const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function assignCategoriesToProducts() {
  try {
    console.log('Přiřazuji kategorie produktům...');
    const dbCategories = await prisma.category.findMany();
    const allProducts = await prisma.product.findMany();
    let count = 0;
    for (const product of allProducts) {
      if (!product.categoryId && product.category) {
        const cat = dbCategories.find(c => c.name === product.category);
        if (cat) {
          await prisma.product.update({
            where: { id: product.id },
            data: { categoryId: cat.id }
          });
          console.log(`Přiřazeno categoryId pro produkt ${product.name}`);
          count++;
        }
      }
    }
    console.log(`Hotovo! Aktualizováno ${count} produktů.`);
  } catch (error) {
    console.error('Chyba při přiřazování kategorií:', error);
  } finally {
    await prisma.$disconnect();
  }
}

assignCategoriesToProducts(); 