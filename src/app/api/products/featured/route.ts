import { NextResponse } from 'next/server';

// Dočasně deaktivovaná implementace featured products
// import { PrismaClient } from '@prisma/client';
// import { ProductWithRelations, FormattedProduct } from '@/types/prisma';
// import { convertEurToCzk } from '@/utils/currency';
// 
// const prisma = new PrismaClient();

export async function GET() {
  // Dočasně vracíme prázdné pole, dokud nebude implementována funkce featured products
  return NextResponse.json([]);
  
  // Původní implementace:
  /*
  try {
    const featuredProducts = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      include: {
        variants: {
          where: {
            isActive: true,
          },
          orderBy: {
            price: 'asc',
          },
        },
        designs: true,
      },
    }) as ProductWithRelations[];

    const formattedProducts: FormattedProduct[] = await Promise.all(featuredProducts.map(async product => {
      const convertedVariants = await Promise.all(product.variants.map(async variant => ({
        ...variant,
        price: await convertEurToCzk(variant.price)
      })));

      const originalPreviewUrl = product.designs[0]?.previewUrl || '';
      
      let processedPreviewUrl = '';
      if (originalPreviewUrl) {
        if (originalPreviewUrl.startsWith('http')) {
          processedPreviewUrl = originalPreviewUrl;
        } else {
          processedPreviewUrl = `https://${originalPreviewUrl}`;
        }
      }

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        previewUrl: processedPreviewUrl,
        price: product.variants[0]?.price ? await convertEurToCzk(product.variants[0].price) : 0,
        variants: convertedVariants,
        designs: product.designs,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        category: product.category,
        categoryId: product.categoryId,
        printfulId: product.printfulId,
        printfulSync: product.printfulSync
      };
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
  */
}