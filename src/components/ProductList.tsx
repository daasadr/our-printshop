import Link from 'next/link';
import Image from 'next/image';
import { Category, FormattedProduct, PrismaProduct } from '@/types/prisma';
import prisma from '@/lib/prisma';
import { convertEurToCzk } from '@/lib/currency';

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

export default async function ProductList() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  if (!products.length) {
    return (
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold mb-4">Žádné produkty nenalezeny</h2>
        <p>Zkuste vybrat jinou kategorii nebo se vraťte později.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4 mb-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.name}`}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {category.name}
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
              <Image
                src={product.previewUrl}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600">
              {product.name}
            </h3>
            <p className="text-gray-600">Od {product.price} CZK</p>
          </Link>
        ))}
      </div>
    </>
  );
}