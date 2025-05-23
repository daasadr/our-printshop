const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { name: 'women', description: 'Dámské oblečení' },
  { name: 'men', description: 'Pánské oblečení' },
  { name: 'kids', description: 'Dětské oblečení' },
  { name: 'home-decor', description: 'Domov a dekorace' },
  { name: 'other', description: 'Ostatní' }
];

async function createCategories() {
  try {
    console.log('Vytvářím/ověřuji kategorie...');
    for (const category of categories) {
      const existingCategory = await prisma.category.findUnique({
        where: { name: category.name }
      });
      if (!existingCategory) {
        await prisma.category.create({
          data: {
            name: category.name,
            description: category.description
          }
        });
        console.log(`Vytvořena kategorie: ${category.description}`);
      } else {
        console.log(`Kategorie již existuje: ${category.description}`);
      }
    }
    console.log('Hotovo!');
  } catch (error) {
    console.error('Chyba při vytváření kategorií:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCategories(); 