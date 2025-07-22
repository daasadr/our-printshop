import { getCurrentRate, getCurrentRateSync } from './exchangeRate';
import { Currency } from '@/context/LocaleContext';

// Formátování ceny v CZK
export function formatPriceCZK(price: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Formátování ceny v EUR
export function formatPriceEUR(price: number): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// Univerzální formátování ceny podle měny
export function formatPrice(price: number, currency: Currency): string {
  if (currency === 'EUR') {
    return formatPriceEUR(price);
  }
  return formatPriceCZK(price);
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

// Univerzální převod měny
export function convertCurrency(priceEur: number, targetCurrency: Currency): number {
  if (targetCurrency === 'EUR') {
    return priceEur;
  }
  return convertEurToCzkSync(priceEur);
}

// Stará funkce pro kompatibilitu
export function formatPriceEUR_old(amount: number): string {
    return `€${amount.toLocaleString('cs-CZ')}`;
} 