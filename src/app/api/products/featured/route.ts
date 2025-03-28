import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ProductWithRelations, FormattedProduct, ProductQueryInput } from '@/types/prisma';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Vytvoření dotazu s explicitním typem
    const productsQuery: ProductQueryInput = {
      where: {
        isActive: true
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
    };

    // Použití správného typu pro produkt s jeho relacemi
    const featuredProducts = await prisma.product.findMany(productsQuery) as ProductWithRelations[];

    // Formátování dat pro klienta
    const formattedProducts: FormattedProduct[] = featuredProducts.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      previewUrl: product.designs[0]?.previewUrl || '',
      price: product.variants[0]?.price || 0,
      variants: product.variants,
      designs: product.designs
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