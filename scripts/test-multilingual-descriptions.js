#!/usr/bin/env node

/**
 * Test skript pre multijazyčné popisy produktov
 * Spustenie: node scripts/test-multilingual-descriptions.js
 */

// Simulované šablóny (rovnaké ako v TypeScript súbore)
const PRODUCT_DESCRIPTION_TEMPLATES = [
  {
    category: 'men',
    templates: {
      cs: `Stylové {product_name} pro moderní muže. Vyrobeno z kvalitních materiálů pro maximální pohodlí a trvanlivost. Ideální pro každodenní nošení i speciální příležitosti.`,
      sk: `Štýlové {product_name} pre moderných mužov. Vyrobené z kvalitných materiálov pre maximálny komfort a trvanlivosť. Ideálne pre každodenné nosenie aj špeciálne príležitosti.`,
      en: `Stylish {product_name} for modern men. Made from quality materials for maximum comfort and durability. Perfect for everyday wear and special occasions.`,
      de: `Stylvolle {product_name} für moderne Männer. Hergestellt aus hochwertigen Materialien für maximalen Komfort und Langlebigkeit. Perfekt für den Alltag und besondere Anlässe.`
    }
  },
  {
    category: 'women',
    templates: {
      cs: `Elegantní {product_name} pro ženy, které chtějí vyjádřit svůj jedinečný styl. Kvalitní materiály a pečlivé zpracování zajišťují pohodlí a krásu.`,
      sk: `Elegantné {product_name} pre ženy, ktoré chcú vyjadriť svoj jedinečný štýl. Kvalitné materiály a starostlivé spracovanie zabezpečujú komfort a krásu.`,
      en: `Elegant {product_name} for women who want to express their unique style. Quality materials and careful craftsmanship ensure comfort and beauty.`,
      de: `Elegante {product_name} für Frauen, die ihren einzigartigen Stil ausdrücken möchten. Hochwertige Materialien und sorgfältige Verarbeitung garantieren Komfort und Schönheit.`
    }
  },
  {
    category: 'kids',
    templates: {
      cs: `Veselé a pohodlné {product_name} pro děti. Bezpečné materiály a zábavné designy, které děti milují. Ideální pro aktivní děti.`,
      sk: `Veselé a pohodlné {product_name} pre deti. Bezpečné materiály a zábavné dizajny, ktoré deti milujú. Ideálne pre aktívne deti.`,
      en: `Fun and comfortable {product_name} for kids. Safe materials and playful designs that children love. Perfect for active kids.`,
      de: `Lustige und bequeme {product_name} für Kinder. Sichere Materialien und verspielte Designs, die Kinder lieben. Perfekt für aktive Kinder.`
    }
  },
  {
    category: 'unisex',
    templates: {
      cs: `Univerzální {product_name} pro všechny. Moderní design a kvalitní materiály zajišťují pohodlí pro každého.`,
      sk: `Univerzálne {product_name} pre všetkých. Moderný dizajn a kvalitné materiály zabezpečujú komfort pre každého.`,
      en: `Universal {product_name} for everyone. Modern design and quality materials ensure comfort for all.`,
      de: `Universelle {product_name} für alle. Modernes Design und hochwertige Materialien garantieren Komfort für jeden.`
    }
  },
  {
    category: 'home-decor',
    templates: {
      cs: `Krásné {product_name} pro váš domov. Přidejte osobní styl do vašeho interiéru s našimi originálními designy.`,
      sk: `Krásne {product_name} pre váš domov. Pridajte osobný štýl do vášho interiéru s našimi originálnymi dizajnmi.`,
      en: `Beautiful {product_name} for your home. Add personal style to your interior with our original designs.`,
      de: `Schöne {product_name} für Ihr Zuhause. Fügen Sie Ihrem Interieur persönlichen Stil mit unseren originellen Designs hinzu.`
    }
  }
];

function generateProductDescription(productName, category, locale = 'cs') {
  const template = PRODUCT_DESCRIPTION_TEMPLATES.find(t => t.category === category);
  
  if (!template) {
    return `Kvalitní ${productName} s originálním designem. Vyrobeno s péčí a láskou k detailu.`;
  }
  
  const templateText = template.templates[locale] || template.templates.cs;
  return templateText.replace('{product_name}', productName);
}

// Test produkty
const testProducts = [
  { name: 'Men\'s T-Shirt Jungle', category: 'men' },
  { name: 'Women\'s Hoodie Tropical', category: 'women' },
  { name: 'Kids T-Shirt Adventure', category: 'kids' },
  { name: 'Tropical Jungle Poster', category: 'home-decor' },
  { name: 'Unisex T-Shirt Design', category: 'unisex' }
];

console.log('🌍 Testovanie multijazyčných popisov produktov\n');

testProducts.forEach(product => {
  console.log(`📦 Produkt: ${product.name}`);
  console.log(`🏷️  Kategória: ${product.category}`);
  console.log('');
  
  // Test všetkých jazykov
  const languages = [
    { code: 'cs', name: 'Čeština' },
    { code: 'sk', name: 'Slovenčina' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' }
  ];
  
  languages.forEach(lang => {
    const description = generateProductDescription(product.name, product.category, lang.code);
    console.log(`${lang.name} (${lang.code.toUpperCase()}):`);
    console.log(`  ${description}`);
    console.log('');
  });
  
  console.log('─'.repeat(80));
  console.log('');
});

console.log('✅ Testovanie multijazyčných popisov dokončené!');
console.log('');
console.log('📋 Ďalšie kroky:');
console.log('1. Spustite: node scripts/add-translation-fields.js');
console.log('2. Pridajte polia do Directus podľa návodu');
console.log('3. Spustite: node scripts/run-generate-descriptions.js');
console.log('4. Všetky produkty budú mať popisy vo všetkých jazykoch!'); 