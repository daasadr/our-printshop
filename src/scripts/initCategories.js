const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Definice základních kategorií
const categories = [
  {
    name: 'women',
    description: 'Dámské oblečení'
  },
  {
    name: 'men',
    description: 'Pánské oblečení'
  },
  {
    name: 'kids',
    description: 'Dětské oblečení'
  },
  {
    name: 'home-decor',
    description: 'Domov a dekorace'
  },
  {
    name: 'other',
    description: 'Ostatní'
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

    // Oprava starých produktů: přiřadit správné categoryId podle názvu kategorie
    const dbCategories = await prisma.category.findMany();
    const allProducts = await prisma.product.findMany();
    for (const product of allProducts) {
      if (!product.categoryId && product.category) {
        const cat = dbCategories.find(c => c.name === product.category);
        if (cat) {
          await prisma.product.update({
            where: { id: product.id },
            data: { categoryId: cat.id }
          });
          console.log(`Přiřazeno categoryId pro produkt ${product.name}`);
        }
      }
    }

    console.log('Inicializace kategorií dokončena!');
  } catch (error) {
    console.error('Chyba při inicializaci kategorií:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initCategories(); 