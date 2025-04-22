// Skript pro spuštění synchronizace s Printful
const { execSync } = require('child_process');
const path = require('path');

console.log('Spouštím synchronizaci s Printful...');

try {
  // Spustíme synchronizační skript
  console.log('1. Spouštím synchronizační skript...');
  execSync('npx ts-node src/scripts/syncPrintfulProducts.ts', { stdio: 'inherit' });
  
  // Počkáme chvíli, aby se databáze aktualizovala
  console.log('2. Čekám na dokončení synchronizace...');
  setTimeout(() => {
    try {
      // Spustíme kontrolní skript
      console.log('3. Spouštím kontrolní skript...');
      execSync('node src/scripts/checkPrintfulSync.js', { stdio: 'inherit' });
      
      console.log('Synchronizace byla úspěšně dokončena!');
    } catch (error) {
      console.error('Chyba při spouštění kontrolního skriptu:', error);
    }
  }, 2000);
} catch (error) {
  console.error('Chyba při spouštění synchronizačního skriptu:', error);
} 