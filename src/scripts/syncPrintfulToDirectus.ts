import fetch from 'node-fetch';
import { createDirectus, rest, staticToken, readItems, createItem, updateItem } from '@directus/sdk';
import dotenv from 'dotenv';
dotenv.config();

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

if (!PRINTFUL_API_KEY || !DIRECTUS_URL || !DIRECTUS_TOKEN) {
  console.error('Chybí PRINTFUL_API_KEY, NEXT_PUBLIC_DIRECTUS_URL nebo DIRECTUS_TOKEN v .env');
  process.exit(1);
}

const directus = createDirectus(DIRECTUS_URL)
  .with(staticToken(DIRECTUS_TOKEN))
  .with(rest());

type PrintfulFile = {
  type: string;
  url: string;
  preview_url: string;
};

type PrintfulVariant = {
  id: number;
  name: string;
  retail_price: string;
  sku: string;
  in_stock?: boolean;
  files?: PrintfulFile[];
  product?: {
    description?: string;
  };
};

type PrintfulProduct = {
  id: number;
  name: string;
  thumbnail_url?: string;
  sync_product: { id: number; name: string; thumbnail_url?: string };
};

async function fetchPrintfulProducts() {
  const res = await fetch('https://api.printful.com/store/products', {
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`
    }
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch from Printful: ${res.statusText} - ${errorText}`);
  }
  const data: any = await res.json();
  return data.result as PrintfulProduct[];
}

async function fetchPrintfulProductDetails(productId: number) {
  const res = await fetch(`https://api.printful.com/store/products/${productId}`, {
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`
    }
  });
  if (!res.ok) {
    return null;
  }
  const data: any = await res.json();
  return data.result as { sync_product: PrintfulProduct['sync_product'], sync_variants: PrintfulVariant[] };
}

function determineCategories(name: string): string[] {
    const lowerName = name.toLowerCase();
    const categories = new Set<string>();

    if (lowerName.includes('dress') || lowerName.includes('šaty')) categories.add('women');
    if (lowerName.includes('bikini') || lowerName.includes('swimsuit')) categories.add('women');
    if (lowerName.includes('tričko') || lowerName.includes('t-shirt') || lowerName.includes('top')) {
        categories.add('women');
        categories.add('men');
    }
    if (lowerName.includes('pánsk')) categories.add('men');
    if (lowerName.includes('dámsk')) categories.add('women');
    if (lowerName.includes('dětsk') || lowerName.includes('kids') || lowerName.includes('youth')) categories.add('kids');
    if (lowerName.includes('mikina') || lowerName.includes('hoodie') || lowerName.includes('sweatshirt')) {
        categories.add('men');
        categories.add('women');
    }
    if (lowerName.includes('plakát') || lowerName.includes('poster')) categories.add('domov-a-dekorace');
    if (lowerName.includes('hrnek') || lowerName.includes('mug')) categories.add('domov-a-dekorace');

    if (categories.size === 0) {
        categories.add('other');
    }

    return Array.from(categories);
}


async function upsertCategory(name: string, slug: string) {
    let items = await directus.request(readItems('categories', { filter: { slug: { _eq: slug } } }));

    if (items && items.length > 0) {
        return items[0];
    } else {
        return await directus.request(createItem('categories', { name, slug }));
    }
}

async function sync() {
  try {
    console.log('SKRIPT SPUŠTĚN: Začínám synchronizaci produktů z Printful do Directus...');
    const printfulProducts = await fetchPrintfulProducts();
    console.log(`Načteno ${printfulProducts.length} produktů z Printful`);

    for (const pf of printfulProducts) {
      try {
        const details = await fetchPrintfulProductDetails(pf.id);
        if (!details) {
          console.log(`- Přeskakuji produkt ${pf.name} (nelze načíst detaily)`);
          continue;
        }

        const categoryNames = determineCategories(details.sync_product.name);
        const categoryInfos = await Promise.all(categoryNames.map(catName => {
          const catSlug = catName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
          return upsertCategory(catName.charAt(0).toUpperCase() + catName.slice(1), catSlug);
        }));
        
        const description = details.sync_variants[0]?.product?.description || 'Popis není k dispozici.';
        
        const productData = {
          name: details.sync_product.name,
          description: description,
          price: parseFloat(details.sync_variants[0]?.retail_price || '0'),
          stock: details.sync_variants.reduce((acc, v) => acc + (v.in_stock ? 1 : 0), 0),
          printful_id: pf.id.toString(),
          image: details.sync_product.thumbnail_url,
          // Správný formát pro aktualizaci M2M vztahu v Directus
          categories: categoryInfos.map(c => ({categories_id: c.id}))
        };

        let existing = await directus.request(readItems('products', {
          filter: { printful_id: { _eq: pf.id.toString() } },
          fields: ['id']
        }));
        
        if (existing && existing.length > 0) {
          let productId = existing[0].id;
          console.log(`Aktualizuji produkt: ${details.sync_product.name} s kategoriemi: ${categoryNames.join(', ')}`);
          await directus.request(updateItem('products', productId, productData));
        } else {
          console.log(`Vytvářím nový produkt: ${details.sync_product.name} s kategoriemi: ${categoryNames.join(', ')}`);
          await directus.request(createItem('products', productData));
        }

      } catch (error: any) {
          const errorDetail = error.errors ? JSON.stringify(error.errors, null, 2) : error;
          console.error(`Chyba při synchronizaci produktu ID ${pf.id}:`, errorDetail);
      }
    }

    console.log('Synchronizace dokončena.');
  } catch (error) {
    console.error("Došlo k fatální chybě při spouštění synchronizace:", error);
    process.exit(1);
  }
}

sync();