#!/usr/bin/env node

/**
 * Test skript na kontrolu prekladových polí v Directus
 * Spustenie: node scripts/test-directus-translations.js
 */

require('dotenv').config();

const { createDirectus, rest, readItems } = require('@directus/sdk');

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL).with(rest());

async function testDirectusTranslations() {
  try {
    console.log('🔍 Testujem prekladové polia v Directus...\n');
    
    // Načítaj prvých 5 produktov
    const products = await directus.request(
      readItems('products', {
        limit: 5,
        fields: [
          'id',
          'name', 
          'description',
          'description_cs',
          'description_sk', 
          'description_en',
          'description_de'
        ]
      })
    );
    
    console.log(`📦 Našiel som ${products.length} produktov\n`);
    
    products.forEach((product, index) => {
      console.log(`--- Produkt ${index + 1} ---`);
      console.log(`ID: ${product.id}`);
      console.log(`Názov: ${product.name}`);
      console.log(`Hlavný popis: ${product.description || 'N/A'}`);
      console.log(`CS: ${product.description_cs || 'N/A'}`);
      console.log(`SK: ${product.description_sk || 'N/A'}`);
      console.log(`EN: ${product.description_en || 'N/A'}`);
      console.log(`DE: ${product.description_de || 'N/A'}`);
      console.log('');
    });
    
    // Test prekladovej funkcie
    console.log('🧪 Testujem prekladovú funkciu...\n');
    
    if (products.length > 0) {
      const product = products[0];
      
      // Simuluj prekladovú funkciu
      function translateProduct(product, locale) {
        const translatedProduct = { ...product };
        
        // Preklad popisu
        const descriptionKey = `description_${locale}`;
        if (product[descriptionKey] && product[descriptionKey].trim()) {
          translatedProduct.description = product[descriptionKey];
        }
        
        return translatedProduct;
      }
      
      const locales = ['cs', 'sk', 'en', 'de'];
      
      locales.forEach(locale => {
        const translated = translateProduct(product, locale);
        console.log(`${locale.toUpperCase()}: ${translated.description || 'N/A'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Chyba:', error.message);
  }
}

testDirectusTranslations(); 