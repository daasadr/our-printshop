import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { ProductWithRelations, FormattedProduct } from '@/types/prisma';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
   
    // Definujeme where podmínku
    const whereCondition: Prisma.ProductWhereInput = {
      isActive: true,
      ...(category ? { category } : {})
    };
    
    // Získáme produkty z databáze
    const products = await prisma.product.findMany({
      where: whereCondition,
      include: {
        variants: {
          where: {
            isActive: true,
          },
          orderBy: {
            price: 'asc' as const,
          },
        },
        designs: true,
      },
    }) as ProductWithRelations[];
    
    // Transformace dat pro klienta s ověřením, že existují potřebná data
    const formattedProducts: FormattedProduct[] = products.map(product => {
      // Najdeme první aktivní variantu nebo použijeme defaultní hodnoty
      const firstVariant = product.variants && product.variants.length > 0 
        ? product.variants[0] 
        : null;
      
      // Najdeme první design nebo použijeme prázdný string
      const firstDesign = product.designs && product.designs.length > 0 
        ? product.designs[0] 
        : null;
      
      // Získáme URL adresu obrázku
      const originalPreviewUrl = firstDesign?.previewUrl || '';
      console.log(`Původní URL obrázku pro produkt ${product.title}: ${originalPreviewUrl}`);
      
      // Zajistíme, že URL adresa začíná na https://
      let processedPreviewUrl = '';
      if (originalPreviewUrl) {
        if (originalPreviewUrl.startsWith('http')) {
          processedPreviewUrl = originalPreviewUrl;
        } else {
          processedPreviewUrl = `https://${originalPreviewUrl}`;
        }
      }
      console.log(`Zpracovaná URL obrázku pro produkt ${product.title}: ${processedPreviewUrl}`);
      
      // Vraťmeme formátovaný produkt
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        previewUrl: processedPreviewUrl,
        price: firstVariant?.price || 0,
        variants: product.variants,
        designs: product.designs
      };
    });
   
    // Vracíme data jako JSON
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