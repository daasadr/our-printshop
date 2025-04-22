import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PrismaClient, Product, Variant, Design } from '@prisma/client';
import ProductDetail from '@/components/ProductDetail';
import ProductSkeleton from '@/components/ProductSkeleton';
import { convertEurToCzk } from '@/utils/currency';

type ProductWithRelations = Product & {
  variants: (Variant & { price: number })[];
  designs: Design[];
};

// Pro využití v app routeru je lepší načítat data přímo v komponentě stránky
async function getProduct(id: string): Promise<ProductWithRelations | null> {
  const prisma = new PrismaClient();
 
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          where: { isActive: true },
          orderBy: {
            price: 'asc'
          }
        },
        designs: true
      }
    });
    if (!product) return null;
    // Převedeme ceny všech variant na CZK
    const convertedVariants = await Promise.all(product.variants.map(async variant => ({
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
  } finally {
    await prisma.$disconnect();
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
    title: `${product.title} | HappyWilderness`,
    description: product.description,
    openGraph: {
      title: `${product.title} | HappyWilderness`,
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