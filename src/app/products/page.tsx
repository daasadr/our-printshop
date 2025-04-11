import React from 'react';
import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import CategoryTiles from '@/components/CategoryTiles';
import ProductList from '@/components/ProductList';
import { FormattedProduct, ProductWithRelations } from '@/types/prisma';
import { convertEurToCzk } from '@/utils/currency';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Naše kolekce | HappyWilderness',
  description: 'Prohlédněte si naši kompletní kolekci originálních produktů s autorskými potisky.'
};

interface Category {
  id: string;
  name: string;
  displayName: string;
  imagePlaceholder: string;
  image: string;
}

/**
 * Získá produkty podle kategorie
 */
const getProducts = async (category?: string): Promise<FormattedProduct[]> => {
  try {
    const whereCondition = {
      isActive: true,
      ...(category ? { category } : {})
    };
    
    const includeCondition = {
      variants: {
        where: {
          isActive: true,
        },
        orderBy: {
          price: 'asc' as const,
        },
      },
      designs: true,
    };
    
    const products = await prisma.product.findMany({
      where: whereCondition,
      include: includeCondition
    }) as ProductWithRelations[];
     
    return await Promise.all(products.map(async (product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      previewUrl: product.designs[0]?.previewUrl || '',
      price: product.variants[0]?.price ? await convertEurToCzk(product.variants[0].price) : 0,
      variants: await Promise.all(product.variants.map(async (variant) => ({
        ...variant,
        price: await convertEurToCzk(variant.price)
      }))),
      designs: product.designs,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: product.category,
      categoryId: product.categoryId,
      printfulId: product.printfulId,
      printfulSync: product.printfulSync
    })));
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

// Helper funkce pro získání zobrazovaného názvu kategorie
const getCategoryDisplayName = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    'home-decor': 'Domov a dekorace',
    'women': 'Stylově pro dámy',
    'men': 'Pánská kolekce',
    'kids': 'Pro malé objevitele'
  };
  return categoryMap[category] || category;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const categoryParam = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const products = await getProducts(categoryParam);
  
  const categories: Category[] = [
    {
      id: 'home-decor',
      name: 'home-decor',
      displayName: 'Domov a dekorace',
      imagePlaceholder: 'Domov',
      image: '/images/home.jpg'
    },
    {
      id: 'women',
      name: 'women',
      displayName: 'Stylově pro dámy',
      imagePlaceholder: 'Ženy',
      image: '/images/women.jpeg'
    },
    {
      id: 'men',
      name: 'men',
      displayName: 'Pánská kolekce',
      imagePlaceholder: 'Muži',
      image: '/images/men.jpg'
    },
    {
      id: 'kids',
      name: 'kids',
      displayName: 'Pro malé objevitele',
      imagePlaceholder: 'Děti',
      image: '/images/kids.jpeg'
    }
  ];
 
  return (
    <main className="min-h-screen relative">
      {/* Background image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/tropical.jpg"
          alt="Tropical Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
            {categoryParam
              ? `Kolekce: ${getCategoryDisplayName(categoryParam)}`
              : 'Všechny produkty'}
          </h1>
         
          {/* Kategorie zobrazené jako dlaždice */}
          <CategoryTiles
            title="Procházet podle kategorie"
            titleClassName="text-green-300 text-xl"
            className="mb-10"
            categories={categories}
          />
         
          {/* Seznam produktů */}
          <ProductList products={products} />
         
          {products.length === 0 && (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Momentálně nemáme žádné produkty v této kategorii</h2>
              <p className="text-gray-600">
                Zkuste vybrat jinou kategorii nebo se vraťte později. Neustále rozšiřujeme naši nabídku.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}