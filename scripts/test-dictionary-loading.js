#!/usr/bin/env node

/**
 * Test skript na kontrolu načítania prekladových slovníkov
 * Spustenie: node scripts/test-dictionary-loading.js
 */

const fs = require('fs');
const path = require('path');

function loadDictionary(locale) {
  try {
    const filePath = path.join(__dirname, '../public/locales', locale, 'common.json');
    console.log(`📁 Načítavam: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const dictionary = JSON.parse(fileContent);
    console.log(`✅ Úspešne načítaný slovník pre ${locale}`);
    return dictionary;
  } catch (error) {
    console.error(`❌ Chyba pri načítaní slovníka pre ${locale}:`, error.message);
    return {};
  }
}

function generateProductDescription(productName, category, locale, dictionary) {
  // Správna cesta k prekladovému kľúču
  const templateKey = `product.description.${category}`;
  console.log(`🔍 Hľadám kľúč: ${templateKey}`);
  
  // Získaj product.description objekt
  const productDescription = dictionary.product?.description;
  console.log(`📦 Product description objekt:`, productDescription ? 'Existuje' : 'Neexistuje');
  
  if (productDescription) {
    console.log(`📋 Dostupné kľúče:`, Object.keys(productDescription));
  }
  
  // Získaj template text
  const templateText = productDescription?.[category] || 
                      productDescription?.fallback || 
                      `Kvalitní {product_name} s originálním designem.`;
  
  console.log(`📝 Template text: ${templateText}`);
  
  const result = templateText.replace('{product_name}', productName);
  console.log(`🎯 Výsledok: ${result}`);
  
  return result;
}

console.log('🧪 Testovanie načítania prekladových slovníkov\n');

const locales = ['cs', 'sk', 'en', 'de'];
const dictionaries = {};

// Načítaj všetky slovníky
locales.forEach(locale => {
  dictionaries[locale] = loadDictionary(locale);
  console.log('');
});

// Test generovania popisov
console.log('🎯 Testovanie generovania popisov\n');

const testProduct = {
  name: 'Men\'s T-Shirt Jungle',
  category: 'men'
};

locales.forEach(locale => {
  console.log(`--- ${locale.toUpperCase()} ---`);
  const description = generateProductDescription(
    testProduct.name, 
    testProduct.category, 
    locale, 
    dictionaries[locale]
  );
  console.log(`Popis: ${description}`);
  console.log('');
}); 