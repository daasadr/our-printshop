import { notFound } from 'next/navigation';
import { readItem, readProducts } from '@/lib/directus';
import { ProductWithRelations, Variant } from '@/types';
import ProductDetail from '@/components/ProductDetail';
import { Suspense } from 'react';
import ProductSkeleton from '@/components/ProductSkeleton';
import { convertEurToCzk } from '@/utils/currency';

// Pro využití v app routeru je lepší načítat data přímo v komponentě stránky
async function getProduct(id: string): Promise<ProductWithRelations | null> {
  console.log('getProduct - called with id:', id);
  
  try {
    // Místo readItem použijeme readProducts s filtrem podle ID
    const products = await readProducts({
      fields: [
        '*',
        'variants.*',
        'designs.*'
      ],
      filter: {
        id: { _eq: id }
      },
      limit: 1
    }) as ProductWithRelations[];

    const product = products && products.length > 0 ? products[0] : null;

    console.log('getProduct - raw product from Directus:', product ? { 
      id: product.id, 
      name: product.name, 
      variantsCount: product.variants?.length, 
      designsCount: product.designs?.length,
      design_info: product.design_info,
      hasDesignInfo: !!product.design_info,
      designInfoLength: product.design_info?.length || 0
    } : 'null');

    if (!product) {
      console.log('getProduct - product is null');
      return null;
    }

    // Ošetření chybějících variant/designů
    const variants = Array.isArray(product.variants) ? product.variants : [];
    const designs = Array.isArray(product.designs) ? product.designs : [];

    console.log('getProduct - variants count:', variants.length);
    console.log('getProduct - designs count:', designs.length);

    // Filtrujeme aktivní varianty a seřadíme je podle ceny
    const activeVariants = variants
      .filter((variant: Variant) => variant && variant.is_active)
      .sort((a: Variant, b: Variant) => a.price - b.price);

    console.log('getProduct - active variants count:', activeVariants.length);

    // Převedeme ceny všech variant na CZK
    const convertedVariants = await Promise.all(activeVariants.map(async (variant: Variant) => ({
      ...variant,
      price: await convertEurToCzk(variant.price)
    })));

    const result = {
      ...product,
      variants: convertedVariants,
      designs: designs
    };

    console.log('getProduct - final result:', { 
      id: result.id, 
      name: result.name, 
      variantsCount: result.variants.length, 
      designsCount: result.designs.length,
      design_info: result.design_info,
      hasDesignInfo: !!result.design_info,
      designInfoLength: result.design_info?.length || 0
    });

    return result;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

type GenerateMetadataProps = {
  params: { id: string };
};

// Generování dynamických metadat pro detail produktu
export async function generateMetadata({ params }: GenerateMetadataProps) {
  const product = await getProduct(params.id);
 
  if (!product) {
    return {
      title: 'Produkt nenalezen | HappyWilderness',
      description: 'Požadovaný produkt nebyl nalezen'
    };
  }
 
  return {
    title: `${product.name} | HappyWilderness`,
    description: product.description,
    openGraph: {
      title: `${product.name} | HappyWilderness`,
      description: product.description,
      images: product.designs[0]?.previewUrl
        ? [product.designs[0].previewUrl]
        : ['/images/default-product.jpg'],
    }
  };
}

type ProductPageProps = {
  params: { id: string };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

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