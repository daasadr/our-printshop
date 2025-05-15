export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaProduct, FormattedProduct, ProductInclude } from '@/types/prisma';
import { convertEurToCzk } from '@/utils/currency';
import prisma from '@/lib/prisma';

// Dočasně deaktivovaná implementace featured products
// import { PrismaClient } from '@prisma/client';
// import { ProductWithRelations, FormattedProduct } from '@/types/prisma';
// import { convertEurToCzk } from '@/utils/currency';
// 
// const prisma = new PrismaClient();

export async function GET() {
  try {
    const include: ProductInclude = {
      variants: {
        where: { isActive: true },
        orderBy: { price: 'asc' },
      },
      designs: true,
      category: true,
    };

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include,
      take: 4, // Omezíme na 4 produkty jako featured
    }) as unknown as PrismaProduct[];

    const formattedProducts: FormattedProduct[] = await Promise.all(products.map(async product => {
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
        name: product.name,
        description: product.description,
        previewUrl: processedPreviewUrl,
        price: product.variants[0]?.price ? await convertEurToCzk(product.variants[0].price) : 0,
        variants: convertedVariants,
        designs: product.designs.map(({ productId, ...design }) => design),
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        category: product.category?.name || '',
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
  }
  
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