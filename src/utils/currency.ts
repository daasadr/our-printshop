import { getCurrentRate, getCurrentRateSync } from './exchangeRate';
import { applyMarketMultiplier } from './marketPricing';

// Formátování ceny v CZK
export function formatPriceCZK(price: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Převod z EUR na CZK
export async function convertEurToCzk(priceEur: number): Promise<number> {
  const rate = await getCurrentRate();
  // Zaokrouhlíme až po vynásobení, abychom zachovali přesnost
  const exactPrice = priceEur * rate;
  // Pro ceny do 1000 Kč zaokrouhlujeme na koruny, nad 1000 Kč na desetikoruny
  if (exactPrice < 1000) {
    return Math.round(exactPrice);
  } else {
    // Zaokrouhlení na desetikoruny (dolů)
    return Math.floor(exactPrice / 10) * 10;
  }
}

// Synchronní verze převodu pro případy, kdy nemůžeme použít async funkci
export function convertEurToCzkSync(priceEur: number): number {
  const rate = getCurrentRateSync();
  const exactPrice = priceEur * rate;
  if (exactPrice < 1000) {
    return Math.round(exactPrice);
  } else {
    return Math.floor(exactPrice / 10) * 10;
  }
}

export function formatPriceEUR(amount: number): string {
    // Zaokrúhli na .99
    const rounded = Math.floor(amount) + 0.99;
    return `€${rounded.toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Formátování ceny v GBP
export function formatPriceGBP(price: number): string {
  // Zaokrúhli na .99
  const rounded = Math.floor(price) + 0.99;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
}

// Konverzia z EUR na GBP (fixný kurz, napr. 0.85)
export function convertEurToGbpSync(priceEur: number): number {
  const EUR_TO_GBP = 0.85; // môžeš neskôr získať dynamicky
  return Math.round(priceEur * EUR_TO_GBP * 100) / 100;
}

// Detekcia krajiny používateľa (asynchrónne)
export async function detectUserCountry(): Promise<string | null> {
  try {
    const res = await fetch('https://ipapi.co/country/');
    if (!res.ok) return null;
    const country = await res.text();
    return country.trim();
  } catch {
    return null;
  }
}

// Upravená funkcia na formátovanie ceny podľa locale a krajiny
export function formatPriceByLocale(price: number, locale: string, country?: string): string {
  // Aplikujeme cenový multiplikátor podľa krajiny
  const adjustedPrice = applyMarketMultiplier(price, country || null);
  
  if (locale === 'cs') {
    return formatPriceCZK(convertEurToCzkSync(adjustedPrice));
  } else if (locale === 'en' && country === 'GB') {
    return formatPriceGBP(convertEurToGbpSync(adjustedPrice));
  } else {
    return formatPriceEUR(adjustedPrice);
  }
} 