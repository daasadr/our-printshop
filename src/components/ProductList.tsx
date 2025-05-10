import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category, FormattedProduct, PrismaProduct } from '@/types/prisma';
import prisma from '@/lib/prisma';
import { convertEurToCzk } from '@/lib/currency';
import { formatPriceCZK } from '@/utils/currency';

async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany();
}

async function getProducts(category?: string): Promise<FormattedProduct[]> {
  const where = {
    isActive: true,
    ...(category && { categoryId: category }),
  };

  const include = {
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
        category: product.category?.name || '',
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

export function ProductList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Placeholder pro produkty */}
      {[...Array(6)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}