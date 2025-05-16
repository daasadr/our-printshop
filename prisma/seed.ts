const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Vytvoření kategorií
  const category1 = await prisma.category.create({
    data: {
      name: 'Trička',
      description: 'Originální trička s autorskými potisky',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Mikiny',
      description: 'Originální mikiny s autorskými potisky',
    },
  });

  // Vytvoření produktů
  const product1 = await prisma.product.create({
    data: {
      name: 'Tričko s potiskem',
      description: 'Originální tričko s autorským potiskem',
      printfulId: 'printful-1',
      isActive: true,
      categoryId: category1.id,
      variants: {
        create: [
          {
            name: 'S',
            price: 10.0,
            isActive: true,
            printfulVariantId: 'printful-variant-1',
            size: 'S',
            color: 'Černá',
          },
          {
            name: 'M',
            price: 10.0,
            isActive: true,
            printfulVariantId: 'printful-variant-2',
            size: 'M',
            color: 'Černá',
          },
        ],
      },
      designs: {
        create: [
          {
            name: 'Design 1',
            printfulFileId: 'printful-file-1',
            previewUrl: 'https://example.com/design1.jpg',
          },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Mikina s potiskem',
      description: 'Originální mikina s autorským potiskem',
      printfulId: 'printful-2',
      isActive: true,
      categoryId: category2.id,
      variants: {
        create: [
          {
            name: 'S',
            price: 20.0,
            isActive: true,
            printfulVariantId: 'printful-variant-3',
            size: 'S',
            color: 'Šedá',
          },
          {
            name: 'M',
            price: 20.0,
            isActive: true,
            printfulVariantId: 'printful-variant-4',
            size: 'M',
            color: 'Šedá',
          },
        ],
      },
      designs: {
        create: [
          {
            name: 'Design 2',
            printfulFileId: 'printful-file-2',
            previewUrl: 'https://example.com/design2.jpg',
          },
        ],
      },
    },
  });

  console.log('Seed dokončen:', { product1, product2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 