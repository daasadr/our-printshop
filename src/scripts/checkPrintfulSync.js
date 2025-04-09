// Skript pro kontrolu synchronizace s Printful
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
const fetch = require('node-fetch');

dotenv.config();

const prisma = new PrismaClient();
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

if (!PRINTFUL_API_KEY) {
  console.error('Chybí PRINTFUL_API_KEY v proměnných prostředí');
  process.exit(1);
}

async function checkPrintfulSync() {
  try {
    console.log('Kontroluji synchronizaci s Printful...');
    
    // 1. Získání produktů z Printful
    const printfulResponse = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`
      }
    });
    
    if (!printfulResponse.ok) {
      throw new Error(`Chyba Printful API: ${printfulResponse.status} ${printfulResponse.statusText}`);
    }
    
    const printfulData = await printfulResponse.json();
    
    if (!printfulData || !printfulData.result) {
      throw new Error('Neplatná odpověď z Printful API');
    }
    
    const printfulProducts = printfulData.result;
    console.log(`Nalezeno ${printfulProducts.length} produktů na Printful`);
    
    // 2. Získání produktů z naší databáze
    const dbProducts = await prisma.product.findMany({
      include: {
        variants: true,
        designs: true
      }
    });
    
    console.log(`Nalezeno ${dbProducts.length} produktů v databázi`);
    
    // 3. Kontrola, zda všechny produkty z Printful jsou v databázi
    const printfulIds = printfulProducts.map(p => p.id.toString());
    const dbPrintfulIds = dbProducts.map(p => p.printfulId);
    
    const missingProducts = printfulIds.filter(id => !dbPrintfulIds.includes(id));
    
    if (missingProducts.length > 0) {
      console.log(`Chybí ${missingProducts.length} produktů v databázi:`);
      for (const id of missingProducts) {
        const product = printfulProducts.find(p => p.id.toString() === id);
        console.log(`- ${product ? product.sync_product.name : id}`);
      }
    } else {
      console.log('Všechny produkty z Printful jsou v databázi');
    }
    
    // 4. Kontrola, zda všechny produkty v databázi mají varianty a designy
    const productsWithoutVariants = dbProducts.filter(p => !p.variants || p.variants.length === 0);
    const productsWithoutDesigns = dbProducts.filter(p => !p.designs || p.designs.length === 0);
    
    if (productsWithoutVariants.length > 0) {
      console.log(`Nalezeno ${productsWithoutVariants.length} produktů bez variant:`);
      for (const product of productsWithoutVariants) {
        console.log(`- ${product.title} (ID: ${product.id}, Printful ID: ${product.printfulId})`);
      }
    }
    
    if (productsWithoutDesigns.length > 0) {
      console.log(`Nalezeno ${productsWithoutDesigns.length} produktů bez designů:`);
      for (const product of productsWithoutDesigns) {
        console.log(`- ${product.title} (ID: ${product.id}, Printful ID: ${product.printfulId})`);
      }
    }
    
    // 5. Kontrola kategorií
    const categories = {};
    dbProducts.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = 0;
      }
      categories[product.category]++;
    });
    
    console.log('Rozdělení produktů podle kategorií:');
    for (const [category, count] of Object.entries(categories)) {
      console.log(`- ${category}: ${count} produktů`);
    }
    
    console.log('Kontrola synchronizace byla dokončena!');
  } catch (error) {
    console.error('Chyba při kontrole synchronizace:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Spustíme kontrolu
checkPrintfulSync(); 