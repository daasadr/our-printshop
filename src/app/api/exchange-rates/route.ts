import { NextRequest, NextResponse } from 'next/server';

// Typy pro API response
interface ExchangeRateResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: {
    [key: string]: number;
  };
}

interface CachedRates {
  rates: {
    [key: string]: number;
  };
  timestamp: number;
  expiresAt: number;
}

// Cache pro kurzy (v reálné aplikaci byste použili Redis nebo podobné řešení)
let ratesCache: CachedRates | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hodina v milisekundách

// API klíč pro exchangerate-api.com (zdarma až 1000 requestů/měsíc)
// V produkci byste měli použít environment variable
const API_KEY = process.env.EXCHANGE_RATE_API_KEY || 'demo';
const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/EUR';

export async function GET(request: NextRequest) {
  try {
    // Kontrola cache
    if (ratesCache && Date.now() < ratesCache.expiresAt) {
      console.log('Using cached exchange rates');
      return NextResponse.json({
        success: true,
        rates: ratesCache.rates,
        cached: true,
        timestamp: ratesCache.timestamp
      });
    }

    // Načtení nových kurzů z API
    console.log('Fetching fresh exchange rates from API');
    
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache na 1 hodinu
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data: ExchangeRateResponse = await response.json();

    if (!data.success && !data.rates) {
      throw new Error('Invalid API response');
    }

    // Extrahujeme potřebné kurzy
    const rates = {
      EUR: 1.0, // Základní měna
      CZK: data.rates.CZK || 25.0, // Fallback na 25 pokud API nevrátí kurz
      GBP: data.rates.GBP || 0.86, // Fallback na 0.86 pokud API nevrátí kurz
    };

    // Uložíme do cache
    ratesCache = {
      rates,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION
    };

    console.log('Exchange rates updated:', rates);

    return NextResponse.json({
      success: true,
      rates,
      cached: false,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Fallback na výchozí kurzy pokud API selže
    const fallbackRates = {
      EUR: 1.0,
      CZK: 25.0,
      GBP: 0.86,
    };

    return NextResponse.json({
      success: false,
      rates: fallbackRates,
      cached: false,
      timestamp: Date.now(),
      error: 'Using fallback rates due to API error'
    });
  }
}

// POST endpoint pro manuální aktualizaci cache
export async function POST(request: NextRequest) {
  try {
    // Vymažeme cache pro vynucení nového načtení
    ratesCache = null;
    
    // Zavoláme GET endpoint pro načtení nových kurzů
    const response = await GET(request);
    
    return NextResponse.json({
      success: true,
      message: 'Cache cleared and rates refreshed',
      data: await response.json()
    });
    
  } catch (error) {
    console.error('Error refreshing exchange rates:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to refresh exchange rates'
    }, { status: 500 });
  }
} 