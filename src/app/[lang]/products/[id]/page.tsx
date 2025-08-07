import { notFound } from 'next/navigation';
import { translateProduct } from '@/lib/directus';
import { ProductWithRelations, Variant } from '@/types';
import ProductDetail from '@/components/ProductDetail';
import { Suspense } from 'react';
import ProductSkeleton from '@/components/ProductSkeleton';
import { convertEurToCzk } from '@/utils/currency';

// Pro využití v app routeru je lepší načítat data přímo v komponentě stránky
async function getProduct(id: string, locale: string = 'cs'): Promise<ProductWithRelations | null> {
  console.log('getProduct - called with id:', id);
  
  try {
    // Použijeme existujúci API endpoint a filtrujeme produkt podľa ID
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.log('Response not ok:', response.status, response.statusText);
      return null;
    }
    
    const products = await response.json();
    
    // Nájdeme produkt podľa ID
    const product = products.find((p: any) => p.id.toString() === id);
    
    if (!product) {
      console.log('Product not found with id:', id);
      return null;
    }

    // Aplikuj preklad
    const translatedProduct = translateProduct(product, locale);
    
    return translatedProduct as ProductWithRelations;
    
  } catch (error) {
    console.error('Error in getProduct:', error);
    return null;
  }
}

type GenerateMetadataProps = {
  params: { id: string; lang: string };
};

// Generování dynamických metadat pro detail produktu
export async function generateMetadata({ params }: GenerateMetadataProps) {
  try {
    const product = await getProduct(params.id, params.lang);
 
    
 
    if (!product) {
      return {
        title: 'Produkt nenalezen | HappyWilderness',
        description: 'Požadovaný produkt nebyl nalezen'
      };
    }
 
    return {
      title: `${product.name} | HappyWilderness`,
      description: product.description || 'Popis produktu není k dispozici',
      openGraph: {
        title: `${product.name} | HappyWilderness`,
        description: product.description || 'Popis produktu není k dispozici',
        images: product.mockups && product.mockups.length > 0
          ? [product.mockups[0]]
          : ['/images/default-product.jpg'],
      }
    };
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    return {
      title: 'Produkt | HappyWilderness',
      description: 'Popis produktu'
    };
  }
}

type ProductPageProps = {
  params: { id: string; lang: string };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id, params.lang);

  if (!product || !Array.isArray(product.variants) || product.variants.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Produkt není dostupný</h1>
        <p className="text-gray-600">Omlouváme se, tento produkt není aktuálně k dispozici.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetail product={product} />
      </Suspense>
    </div>
  );
} 