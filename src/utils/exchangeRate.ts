// Cache pro kurzy měn
let cachedRates: { [key: string]: number } | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hodina

// Výchozí kurzy (fallback)
const DEFAULT_RATES = {
  EUR: 1.0,
  CZK: 25.0,
  GBP: 0.86,
};

// Načtení kurzů z našeho API
async function fetchExchangeRates(): Promise<{ [key: string]: number }> {
  try {
    const response = await fetch('/api/exchange-rates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.rates) {
      return data.rates;
    } else {
      console.warn('API returned fallback rates:', data.error);
      return DEFAULT_RATES;
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return DEFAULT_RATES;
  }
}

// Asynchronní funkce pro získání aktuálního kurzu
export async function getCurrentRate(): Promise<number> {
  const now = Date.now();
  
  // Kontrola cache
  if (cachedRates && (now - lastFetch) < CACHE_DURATION) {
    return cachedRates.CZK || DEFAULT_RATES.CZK;
  }

  // Načtení nových kurzů
  cachedRates = await fetchExchangeRates();
  lastFetch = now;
  
  return cachedRates.CZK || DEFAULT_RATES.CZK;
}

// Synchronní funkce pro získání aktuálního kurzu (používá cache)
export function getCurrentRateSync(): number {
  if (cachedRates) {
    return cachedRates.CZK || DEFAULT_RATES.CZK;
  }
  return DEFAULT_RATES.CZK;
}

// Funkce pro získání kurzu pro konkrétní měnu
export async function getRateForCurrency(currency: string): Promise<number> {
  const now = Date.now();
  
  // Kontrola cache
  if (cachedRates && (now - lastFetch) < CACHE_DURATION) {
    return cachedRates[currency] || DEFAULT_RATES[currency as keyof typeof DEFAULT_RATES] || 1.0;
  }

  // Načtení nových kurzů
  cachedRates = await fetchExchangeRates();
  lastFetch = now;
  
  return cachedRates[currency] || DEFAULT_RATES[currency as keyof typeof DEFAULT_RATES] || 1.0;
}

// Synchronní funkce pro získání kurzu pro konkrétní měnu
export function getRateForCurrencySync(currency: string): number {
  if (cachedRates) {
    return cachedRates[currency] || DEFAULT_RATES[currency as keyof typeof DEFAULT_RATES] || 1.0;
  }
  return DEFAULT_RATES[currency as keyof typeof DEFAULT_RATES] || 1.0;
}

// Funkce pro vynucení aktualizace kurzů
export async function refreshExchangeRates(): Promise<void> {
  try {
    const response = await fetch('/api/exchange-rates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data.rates) {
        cachedRates = data.data.rates;
        lastFetch = Date.now();
        console.log('Exchange rates refreshed successfully');
      }
    }
  } catch (error) {
    console.error('Error refreshing exchange rates:', error);
  }
}

// Funkce pro získání všech kurzů
export async function getAllRates(): Promise<{ [key: string]: number }> {
  const now = Date.now();
  
  // Kontrola cache
  if (cachedRates && (now - lastFetch) < CACHE_DURATION) {
    return cachedRates;
  }

  // Načtení nových kurzů
  cachedRates = await fetchExchangeRates();
  lastFetch = now;
  
  return cachedRates;
}

// Funkce pro získání všech kurzů synchronně
export function getAllRatesSync(): { [key: string]: number } {
  return cachedRates || DEFAULT_RATES;
} 