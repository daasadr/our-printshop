export const dynamic = "force-dynamic";
import { Suspense } from 'react';
import { ProductList } from '@/components/ProductList';
import { ProductListSkeleton } from '@/components/ProductListSkeleton';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { convertEurToCzk } from '@/lib/currency';
import { FormattedProduct, PrismaProduct } from '@/types/prisma';
import { Prisma } from '@prisma/client';

type ProductWithCategories = Prisma.ProductGetPayload<{ include: { categories: { include: { category: true } }, variants: { where: { isActive: true }, orderBy: { price: 'asc' } }, designs: true } }>;

export const metadata: Metadata = {
  title: 'Produkty | Our Printshop',
  description: 'Prohlédněte si naši nabídku produktů',
};

async function getProducts(): Promise<FormattedProduct[]> {
  const include = {
    variants: {
      where: { isActive: true },
      orderBy: { price: 'asc' },
    },
    designs: true,
    categories: { include: { category: true } },
  };

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include,
    }) as ProductWithCategories[];

    const formattedProducts = await Promise.all(products.map(async (product) => {
      const basePrice = product.variants[0]?.price || 0;
      const convertedPrice = await convertEurToCzk(basePrice);

      const convertedVariants = await Promise.all(product.variants.map(async (variant) => ({
        ...variant,
        price: await convertEurToCzk(variant.price),
      })));

      return {
        ...product,
        previewUrl: product.designs[0]?.previewUrl || '',
        price: convertedPrice,
        categories: product.categories.map(pc => pc.category.name),
        categoryIds: product.categories.map(pc => pc.categoryId),
        variants: convertedVariants,
        designs: product.designs.map(({ productId: _productId, ...design }) => design),
      } as FormattedProduct;
    }));

    return formattedProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Naše produkty</h1>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList products={products} />
      </Suspense>
    </div>
  );
}