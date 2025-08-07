#!/usr/bin/env node

/**
 * Skript na resetovanie prekladových polí v Directus
 * Spustenie: node scripts/reset-translation-fields.js
 */

require('dotenv').config();

const { createDirectus, rest, readItems, updateItem } = require('@directus/sdk');

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL).with(rest());

async function resetTranslationFields() {
  try {
    console.log('🔄 Resetujem prekladové polia v Directus...\n');
    
    // Načítaj všetky produkty
    const products = await directus.request(
      readItems('products', {
        fields: ['id', 'name', 'description', 'main_category']
      })
    );
    
    console.log(`📦 Našiel som ${products.length} produktov\n`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      try {
        // Vymaž prekladové polia
        await directus.request(
          updateItem('products', product.id, {
            description_cs: '',
            description_sk: '',
            description_en: '',
            description_de: ''
          })
        );
        
        console.log(`✅ Resetovaný produkt: ${product.name}`);
        updatedCount++;
        
        // Pridaj malé oneskorenie
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Chyba pri resetovaní produktu ${product.name}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Resetovanie dokončené!`);
    console.log(`✅ Resetovaných produktov: ${updatedCount}`);
    console.log(`\n📋 Ďalšie kroky:`);
    console.log(`1. Spustite: node scripts/run-generate-descriptions.js`);
    console.log(`2. Všetky produkty dostanú správne preklady`);
    
  } catch (error) {
    console.error('❌ Chyba pri resetovaní:', error.message);
  }
}

resetTranslationFields(); 