import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { uploadDesign } from '@/services/printful';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrintfulFile, PrintfulApiResponse } from '@/types/printful';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Ověření přihlášení
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Získání dat z požadavku
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
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Nepodporovaný typ souboru' },
        { status: 400 }
      );
    }

    // Kontrola velikosti souboru (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB v bytech
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
        previewUrl: printfulResponse.result.url
      }
    });

    return NextResponse.json(design);
  } catch (error) {
    console.error('Error uploading design:', error);
    return NextResponse.json(
      { error: 'Chyba při nahrávání designu' },
      { status: 500 }
    );
  }
}

// src/app/api/designs/route.ts
export async function GET() {
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