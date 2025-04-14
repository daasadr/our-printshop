import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Product, ProductVariant, Design } from '@prisma/client';
import { convertEurToCzk } from '@/utils/currency';

const prisma = new PrismaClient();

type ProductWithRelations = Product & {
  variants: (ProductVariant & { price: number })[];
  designs: Design[];
};

type FormattedProduct = {
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  price: number;
  variants: (ProductVariant & { price: number })[];
  designs: Design[];
};

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '4'); // Výchozí limit je 4 produkty
    
    // Získání nejnovějších produktů z databáze
    const latestProducts = await prisma.product.findMany({
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
      take: limit,
      orderBy: {
        createdAt: 'desc', // Řazení podle data vytvoření (nejnovější první)
      },
    }) as ProductWithRelations[];

    // Formátování dat pro klienta
    const formattedProducts: FormattedProduct[] = await Promise.all(latestProducts.map(async product => {
      // Převedeme ceny všech variant
      const convertedVariants = await Promise.all(product.variants.map(async variant => ({
        ...variant,
        price: await convertEurToCzk(variant.price)
      })));

      // Získáme URL adresu obrázku
      const originalPreviewUrl = product.designs[0]?.previewUrl || '';
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

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        previewUrl: processedPreviewUrl,
        price: product.variants[0]?.price ? await convertEurToCzk(product.variants[0].price) : 0,
        variants: convertedVariants,
        designs: product.designs
      };
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return NextResponse.json(
      { message: 'Chyba při načítání nejnovějších produktů' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}