import React from 'react';
import { PrismaClient } from '@prisma/client';
import ProductList from '@/components/ProductList';
import ProductFilters from '@/components/ProductFilters';
import { formatPriceCZK } from '@/utils/currency';

// Metadata stránky
export const metadata = {
  title: 'Produkty | HappyWilderness',
  description: 'Prohlédněte si naši kompletní nabídku originálních produktů'
};

// Funkce pro získání produktů z databáze
async function getProducts(
  category = null,
  search = '',
  sortBy = 'newest',
  minPrice = 0,
  maxPrice = 10000
) {
  const prisma = new PrismaClient();
  
  try {
    const whereClause = {
      isActive: true,
      ...(category && category !== 'all' ? { category } : {}),
      ...(search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      } : {})
    };
    
    // Zjistit cenové rozpětí pro filtrování
    const priceFilter = {
      variants: {
        some: {
          price: {
            gte: parseInt(minPrice) || 0,
            lte: parseInt(maxPrice) || 100000
          }
        }
      }
    };
    
    // Sestavení orderBy podle zvoleného řazení
    let orderBy = {};
    switch (sortBy) {
      case 'price-asc':
        orderBy = { variants: { orderBy: { price: 'asc' }, take: 1 } };
        break;
      case 'price-desc':
        orderBy = { variants: { orderBy: { price: 'desc' }, take: 1 } };
        break;
      case 'alphabetical':
        orderBy = { title: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
    }
    
    // Získání produktů s variantami a designy
    const products = await prisma.product.findMany({
      where: {
        ...whereClause,
        ...priceFilter
      },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' }
        },
        designs: true
      },
      orderBy
    });
    
    // Formátování produktů pro klienta
    const formattedProducts = products.map(product => {
      // Najdeme nejnižší cenu ze všech variant
      const lowestPrice = product.variants.length > 0
        ? Math.min(...product.variants.map(v => v.price))
        : 0;
      
      // Najdeme URL pro náhled produktu
      const previewUrl = product.designs.length > 0
        ? product.designs[0].previewUrl
        : '/images/placeholder.jpg';
      
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: lowestPrice,
        previewUrl,
        variants: product.variants,
        designs: product.designs,
        category: product.category,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        categoryId: product.categoryId,
        printfulId: product.printfulId,
        printfulSync: product.printfulSync
      };
    });
    
    return formattedProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

// Získání kategorií
async function getCategories() {
  const prisma = new PrismaClient();
  
  try {
    const categories = await prisma.category.findMany();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

// Hlavní komponenta stránky
export default async function ProductsPage({ searchParams }) {
  // Získání parametrů z URL
  const category = searchParams.category || 'all';
  const search = searchParams.search || '';
  const sortBy = searchParams.sort || 'newest';
  const minPrice = searchParams.minPrice || 0;
  const maxPrice = searchParams.maxPrice || 10000;
  
  // Načtení produktů a kategorií
  const products = await getProducts(category, search, sortBy, minPrice, maxPrice);
  const categories = await getCategories();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Naše produkty</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <ProductFilters 
            categories={categories}
            activeCategory={category}
            activeSort={sortBy}
            minPrice={minPrice}
            maxPrice={maxPrice}
            searchQuery={search}
          />
        </div>
        
        <div className="md:w-3/4">
          {products.length > 0 ? (
            <>
              <p className="mb-4 text-gray-600">
                Zobrazeno {products.length} výsledků
                {search && ` pro "${search}"`}
              </p>
              <ProductList products={products} />
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">Žádné produkty nenalezeny</h2>
              <p className="text-gray-600 mb-8">
                Zkuste změnit filtry nebo hledejte podle jiného klíčového slova.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}