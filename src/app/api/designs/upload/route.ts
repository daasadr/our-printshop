import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { uploadDesign } from '@/services/printful';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
<<<<<<< HEAD
import { PrintfulApiResponse, PrintfulFile } from '@/types/printful';
=======
import { PrintfulFileResponse } from '@/types/printful';
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8

const prisma = new PrismaClient();

interface UploadDesignResponse {
  id: string;
  url: string;
}

export async function POST(req: NextRequest) {
  try {
    // Volitelně: Kontrola autentizace
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Pro zpracování multipart/form-data je potřeba použít formData
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;

    if (!file || !name) {
      return NextResponse.json(
        { message: 'Chybí soubor nebo název' },
        { status: 400 }
      );
    }

    // Kontrola typu souboru
    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Nepodporovaný formát souboru' },
        { status: 400 }
      );
    }

    // Kontrola velikosti souboru (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Soubor je příliš velký (max 10MB)' },
        { status: 400 }
      );
    }

    // Nahrání designu do Printful
<<<<<<< HEAD
    const printfulResponse = await uploadDesign(file) as PrintfulApiResponse<PrintfulFile>;
=======
    const printfulResponse = await uploadDesign(file) as { result: PrintfulFileResponse };
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8

    // Uložení designu do databáze
    const design = await prisma.design.create({
      data: {
        name,
<<<<<<< HEAD
        printfulFileId: printfulResponse.result.id,
        previewUrl: printfulResponse.result.preview_url
=======
        printfulFileId: String(printfulResponse.result.id),
        previewUrl: printfulResponse.result.url,
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8
      }
    });

    return NextResponse.json({
      success: true,
      design
    });

  } catch (error) {
    console.error('Error uploading design:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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