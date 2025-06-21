import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const colors = await prisma.variant.findMany({
      where: {
        color: {
          not: null,
        },
      },
      distinct: ['color'],
      select: {
        color: true,
      },
      orderBy: {
        color: 'asc',
      },
    });
    
    const colorList = colors.map(c => c.color).filter(Boolean) as string[];
    return NextResponse.json(colorList);
  } catch (error) {
    console.error('Error fetching variant colors:', error);
    return NextResponse.json({ error: 'Failed to fetch variant colors' }, { status: 500 });
  }
} 