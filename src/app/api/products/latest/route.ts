import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { ProductWithRelations, FormattedProduct } from '@/types/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products: ProductWithRelations[] = await prisma.product.findMany({
      where: {
        isActive: true,
        variants: {
          some: {
            isActive: true,
          },
        },
      },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
        designs: true,
        category: true,
        collection: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    const formattedProducts: FormattedProduct[] = products.map((product) => {
      const firstVariant = product.variants[0];
      const firstDesign = product.designs[0];

      const getImageUrl = () => {
        if (!firstDesign?.previewUrl) return '/images/placeholder.jpg';
        return firstDesign.previewUrl.startsWith('http')
          ? firstDesign.previewUrl
          : `https://${firstDesign.previewUrl}`;
      };

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: firstVariant?.price || 0,
        image: getImageUrl(),
        variants: product.variants,
        designs: product.designs.map(({ productId, ...design }) => design),
        category: product.category,
        collection: product.collection,
        collectionId: product.collectionId,
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}