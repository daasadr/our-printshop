#!/usr/bin/env node

/**
 * Skript na generovanie popisov pre existujúce produkty
 * Spustenie: node scripts/run-generate-descriptions.js
 */

const { execSync } = require('child_process');
const path = require('path');

// Načítaj .env súbor
require('dotenv').config();

console.log('🚀 Spúšťam generovanie popisov pre existujúce produkty...\n');

try {
  // Spusti TypeScript skript pomocou ts-node
  const scriptPath = path.join(__dirname, 'generateProductDescriptions.ts');
  
  console.log('📝 Generujem popisy pomocou šablón...');
  execSync(`npx ts-node ${scriptPath}`, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ Generovanie popisov dokončené!');
  console.log('\n📋 Ďalšie kroky:');
  console.log('1. Skontrolujte produkty v Directus admin paneli');
  console.log('2. Upravte popisy podľa potreby');
  console.log('3. Nové produkty budú automaticky generovať popisy pri synchronizácii');
  
} catch (error) {
  console.error('❌ Chyba pri generovaní popisov:', error.message);
  process.exit(1);
} 