require('dotenv').config();
const { createDirectus, rest, readItems, updateItem } = require('@directus/sdk');

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
  .with(rest());

async function setupManualDescriptions() {
  try {
    console.log('📝 Nastavujem manuálny systém pre popisky...');
    
    // Získaj prvých 5 produktov
    const products = await directus.request(readItems('products', {
      fields: ['id', 'name', 'description_cs', 'description_sk', 'description_en', 'description_de'],
      limit: 5
    }));
    
    console.log(`📦 Našiel som ${products.length} produktov`);
    
    // Nastav placeholder texty
    for (const product of products) {
      try {
        await directus.request(updateItem('products', product.id, {
          description_cs: '[POTREBUJE POPIS - CS]',
          description_sk: '[POTREBUJE POPIS - SK]',
          description_en: '[POTREBUJE POPIS - EN]',
          description_de: '[POTREBUJE POPIS - DE]'
        }));
        console.log(`✅ Nastavené placeholder pre produkt: ${product.name}`);
      } catch (updateError) {
        console.error(`❌ Chyba pri update produktu ${product.name}:`, updateError.message);
      }
    }
    
    console.log('🎉 Systém je pripravený!');
    console.log('');
    console.log('📋 Ďalšie kroky:');
    console.log('1. Otvorte Directus admin panel');
    console.log('2. Prejdite na kolekciu "products"');
    console.log('3. Kliknite na produkt a upravte popisky');
    console.log('4. Pre každý jazyk napíšte jedinečný popis');
    console.log('');
    console.log('💡 Tip: Začnite s 1-2 produktmi a otestujte v aplikácii');
    
  } catch (error) {
    console.error('❌ Chyba:', error.message);
  }
}

setupManualDescriptions(); 