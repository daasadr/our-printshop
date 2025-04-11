import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { uploadDesign } from '@/services/printful';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

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
    const printfulResponse = await uploadDesign(file);

    // Uložení designu do databáze - oprava schématu podle Prisma modelu
    const design = await prisma.design.create({
      data: {
        name,
        printfulFileId: String(printfulResponse.id),
        previewUrl: printfulResponse.url,
        // Přidáno: Vytvořit design jako "samostatný" bez propojení s produktem
        // nebo použít connect prázdný které odpovídá vaší Prisma schématu
        product: { 
          connect: { id: "placeholder" } // Toto upravte podle vašeho schématu
        }
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
export async function GET(req: NextRequest) {
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