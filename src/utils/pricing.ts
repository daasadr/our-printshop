// Pricing zones and regional adjustments
export enum PricingZone {
  WESTERN_EUROPE = 'western_europe',
  CENTRAL_EUROPE = 'central_europe',
  DEFAULT = 'default'
}

export const PRICING_ZONES = {
  [PricingZone.WESTERN_EUROPE]: {
    countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'LU', 'DK', 'SE', 'NO', 'FI', 'IE'],
    multiplier: 1.15
  },
  [PricingZone.CENTRAL_EUROPE]: {
    countries: ['SK', 'CZ', 'PL', 'HU', 'SI', 'HR', 'EE', 'LV', 'LT'],
    multiplier: 1.08
  },
  [PricingZone.DEFAULT]: {
    countries: [],
    multiplier: 1.0
  }
};

// Exchange rates (hardcoded for now)
const EXCHANGE_RATES = {
  EUR: 1.0,
  CZK: 25.0,
  USD: 1.1,
  GBP: 0.85
};

/**
 * Get pricing zone for a country
 */
export function getPricingZone(countryCode: string): PricingZone {
  for (const [zone, config] of Object.entries(PRICING_ZONES)) {
    if (config.countries.includes(countryCode)) {
      return zone as PricingZone;
    }
  }
  return PricingZone.DEFAULT;
}

/**
 * Apply regional pricing multiplier
 */
export function applyRegionalPricing(basePrice: number, countryCode: string): number {
  const zone = getPricingZone(countryCode);
  const multiplier = PRICING_ZONES[zone].multiplier;
  return basePrice * multiplier;
}

/**
 * Get regional price with proper conversion and rounding
 */
export function getRegionalPrice(basePrice: number, countryCode: string, targetCurrency: string = 'EUR'): {
  price: number;
  zone: {
    currency: string;
    multiplier: number;
  };
} {
  const zone = getPricingZone(countryCode);
  const regionalPrice = applyRegionalPricing(basePrice, countryCode);
  const convertedPrice = convertPrice(regionalPrice, 'EUR', targetCurrency);
  
  return {
    price: convertedPrice,
    zone: {
      currency: targetCurrency,
      multiplier: PRICING_ZONES[zone].multiplier
    }
  };
}

/**
 * Convert price between currencies
 */
export function convertPrice(price: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return price;
  
  const fromRate = EXCHANGE_RATES[fromCurrency as keyof typeof EXCHANGE_RATES] || 1;
  const toRate = EXCHANGE_RATES[toCurrency as keyof typeof EXCHANGE_RATES] || 1;
  
  // Convert to EUR first, then to target currency
  const eurPrice = price / fromRate;
  return eurPrice * toRate;
}

/**
 * Round price up to a "nice" number (XX.99)
 */
export function roundPriceUp(price: number, currency: string = 'EUR'): number {
  // Round to XX.99 for all currencies
  const rounded = Math.floor(price) + 0.99;
  return Math.max(rounded, price);
}

/**
 * Format price with proper currency formatting
 */
export function formatPrice(price: number, currency: string = 'EUR'): string {
  const currencySymbols: { [key: string]: string } = {
    'EUR': '€',
    'CZK': 'Kč',
    'USD': '$',
    'GBP': '£',
    'SK': '€', // Slovensko používa Euro
    'CS': 'Kč', // Česká republika používa Koruny
    'EN': '$', // Anglicko používa doláre
    'DE': '€'  // Nemecko používa Euro
  };
  
  const symbol = currencySymbols[currency] || currency;
  const formattedPrice = price.toFixed(2);
  
  // Všetky meny zobrazujeme s medzerou za číslom
  return `${formattedPrice} ${symbol}`;
}

/**
 * Format price for display with currency conversion and rounding
 */
export function formatPriceForDisplay(price: number, fromCurrency: string, toCurrency: string): string {
  const convertedPrice = convertPrice(price, fromCurrency, toCurrency);
  const roundedPrice = roundPriceUp(convertedPrice, toCurrency);
  return formatPrice(roundedPrice, toCurrency);
}
