import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import ProductDetail from '@/components/ProductDetail';
import ProductSkeleton from '@/components/ProductSkeleton';
import { Metadata, ResolvingMetadata } from 'next';
import { convertEurToCzk } from '@/utils/currency';

interface PageProps {
  params: {
    id: string;
  };
}

// Pro využití v app routeru je lepší načítat data přímo v komponentě stránky
async function getProduct(id: string) {
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

// Generování dynamických metadat pro detail produktu
export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
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

export default async function ProductPage({ params }: PageProps) {
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