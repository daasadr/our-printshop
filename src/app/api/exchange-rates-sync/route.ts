import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/EUR';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching exchange rates synchronously for server-side rendering');
    
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store' // Vždy načítat aktuální kurzy
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.rates) {
      throw new Error('Invalid API response - no rates');
    }

    // Extrahujeme potřebné kurzy
    const rates = {
      EUR: 1.0, // Základní měna
      CZK: data.rates.CZK || 25.0, // Fallback na 25 pokud API nevrátí kurz
      GBP: data.rates.GBP || 0.86, // Fallback na 0.86 pokud API nevrátí kurz
    };

    console.log('Exchange rates fetched for SSR:', rates);

    return NextResponse.json({
      success: true,
      rates,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Error fetching exchange rates for SSR:', error);
    
    // Fallback na výchozí kurzy pokud API selže
    const fallbackRates = {
      EUR: 1.0,
      CZK: 25.0,
      GBP: 0.86,
    };

    return NextResponse.json({
      success: false,
      rates: fallbackRates,
      timestamp: Date.now(),
      error: 'Using fallback rates due to API error'
    });
  }
} 