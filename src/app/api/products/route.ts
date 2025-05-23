export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaProduct, FormattedProduct, ProductInclude, ProductWhereInput } from '@/types/prisma';
import { convertEurToCzk } from '@/utils/currency';
import prisma from '@/lib/prisma';

type ProductWithCategories = Prisma.ProductGetPayload<{ include: { categories: { include: { category: true } }, variants: { where: { isActive: true }, orderBy: { price: 'asc' } }, designs: true } }>;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    // Definujeme where podmínku
    const whereCondition: ProductWhereInput = {
      isActive: true,
      // Filtrace podle kategorie bude řešena až po načtení, protože máme many-to-many vztah
    };

    const include = {
      variants: {
        where: { isActive: true },
        orderBy: { price: 'asc' },
      },
      designs: true,
      categories: { include: { category: true } },
    };

    // Získáme produkty z databáze
    const products = await prisma.product.findMany({
      where: whereCondition,
      include,
    }) as ProductWithCategories[];

    console.log('Načtené produkty:', products);
    products.forEach(product => {
      console.log('Product:', product.id, 'categories:', product.categories);
    });

    // Pokud je zadána kategorie, filtrujeme produkty podle ní
    let filteredProducts = products;
    if (category) {
      filteredProducts = products.filter(product =>
        product.categories.some(pc => pc.categoryId === category)
      );
    }

    // Transformace dat pro klienta
    const formattedProducts: FormattedProduct[] = await Promise.all(filteredProducts.map(async product => {
      const convertedVariants = await Promise.all(
        (product.variants || []).map(async variant => ({
          ...variant,
          price: await convertEurToCzk(variant.price)
        }))
      );

      const originalPreviewUrl = product.designs?.[0]?.previewUrl || '';
      let processedPreviewUrl = '';
      if (originalPreviewUrl) {
        if (originalPreviewUrl.startsWith('http')) {
          processedPreviewUrl = originalPreviewUrl;
        } else {
          processedPreviewUrl = `https://${originalPreviewUrl}`;
        }
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        previewUrl: processedPreviewUrl,
        price: product.variants?.[0]?.price
          ? await convertEurToCzk(product.variants[0].price)
          : 0,
        variants: convertedVariants,
        designs: (product.designs || []).map(({ productId, ...design }) => design),
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        categories: product.categories.map(pc => pc.category.name),
        categoryIds: product.categories.map(pc => pc.categoryId),
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