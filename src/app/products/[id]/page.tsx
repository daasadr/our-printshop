import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import ProductDetail from '@/components/ProductDetail';
import ProductSkeleton from '@/components/ProductSkeleton';

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
          where: { isActive: true }
        },
        designs: true
      }
    });
    
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export async function generateMetadata({ params }: PageProps) {
  const product = await getProduct(params.id);
  
  if (!product) {
    return {
      title: 'Produkt nenalezen',
      description: 'Požadovaný produkt nebyl nalezen'
    };
  }
  
  return {
    title: product.title,
    description: product.description
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