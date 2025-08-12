// Server-side utility pro načítání kurzů
export async function getExchangeRatesForSSR() {
  try {
    // Na server-side používáme absolutní URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/exchange-rates-sync`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.rates) {
      return data.rates;
    } else {
      throw new Error('Invalid exchange rates response');
    }
  } catch (error) {
    console.error('Error fetching exchange rates for SSR:', error);
    
    // Fallback na výchozí kurzy
    return {
      EUR: 1.0,
      CZK: 25.0,
      GBP: 0.86,
    };
  }
}

// Funkce pro konverzi ceny na server-side
export function convertCurrencyServer(priceEur: number, targetCurrency: string, rates: any): number {
  if (targetCurrency === 'EUR') {
    return priceEur;
  }
  
  const rate = rates[targetCurrency];
  if (!rate) {
    console.warn(`No rate found for ${targetCurrency}, using 1.0`);
    return priceEur;
  }
  
  const convertedPrice = priceEur * rate;
  
  // Zaokrouhlení podle měny
  switch (targetCurrency) {
    case 'CZK':
      if (convertedPrice < 1000) {
        return Math.round(convertedPrice);
      } else {
        return Math.floor(convertedPrice / 10) * 10;
      }
    case 'GBP':
      return Math.round(convertedPrice * 100) / 100; // 2 desetinná místa
    default:
      return convertedPrice;
  }
} 