import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sizes = await prisma.variant.findMany({
      where: {
        size: {
          not: null,
        },
      },
      distinct: ['size'],
      select: {
        size: true,
      },
      orderBy: {
        size: 'asc',
      },
    });
    
    const sizeList = sizes.map(s => s.size).filter(Boolean) as string[];
    return NextResponse.json(sizeList);
  } catch (error) {
    console.error('Error fetching variant sizes:', error);
    return NextResponse.json({ error: 'Failed to fetch variant sizes' }, { status: 500 });
  }
} 