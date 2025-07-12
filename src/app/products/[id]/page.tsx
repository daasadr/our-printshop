import { notFound } from 'next/navigation';
import { readItem } from '@/lib/directus';
import { ProductWithRelations, Variant } from '@/types';
import ProductDetail from '@/components/ProductDetail';
import { Suspense } from 'react';
import ProductSkeleton from '@/components/ProductSkeleton';
import { convertEurToCzk } from '@/utils/currency';

// Pro využití v app routeru je lepší načítat data přímo v komponentě stránky
async function getProduct(id: string): Promise<ProductWithRelations | null> {
  try {
    // @ts-expect-error - Directus SDK typy nejsou dokonalé, ale kód funguje správně
    const product = await readItem('products', id, {
      fields: [
        '*',
        'variants.*',
        'variants.images.*',
        'images.*'
        // Prozatím odstraníme kategorie, dokud nevyřešíme oprávnění
        // 'categories.*',
        // 'categories.category.*'
      ]
    }) as ProductWithRelations;

    if (!product) return null;

    // Ošetření chybějících variant/designů
    const variants = Array.isArray(product.variants) ? product.variants : [];
    const designs = Array.isArray(product.designs) ? product.designs : [];

    // Filtrujeme aktivní varianty a seřadíme je podle ceny
    const activeVariants = variants
      .filter((variant: Variant) => variant && variant.is_active)
      .sort((a: Variant, b: Variant) => a.price - b.price);

    // Převedeme ceny všech variant na CZK
    const convertedVariants = await Promise.all(activeVariants.map(async (variant: Variant) => ({
      ...variant,
      price: await convertEurToCzk(variant.price)
    })));

    return {
      ...product,
      variants: convertedVariants,
      designs: designs
    };
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