require('dotenv').config();
const { createDirectus, rest, readItems, updateItem } = require('@directus/sdk');

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
  .with(rest());

async function clearTranslationFields() {
  try {
    console.log('🧹 Čistím prekladové polia...');
    
    // Získaj prvých 5 produktov
    const products = await directus.request(readItems('products', {
      fields: ['id', 'name', 'description_cs', 'description_sk', 'description_en', 'description_de'],
      limit: 5
    }));
    
    console.log(`📦 Našiel som ${products.length} produktov`);
    
    // Vyčisti prekladové polia
    for (const product of products) {
      try {
        await directus.request(updateItem('products', product.id, {
          description_cs: '',
          description_sk: '',
          description_en: '',
          description_de: ''
        }));
        console.log(`✅ Vyčistené polia pre produkt: ${product.name}`);
      } catch (updateError) {
        console.error(`❌ Chyba pri update produktu ${product.name}:`, updateError.message);
      }
    }
    
    console.log('🎉 Prekladové polia boli vyčistené!');
    
  } catch (error) {
    console.error('❌ Chyba:', error.message);
  }
}

clearTranslationFields(); 