#!/usr/bin/env node

/**
 * Test skript pre generovanie popisov pre nové produkty
 * Spustenie: node scripts/test-new-product-generation.js
 */

// Simulované prekladové slovníky
const dictionaries = {
  cs: {
    "product.description.men": "Stylové {product_name} pro moderní muže. Vyrobeno z kvalitních materiálů pro maximální pohodlí a trvanlivost. Ideální pro každodenní nošení i speciální příležitosti.",
    "product.description.women": "Elegantní {product_name} pro ženy, které chtějí vyjádřit svůj jedinečný styl. Kvalitní materiály a pečlivé zpracování zajišťují pohodlí a krásu.",
    "product.description.kids": "Veselé a pohodlné {product_name} pro děti. Bezpečné materiály a zábavné designy, které děti milují. Ideální pro aktivní děti.",
    "product.description.unisex": "Univerzální {product_name} pro všechny. Moderní design a kvalitní materiály zajišťují pohodlí pro každého.",
    "product.description.home-decor": "Krásné {product_name} pro váš domov. Přidejte osobní styl do vašeho interiéru s našimi originálními designy.",
    "product.description.t-shirt": "Stylové tričko {product_name} z 100% bavlny. Měkký materiál a pohodlný střih zajišťují maximální pohodlí.",
    "product.description.hoodie": "Teplá a pohodlná mikina {product_name}. Ideální pro chladnější dny a relaxaci.",
    "product.description.poster": "Krásný plakát {product_name} pro váš domov. Vytištěno na kvalitním papíru s živými barvami.",
    "product.description.fallback": "Kvalitní {product_name} s originálním designem. Vyrobeno s péčí a láskou k detailu."
  }
};

function generateProductDescription(productName, category, locale = 'cs', dictionary) {
  const templateKey = `product.description.${category}`;
  const templateText = dictionary[templateKey] || dictionary['product.description.fallback'] || `Kvalitní {product_name} s originálním designem.`;
  return templateText.replace('{product_name}', productName);
}

function generateDescriptionByProductType(productName, productType, locale = 'cs', dictionary) {
  const templateKey = `product.description.${productType}`;
  const templateText = dictionary[templateKey] || dictionary['product.description.fallback'] || `Kvalitní {product_name} s originálním designem.`;
  return templateText.replace('{product_name}', productName);
}

async function generateDescriptionForNewProduct(productName, category = 'unisex', productType) {
  const dictionary = dictionaries.cs; // Pre test používame len češtinu
  
  if (productType) {
    return {
      description_cs: generateDescriptionByProductType(productName, productType, 'cs', dictionary),
      description: generateDescriptionByProductType(productName, productType, 'cs', dictionary)
    };
  }
  
  return {
    description_cs: generateProductDescription(productName, category, 'cs', dictionary),
    description: generateProductDescription(productName, category, 'cs', dictionary)
  };
}

// Test nových produktov
const testNewProducts = [
  { name: 'Test Men\'s T-Shirt', category: 'men', type: 't-shirt' },
  { name: 'Test Women\'s Hoodie', category: 'women', type: 'hoodie' },
  { name: 'Test Kids Poster', category: 'kids', type: 'poster' },
  { name: 'Test Unisex Product', category: 'unisex' }
];

console.log('🧪 Testovanie generovania popisov pre nové produkty\n');

for (const product of testNewProducts) {
  console.log(`📦 Nový produkt: ${product.name}`);
  console.log(`🏷️  Kategória: ${product.category}`);
  if (product.type) {
    console.log(`🔧 Typ: ${product.type}`);
  }
  
  const descriptions = await generateDescriptionForNewProduct(product.name, product.category, product.type);
  
  console.log(`📝 Vygenerovaný popis:`);
  console.log(`  ${descriptions.description}`);
  console.log('');
  console.log('─'.repeat(80));
  console.log('');
}

console.log('✅ Testovanie nových produktov dokončené!');
console.log('');
console.log('🎯 Ako to funguje v praxi:');
console.log('1. Pridáte nový produkt do Printful');
console.log('2. Spustite synchronizáciu');
console.log('3. Produkt sa automaticky vytvorí s vygenerovaným popisom');
console.log('4. Popis sa zobrazí v jazyku používateľa'); 