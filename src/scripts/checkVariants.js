const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkVariants() {
  try {
    // Najděte produkt podle názvu
    const product = await prisma.product.findFirst({
      where: {
        title: {
          contains: 'Ancient Heroine'
        }
      },
      include: {
        variants: true,
        designs: true
      }
    });

    if (!product) {
      console.log('Produkt nenalezen!');
      return;
    }

    console.log(`Produkt: ${product.title}`);
    console.log(`Počet variant: ${product.variants.length}`);
    
    // Vypsat všechny varianty
    if (product.variants.length > 0) {
      console.log('Varianty:');
      product.variants.forEach((variant, index) => {
        console.log(`[${index + 1}] ${variant.name}: ${variant.price} Kč (ID: ${variant.id})`);
      });
    } else {
      console.log('Produkt nemá žádné varianty!');
    }
    
    // Zkontrolujte design
    if (product.designs.length > 0) {
      console.log(`\nDesign: ${product.designs[0].name}`);
      console.log(`URL: ${product.designs[0].previewUrl}`);
    } else {
      console.log('\nProdukt nemá žádný design!');
    }
  } catch (error) {
    console.error('Chyba při kontrole variant:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVariants();