import { NextRequest, NextResponse } from 'next/server';
import { getCurrentExchangeRates, getExchangeRate, convertCurrency } from '@/utils/currency';
import { Currency } from '@/context/LocaleContext';

export async function GET(request: NextRequest) {
  try {
    // Získáme aktuální kurzy
    const rates = getCurrentExchangeRates();
    
    // Testovací cena v EUR
    const testPriceEur = 48.5;
    
    // Přepočítáme cenu do všech měn
    const conversions = {
      EUR: convertCurrency(testPriceEur, 'EUR'),
      CZK: convertCurrency(testPriceEur, 'CZK'),
      GBP: convertCurrency(testPriceEur, 'GBP'),
    };
    
    // Získáme jednotlivé kurzy
    const individualRates = {
      EUR: getExchangeRate('EUR'),
      CZK: getExchangeRate('CZK'),
      GBP: getExchangeRate('GBP'),
    };
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      currentRates: rates,
      individualRates,
      testConversions: {
        originalPriceEur: testPriceEur,
        convertedPrices: conversions,
        example: `Produkt za ${testPriceEur} EUR se zobrazuje jako:`,
        examples: {
          CZ: `${conversions.CZK} CZK`,
          SK: `${conversions.EUR} EUR`,
          EN: `${conversions.GBP} GBP`,
          DE: `${conversions.EUR} EUR`,
        }
      }
    });
    
  } catch (error) {
    console.error('Error in test exchange rates:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to test exchange rates',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 