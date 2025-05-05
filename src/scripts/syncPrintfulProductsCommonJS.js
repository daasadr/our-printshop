const prisma = require('@/lib/prisma');
// Použijeme fetch pro starší verze Node.js
const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Načtení proměnných prostředí z .env souboru
dotenv.config();

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

if (!PRINTFUL_API_KEY) {
  console.error('Chybí PRINTFUL_API_KEY v proměnných prostředí');
  process.exit(1);
}

// Funkce pro určení kategorie podle názvu produktu
function determineCategory(productName) {
  if (!productName) return 'other';
  
  const name = productName.toLowerCase();
 
  if (name.includes('dress') || name.includes('šaty')) {
    return 'women';
  }
  
  if (name.includes('tričko') || name.includes('t-shirt') || name.includes('tee')) {
    if (name.includes('dámsk') || name.includes('women')) {
      return 'women';
    } else if (name.includes('dětsk') || name.includes('kids')) {
      return 'kids';
    } else {
      return 'men';
    }
  } 
  
  if (name.includes('mikina') || name.includes('hoodie') || name.includes('sweatshirt')) {
    return name.includes('dámsk') || name.includes('women') ? 'women' : 'men';
  }
 
  if (name.includes('plakát') || name.includes('poster') || name.includes('hrnek') || name.includes('mug')) {
    return 'home-decor';
  }
 
  return 'other';
}

// Funkce pro bezpečné získání vlastnosti z objektu
function safeGet(obj, path, defaultValue = undefined) {
  if (!obj) return defaultValue;
  const keys = path.split('.');
  return keys.reduce((o, key) => (o && o[key] !== undefined ? o[key] : defaultValue), obj);
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
    
    const data = await response.json();
    console.log('Odpověď z Printful API:', JSON.stringify(data, null, 2));
    
    if (!data || !data.result) {
      throw new Error('Neplatná odpověď z Printful API');
    }
   
    const printfulProducts = data.result;
   
    console.log(`Nalezeno ${printfulProducts.length} produktů na Printful`);
   
    // Pro každý produkt v Printful
    for (const syncProduct of printfulProducts) {
      console.log('Zpracovávám syncProduct:', JSON.stringify(syncProduct, null, 2));
      
      // Bezpečné získání názvu produktu
      const productName = syncProduct.name;
      
      if (!productName) {
        console.error('Produkt nemá platný název:', syncProduct);
        continue; // Přeskočit tento produkt
      }
      
      // Určíme kategorii
      const category = determineCategory(productName);
      console.log(`Produkt: ${productName}, Kategorie: ${category}`);
      
      try {
        // Získáme informace o produktu včetně obrázků a cen
        console.log(`Získávám detaily pro produkt ID ${syncProduct.id}...`);
        const productDetailsUrl = `https://api.printful.com/store/products/${syncProduct.id}`;
        console.log('URL dotazu na detaily produktu:', productDetailsUrl);
        
        const productResponse = await fetch(productDetailsUrl, {
          headers: {
            'Authorization': `Bearer ${PRINTFUL_API_KEY}`
          }
        });
        
        if (!productResponse.ok) {
          console.error(`Chyba při získávání detailů produktu ${syncProduct.id}: ${productResponse.status}`);
          continue;
        }
        
        const productDetails = await productResponse.json();
        console.log('Detail produktu z API:', JSON.stringify(productDetails, null, 2));
        
        if (!productDetails || !productDetails.result) {
          console.error(`Neplatná odpověď pro detaily produktu ${syncProduct.id}`);
          continue;
        }
        
        // Najdeme hlavní obrázek produktu
        const thumbnailUrl = syncProduct.thumbnail_url;
        
        console.log('Thumbnail URL:', thumbnailUrl);
        
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
        
        console.log('Existující produkt v databázi:', existingProduct ? 'ANO' : 'NE');
        
        // Zkusíme získat varianty produktu - měly by být v productDetails.result.sync_variants
        let variants = [];
        if (productDetails.result && productDetails.result.sync_variants) {
          variants = productDetails.result.sync_variants;
          console.log(`Nalezeno ${variants.length} variant produktu:`);
          variants.forEach((v, i) => {
            console.log(`Varianta ${i+1}: ID=${v.id}, Název=${v.name}, Cena=${v.retail_price}`);
          });
        } else {
          console.log('Varianty produktu nenalezeny v odpovědi API!');
        }
        
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
              category
            }
          });
          
          console.log('Nový produkt vytvořen:', newProduct.id);
          
          // Pak přidáme design, pokud máme thumbnail
          if (thumbnailUrl) {
            console.log('Vytvářím design s URL:', thumbnailUrl);
            try {
              const design = await prisma.design.create({
                data: {
                  name: `Design pro ${productName}`,
                  printfulFileId: syncProduct.id.toString(),
                  previewUrl: thumbnailUrl,
                  product: {
                    connect: { id: newProduct.id }
                  }
                }
              });
              
              console.log(`Vytvořen nový design:`, design.id);
            } catch (designError) {
              console.error('Chyba při vytváření designu:', designError);
            }
          } else {
            console.log('Žádný thumbnail URL, design nebude vytvořen');
          }
          
          // Nakonec přidáme varianty
          if (variants && variants.length > 0) {
            console.log(`Vytvářím ${variants.length} variant...`);
            
            for (const variant of variants) {
              if (!variant || !variant.id) {
                console.error('Neplatná varianta:', variant);
                continue;
              }
              
              try {
                const price = parseFloat(variant.retail_price);
                console.log(`Vytvářím variantu: ${variant.name}, Cena: ${price} Kč`);
                
                const newVariant = await prisma.variant.create({
                  data: {
                    printfulVariantId: variant.id.toString(),
                    name: variant.name || 'Default',
                    size: variant.size || null,
                    color: variant.color || null,
                    price: price || 0,
                    isActive: true,
                    product: {
                      connect: { id: newProduct.id }
                    }
                  }
                });
                
                console.log(`Vytvořena nová varianta:`, newVariant.id);
              } catch (variantError) {
                console.error('Chyba při vytváření varianty:', variantError);
              }
            }
            
            console.log(`Vytvořeny varianty pro produkt: ${productName}`);
          } else {
            console.log('Žádné varianty k vytvoření');
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
              category
            }
          });
          
          // Aktualizujeme design, pokud existuje, jinak vytvoříme nový
          if (thumbnailUrl) {
            if (existingProduct.designs && existingProduct.designs.length > 0) {
              console.log('Aktualizuji existující design:', existingProduct.designs[0].id);
              await prisma.design.update({
                where: { id: existingProduct.designs[0].id },
                data: {
                  previewUrl: thumbnailUrl
                }
              });
            } else {
              console.log('Vytvářím nový design pro existující produkt');
              try {
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
              } catch (designError) {
                console.error('Chyba při vytváření designu:', designError);
              }
            }
          } else {
            console.log('Žádný thumbnail URL pro aktualizaci designu');
          }
          
          // Aktualizujeme varianty
          if (variants && variants.length > 0) {
            console.log(`Aktualizuji ${variants.length} variant...`);
            
            for (const variant of variants) {
              if (!variant || !variant.id) {
                console.error('Neplatná varianta pro aktualizaci:', variant);
                continue;
              }
              
              try {
                const price = parseFloat(variant.retail_price);
                console.log(`Zpracovávám variantu: ${variant.name}, Cena: ${price} Kč`);
                
                const existingVariant = existingProduct.variants.find(
                  v => v.printfulVariantId === variant.id.toString()
                );
                
                if (existingVariant) {
                  console.log('Aktualizuji existující variantu:', existingVariant.id);
                  await prisma.variant.update({
                    where: { id: existingVariant.id },
                    data: {
                      name: variant.name || 'Default',
                      size: variant.size || null,
                      color: variant.color || null,
                      price: price || 0,
                      isActive: true
                    }
                  });
                } else {
                  console.log('Vytvářím novou variantu pro existující produkt');
                  await prisma.variant.create({
                    data: {
                      printfulVariantId: variant.id.toString(),
                      name: variant.name || 'Default',
                      size: variant.size || null,
                      color: variant.color || null,
                      price: price || 0,
                      isActive: true,
                      product: {
                        connect: { id: existingProduct.id }
                      }
                    }
                  });
                }
              } catch (variantUpdateError) {
                console.error('Chyba při aktualizaci varianty:', variantUpdateError);
              }
            }
          } else {
            console.log('Žádné varianty k aktualizaci');
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