#!/usr/bin/env node

/**
 * Test skript pre šablóny popisov produktov
 * Spustenie: node scripts/test-description-templates.js
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

const PRODUCT_TYPE_TEMPLATES = {
  't-shirt': {
    category: 'clothing',
    templates: {
      cs: `Stylové tričko {product_name} z 100% bavlny. Měkký materiál a pohodlný střih zajišťují maximální pohodlí.`,
      sk: `Štýlové tričko {product_name} zo 100% bavlny. Mäkký materiál a pohodlný strih zabezpečujú maximálny komfort.`,
      en: `Stylish {product_name} t-shirt made from 100% cotton. Soft material and comfortable fit ensure maximum comfort.`,
      de: `Stylvolle {product_name} T-Shirt aus 100% Baumwolle. Weiches Material und bequemer Schnitt garantieren maximalen Komfort.`
    }
  },
  'hoodie': {
    category: 'clothing',
    templates: {
      cs: `Teplá a pohodlná mikina {product_name}. Ideální pro chladnější dny a relaxaci.`,
      sk: `Teplá a pohodlná mikina {product_name}. Ideálna pre chladnejšie dni a relaxáciu.`,
      en: `Warm and comfortable {product_name} hoodie. Perfect for cooler days and relaxation.`,
      de: `Warme und bequeme {product_name} Kapuze. Perfekt für kühlere Tage und Entspannung.`
    }
  },
  'poster': {
    category: 'home-decor',
    templates: {
      cs: `Krásný plakát {product_name} pro váš domov. Vytištěno na kvalitním papíru s živými barvami.`,
      sk: `Krásny plagát {product_name} pre váš domov. Vytlačené na kvalitnom papieri so živými farbami.`,
      en: `Beautiful {product_name} poster for your home. Printed on quality paper with vibrant colors.`,
      de: `Schönes {product_name} Poster für Ihr Zuhause. Gedruckt auf hochwertigem Papier mit lebendigen Farben.`
    }
  }
};

function generateProductDescription(productName, category, locale = 'cs') {
  const template = PRODUCT_DESCRIPTION_TEMPLATES.find(t => t.category === category);
  
  if (!template) {
    return `Kvalitní ${productName} s originálním designem. Vyrobeno s péčí a láskou k detailu.`;
  }
  
  const templateText = template.templates[locale] || template.templates.cs;
  return templateText.replace('{product_name}', productName);
}

function generateDescriptionByProductType(productName, productType, locale = 'cs') {
  const template = PRODUCT_TYPE_TEMPLATES[productType.toLowerCase()];
  
  if (!template) {
    return generateProductDescription(productName, 'unisex', locale);
  }
  
  const templateText = template.templates[locale] || template.templates.cs;
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

console.log('🧪 Testovanie šablón popisov produktov\n');

testProducts.forEach(product => {
  console.log(`📦 Produkt: ${product.name}`);
  console.log(`🏷️  Kategória: ${product.category}`);
  console.log(`🔧 Typ: ${product.type}`);
  
  // Test kategóriálneho popisu
  const categoryDescription = generateProductDescription(product.name, product.category, 'cs');
  console.log(`📝 Kategóriálny popis (CS): ${categoryDescription}`);
  
  // Test typového popisu
  const typeDescription = generateDescriptionByProductType(product.name, product.type, 'cs');
  console.log(`📝 Typový popis (CS): ${typeDescription}`);
  
  // Test všetkých jazykov
  console.log('🌍 Všetky jazyky:');
  ['cs', 'sk', 'en', 'de'].forEach(locale => {
    const desc = generateDescriptionByProductType(product.name, product.type, locale);
    console.log(`  ${locale.toUpperCase()}: ${desc.substring(0, 80)}...`);
  });
  
  console.log('\n' + '─'.repeat(80) + '\n');
});

console.log('✅ Testovanie dokončené!');
console.log('\n📋 Ako používať:');
console.log('1. Pre existujúce produkty: node scripts/run-generate-descriptions.js');
console.log('2. Pre nové produkty: Popisy sa generujú automaticky pri synchronizácii');
console.log('3. Upravte šablóny v src/lib/productDescriptionTemplates.ts'); 