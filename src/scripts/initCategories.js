const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Definice základních kategorií
const categories = [
  {
    name: 'women',
    displayName: 'Dámské oblečení',
    printfulCategory: 'women'
  },
  {
    name: 'men',
    displayName: 'Pánské oblečení',
    printfulCategory: 'men'
  },
  {
    name: 'kids',
    displayName: 'Dětské oblečení',
    printfulCategory: 'kids'
  },
  {
    name: 'home-decor',
    displayName: 'Domov a dekorace',
    printfulCategory: 'home-decor'
  },
  {
    name: 'other',
    displayName: 'Ostatní',
    printfulCategory: 'other'
  }
];

async function initCategories() {
  try {
    console.log('Inicializuji kategorie...');

    for (const category of categories) {
      const existingCategory = await prisma.category.findUnique({
        where: { name: category.name }
      });

      if (!existingCategory) {
        await prisma.category.create({
          data: category
        });
        console.log(`Vytvořena kategorie: ${category.displayName}`);
      } else {
        console.log(`Kategorie již existuje: ${category.displayName}`);
      }
    }

    // Aktualizace existujících produktů
    const products = await prisma.product.findMany();
    const defaultCategory = await prisma.category.findUnique({
      where: { name: 'other' }
    });

    if (defaultCategory) {
      for (const product of products) {
        await prisma.product.update({
          where: { id: product.id },
          data: { categoryId: defaultCategory.id }
        });
      }
      console.log('Produkty byly aktualizovány s výchozí kategorií');
    }

    console.log('Inicializace kategorií dokončena!');
  } catch (error) {
    console.error('Chyba při inicializaci kategorií:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initCategories(); 