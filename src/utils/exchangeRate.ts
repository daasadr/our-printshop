// Cache pro kurz měny (1 hodina)
let cachedRate: number = 25.5; // Fallback kurz
let lastFetch: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hodina v ms

// Asynchronní funkce pro získání aktuálního kurzu
export async function getCurrentRate(): Promise<number> {
  const now = Date.now();

  // Použijeme cache pokud je platný
  if ((now - lastFetch) < CACHE_DURATION) {
    return cachedRate;
  }

  try {
    // Načteme kurz z našeho API
    const response = await fetch('/api/exchange-rate', {
      next: { revalidate: 3600 } // Cache na 1 hodinu
    });

    if (response.ok) {
      const data = await response.json();
      cachedRate = data.rate;
      lastFetch = now;
      console.log('Exchange rate updated:', cachedRate);
      return cachedRate;
    }
  } catch (error) {
    console.warn('Failed to fetch exchange rate, using cached value:', error);
  }

  return cachedRate;
}

// Synchronní funkce pro získání aktuálního kurzu (používá cache)
export function getCurrentRateSync(): number {
  return cachedRate;
}

// Funkce pro manuální aktualizaci kurzu (např. při startu aplikace)
export async function refreshExchangeRate(): Promise<number> {
  lastFetch = 0; // Reset cache
  return await getCurrentRate();
} 