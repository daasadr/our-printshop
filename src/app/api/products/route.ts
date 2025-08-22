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
    const category = searchParams.get('category') || searchParams.get('main_category'); // Podporuje oba parametry
    const limit = parseInt(searchParams.get('limit') || '1000', 10); // Default limit 1000
    const page = parseInt(searchParams.get('page') || '1', 10); // Default page 1
    const sort = searchParams.get('sort') || '-id'; // Změna na -id místo -date_created
    const locale = searchParams.get('locale') || 'cs'; // Jazyk pre preklady
    
    // Nové filtre
    const search = searchParams.get('search');
    const priceFrom = searchParams.get('priceFrom');
    const priceTo = searchParams.get('priceTo');
    const sortBy = searchParams.get('sortBy');
    
    // Výpočet offset pre pagináciu
    const offset = (page - 1) * limit;
    
    // Kontrola cache - len ak nie sú filtre
    const now = Date.now();
    if (!search && !priceFrom && !priceTo && !sortBy && productsCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log(`Using cached products (${productsCache.length} products)`);
      let cachedProducts = productsCache;
      
      // Aplikovanie kategórie na cached produkty
      if (category && category !== 'home-decor') {
        const SLUG_TO_MAIN_CATEGORY: Record<string, string> = {
          'men': 'men',
          'women': 'women',
          'kids': 'kids',
          'kids-youth-clothing': 'kids',
          'unisex': 'unisex',
          'mens-clothing': 'men',
          'womens-clothing': 'women',
        };
        
        const mainCategory = SLUG_TO_MAIN_CATEGORY[category.toLowerCase()] || category;
        
        if (mainCategory === 'men' || mainCategory === 'women') {
          cachedProducts = cachedProducts.filter(product => 
            product.main_category === mainCategory || product.main_category === 'unisex'
          );
        } else {
          cachedProducts = cachedProducts.filter(product => 
            product.main_category === mainCategory
          );
        }
      }
      
      // Preklad cached produktov
      const translatedProducts = translateProducts(cachedProducts, locale);
      // Uloženie do cache
      productsCache = translatedProducts;
      cacheTimestamp = now;
    
      return NextResponse.json(translatedProducts);
    }
    
    const params: any = {
      fields: [
        '*',
        'variants.*',
        'designs.*',
        'main_category', // Explicitně přidám main_category
        'description_cs',
        'description_sk', 
        'description_en',
        'description_de',
        'icon_cs',
        'icon_sk',
        'icon_en',
        'icon_de'
      ],
      sort,
      limit: limit, // Vždy nastavit limit
      offset: offset // Přidat offset
    };
    
    console.log('API Products - Request params:', { category, limit, page, sort, locale, search, priceFrom, priceTo, sortBy });
    
    // Filtrování podle main_category
    if (category) {
      const SLUG_TO_MAIN_CATEGORY: Record<string, string> = {
        'men': 'men',
        'women': 'women',
        'kids': 'kids',
        'kids-youth-clothing': 'kids',
        'unisex': 'unisex',
        'mens-clothing': 'men',
        'womens-clothing': 'women',
      };
      
      const mainCategory = SLUG_TO_MAIN_CATEGORY[category.toLowerCase()] || category;
      console.log('API Products - Category mapping:', { category, mainCategory });
      
      // Pre home-decor nepoužívame Directus filter, lebo taká kategória neexistuje
      if (category !== 'home-decor') {
        // Speciální logika pro men a women - zahrnout i unisex produkty
        if (mainCategory === 'men' || mainCategory === 'women') {
          params.filter = {
            _or: [
              { main_category: { _eq: mainCategory } },
              { main_category: { _eq: 'unisex' } }
            ]
          };
        } else {
          params.filter = {
            main_category: { _eq: mainCategory }
          };
        }
        
        console.log('API Products - Filter params:', params.filter);
      }
    }
    
    const response = await readProducts(params);
    console.log('API Products - Directus response count:', response.length);
    
    // Preklad produktov podľa jazyka
    let translatedProducts = translateProducts(response, locale);
    
    // Pre home-decor používame len Printful produkty
    if (category === 'home-decor') {
      try {
        // Priamo voláme Printful API endpoint
        const { GET: getPrintfulProducts } = await import('../products/all/route');
        const printfulRequest = new Request(`http://localhost:3000/api/products/all?locale=${locale}&category=home-decor`);
        const printfulResponse = await getPrintfulProducts(printfulRequest);
        const printfulProducts = await printfulResponse.json();
        console.log('API Products - Printful home-decor products count:', printfulProducts.length);
        translatedProducts = printfulProducts; // Používame len Printful produkty
      } catch (error) {
        console.error('Error fetching Printful home-decor products:', error);
        translatedProducts = []; // Ak sa nepodarí načítať, vrátime prázdny array
      }
    }
    
    // Aplikovanie dodatočných filtrov na preložené produkty
    if (search) {
      const searchLower = search.toLowerCase();
      translatedProducts = translatedProducts.filter(product => 
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrovanie podľa ceny
    if (priceFrom || priceTo) {
      translatedProducts = translatedProducts.filter(product => {
        const minPrice = product.variants?.[0]?.price || 0;
        const maxPrice = Math.max(...(product.variants?.map(v => v.price) || [0]));
        
        if (priceFrom && minPrice < parseFloat(priceFrom)) return false;
        if (priceTo && maxPrice > parseFloat(priceTo)) return false;
        return true;
      });
    }
    
    // Zoradenie
    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          translatedProducts.sort((a, b) => {
            const priceA = a.variants?.[0]?.price || 0;
            const priceB = b.variants?.[0]?.price || 0;
            return priceA - priceB;
          });
          break;
        case 'price_desc':
          translatedProducts.sort((a, b) => {
            const priceA = a.variants?.[0]?.price || 0;
            const priceB = b.variants?.[0]?.price || 0;
            return priceB - priceA;
          });
          break;
        case 'name_asc':
          translatedProducts.sort((a, b) => 
            (a.name || '').localeCompare(b.name || '')
          );
          break;
      }
    }
    
    // Debug: vypíšu main_category prvních 5 produktů
    if (translatedProducts.length > 0) {
      console.log('API Products - First 5 products main_category:', 
        translatedProducts.slice(0, 5).map(p => ({ id: p.id, name: p.name, main_category: p.main_category }))
      );
    }
    
    return NextResponse.json(translatedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}