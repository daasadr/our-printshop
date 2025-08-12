import { getCurrentRate, getCurrentRateSync, getRateForCurrencySync, getAllRatesSync } from './exchangeRate';
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

// Formátování ceny v GBP
export function formatPriceGBP(price: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// Univerzální formátování ceny podle měny
export function formatPrice(price: number, currency: Currency): string {
  switch (currency) {
    case 'EUR':
      return formatPriceEUR(price);
    case 'GBP':
      return formatPriceGBP(price);
    case 'CZK':
    default:
      return formatPriceCZK(price);
  }
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

// Univerzální převod měny s reálnými kurzy
export function convertCurrency(price: number, targetCurrency: Currency, sourceCurrency?: Currency): number {
  // Pokud není specifikována zdrojová měna, předpokládáme EUR (pro zpětnou kompatibilitu)
  if (!sourceCurrency) {
    sourceCurrency = 'EUR';
  }
  
  // Pokud jsou měny stejné, vracíme původní cenu
  if (sourceCurrency === targetCurrency) {
    return price;
  }
  
  // Pokud je zdrojová měna EUR, použijeme původní logiku
  if (sourceCurrency === 'EUR') {
    if (targetCurrency === 'EUR') {
      return price;
    }
    
    // Získáme aktuální kurz z cache nebo výchozí hodnoty
    const rate = getRateForCurrencySync(targetCurrency);
    
    const convertedPrice = price * rate;
    
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
  
  // Pro převod z jiných měn než EUR
  // Nejdříve převedeme na EUR, pak na cílovou měnu
  const eurRate = getRateForCurrencySync(sourceCurrency);
  const priceInEur = price / eurRate;
  
  if (targetCurrency === 'EUR') {
    return priceInEur;
  }
  
  const targetRate = getRateForCurrencySync(targetCurrency);
  const convertedPrice = priceInEur * targetRate;
  
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

// Funkce pro získání aktuálních kurzů
export function getCurrentExchangeRates(): { [key: string]: number } {
  return getAllRatesSync();
}

// Funkce pro získání kurzu konkrétní měny
export function getExchangeRate(currency: Currency): number {
  return getRateForCurrencySync(currency);
}

// Stará funkce pro kompatibilitu
export function formatPriceEUR_old(amount: number): string {
    return `€${amount.toLocaleString('cs-CZ')}`;
} 