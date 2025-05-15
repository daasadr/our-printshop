export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaProduct, FormattedProduct, ProductInclude, ProductWhereInput } from '@/types/prisma';
import { convertEurToCzk } from '@/utils/currency';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
   
    // Definujeme where podmínku
    const whereCondition: ProductWhereInput = {
      isActive: true,
      ...(category ? { categoryId: category } : {})
    };
    
    const include: ProductInclude = {
      variants: {
        where: { isActive: true },
        orderBy: { price: 'asc' },
      },
      designs: true,
      category: true,
    };
    
    // Získáme produkty z databáze
    const products = await prisma.product.findMany({
      where: whereCondition,
      include,
    }) as unknown as PrismaProduct[];
    
    // Transformace dat pro klienta s ověřením, že existují potřebná data
    const formattedProducts: FormattedProduct[] = await Promise.all(products.map(async product => {
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
      console.log(`Původní URL obrázku pro produkt ${product.name}: ${originalPreviewUrl}`);
      
      // Zajistíme, že URL adresa začíná na https://
      let processedPreviewUrl = '';
      if (originalPreviewUrl) {
        if (originalPreviewUrl.startsWith('http')) {
          processedPreviewUrl = originalPreviewUrl;
        } else {
          processedPreviewUrl = `https://${originalPreviewUrl}`;
        }
      }
      console.log(`Zpracovaná URL obrázku pro produkt ${product.name}: ${processedPreviewUrl}`);

      // Konvertujeme ceny z EUR na CZK
      const priceInCzk = firstVariant?.price ? await convertEurToCzk(firstVariant.price) : 0;
      const convertedVariants = await Promise.all(product.variants.map(async variant => ({
        ...variant,
        price: await convertEurToCzk(variant.price)
      })));
      
      // Vraťmeme formátovaný produkt
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        previewUrl: processedPreviewUrl,
        price: priceInCzk,
        variants: convertedVariants,
        designs: product.designs.map(({ productId, ...design }) => design),
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        category: product.category?.name || '',
        categoryId: product.categoryId,
        printfulId: product.printfulId,
        printfulSync: product.printfulSync
      };
    }));
   
    // Vracíme data jako JSON
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Chyba při načítání produktů' },
      { status: 500 }
    );
  }
}