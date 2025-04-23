import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { uploadDesign } from '@/services/printful';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrintfulApiResponse, PrintfulFile } from '@/types/printful';

const prisma = new PrismaClient();

interface UploadDesignResponse {
  id: string;
  url: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Kontrola autorizace
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Získání dat z FormData
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;

    if (!file || !name) {
      return NextResponse.json(
        { error: 'Chybí soubor nebo název' },
        { status: 400 }
      );
    }

    // Kontrola typu souboru
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Neplatný typ souboru' },
        { status: 400 }
      );
    }

    // Kontrola velikosti souboru (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB v bytech
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Soubor je příliš velký' },
        { status: 400 }
      );
    }

    // Nahrání designu do Printful
    const printfulResponse = await uploadDesign(file) as PrintfulApiResponse<PrintfulFile>;

    // Uložení designu do databáze
    const design = await prisma.design.create({
      data: {
        name,
        printfulFileId: String(printfulResponse.result.id),
        previewUrl: printfulResponse.result.preview_url || printfulResponse.result.url,
      }
    });

    return NextResponse.json(design);
  } catch (error) {
    console.error('Error uploading design:', error);
    return NextResponse.json(
      { error: 'Chyba při nahrávání designu' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// src/app/api/designs/route.ts
export async function GET(request: NextRequest) {
  try {
    // Volitelně: Kontrola autentizace
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Získání seznamu designů z databáze
    const designs = await prisma.design.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(designs);
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json(
      { message: 'Chyba při načítání designů' },
      { status: 500 }
    );
  }
}