// Cenové multiplikátory pre rôzne trhy
export const MARKET_PRICE_MULTIPLIERS = {
  // Západná Európa - silné trhy
  'DE': 1.15,  // Nemecko
  'AT': 1.15,  // Rakúsko
  'CH': 1.15,  // Švajčiarsko
  'NL': 1.15,  // Holandsko
  'BE': 1.15,  // Belgicko
  'FR': 1.15,  // Francúzsko
  'IT': 1.15,  // Taliansko
  'ES': 1.15,  // Španielsko
  
  // Severná Európa
  'SE': 1.15,  // Švédsko
  'NO': 1.15,  // Nórsko
  'DK': 1.15,  // Dánsko
  'FI': 1.15,  // Fínsko
  
  // Východná Európa - slabšie trhy
  'CZ': 1.0,   // Česko
  'SK': 1.0,   // Slovensko
  'PL': 1.0,   // Poľsko
  'HU': 1.0,   // Maďarsko
  'RO': 1.0,   // Rumunsko
  'BG': 1.0,   // Bulharsko
  'HR': 1.0,   // Chorvátsko
  'SI': 1.0,   // Slovinsko
  
  // Ostatné
  'GB': 1.0,   // UK - zatiaľ bez konverzie
  'DEFAULT': 1.0
};

// Funkcia na získanie multiplikátora pre danú krajinu
export function getMarketMultiplier(country: string | null): number {
  if (!country) return MARKET_PRICE_MULTIPLIERS.DEFAULT;
  return MARKET_PRICE_MULTIPLIERS[country as keyof typeof MARKET_PRICE_MULTIPLIERS] || MARKET_PRICE_MULTIPLIERS.DEFAULT;
}

// Funkcia na aplikovanie cenového multiplikátora
export function applyMarketMultiplier(price: number, country: string | null): number {
  const multiplier = getMarketMultiplier(country);
  return price * multiplier;
} 