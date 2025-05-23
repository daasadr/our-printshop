const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Připojení k databázi bylo úspěšné!');
  } catch (error) {
    console.error('Chyba při připojování k databázi:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 