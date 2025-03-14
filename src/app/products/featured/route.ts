import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Získání doporučených produktů z databáze
    // Ve skutečné aplikaci byste mohli mít další logiku pro určení, které produkty jsou "doporučené"
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
    });

    return NextResponse.json(featuredProducts);
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