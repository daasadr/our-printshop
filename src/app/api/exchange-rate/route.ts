import { NextResponse } from 'next/server';

// Cache pro kurz měny (1 hodina)
let cachedRate: number | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hodina v ms

async function fetchExchangeRate(): Promise<number> {
  try {
    // Zkusíme více zdrojů pro spolehlivost
    const sources = [
      'https://api.exchangerate-api.com/v4/latest/EUR',
      'https://api.frankfurter.app/latest?from=EUR&to=CZK',
      'https://api.currencyapi.com/v3/latest?apikey=free&currencies=CZK&base_currency=EUR'
    ];

    for (const source of sources) {
      try {
        const response = await fetch(source, {
          headers: {
            'User-Agent': 'HappyWilderness/1.0'
          },
          next: { revalidate: 3600 } // Cache na 1 hodinu
        });

        if (!response.ok) continue;

        const data = await response.json();
        
        // Různé formáty odpovědí
        let rate: number;
        if (data.rates?.CZK) {
          rate = data.rates.CZK;
        } else if (data.rates?.CZK) {
          rate = data.rates.CZK;
        } else if (data.data?.CZK?.value) {
          rate = data.data.CZK.value;
        } else {
          continue;
        }

        console.log(`Exchange rate fetched from ${source}: ${rate}`);
        return rate;
      } catch (error) {
        console.warn(`Failed to fetch from ${source}:`, error);
        continue;
      }
    }

    // Fallback na pevný kurz pokud všechny API selžou
    console.warn('All exchange rate APIs failed, using fallback rate');
    return 25.5;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 25.5; // Fallback kurz
  }
}

export async function GET() {
  const now = Date.now();

  // Použijeme cache pokud je platný
  if (cachedRate && (now - lastFetch) < CACHE_DURATION) {
    return NextResponse.json({
      rate: cachedRate,
      cached: true,
      timestamp: lastFetch
    });
  }

  // Načteme nový kurz
  const rate = await fetchExchangeRate();
  
  // Uložíme do cache
  cachedRate = rate;
  lastFetch = now;

  return NextResponse.json({
    rate,
    cached: false,
    timestamp: now
  });
} 