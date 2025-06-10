// Aktuální kurz EUR/CZK (aktualizujte podle potřeby)
const CURRENT_RATE = 25.5;

// Asynchronní funkce pro získání aktuálního kurzu
export async function getCurrentRate(): Promise<number> {
  // TODO: Implementovat načítání kurzu z API
  return CURRENT_RATE;
}

// Synchronní funkce pro získání aktuálního kurzu
export function getCurrentRateSync(): number {
  return CURRENT_RATE;
} 