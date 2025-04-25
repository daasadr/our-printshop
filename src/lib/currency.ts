// Exchange rate for EUR to CZK (1 EUR = 24.5 CZK)
const EUR_TO_CZK_RATE = 24.5;

export async function convertEurToCzk(eurAmount: number): Promise<number> {
  return Math.round(eurAmount * EUR_TO_CZK_RATE);
} 