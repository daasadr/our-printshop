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
const DEFAULT_RATE = 25.21; // Výchozí kurz v případě chyby

// Funkce pro získání aktuálního kurzu z ČNB API
async function fetchCNBRate(): Promise<number> {
  try {
    // Použijeme správnou URL pro API ČNB
    const response = await axios.get<CNBResponse>(
      'https://api.cnb.cz/cnbapi/exchanges/daily?lang=CS&currency=EUR'
    );
    
    if (response.data.rates && response.data.rates.length > 0) {
      return response.data.rates[0].rate;
    }
    
    throw new Error('EUR rate not found in CNB response');
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

// Funkce pro získání aktuálního kurzu
export async function getCurrentRate(): Promise<number> {
  // Pokud máme cached kurz a není starší než 1 hodina, vrátíme ho
  if (cachedRate && lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedRate;
  }

  try {
    // Nejprve zkusíme načíst kurz z databáze
    const dbRate = await prisma.exchangeRate.findUnique({
      where: {
        fromCurrency_toCurrency: {
          fromCurrency: 'EUR',
          toCurrency: 'CZK'
        }
      }
    });
    
    // Pokud máme kurz v databázi a není starší než 24 hodin, použijeme ho
    if (dbRate && new Date().getTime() - dbRate.updatedAt.getTime() < 24 * 60 * 60 * 1000) {
      cachedRate = dbRate.rate;
      lastFetchTime = Date.now();
      return dbRate.rate;
    }
    
    // Jinak zkusíme načíst aktuální kurz z ČNB
    const rate = await fetchCNBRate();
    cachedRate = rate;
    lastFetchTime = Date.now();
    
    // Aktualizujeme kurz v databázi
    await updateExchangeRate();
    
    return rate;
  } catch (error) {
    console.error('Chyba při načítání kurzu:', error);
    // Fallback na výchozí kurz v případě chyby
    return DEFAULT_RATE;
  }
}

// Synchronní verze pro případy, kdy nemůžeme použít async funkci
export function getCurrentRateSync(): number {
  return cachedRate || DEFAULT_RATE;
}

export async function convertEurToCzk(eurAmount: number): Promise<number> {
  const rate = await getCurrentRate();
  return eurAmount * rate;
} 