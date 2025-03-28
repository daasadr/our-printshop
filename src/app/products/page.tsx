// src/app/products/page.tsx
import React from 'react';
import { Header } from '@/components/layout/Header';
import {Footer} from '@/components/layout/Footer';
import CategoryTiles from '@/components/CategoryTiles';
import ProductList from '@/components/ProductList';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Definujeme vlastní typy podle schéma
interface Product {
  id: string;
  title: string;
  description: string;
  printfulId: string;
  printfulSync: boolean;
  isActive: boolean;
  category?: string; // Přidáno pro podporu kategorizace
  createdAt: Date;
  updatedAt: Date;
}

interface Variant {
  id: string;
  productId: string;
  printfulVariantId: string;
  name: string;
  size?: string | null;
  color?: string | null;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Design {
  id: string;
  name: string;
  printfulFileId: string;
  previewUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// Definujeme typ pro produkt včetně variant a designů
interface ProductWithDetails extends Product {
  variants: Variant[];
  designs: Design[];
}

// Definujeme typ pro transformovaný produkt pro frontend
interface TransformedProduct {
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  price: number;
  variants: Variant[];
  designs: Design[];
}

const getProducts = async (category?: string): Promise<TransformedProduct[]> => {
    try {
      // Přímo použít Prisma klienta v server komponentě
      const productsQuery = {
        where: {
          isActive: true,
          ...(category ? { category } : {})
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
      };
      
      const products = await prisma.product.findMany(productsQuery);
      
      // Transformace dat pro UI s explicitním typem
      return products.map((product: any) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        previewUrl: product.designs[0]?.previewUrl || '',
        price: product.variants[0]?.price || 0,
        variants: product.variants,
        designs: product.designs
      }));
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const categoryParam = searchParams.category as string | undefined;
  
  // Načtení produktů podle kategorie
  const products = await getProducts(categoryParam);
  
  return (
    <>
      <main className="min-h-screen">
        <div className="bg-gray-100 py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
              {categoryParam 
                ? `Kolekce: ${getCategoryDisplayName(categoryParam)}` 
                : 'Všechny produkty'}
            </h1>
            
            {/* Kategorie zobrazené jako dlaždice */}
            <CategoryTiles 
              title="Procházet podle kategorie" 
              className="mb-10"
              categories={[
                {
                  id: 'home-decor',
                  name: 'home-decor',
                  displayName: 'Domov a dekorace',
                  imagePlaceholder: 'Domov',
                  image: '/images/categories/home-decor.jpg'
                },
                {
                  id: 'women',
                  name: 'women',
                  displayName: 'Stylově pro dámy',
                  imagePlaceholder: 'Ženy',
                  image: '/images/categories/women.jpg'
                },
                {
                    id: 'men',
                    name: 'men',
                    displayName: 'Pánská kolekce',
                    imagePlaceholder: 'Muži',
                    image: '/images/categories/men.jpg'
                  },
                  {
                    id: 'kids',
                    name: 'kids',
                    displayName: 'Pro malé objevitele',
                    imagePlaceholder: 'Děti',
                    image: '/images/categories/kids.jpg'
                  }
              ]}
              
            />
            
            {/* Seznam produktů */}
            <ProductList products={products} />
            
            {/* Pokud nejsou žádné produkty */}
            {products.length === 0 && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">Momentálně nemáme žádné produkty v této kategorii</h2>
                <p className="text-gray-600">
                  Zkuste vybrat jinou kategorii nebo se vraťte později. Neustále rozšiřujeme naši nabídku.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    
    </>
  );
}

// Helper funkce pro získání zobrazovaného názvu kategorie
function getCategoryDisplayName(categoryName: string): string {
  const categories = {
    'home-decor': 'Domov a dekorace',
    'women': 'Stylově pro dámy',
    'men': 'Pánská kolekce',
    'kids': 'Pro malé objevitele'
  };
  
  return categories[categoryName as keyof typeof categories] || 'Všechny produkty';
}