import { NextResponse } from 'next/server';

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

export async function GET() {
  try {
    // Testujeme různé jazykové parametry
    const locales = ['en', 'cs', 'sk', 'de', 'fr'];
    const results: any = {};

    for (const locale of locales) {
      try {
        console.log(`Testing locale: ${locale}`);
        
        // Zkusíme načíst první produkt s různými jazyky
        const response = await fetch(`https://api.printful.com/store/products?limit=1&locale=${locale}`, {
          headers: {
            'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          results[locale] = {
            success: true,
            productCount: data.result?.length || 0,
            firstProduct: data.result?.[0] ? {
              name: data.result[0].name,
              description: data.result[0].description?.substring(0, 100) + '...'
            } : null
          };
        } else {
          results[locale] = {
            success: false,
            status: response.status,
            statusText: response.statusText
          };
        }
      } catch (error) {
        results[locale] = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    return NextResponse.json({
      message: 'Printful locale test results',
      results
    });

  } catch (error) {
    console.error('Error testing Printful locales:', error);
    return NextResponse.json(
      { error: 'Failed to test Printful locales' },
      { status: 500 }
    );
  }
} 