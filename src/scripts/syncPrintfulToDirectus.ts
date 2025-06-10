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

type PrintfulVariant = {
  id: number;
  name: string;
  retail_price: string;
  sku: string;
  in_stock?: boolean;
  files?: Array<{ url?: string; type?: string }>;
};

type PrintfulProduct = {
  id: number;
  name: string;
  thumbnail_url?: string;
  sync_product: { id: number; name: string; thumbnail_url?: string };
};

async function fetchPrintfulProducts() {
  const res = await fetch('https://api.printful.com/store/products', {
    headers: { Authorization: `Bearer ${PRINTFUL_API_KEY}` },
  });
  if (!res.ok) throw new Error('Chyba při načítání produktů z Printful');
  const data = await res.json();
  return (data as any).result as PrintfulProduct[];
}

async function fetchPrintfulProductDetails(id: number) {
  const res = await fetch(`https://api.printful.com/store/products/${id}`, {
    headers: { Authorization: `Bearer ${PRINTFUL_API_KEY}` },
  });
  if (!res.ok) throw new Error('Chyba při načítání detailu produktu z Printful');
  const data = await res.json();
  return (data as any).result;
}

async function upsertCategory(name: string) {
  const categories = await directus.request(readItems('categories', { filter: { name: { _eq: name } } }));
  if (categories && categories.length > 0) return categories[0].id;
  const created = await directus.request(createItem('categories', { name }));
  return created.id;
}

function determineCategory(productName: string): string {
  if (!productName || typeof productName !== 'string') return 'other';
  const name = productName.toLowerCase();
  if (name.includes('dress') || name.includes('šaty') || name.includes('dámsk')) return 'women';
  if (name.includes('tričko') || name.includes('t-shirt')) return 'men';
  if (name.includes('dětsk') || name.includes('kids')) return 'kids';
  if (name.includes('mikina') || name.includes('hoodie')) return 'men';
  if (name.includes('plakát') || name.includes('poster')) return 'home-decor';
  return 'other';
}

async function sync() {
  console.log('Začínám synchronizaci produktů z Printful do Directus...');
  const products = await fetchPrintfulProducts();
  console.log(`Načteno ${products.length} produktů z Printful`);

  for (const pf of products) {
    try {
      const details = await fetchPrintfulProductDetails(pf.id);
      
      if (!details.sync_product || !details.sync_product.name) {
        console.warn(`Produkt ID ${pf.id} nemá název, přeskakuji...`);
        continue;
      }

      const categoryName = determineCategory(details.sync_product.name);
      const categoryId = await upsertCategory(categoryName);

      const existing = await directus.request(readItems('products', { 
        filter: { printful_id: { _eq: pf.id.toString() } } 
      }));

      const mockups = [
        (pf && pf.sync_product && pf.sync_product.thumbnail_url) || 
        pf?.thumbnail_url || 
        ''
      ].filter(Boolean);

      const productData = {
        name: details.sync_product.name,
        description: details.description || '',
        price: details.sync_variants?.[0]?.retail_price || '0',
        printful_id: pf.id.toString(),
        mockups,
        categories: [categoryId],
        is_active: true
      };

      let productId;
      if (existing && existing.length > 0) {
        productId = existing[0].id;
        console.log(`Aktualizuji produkt: ${details.sync_product.name}`);
        await directus.request(updateItem('products', productId, productData));
      } else {
        console.log(`Vytvářím nový produkt: ${details.name}`);
        const created = await directus.request(createItem('products', productData));
        productId = created.id;
      }

      if (details.sync_variants) {
        for (const v of details.sync_variants) {
          const existingVar = await directus.request(readItems('variants', { 
            filter: { printful_variant_id: { _eq: v.id.toString() } } 
          }));

          const variantData = {
            name: v.name,
            price: v.retail_price,
            sku: v.sku,
            printful_variant_id: v.id.toString(),
            product: productId,
            is_active: true
          };

          if (existingVar && existingVar.length > 0) {
            await directus.request(updateItem('variants', existingVar[0].id, variantData));
          } else {
            await directus.request(createItem('variants', variantData));
          }
        }
      }

      console.log(`✓ Synchronizován produkt: ${details.sync_product.name}`);
    } catch (error) {
      console.error(`Chyba při synchronizaci produktu ID ${pf.id}:`, error);
    }
  }
}

sync().then(() => {
  console.log('Synchronizace dokončena.');
  process.exit(0);
}).catch(e => {
  console.error('Chyba při synchronizaci:', e);
  process.exit(1);
});