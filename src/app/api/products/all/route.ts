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

async function fetchAllPrintfulProducts() {
  try {
    let allProducts = [];
    let offset = 0;
    const limit = 20;
    let hasMore = true;
    
    // Načítame všetky produkty pomocou pagination
    while (hasMore) {
      const response = await fetch(`https://api.printful.com/store/products?limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
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
    // Použijeme Store API namiesto Sync API
    const response = await fetch(`https://api.printful.com/store/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
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
    
    console.log('Fetching ALL products from Printful Store API and descriptions from Directus...');
    
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
    
    for (const product of allProducts) { // Bez limitu - všetky produkty
      const details = await fetchPrintfulProductDetails(product.id);
      
      // Znížené požiadavky - spracujeme aj produkty s neúplnými dátami
      if (details && !processedIds.has(product.id)) {
        processedIds.add(product.id);
        
        // Hľadanie popisku v Directus
        const directusData = descriptionsMap.get(product.id.toString());
        
        // Bezpečné získanie dát s fallback hodnotami
        const syncProduct = details.sync_product || {};
        const firstVariant = details.sync_variants?.[0] || {};
        const productDetails = firstVariant.product || {};
        
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
          is_ignored: product.is_ignored
        });
      }
    }
    
    console.log(`Successfully processed ${productsWithDetails.length} products with details`);
    
    return NextResponse.json(productsWithDetails);
    
  } catch (error) {
    console.error('Error in /api/products/all:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
