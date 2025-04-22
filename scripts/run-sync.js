const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  console.log('Spouštím synchronizaci produktů z Printful...');
  
  // Cesta k synchronizačnímu skriptu
  const scriptPath = path.resolve(__dirname, '../src/scripts/syncPrintfulProducts.ts');
  
  
  // Kontrola existence souboru
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Synchronizační skript neexistuje na cestě: ${scriptPath}`);
  }
  
  // Spustíme npx místo přímého volání ts-node
  // Toto zajistí, že npx najde ts-node i pokud není globálně nainstalovaný
  try {
    execSync(`npx ts-node-esm "${scriptPath}"`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_OPTIONS: '--experimental-specifier-resolution=node --no-warnings'
      }
    });
    console.log('Synchronizace dokončena úspěšně!');
  } catch (execError) {
    // Pokud selže, zkusíme alternativní způsob
    console.log('Zkouším alternativní způsob spuštění...');
    
    // Zkusíme najít lokální instalaci ts-node přímo
    const nodeModulesPath = path.resolve(__dirname, '../node_modules/.bin');
    const tsNodePath = path.join(nodeModulesPath, 'ts-node');
    
    if (fs.existsSync(tsNodePath)) {
      execSync(`"${tsNodePath}" --esm "${scriptPath}"`, {
        stdio: 'inherit',
        env: {
          ...process.env,
          NODE_OPTIONS: '--experimental-specifier-resolution=node --no-warnings'
        }
      });
      console.log('Synchronizace dokončena úspěšně!');
    } else {
      // Pokud vše selže, zkusíme commonjs verzi
      console.log('Používám CommonJS verzi skriptu...');
      
      // Cesta k CommonJS skriptu, který jsme vytvořili
      const commonJsScriptPath = path.resolve(__dirname, '../src/scripts/syncPrintfulProductsCommonJS.js');
      
      // Pokud CommonJS verze existuje, spustíme ji
      if (fs.existsSync(commonJsScriptPath)) {
        execSync(`node "${commonJsScriptPath}"`, {
          stdio: 'inherit'
        });
        console.log('Synchronizace dokončena úspěšně!');
      } else {
        throw new Error('Nelze najít ani CommonJS verzi skriptu. Prosím vytvořte soubor src/scripts/syncPrintfulProductsCommonJS.js');
      }
    }
  }
} catch (error) {
  console.error('\nChyba při spouštění synchronizace:');
  console.error(error.message);
  if (error.stderr) {
    console.error('\nVýstup chyby:');
    console.error(error.stderr.toString());
  }
  process.exit(1);
}