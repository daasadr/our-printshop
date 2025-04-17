import React from 'react';
import { PrismaClient } from '@prisma/client';
import ProductList from '@/components/ProductList';
import Link from 'next/link';
import { FormattedProduct } from '@/types/prisma';
import { convertEurToCzk } from '@/utils/currency';

// Metadata stránky
export const metadata = {
  title: 'Produkty | HappyWilderness',
  description: 'Prohlédněte si naši kompletní nabídku originálních produktů'
};

// Funkce pro získání produktů z databáze
async function getProducts(category: string | null = null): Promise<FormattedProduct[]> {
  const prisma = new PrismaClient();
  
  try {
    // Základní filtrovací podmínky
    const where: any = {
      isActive: true
    };
    
    // Přidáme filtr podle kategorie, pokud je specifikována
    if (category && category !== 'all') {
      where.category = category;
    }
    
    // Získání produktů s variantami a designy
    const products = await prisma.product.findMany({
      where,
      include: {
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' }
        },
        designs: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Formátování produktů pro klienta
    const formattedProducts = await Promise.all(products.map(async product => {
      // Najdeme nejnižší cenu ze všech variant a převedeme ji na CZK
      const lowestPrice = product.variants.length > 0
        ? await convertEurToCzk(Math.min(...product.variants.map(v => v.price)))
        : 0;
      
      // Najdeme URL pro náhled produktu
      let previewUrl = '/images/placeholder.jpg';
      if (product.designs.length > 0) {
        const originalPreviewUrl = product.designs[0].previewUrl;
        if (originalPreviewUrl) {
          if (originalPreviewUrl.startsWith('http')) {
            previewUrl = originalPreviewUrl;
          } else {
            previewUrl = `https://${originalPreviewUrl}`;
          }
        }
      }
      
      // Převedeme ceny všech variant na CZK
      const convertedVariants = await Promise.all(product.variants.map(async variant => ({
        ...variant,
        price: await convertEurToCzk(variant.price)
      })));
      
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: lowestPrice,
        previewUrl,
        variants: convertedVariants,
        designs: product.designs,
        category: product.category,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        categoryId: product.categoryId,
        printfulId: product.printfulId,
        printfulSync: product.printfulSync
      };
    }));
    
    return formattedProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Získání kategorií
async function getCategories() {
  const prisma = new PrismaClient();
  
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        displayName: 'asc'
      }
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

type ProductsPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

// Hlavní komponenta stránky
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Získání parametrů z URL
  const category = typeof searchParams.category === 'string' ? searchParams.category : 'all';
  
  try {
    // Načtení produktů a kategorií
    const [products, categories] = await Promise.all([
      getProducts(category),
      getCategories()
    ]);
    
    return (
      <main className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(/images/waterfall2.jpg)' }}>
        <div className="container mx-auto px-4 py-8 relative">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm -mx-4"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold mb-8 text-center text-white">Naše produkty</h1>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-4">
                  <h2 className="text-lg font-semibold mb-3 text-gray-900">Kategorie</h2>
                  <ul className="space-y-2">
                    <li>
                      <Link 
                        href="/products"
                        className={category === 'all' ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}
                      >
                        Všechny produkty
                      </Link>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat.id}>
                        <Link 
                          href={`/products?category=${cat.name}`}
                          className={category === cat.name ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}
                        >
                          {cat.displayName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="md:w-3/4">
                {products && products.length > 0 ? (
                  <>
                    <p className="mb-4 text-white">
                      Zobrazeno {products.length} výsledků
                    </p>
                    <ProductList products={products} />
                  </>
                ) : (
                  <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Žádné produkty nenalezeny</h2>
                    <p className="text-gray-600 mb-8">
                      Zkuste vybrat jinou kategorii nebo se vraťte později.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in ProductsPage:', error);
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(/images/waterfall2.jpg)' }}>
        <div className="container mx-auto px-4 py-16 text-center relative">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm -mx-4"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Nastala chyba</h1>
            <p className="text-gray-600 mb-8">
              Omlouváme se, ale nastala chyba při načítání produktů. Zkuste to prosím později.
            </p>
            <Link href="/" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700">
              Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </div>
    );
  }
} 