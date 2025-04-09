import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ProductWithRelations, FormattedProduct } from '@/types/prisma';
import { convertEurToCzk } from '@/utils/currency';

const prisma = new PrismaClient();

export async function GET(_req: NextRequest) {
  try {
    // Získání doporučených produktů z databáze
    const featuredProducts = await prisma.product.findMany({
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
      take: 4, // Omezíme na 4 produkty
      orderBy: {
        createdAt: 'desc', // Nejnovější produkty
      },
    }) as ProductWithRelations[];

    // Formátování dat pro klienta
    const formattedProducts: FormattedProduct[] = await Promise.all(featuredProducts.map(async product => {
      // Převedeme ceny všech variant
      const convertedVariants = await Promise.all(product.variants.map(async variant => ({
        ...variant,
        price: await convertEurToCzk(variant.price)
      })));

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        previewUrl: product.designs[0]?.previewUrl || '',
        price: product.variants[0]?.price ? await convertEurToCzk(product.variants[0].price) : 0,
        variants: convertedVariants,
        designs: product.designs
      };
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { message: 'Chyba při načítání doporučených produktů' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}