import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';

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

    await prisma.$transaction(async (tx) => {
      // Vytvoření kategorií
      for (const categoryData of categories) {
        const existingCategory = await tx.$queryRaw`
          SELECT * FROM "Category" WHERE name = ${categoryData.name}
        `;

        if (!existingCategory || (Array.isArray(existingCategory) && existingCategory.length === 0)) {
          await tx.$executeRaw`
            INSERT INTO "Category" (id, name, "displayName", "printfulCategory", "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), ${categoryData.name}, ${categoryData.displayName}, ${categoryData.printfulCategory}, NOW(), NOW())
          `;
          console.log(`Vytvořena kategorie: ${categoryData.displayName}`);
        } else {
          console.log(`Kategorie již existuje: ${categoryData.displayName}`);
        }
      }

      // Získání všech kategorií pro mapování
      const dbCategories = await tx.$queryRaw<DbCategory[]>`
        SELECT id, name FROM "Category"
      `;
      
      // Vytvoření mapy ID kategorií
      const categoryIds: Record<string, string> = {};
      for (const cat of dbCategories) {
        categoryIds[cat.name] = cat.id;
      }

      // Nejprve přesuneme šaty do dámské kategorie
      if (categoryIds['women']) {
        await tx.$executeRaw`
          UPDATE "Product"
          SET category = 'women', "categoryId" = ${categoryIds['women']}
          WHERE LOWER(title) LIKE '%dress%' OR LOWER(title) LIKE '%skirt%'
        `;
        console.log('Šaty a sukně byly přesunuty do kategorie "Dámské oblečení"');
      }

      // Aktualizace zbývajících produktů podle jejich původní kategorie
      const categoryMappings = [
        { pattern: 'women%', category: 'women' },
        { pattern: 'men%', category: 'men' },
        { pattern: 'kid%', category: 'kids' },
        { pattern: 'home%', category: 'home-decor' }
      ];

      for (const mapping of categoryMappings) {
        if (categoryIds[mapping.category]) {
          await tx.$executeRaw`
            UPDATE "Product"
            SET category = ${mapping.category}, "categoryId" = ${categoryIds[mapping.category]}
            WHERE LOWER(category) LIKE ${mapping.pattern}
            AND "categoryId" IS NULL
          `;
          console.log(`Produkty z kategorie obsahující "${mapping.pattern}" byly přesunuty do "${mapping.category}"`);
        }
      }

      // Zbývající produkty bez kategorie přesuneme do 'other'
      if (categoryIds['other']) {
        await tx.$executeRaw`
          UPDATE "Product"
          SET category = 'other', "categoryId" = ${categoryIds['other']}
          WHERE "categoryId" IS NULL
        `;
        console.log('Zbývající produkty byly přesunuty do kategorie "Ostatní"');
      }
    });

    console.log('Inicializace kategorií dokončena!');
  } catch (error) {
    console.error('Chyba při inicializaci kategorií:', error);
  } finally {
    await prisma.$disconnect();
  }
}

interface DbCategory {
  id: string;
  name: string;
}

initCategories(); 