import { PrismaClient } from '@prisma/client';
import { getProducts } from '@/services/printful';

const prisma = new PrismaClient();

interface PrintfulVariant {
  id: number;
  product_id: number;
  name: string;
  size?: string;
  color?: string;
  retail_price: string;
  [key: string]: any;
}

interface PrintfulProduct {
  id: number;
  name: string;
  description?: string;
  sync_variants: PrintfulVariant[];
  [key: string]: any;
}

interface PrintfulResponse {
  code: number;
  result: PrintfulProduct[];
  [key: string]: any;
}

// Funkce pro určení kategorie podle názvu produktu
function determineCategory(product: PrintfulProduct): string {
  const name = product.name.toLowerCase();
  
  if (name.includes('tričko') || name.includes('t-shirt')) {
    if (name.includes('dámsk') || name.includes('women') || name.includes('dress')) {
      return 'women';
    } else if (name.includes('dětsk') || name.includes('kids')) {
      return 'kids';
    } else {
      return 'men';
    }
  }
  
  if (name.includes('mikina') || name.includes('hoodie')) {
    return name.includes('dámsk') ? 'women' : 'men';
  }
  
  if (name.includes('plakát') || name.includes('hrnek')) {
    return 'home-decor';
  }
  
  return 'other';
}

async function syncPrintfulProducts() {
  try {
    console.log('Starting Printful products synchronization...');
    
    // Získat produkty z Printful
    const printfulResponse = await getProducts() as PrintfulResponse;
    
    // Ověřit, že data jsou ve správném formátu
    if (!printfulResponse || !printfulResponse.result) {
      throw new Error('Invalid response from Printful API');
    }
    
    const printfulProducts = printfulResponse.result;
    
    console.log(`Found ${printfulProducts.length} products on Printful`);
    
    // Pro každý produkt v Printful
    for (const product of printfulProducts) {
      // Určit kategorii
      const category = determineCategory(product);
      console.log(`Product: ${product.name}, Category: ${category}`);
      
      // Zkontrolovat, zda produkt existuje v databázi
      const existingProduct = await prisma.product.findUnique({
        where: { printfulId: product.id.toString() }
      });
      
      if (existingProduct) {
        // Aktualizovat existující produkt
        console.log(`Updating product: ${product.name}`);
        
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            title: product.name,
            description: product.description || product.name,
            printfulSync: true,
          }
        });
      } else {
        // Vytvořit nový produkt
        console.log(`Creating new product: ${product.name}`);
        
        const newProduct = await prisma.product.create({
          data: {
            title: product.name,
            description: product.description || product.name,
            printfulId: product.id.toString(),
            printfulSync: true,
            isActive: true,
          }
        });
        
        // Vytvořit varianty
        for (const variant of product.sync_variants || []) {
          await prisma.variant.create({
            data: {
              productId: newProduct.id,
              printfulVariantId: variant.id.toString(),
              name: variant.name || 'Default',
              size: variant.size || null,
              color: variant.color || null,
              price: parseFloat(variant.retail_price) || 0,
              isActive: true,
            }
          });
        }
      }
    }
    
    console.log('Synchronization completed successfully!');
  } catch (error) {
    console.error('Error syncing products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Spustit synchronizaci
syncPrintfulProducts();