const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function test() {
  try {
    console.log('Zkouším připojit k databázi...');
    const cats = await prisma.category.findMany();
    console.log('Kategorie:', cats);
  } catch (error) {
    console.error('Chyba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test(); 