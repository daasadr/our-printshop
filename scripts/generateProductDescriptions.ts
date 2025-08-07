import { directus } from '../src/lib/directus';
import { readItems, updateItem } from '@directus/sdk';
// Lokálna implementácia generateProductDescription funkcie
function generateProductDescription(productName: string, category: string, locale: string = 'cs', dictionary?: any): string {
  // Získaj product.description objekt
  const productDescription = dictionary?.product?.description;
  
  if (!productDescription) {
    return `Kvalitní ${productName} s originálním designem. Vyrobeno s péčí a láskou k detailu.`;
  }
  
  // Získaj template text
  const templateText = productDescription[category] || 
                      productDescription.fallback || 
                      `Kvalitní {product_name} s originálním designem.`;
  
  return templateText.replace('{product_name}', productName);
}

// Lokálna implementácia generateDescriptionByProductType funkcie
function generateDescriptionByProductType(productName: string, productType: string, locale: string = 'cs', dictionary?: any): string {
  // Získaj product.description objekt
  const productDescription = dictionary?.product?.description;
  
  if (!productDescription) {
    return generateProductDescription(productName, 'unisex', locale, dictionary);
  }
  
  // Získaj template text pre typ produktu
  const templateText = productDescription[productType.toLowerCase()] || 
                      productDescription.fallback || 
                      `Kvalitní {product_name} s originálním designem.`;
  
  return templateText.replace('{product_name}', productName);
}
import * as fs from 'fs';
import * as path from 'path';

interface Product {
  id: string;
  name: string;
  description?: string;
  main_category?: string;
  printful_id?: string;
}

// Funkcia na načítanie prekladového slovníka
function loadDictionary(locale: string): any {
  try {
    const filePath = path.join(__dirname, '../public/locales', locale, 'common.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Chyba pri načítaní slovníka pre ${locale}:`, error);
    return {};
  }
}

async function generateDescriptionsForExistingProducts() {
  try {
    console.log('🚀 Začínam generovanie popisov pre existujúce produkty...');
    
    // Načítaj prekladové slovníky pre všetky jazyky
    const dictionaries = {
      cs: loadDictionary('cs'),
      sk: loadDictionary('sk'),
      en: loadDictionary('en'),
      de: loadDictionary('de')
    };
    
                 // Načítaj všetky produkty ktoré nemajú prekladové polia
             const products = await directus.request(readItems('products', {
               filter: {
                 _or: [
                   { description_cs: { _null: true } },
                   { description_cs: { _empty: true } },
                   { description_sk: { _null: true } },
                   { description_sk: { _empty: true } },
                   { description_en: { _null: true } },
                   { description_en: { _empty: true } },
                   { description_de: { _null: true } },
                   { description_de: { _empty: true } }
                 ]
               },
               fields: ['id', 'name', 'description', 'main_category', 'printful_id']
             })) as Product[];
    
    console.log(`📦 Našiel som ${products.length} produktov bez popisu`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const product of products) {
      try {
        // Urči kategóriu produktu
        let category = product.main_category || 'unisex';
        
        // Ak nemá kategóriu, skús ju určiť z názvu
        if (!product.main_category) {
          const nameLower = product.name.toLowerCase();
          if (nameLower.includes('men') || nameLower.includes('pánske')) {
            category = 'men';
          } else if (nameLower.includes('women') || nameLower.includes('dámske')) {
            category = 'women';
          } else if (nameLower.includes('kids') || nameLower.includes('deti')) {
            category = 'kids';
          } else if (nameLower.includes('poster') || nameLower.includes('plagát')) {
            category = 'home-decor';
          }
        }
        
        // Skontroluj, či má produkt už anglický popis z Printful
        const hasEnglishDescription = product.description && 
          (product.description.includes('Made from') || 
           product.description.includes('Quality') || 
           product.description.includes('Perfect for') ||
           product.description.includes('Stylish') ||
           product.description.includes('Beautiful'));
        
        // Generuj popisy pre všetky jazyky pomocou prekladových slovníkov
        const descriptions = {
          description_cs: await generateProductDescription(product.name, category, 'cs', dictionaries.cs),
          description_sk: await generateProductDescription(product.name, category, 'sk', dictionaries.sk),
          description_en: hasEnglishDescription ? product.description : await generateProductDescription(product.name, category, 'en', dictionaries.en),
          description_de: await generateProductDescription(product.name, category, 'de', dictionaries.de),
          // Hlavný popis v češtine
          description: await generateProductDescription(product.name, category, 'cs', dictionaries.cs)
        };
        
        // Aktualizuj produkt v Directus
        await directus.request(updateItem('products', product.id, descriptions));
        
        console.log(`✅ Aktualizovaný produkt: ${product.name} (${category})`);
        updatedCount++;
        
        // Pridaj malé oneskorenie aby sme nepreťažili API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Chyba pri aktualizácii produktu ${product.name}:`, error);
        skippedCount++;
      }
    }
    
    console.log(`\n🎉 Generovanie dokončené!`);
    console.log(`✅ Aktualizovaných produktov: ${updatedCount}`);
    console.log(`❌ Preskočených produktov: ${skippedCount}`);
    
  } catch (error) {
    console.error('❌ Chyba pri generovaní popisov:', error);
  }
}

// Skript na generovanie popisov pre nové produkty pri synchronizácii
export async function generateDescriptionForNewProduct(
  productName: string,
  category: string = 'unisex',
  productType?: string
) {
  // Načítaj prekladové slovníky
  const dictionaries = {
    cs: loadDictionary('cs'),
    sk: loadDictionary('sk'),
    en: loadDictionary('en'),
    de: loadDictionary('de')
  };
  
  if (productType) {
    return {
      description_cs: await generateDescriptionByProductType(productName, productType, 'cs', dictionaries.cs),
      description_sk: await generateDescriptionByProductType(productName, productType, 'sk', dictionaries.sk),
      description_en: await generateDescriptionByProductType(productName, productType, 'en', dictionaries.en),
      description_de: await generateDescriptionByProductType(productName, productType, 'de', dictionaries.de),
      description: await generateDescriptionByProductType(productName, productType, 'cs', dictionaries.cs)
    };
  }
  
  return {
    description_cs: await generateProductDescription(productName, category, 'cs', dictionaries.cs),
    description_sk: await generateProductDescription(productName, category, 'sk', dictionaries.sk),
    description_en: await generateProductDescription(productName, category, 'en', dictionaries.en),
    description_de: await generateProductDescription(productName, category, 'de', dictionaries.de),
    description: await generateProductDescription(productName, category, 'cs', dictionaries.cs)
  };
}

// Spusti skript ak je volaný priamo
if (require.main === module) {
  generateDescriptionsForExistingProducts();
} 