import { NextResponse } from 'next/server';

// ============================================================================
// NOVÝ ENDPOINT PRE VŠETKY PRODUKTY (VRÁTANE DRAFT)
// ============================================================================
// Tento endpoint používa Printful Store API namiesto Sync API
// Store API vracia všetky produkty (published, draft, unpublished)
// Sync API vracia len published produkty
// 
// Pali: Tento endpoint sme vytvorili, pretože pôvodný /api/products/latest
// vracia len published produkty, ale v Printful dashboarde sú 41 produkty
// vrátane draft a unpublished. Tento endpoint vracia všetky produkty.
// ============================================================================

// Rate limiting a caching
let cachedProducts: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minút
const RATE_LIMIT_DELAY = 1000; // 1 sekunda medzi volaniami

// Globálny cache pre detaily produktov
const globalProductDetailsCache = new Map();
let globalProductDetailsCacheTime = 0;
const PRODUCT_DETAILS_CACHE_DURATION = 10 * 60 * 1000; // 10 minút

// Helper function pre delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchAllPrintfulProducts() {
  try {
    // Kontrola cache
    const now = Date.now();
    if (cachedProducts.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('Using cached products:', cachedProducts.length);
      return cachedProducts;
    }
    
    let allProducts = [];
    let offset = 0;
    const limit = 20;
    let hasMore = true;
    
    console.log('Fetching fresh products from Printful...');
    
    // Načítame všetky produkty pomocou pagination s rate limiting
    while (hasMore) {
      // Rate limiting - čakáme 1 sekundu medzi volaniami
      if (offset > 0) {
        await delay(RATE_LIMIT_DELAY);
      }
      
      const response = await fetch(`https://api.printful.com/store/products?limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.log('Rate limit hit, waiting 5 seconds...');
          await delay(5000);
          continue; // Skúsime to znovu
        }
        throw new Error(`Printful API error: ${response.status}`);
      }

      const data = await response.json();
      const products = data.result || [];
      
      allProducts = allProducts.concat(products);
      
      // Kontrola, či sú ešte ďalšie produkty
      if (products.length === 0) {
        hasMore = false;
      } else {
        offset += limit;
        // Kontrola, či sme dosiahli celkový počet produktov
        if (allProducts.length >= 41) { // Celkový počet z Printful
          hasMore = false;
        }
      }
      
      console.log(`Loaded ${allProducts.length} products so far...`);
    }
    
    // Update cache
    cachedProducts = allProducts;
    lastFetchTime = now;
    
    console.log(`Total products loaded: ${allProducts.length}`);
    return allProducts;
  } catch (error) {
    console.error('Error fetching all Printful products:', error);
    return [];
  }
}

async function fetchDirectusDescriptions() {
  try {
    const response = await fetch('https://directus-on-fly.fly.dev/items/products?fields=id,name,description_cs,description_sk,description_en,description_de,icon_cs,icon_sk,icon_en,icon_de,printful_id', {
      headers: {
        'Authorization': `Bearer ${process.env.DIRECTUS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Directus API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Directus descriptions:', error);
    return [];
  }
}

async function fetchPrintfulProductDetails(productId: number) {
  try {
    // Rate limiting - čakáme 1 sekundu medzi volaniami
    await delay(RATE_LIMIT_DELAY);
    
    // Použijeme Store API namiesto Sync API
    const response = await fetch(`https://api.printful.com/store/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.log(`Rate limit hit for product ${productId}, waiting 5 seconds...`);
        await delay(5000);
        return null; // Preskočíme tento produkt
      }
      return null;
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'cs';
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const priceFrom = searchParams.get('priceFrom');
    const priceTo = searchParams.get('priceTo');
    const sortBy = searchParams.get('sortBy');
    
    console.log('Fetching ALL products from Printful Store API and descriptions from Directus...');
    console.log('Filters:', { category, search, priceFrom, priceTo, sortBy });
    
    // Získanie všetkých produktov z Printful Store API
    const printfulProducts = await fetchAllPrintfulProducts();
    console.log(`Found ${printfulProducts.length} products in Printful Store API`);
    
    // Spracujeme všetky produkty bez filtrovania duplikátov
    const allProducts = printfulProducts;
    console.log(`Processing all ${allProducts.length} products without filtering`);
    
    // Debug: vypíšeme všetky produkty
    console.log('All products:');
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (ID: ${product.id})`);
    });
    
    // Získanie popiskov z Directus
    const directusDescriptions = await fetchDirectusDescriptions();
    console.log(`Found ${directusDescriptions.length} descriptions in Directus`);
    
    // Vytvorenie mapy popiskov podľa printful_id
    const descriptionsMap = new Map();
    directusDescriptions.forEach((item: any) => {
      if (item.printful_id) {
        descriptionsMap.set(item.printful_id, item);
      }
    });
    
    // Získanie detailov pre každý produkt - všetky produkty vrátane draft
    const productsWithDetails = [];
    const processedIds = new Set(); // Pre sledovanie spracovaných ID
    
    // Kontrola globálneho cache pre detaily produktov
    const now = Date.now();
    if (globalProductDetailsCache.size > 0 && (now - globalProductDetailsCacheTime) < PRODUCT_DETAILS_CACHE_DURATION) {
      console.log(`Using global product details cache (${globalProductDetailsCache.size} items)`);
    } else {
      console.log('Clearing global product details cache');
      globalProductDetailsCache.clear();
      globalProductDetailsCacheTime = now;
    }
    
    for (const product of allProducts) { // Bez limitu - všetky produkty
      if (!processedIds.has(product.id)) {
        processedIds.add(product.id);
        
        // Skontrolujeme globálny cache
        let details = globalProductDetailsCache.get(product.id);
        if (!details) {
          details = await fetchPrintfulProductDetails(product.id);
          if (details) {
            globalProductDetailsCache.set(product.id, details);
          }
        }
        
        // Znížené požiadavky - spracujeme aj produkty s neúplnými dátami
        if (details) {
          // Hľadanie popisku v Directus
          const directusData = descriptionsMap.get(product.id.toString());
          
          // Bezpečné získanie dát s fallback hodnotami
          const syncProduct = details.sync_product || {};
          const firstVariant = details.sync_variants?.[0] || {};
          const productDetails = firstVariant.product || {};
          
          // Určenie kategórie na základe názvu
          const name = (directusData?.name || syncProduct.name || product.name || '').toLowerCase();
          let main_category = 'unisex'; // Default kategória
          
          if (name.includes('women') || name.includes('žena') || name.includes('dáma') || name.includes('crop')) {
            main_category = 'women';
          } else if (name.includes('men') || name.includes('muž') || name.includes('pán')) {
            main_category = 'men';
          } else if (name.includes('kid') || name.includes('child') || name.includes('dieťa')) {
            main_category = 'kids';
          } else if (name.includes('mug') || name.includes('pohár') || name.includes('šálka') || name.includes('apron') || name.includes('bandana')) {
            main_category = 'home-decor';
          } else if (name.includes('poster') || name.includes('plagát') || name.includes('obraz')) {
            main_category = 'home-decor';
          }
          
          productsWithDetails.push({
            id: product.id,
            name: directusData?.name || syncProduct.name || product.name || 'Neznámý produkt',
            description: directusData?.[`description_${locale}`] || productDetails.description || 'Popis není k dispozici.',
            price: parseFloat(firstVariant.retail_price || '0'),
            thumbnail_url: syncProduct.thumbnail_url || product.thumbnail_url || '',
            mockup_images: [syncProduct.thumbnail_url || product.thumbnail_url || ''],
            printful_id: product.id.toString(),
            external_id: product.external_id,
            variants: product.variants,
            synced: product.synced,
            is_ignored: product.is_ignored,
            main_category
          });
        }
      }
    }
    
    console.log(`Successfully processed ${productsWithDetails.length} products with details`);
    
    // Aplikovanie filtrov
    let filteredProducts = productsWithDetails;
    
    // Filtrovanie podľa kategórie
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.main_category === category
      );
      console.log(`Filtered by category '${category}': ${filteredProducts.length} products`);
    }
    
    // Filtrovanie podľa vyhľadávania
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
      console.log(`Filtered by search '${search}': ${filteredProducts.length} products`);
    }
    
    // Filtrovanie podľa ceny
    if (priceFrom) {
      const minPrice = parseFloat(priceFrom);
      filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
      console.log(`Filtered by min price ${minPrice}: ${filteredProducts.length} products`);
    }
    
    if (priceTo) {
      const maxPrice = parseFloat(priceTo);
      filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
      console.log(`Filtered by max price ${maxPrice}: ${filteredProducts.length} products`);
    }
    
    // Zoradenie
    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name_asc':
        case 'name-asc':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
        case 'name-desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
      console.log(`Sorted by ${sortBy}: ${filteredProducts.length} products`);
    }
    
    console.log(`Returning ${filteredProducts.length} filtered products`);
    
    return NextResponse.json(filteredProducts);
    
  } catch (error) {
    console.error('Error in /api/products/all:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
