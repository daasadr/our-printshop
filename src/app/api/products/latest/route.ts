import { NextRequest, NextResponse } from 'next/server';
import { readItems } from '@directus/sdk';
import { directus } from '@/lib/directus';

// Force dynamic rendering - don't generate static pages for this API
export const dynamic = 'force-dynamic';

async function fetchPrintfulProducts() {
  try {
    const response = await fetch('https://api.printful.com/sync/products', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status}`);
    }

    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error('Error fetching from Printful:', error);
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
    const response = await fetch(`https://api.printful.com/sync/products/${productId}`, {
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
    
    console.log('Fetching products from Printful and descriptions from Directus...');
    
    // Získanie produktov z Printful
    const printfulProducts = await fetchPrintfulProducts();
    console.log(`Found ${printfulProducts.length} products in Printful`);
    
    // Odstránenie duplikátov podľa názvu - zoberieme len prvý výskyt každého názvu
    const uniqueProducts = printfulProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.name === product.name)
    );
    console.log(`After removing duplicates by name: ${uniqueProducts.length} unique products`);
    
    // Filtrovanie len hlavných produktov (bez variantov)
    const mainProducts = uniqueProducts.filter(product => 
      !product.name.includes(' / ') && !product.name.includes(' - ')
    );
    console.log(`Main products (without variants): ${mainProducts.length} products`);
    
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
    
    // Získanie detailov pre každý produkt - len pre aktívne produkty
    const productsWithDetails = [];
    const processedIds = new Set(); // Pre sledovanie spracovaných ID
    
    for (const product of mainProducts.slice(0, 41)) { // Limit na 41 produktov
      const details = await fetchPrintfulProductDetails(product.id);
      if (details && details.sync_product && details.sync_variants && details.sync_variants.length > 0) {
        const firstVariant = details.sync_variants[0];
        
        // Kontrola, či má produkt platné dáta a či sme ho ešte nespracovali
        if (firstVariant && firstVariant.product && details.sync_product.thumbnail_url && !processedIds.has(product.id)) {
          processedIds.add(product.id);
          
          // Hľadanie popisku v Directus
          const directusData = descriptionsMap.get(product.id.toString());
          
          // Použijeme názov hlavného produktu, nie variantu
          const productName = directusData?.name || details.sync_product.name;
          
          productsWithDetails.push({
            id: product.id,
            name: productName, // Hlavný názov produktu
            description: directusData?.[`description_${locale}`] || firstVariant.product?.description || 'Popis není k dispozici.',
            price: parseFloat(firstVariant.retail_price || '0'),
            thumbnail_url: details.sync_product.thumbnail_url,
            mockup_images: [details.sync_product.thumbnail_url], // Pridané pre getProductImages
            printful_id: product.id.toString(),
            main_category: 'unisex', // Default kategória
            // Pridanie emoji ikon z Directus
            icon_cs: directusData?.icon_cs || '',
            icon_sk: directusData?.icon_sk || '',
            icon_en: directusData?.icon_en || '',
            icon_de: directusData?.icon_de || '',
            variants: details.sync_variants?.map(variant => ({
              id: variant.id,
              name: variant.name,
              price: parseFloat(variant.retail_price || '0'),
              is_active: variant.in_stock
            })) || [],
            designs: [{
              id: product.id,
              name: details.sync_product.name,
              previewUrl: details.sync_product.thumbnail_url
            }]
          });
        }
      }
    }
    
    console.log(`Processed ${productsWithDetails.length} products with combined data`);
    
    return NextResponse.json(productsWithDetails);
  } catch (error) {
    console.error('Error in latest products API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest products' },
      { status: 500 }
    );
  }
}