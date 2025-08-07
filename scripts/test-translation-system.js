#!/usr/bin/env node

/**
 * Test skript pre systém prekladov cez public/locales
 * Spustenie: node scripts/test-translation-system.js
 */

require('dotenv').config();

// Simulované prekladové slovníky (rovnaké ako v public/locales)
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
  },
  sk: {
    "product.description.men": "Štýlové {product_name} pre moderných mužov. Vyrobené z kvalitných materiálov pre maximálny komfort a trvanlivosť. Ideálne pre každodenné nosenie aj špeciálne príležitosti.",
    "product.description.women": "Elegantné {product_name} pre ženy, ktoré chcú vyjadriť svoj jedinečný štýl. Kvalitné materiály a starostlivé spracovanie zabezpečujú komfort a krásu.",
    "product.description.kids": "Veselé a pohodlné {product_name} pre deti. Bezpečné materiály a zábavné dizajny, ktoré deti milujú. Ideálne pre aktívne deti.",
    "product.description.unisex": "Univerzálne {product_name} pre všetkých. Moderný dizajn a kvalitné materiály zabezpečujú komfort pre každého.",
    "product.description.home-decor": "Krásne {product_name} pre váš domov. Pridajte osobný štýl do vášho interiéru s našimi originálnymi dizajnmi.",
    "product.description.t-shirt": "Štýlové tričko {product_name} zo 100% bavlny. Mäkký materiál a pohodlný strih zabezpečujú maximálny komfort.",
    "product.description.hoodie": "Teplá a pohodlná mikina {product_name}. Ideálna pre chladnejšie dni a relaxáciu.",
    "product.description.poster": "Krásny plagát {product_name} pre váš domov. Vytlačené na kvalitnom papieri so živými farbami.",
    "product.description.fallback": "Kvalitné {product_name} s originálnym dizajnom. Vyrobené s starostlivosťou a láskou k detailu."
  },
  en: {
    "product.description.men": "Stylish {product_name} for modern men. Made from quality materials for maximum comfort and durability. Perfect for everyday wear and special occasions.",
    "product.description.women": "Elegant {product_name} for women who want to express their unique style. Quality materials and careful craftsmanship ensure comfort and beauty.",
    "product.description.kids": "Fun and comfortable {product_name} for kids. Safe materials and playful designs that children love. Perfect for active kids.",
    "product.description.unisex": "Universal {product_name} for everyone. Modern design and quality materials ensure comfort for all.",
    "product.description.home-decor": "Beautiful {product_name} for your home. Add personal style to your interior with our original designs.",
    "product.description.t-shirt": "Stylish {product_name} t-shirt made from 100% cotton. Soft material and comfortable fit ensure maximum comfort.",
    "product.description.hoodie": "Warm and comfortable {product_name} hoodie. Perfect for cooler days and relaxation.",
    "product.description.poster": "Beautiful {product_name} poster for your home. Printed on quality paper with vibrant colors.",
    "product.description.fallback": "Quality {product_name} with original design. Made with care and love for detail."
  },
  de: {
    "product.description.men": "Stylvolle {product_name} für moderne Männer. Hergestellt aus hochwertigen Materialien für maximalen Komfort und Langlebigkeit. Perfekt für den Alltag und besondere Anlässe.",
    "product.description.women": "Elegante {product_name} für Frauen, die ihren einzigartigen Stil ausdrücken möchten. Hochwertige Materialien und sorgfältige Verarbeitung garantieren Komfort und Schönheit.",
    "product.description.kids": "Lustige und bequeme {product_name} für Kinder. Sichere Materialien und verspielte Designs, die Kinder lieben. Perfekt für aktive Kinder.",
    "product.description.unisex": "Universelle {product_name} für alle. Modernes Design und hochwertige Materialien garantieren Komfort für jeden.",
    "product.description.home-decor": "Schöne {product_name} für Ihr Zuhause. Fügen Sie Ihrem Interieur persönlichen Stil mit unseren originellen Designs hinzu.",
    "product.description.t-shirt": "Stylvolle {product_name} T-Shirt aus 100% Baumwolle. Weiches Material und bequemer Schnitt garantieren maximalen Komfort.",
    "product.description.hoodie": "Warme und bequeme {product_name} Kapuze. Perfekt für kühlere Tage und Entspannung.",
    "product.description.poster": "Schönes {product_name} Poster für Ihr Zuhause. Gedruckt auf hochwertigem Papier mit lebendigen Farben.",
    "product.description.fallback": "Hochwertige {product_name} mit originellem Design. Hergestellt mit Sorgfalt und Liebe zum Detail."
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

// Test produkty
const testProducts = [
  { name: 'Men\'s T-Shirt Jungle', category: 'men', type: 't-shirt' },
  { name: 'Women\'s Hoodie Tropical', category: 'women', type: 'hoodie' },
  { name: 'Kids T-Shirt Adventure', category: 'kids', type: 't-shirt' },
  { name: 'Tropical Jungle Poster', category: 'home-decor', type: 'poster' },
  { name: 'Unisex T-Shirt Design', category: 'unisex', type: 't-shirt' }
];

console.log('🌍 Testovanie systému prekladov cez public/locales\n');

testProducts.forEach(product => {
  console.log(`📦 Produkt: ${product.name}`);
  console.log(`🏷️  Kategória: ${product.category}`);
  console.log(`🔧 Typ: ${product.type}`);
  console.log('');
  
  // Test všetkých jazykov
  const languages = [
    { code: 'cs', name: 'Čeština' },
    { code: 'sk', name: 'Slovenčina' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' }
  ];
  
  languages.forEach(lang => {
    const dictionary = dictionaries[lang.code];
    const description = generateDescriptionByProductType(product.name, product.type, lang.code, dictionary);
    console.log(`${lang.name} (${lang.code.toUpperCase()}):`);
    console.log(`  ${description}`);
    console.log('');
  });
  
  console.log('─'.repeat(80));
  console.log('');
});

console.log('✅ Testovanie systému prekladov dokončené!');
console.log('');
console.log('🎯 Výhody tohto riešenia:');
console.log('✅ Používa existujúci prekladový systém');
console.log('✅ Žiadne nové polia v Directus');
console.log('✅ Konzistentné s celou aplikáciou');
console.log('✅ Jednoduchá údržba prekladov');
console.log('');
console.log('📋 Ďalšie kroky:');
console.log('1. Spustite: node scripts/run-generate-descriptions.js');
console.log('2. Všetky produkty budú mať popisy v češtine');
console.log('3. Preklady sa zobrazia automaticky podľa jazyka používateľa'); 