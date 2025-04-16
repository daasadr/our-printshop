import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Product, ProductVariant, Design } from '@prisma/client';
import { convertEurToCzk } from '@/utils/currency';

const prisma = new PrismaClient();

type ProductWithRelations = Product & {
  variants: (ProductVariant & { price: number })[];
  designs: Design[];
};

type FormattedProduct = {
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  price: number;
  variants: (ProductVariant & { price: number })[];
  designs: Design[];
};

export async function GET() {
  // Dočasně vracíme prázdné pole, dokud nebude implementována funkce nejnovějších produktů
  return NextResponse.json([]);

  // Původní implementace:
  /*
  const prisma = new PrismaClient();
  
  try {
    const products = await prisma.product.findMany({
      where: {
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
      orderBy: {
        createdAt: 'desc',
      },
      take: 4,
    });

    const formattedProducts = await Promise.all(products.map(async product => {
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
    console.error('Error fetching latest products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
  */
}