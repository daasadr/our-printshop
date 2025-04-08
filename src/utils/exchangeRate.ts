import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Funkce pro získání aktuálního kurzu z ČNB API
async function fetchCNBRate(): Promise<number> {
  try {
    const response = await fetch('https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt');
    const text = await response.text();
    
    // Parsování textového formátu ČNB
    const lines = text.split('\n');
    const eurLine = lines.find(line => line.includes('EUR'));
    
    if (!eurLine) {
      throw new Error('EUR rate not found');
    }
    
    // Formát řádku: země|měna|množství|kód|kurz
    const [, , amount, , rate] = eurLine.split('|');
    return parseFloat(rate.replace(',', '.')) / parseInt(amount);
  } catch (error) {
    console.error('Error fetching CNB rate:', error);
    throw error;
  }
}

// Funkce pro aktualizaci kurzu v databázi
export async function updateExchangeRate(): Promise<void> {
  try {
    const rate = await fetchCNBRate();
    
    await prisma.exchangeRate.upsert({
      where: {
        fromCurrency_toCurrency: {
          fromCurrency: 'EUR',
          toCurrency: 'CZK'
        }
      },
      update: {
        rate,
        updatedAt: new Date()
      },
      create: {
        fromCurrency: 'EUR',
        toCurrency: 'CZK',
        rate
      }
    });
    
    console.log('Exchange rate updated:', rate);
  } catch (error) {
    console.error('Error updating exchange rate:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Funkce pro získání aktuálního kurzu z databáze
export async function getCurrentRate(): Promise<number> {
  try {
    const rate = await prisma.exchangeRate.findUnique({
      where: {
        fromCurrency_toCurrency: {
          fromCurrency: 'EUR',
          toCurrency: 'CZK'
        }
      }
    });
    
    if (!rate) {
      // Pokud nemáme kurz v databázi, získáme ho z ČNB a uložíme
      await updateExchangeRate();
      return getCurrentRate();
    }
    
    // Pokud je kurz starší než 24 hodin, aktualizujeme ho
    if (new Date().getTime() - rate.updatedAt.getTime() > 24 * 60 * 60 * 1000) {
      await updateExchangeRate();
      return getCurrentRate();
    }
    
    return rate.rate;
  } catch (error) {
    console.error('Error getting current rate:', error);
    // V případě chyby vrátíme výchozí kurz 25
    return 25;
  } finally {
    await prisma.$disconnect();
  }
} 