console.log('LOADING /api/products/route.ts - start');
import { NextRequest, NextResponse } from 'next/server';

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = 'https://api.printful.com';
console.log('set PRINTFUL_API_KEY and PRINTFUL_API_URL');

// Fixné ceny dopravy pre SK
const SHIPPING_PRICES = {
  MIN: 5.99,
  MAX: 9.99
};
console.log('set SHIPPING_PRICES');

export async function GET(req: NextRequest) {
  console.log('HIT /api/products');
  try {
    // 1. Získaj zoznam produktov
    const response = await fetch(`${PRINTFUL_API_URL}/store/products?limit=100`, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      console.error('Chyba pri získavaní zoznamu produktov:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch product list from Printful' }, { status: 500 });
    }
    const data = await response.json();
    if (!data.result || !Array.isArray(data.result)) {
      console.error('Neočakávaný formát dát zoznamu produktov:', data);
      return NextResponse.json({ error: 'Unexpected data format from Printful' }, { status: 500 });
    }

    // 2. Pre každý produkt načítaj detail (varianty a ceny)
    const productsWithDetails = await Promise.all(
      data.result.map(async (item: any) => {
        try {
          const detailRes = await fetch(`${PRINTFUL_API_URL}/store/products/${item.id}`, {
            headers: {
              'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
              'Content-Type': 'application/json'
            }
          });
          if (!detailRes.ok) {
            console.error(`Chyba pri detaili produktu ${item.id}:`, detailRes.status, detailRes.statusText);
            return null;
          }
          const detailData = await detailRes.json();
          const firstVariant = detailData.result?.sync_variants?.[0];
          
          // Ak thumbnail_url nie je platný, použijeme lokálny placeholder
          const imageUrl = item.thumbnail_url && item.thumbnail_url.startsWith('http')
            ? item.thumbnail_url
            : '/placeholder.jpg';
            
          return {
            id: item.id,
            name: item.name,
            image: imageUrl,
            price: firstVariant?.retail_price || null,
            currency: firstVariant?.currency || 'EUR',
            shippingPrice: {
              min: SHIPPING_PRICES.MIN,
              max: SHIPPING_PRICES.MAX
            },
            printfulId: item.id.toString()
          };
        } catch (err) {
          console.error(`Výnimka pri spracovaní produktu ${item.id}:`, err);
          return null;
        }
      })
    );

    // Odstránime produkty, ktoré sa nepodarilo načítať
    const filteredProducts = productsWithDetails.filter(Boolean);
    if (filteredProducts.length === 0) {
      return NextResponse.json({ error: 'No products could be loaded from Printful' }, { status: 500 });
    }
    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error('Error fetching products from Printful:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}