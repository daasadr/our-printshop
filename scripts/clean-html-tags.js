const { createDirectus, rest, staticToken } = require('@directus/sdk');

// Load environment variables
require('dotenv').config();

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
  .with(rest())
  .with(staticToken(process.env.DIRECTUS_TOKEN));

// Funkcia na vyčistenie HTML tagov
function stripHtmlTags(text) {
  if (!text) return text;
  return text
    .replace(/<[^>]*>/g, '') // Odstráň HTML tagy
    .replace(/&lt;/g, '<')   // Dekóduj HTML entity
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

async function cleanHtmlTags() {
  try {
    console.log('🔍 Načítavam všetky produkty...');
    
    // Načítaj všetky produkty
    const products = await directus.request(
      rest.readItems('products', {
        fields: ['id', 'name', 'description_cs', 'description_sk', 'description_en', 'description_de', 'description']
      })
    );

    console.log(`📦 Našiel som ${products.length} produktov`);

    let cleanedCount = 0;
    let updatedCount = 0;

    for (const product of products) {
      const originalDescriptions = {
        description: product.description,
        description_cs: product.description_cs,
        description_sk: product.description_sk,
        description_en: product.description_en,
        description_de: product.description_de
      };

      const cleanedDescriptions = {
        description: stripHtmlTags(product.description),
        description_cs: stripHtmlTags(product.description_cs),
        description_sk: stripHtmlTags(product.description_sk),
        description_en: stripHtmlTags(product.description_en),
        description_de: stripHtmlTags(product.description_de)
      };

      // Skontroluj, či sa niečo zmenilo
      const hasChanges = Object.keys(originalDescriptions).some(key => 
        originalDescriptions[key] !== cleanedDescriptions[key]
      );

      if (hasChanges) {
        console.log(`🧹 Čistím HTML tagy z produktu: ${product.name}`);
        
        // Aktualizuj produkt
        await directus.request(
          rest.updateItem('products', product.id, cleanedDescriptions)
        );
        
        updatedCount++;
      }

      cleanedCount++;
    }

    console.log(`✅ Hotovo! Vyčistených ${cleanedCount} produktov, aktualizovaných ${updatedCount} produktov`);

  } catch (error) {
    console.error('❌ Chyba pri čistení HTML tagov:', error);
  }
}

cleanHtmlTags(); 