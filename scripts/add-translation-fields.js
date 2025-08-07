#!/usr/bin/env node

/**
 * Skript na pridanie prekladových polí do Directus
 * Spustenie: node scripts/add-translation-fields.js
 */

require('dotenv').config();

console.log('🔧 Skript na pridanie prekladových polí do Directus');
console.log('==================================================\n');

console.log('📋 Manuálne kroky na pridanie polí do Directus:');
console.log('');
console.log('1. Otvorte Directus admin panel');
console.log('2. Prejdite na Settings → Data Model');
console.log('3. Vyberte kolekciu "products"');
console.log('4. Kliknite "Create Field"');
console.log('');
console.log('📝 Pridajte tieto polia:');
console.log('');
console.log('Pole 1:');
console.log('  - Field Key: description_cs');
console.log('  - Field Type: Text');
console.log('  - Interface: Input');
console.log('  - Label: Český popis');
console.log('');
console.log('Pole 2:');
console.log('  - Field Key: description_sk');
console.log('  - Field Type: Text');
console.log('  - Interface: Input');
console.log('  - Label: Slovenský popis');
console.log('');
console.log('Pole 3:');
console.log('  - Field Key: description_en');
console.log('  - Field Type: Text');
console.log('  - Interface: Input');
console.log('  - Label: Anglický popis');
console.log('');
console.log('Pole 4:');
console.log('  - Field Key: description_de');
console.log('  - Field Type: Text');
console.log('  - Interface: Input');
console.log('  - Label: Nemecký popis');
console.log('');
console.log('✅ Po pridaní polí spustite:');
console.log('   node scripts/run-generate-descriptions.js');
console.log('');
console.log('🌍 Tým sa vygenerujú popisy vo všetkých jazykoch!');
console.log('');
console.log('🎯 Výsledok:');
console.log('- Produkty budú mať popisy vo všetkých jazykoch');
console.log('- Aplikácia automaticky zobrazí správny jazyk podľa výberu používateľa');
console.log('- Anglické produkty z Printful zostanú v angličtine');
console.log('- Ostatné jazyky sa vygenerujú automaticky'); 