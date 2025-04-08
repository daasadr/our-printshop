import { getCurrentRate } from './exchangeRate';

// Fixní kurz EUR/CZK - v produkci by se měl aktualizovat z API
const EUR_TO_CZK_RATE = 25;

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
  // Použijeme výchozí kurz 25.21 pro synchronní převod
  const rate = 25.21;
  const exactPrice = priceEur * rate;
  if (exactPrice < 1000) {
    return Math.round(exactPrice);
  } else {
    return Math.floor(exactPrice / 10) * 10;
  }
}

export function formatPriceEUR(amount: number): string {
    return `€${amount.toLocaleString('cs-CZ')}`;
} 