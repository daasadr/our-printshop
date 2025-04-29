import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const CZK_CODE = 'CZK';
const EUR_CODE = 'EUR';

interface CNBResponse {
  rates: Array<{
    currencyCode: string;
    rate: number;
  }>;
}

let cachedRate: number | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hodina

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
  // Pokud máme cached kurz a není starší než 1 hodina, vrátíme ho
  if (cachedRate && lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedRate;
  }

  try {
    // Načteme aktuální kurz z ČNB
    const response = await axios.get<CNBResponse>(
      'https://api.cnb.cz/cnbapi/exrates/daily?lang=CS&currency=EUR'
    );

    if (response.data.rates && response.data.rates.length > 0) {
      const eurRate = response.data.rates[0].rate;
      cachedRate = eurRate;
      lastFetchTime = Date.now();
      return eurRate;
    }

    // Fallback na výchozí kurz, pokud se nepodaří načíst aktuální
    console.warn('Nepodařilo se načíst aktuální kurz z ČNB, používám výchozí kurz');
    return 24.5;
  } catch (error) {
    console.error('Chyba při načítání kurzu z ČNB:', error);
    // Fallback na výchozí kurz v případě chyby
    return 24.5;
  }
}

// Synchronní verze pro případy, kdy nemůžeme použít async funkci
export function getCurrentRateSync(): number {
  return cachedRate || 24.5;
}

export async function convertEurToCzk(eurAmount: number): Promise<number> {
  try {
    // Najít aktuální kurz v databázi
    const rate = await prisma.exchangeRate.findUnique({
      where: {
        fromCurrency_toCurrency: {
          fromCurrency: 'EUR',
          toCurrency: 'CZK'
        }
      }
    });

    if (!rate) {
      // Pokud kurz neexistuje, použít defaultní hodnotu
      return eurAmount * 25;
    }

    return eurAmount * rate.rate;
  } catch (error) {
    console.error('Error converting currency:', error);
    // V případě chyby použít defaultní hodnotu
    return eurAmount * 25;
  }
} 