import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ProductWithRelations, FormattedProduct, ProductQueryInput } from '@/types/prisma';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
   
    // Vytvoření dotazu s explicitním typem
    const productsQuery: ProductQueryInput = {
      where: {
        isActive: true,
        ...(category ? { category } : {})
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
    };
   
    // Použití správného typu pro produkt s jeho relacemi
    const products = await prisma.product.findMany(productsQuery) as ProductWithRelations[];
   
    // Transformace dat pro klienta
    const formattedProducts: FormattedProduct[] = products.map(product => ({
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
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Chyba při načítání produktů' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}