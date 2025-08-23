import { NextRequest, NextResponse } from 'next/server';
import { readProducts, translateProducts } from "@/lib/directus";

// Force dynamic rendering - don't generate static pages for this API
export const dynamic = 'force-dynamic';

// Cache pre produkty (5 minút)
let productsCache: any[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minút

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'cs';
    
    // Kontrola cache
    const now = Date.now();
    if (productsCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log(`Using cached products (${productsCache.length} products)`);
      return NextResponse.json(productsCache);
    }
    
    console.log('Fetching products from Directus...');
    
    // Získanie všetkých produktov z Directus
    const response = await readProducts({
      fields: [
        '*', 
        'variants.*',
        'designs.*',
        'main_category',
        'description_cs',
        'description_sk', 
        'description_en',
        'description_de',
        'icon_cs',
        'icon_sk',
        'icon_en',
        'icon_de'
      ],
      sort: ['-date_created'],
      limit: 1000 // Vysoký limit pre všetky produkty
    });
    
    console.log(`Found ${response.length} products in Directus`);
    
    // Debug: vypíšeme prvých 3 produkty s cenami
    if (response.length > 0) {
      console.log('First 3 products with prices:');
      response.slice(0, 3).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}: price=${product.price}, variants=${product.variants?.length || 0}`);
        if (product.variants && product.variants.length > 0) {
          console.log(`   Variant prices: ${product.variants.map(v => v.price).join(', ')}`);
        }
      });
    }
    
    // Preklad produktov podľa jazyka
    const translatedProducts = translateProducts(response, locale);
    
    // Uloženie do cache
    productsCache = translatedProducts;
    cacheTimestamp = now;
    
    return NextResponse.json(translatedProducts);
  } catch (error) {
    console.error('Error in latest products API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest products' },
      { status: 500 }
    );
  }
}