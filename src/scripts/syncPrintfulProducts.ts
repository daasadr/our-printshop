import prisma from '@/lib/prisma';
import fetch from 'node-fetch';
import { convertEurToCzkSync } from '../utils/currency';

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

if (!PRINTFUL_API_KEY) {
  console.error('Chybí PRINTFUL_API_KEY v proměnných prostředí');
  process.exit(1);
}

// Definice rozhraní pro Printful API
interface PrintfulVariant {
  id: number;
  name: string;
  size?: string | null;
  color?: string | null;
  retail_price: string;
  in_stock?: boolean;
  files?: Array<{
    id: number;
    type: string;
    url?: string;
    filename?: string;
    size?: number;
    width?: number;
    height?: number;
    dpi?: number;
  }>;
}

interface PrintfulSyncProduct {
  id: number;
  name: string;
  thumbnail_url?: string;
  sync_product: {
    id: number;
    name: string;
    thumbnail_url?: string;
  };
}

interface PrintfulResponse {
  code: number;
  result: PrintfulSyncProduct[];
}

interface PrintfulProductDetails {
  result: {
    id: number;
    name: string;
    sync_variants?: PrintfulVariant[];
    [key: string]: any;
  };
}

// Funkce pro určení kategorie podle názvu produktu
function determineCategory(productName: string): string {
  const name = productName.toLowerCase();
 
  // Dámské oblečení
  if (name.includes('dress') || name.includes('šaty') || 
      name.includes('dámsk') || name.includes('women') || 
      name.includes('female') || name.includes('lady')) {
    return 'women';
  }
  
  // Trička
  if (name.includes('tričko') || name.includes('t-shirt') || name.includes('tee')) {
    if (name.includes('dámsk') || name.includes('women') || name.includes('female')) {
      return 'women';
    } else if (name.includes('dětsk') || name.includes('kids') || name.includes('child')) {
      return 'kids';
    } else {
      return 'men';
    }
  } 
  
  // Mikiny a svetry
  if (name.includes('mikina') || name.includes('hoodie') || name.includes('sweatshirt') || 
      name.includes('sweater') || name.includes('svetr')) {
    return name.includes('dámsk') || name.includes('women') || name.includes('female') ? 'women' : 'men';
  }
  
  // Dětské oblečení
  if (name.includes('dětsk') || name.includes('kids') || name.includes('child') || 
      name.includes('baby') || name.includes('infant')) {
    return 'kids';
  }
  
  // Pánské oblečení
  if (name.includes('pánsk') || name.includes('men') || name.includes('male') || 
      name.includes('guy') || name.includes('gentleman')) {
    return 'men';
  }
  
  // Domov a dekorace
  if (name.includes('plakát') || name.includes('poster') || name.includes('hrnek') || 
      name.includes('mug') || name.includes('dekor') || name.includes('decor') || 
      name.includes('home') || name.includes('domov') || name.includes('wall') || 
      name.includes('stěna') || name.includes('canvas') || name.includes('plátno')) {
    return 'home-decor';
  }
  
  // Pokud nemůžeme určit kategorii, vrátíme 'other'
  return 'other';
}

async function syncPrintfulProducts() {
  try {
    console.log('Začínám synchronizaci produktů z Printful...');
   
    // Získání sync produktů z Printful API
    const response = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Chyba Printful API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as PrintfulResponse;
    
    if (!data || !data.result) {
      throw new Error('Neplatná odpověď z Printful API');
    }
   
    const printfulProducts = data.result;
   
    console.log(`Nalezeno ${printfulProducts.length} produktů na Printful`);
   
    // Pro každý produkt v Printful
    for (const syncProduct of printfulProducts) {
      const productName = syncProduct.sync_product.name;
      
      // Určíme kategorii
      const category = determineCategory(productName);
      console.log(`Produkt: ${productName}, Kategorie: ${category}`);
      
      try {
        // Získáme informace o produktu včetně obrázků a cen
        const productResponse = await fetch(`https://api.printful.com/store/products/${syncProduct.id}`, {
          headers: {
            'Authorization': `Bearer ${PRINTFUL_API_KEY}`
          }
        });
        
        if (!productResponse.ok) {
          console.error(`Chyba při získávání detailů produktu ${syncProduct.id}: ${productResponse.status}`);
          continue;
        }
        
        const productDetails = await productResponse.json() as PrintfulProductDetails;
        
        if (!productDetails || !productDetails.result) {
          console.error(`Neplatná odpověď pro detaily produktu ${syncProduct.id}`);
          continue;
        }
        
        // Najdeme hlavní obrázek produktu - zkusíme získat nejlepší dostupný obrázek
        let thumbnailUrl = syncProduct.sync_product.thumbnail_url || syncProduct.thumbnail_url;
        
        // Pokud nemáme thumbnail, zkusíme najít obrázek v sync_variants
        if (!thumbnailUrl && productDetails.result.sync_variants && productDetails.result.sync_variants.length > 0) {
          for (const variant of productDetails.result.sync_variants) {
            if (variant.files && variant.files.length > 0) {
              // Najdeme první obrázek typu 'preview' nebo 'default'
              const previewFile = variant.files.find(file => 
                file.type === 'preview' || file.type === 'default'
              );
              
              if (previewFile && previewFile.url) {
                thumbnailUrl = previewFile.url;
                break;
              }
            }
          }
        }
        
        // Zajistíme, že URL adresa začíná na https://
        if (thumbnailUrl) {
          if (!thumbnailUrl.startsWith('http')) {
            thumbnailUrl = `https://${thumbnailUrl}`;
          }
          console.log(`Zpracovaná URL obrázku pro produkt ${productName}: ${thumbnailUrl}`);
        }
        
        // Zkontrolujeme, zda produkt existuje v databázi
        const existingProduct = await prisma.product.findFirst({
          where: { 
            printfulId: syncProduct.id.toString() 
          },
          include: {
            variants: true,
            designs: true
          }
        });
        
        if (!existingProduct) {
          // Vytvoříme nový produkt
          console.log(`Vytvářím nový produkt: ${productName}`);
          
          // Nejprve vytvoříme produkt
          const newProduct = await prisma.product.create({
            data: {
              title: productName,
              description: `Originální produkt: ${productName}`,
              printfulId: syncProduct.id.toString(),
              printfulSync: true,
              isActive: true,
              category: {
                connect: {
                  name: category
                }
              }
            }
          });
          
          // Pak přidáme design, pokud máme thumbnail
          if (thumbnailUrl) {
            console.log(`Ukládám design pro produkt ${productName} s URL: ${thumbnailUrl}`);
            
            await prisma.design.create({
              data: {
                name: `Design pro ${productName}`,
                printfulFileId: syncProduct.id.toString(),
                previewUrl: thumbnailUrl,
                product: {
                  connect: { id: newProduct.id }
                }
              }
            });
            
            console.log(`Vytvořen nový design pro produkt: ${productName}`);
          }
          
          // Nakonec přidáme varianty
          if (productDetails.result.sync_variants && productDetails.result.sync_variants.length > 0) {
            for (const variant of productDetails.result.sync_variants) {
              if (!variant.id || !variant.retail_price) {
                console.warn(`Variant ${variant.id} nemá všechny potřebné údaje, přeskakuji.`);
                continue;
              }
              
              const eurPrice = parseFloat(variant.retail_price);
              // Použít synchronní verzi pro převod měny
              const czkPrice = convertEurToCzkSync(eurPrice);
              
              await prisma.variant.create({
                data: {
                  printfulVariantId: variant.id.toString(),
                  name: variant.name || 'Default',
                  size: variant.size || null,
                  color: variant.color || null,
                  price: czkPrice,
                  isActive: true,
                  product: {
                    connect: { id: newProduct.id }
                  }
                }
              });
            }
            
            console.log(`Vytvořeny varianty pro produkt: ${productName}`);
          }
        } else {
          // Aktualizujeme existující produkt
          console.log(`Aktualizuji produkt: ${productName}`);
          
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              title: productName,
              description: `Originální produkt: ${productName}`,
              printfulSync: true,
              isActive: true,
              category: {
                connect: {
                  name: category
                }
              }
            }
          });
          
          // Aktualizujeme design, pokud existuje, jinak vytvoříme nový
          if (thumbnailUrl) {
            if (existingProduct.designs.length > 0) {
              await prisma.design.update({
                where: { id: existingProduct.designs[0].id },
                data: {
                  previewUrl: thumbnailUrl
                }
              });
            } else {
              await prisma.design.create({
                data: {
                  name: `Design pro ${productName}`,
                  printfulFileId: syncProduct.id.toString(),
                  previewUrl: thumbnailUrl,
                  product: {
                    connect: { id: existingProduct.id }
                  }
                }
              });
            }
          }
          
          // Aktualizujeme varianty
          if (productDetails.result.sync_variants && productDetails.result.sync_variants.length > 0) {
            for (const variant of productDetails.result.sync_variants) {
              const existingVariant = existingProduct.variants.find(
                v => v.printfulVariantId === variant.id.toString()
              );
              
              const eurPrice = parseFloat(variant.retail_price);
              // Použít synchronní verzi pro převod měny
              const czkPrice = convertEurToCzkSync(eurPrice);
              
              if (existingVariant) {
                await prisma.variant.update({
                  where: { id: existingVariant.id },
                  data: {
                    name: variant.name || 'Default',
                    size: variant.size || null,
                    color: variant.color || null,
                    price: czkPrice,
                    isActive: true
                  }
                });
              } else {
                await prisma.variant.create({
                  data: {
                    printfulVariantId: variant.id.toString(),
                    name: variant.name || 'Default',
                    size: variant.size || null,
                    color: variant.color || null,
                    price: czkPrice,
                    isActive: true,
                    product: {
                      connect: { id: existingProduct.id }
                    }
                  }
                });
              }
            }
          }
        }
      } catch (productError) {
        console.error(`Chyba při zpracování produktu ${syncProduct.id}:`, productError);
      }
    }
   
    console.log('Synchronizace byla úspěšně dokončena!');
  } catch (error) {
    console.error('Chyba při synchronizaci produktů:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Spustíme synchronizaci
syncPrintfulProducts();