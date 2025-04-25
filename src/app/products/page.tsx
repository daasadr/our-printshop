import React from 'react';
import { Category, FormattedProduct, ProductWhereInput, ProductInclude, PrismaProduct } from '@/types/prisma';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { convertEurToCzk } from '@/lib/currency';

// Metadata stránky
export const metadata = {
  title: 'Products | Our Printshop',
  description: 'Browse our collection of custom printed products.',
};

// Funkce pro získání kategorií
async function getCategories() {
  return prisma.category.findMany();
}

// Funkce pro získání produktů z databáze
async function getProducts(category?: string): Promise<FormattedProduct[]> {
  const where: ProductWhereInput = {
    isActive: true,
  };

  if (category) {
    where.categoryId = category;
  }

  const include: ProductInclude = {
    variants: {
      where: { isActive: true },
      orderBy: { price: 'asc' },
    },
    designs: true,
    category: true,
  };

  try {
    const products = await prisma.product.findMany({
      where,
      include,
    }) as unknown as PrismaProduct[];

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
        category: product.category?.displayName || '',
        variants: convertedVariants,
        designs: product.designs.map(({ productId, ...design }) => design),
      } as FormattedProduct;
    }));

    return formattedProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

type ProductsPageProps = {
  searchParams: { category?: string };
};

// Hlavní komponenta stránky
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(searchParams.category),
  ]);

  if (!products.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.name}`}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              {category.displayName}
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold mb-4">No products found</h2>
          <p>Try selecting a different category or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-4 mb-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.name}`}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {category.displayName}
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="block group"
          >
            <div className="aspect-square relative mb-4">
              <img
                src={product.previewUrl}
                alt={product.title}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600">
              {product.title}
            </h3>
            <p className="text-gray-600">From {product.price} CZK</p>
          </Link>
        ))}
      </div>
    </div>
  );
}