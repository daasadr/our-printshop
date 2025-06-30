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

    // Filtrujeme aktivní varianty a seřadíme je podle ceny
    const activeVariants = product.variants
      .filter((variant: Variant) => variant.is_active)
      .sort((a: Variant, b: Variant) => a.price - b.price);

    // Převedeme ceny všech variant na CZK
    const convertedVariants = await Promise.all(activeVariants.map(async (variant: Variant) => ({
      ...variant,
      price: await convertEurToCzk(variant.price)
    })));

    // Vrátíme produkt s převedenými cenami
    return {
      ...product,
      variants: convertedVariants
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
 
  if (!product) {
    notFound();
  }
 
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetail product={product} />
      </Suspense>
    </div>
  );
} 