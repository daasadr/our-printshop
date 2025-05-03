"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { FormattedProduct } from '@/types/prisma';
import { formatPriceCZK } from '@/utils/currency';

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/featured');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product: FormattedProduct, variant: any) => {
    await addToCart({
      productId: product.id,
      variantId: variant.id,
      quantity: 1,
      name: product.name,
      price: variant.price,
      image: product.designs && product.designs.length > 0 ? product.designs[0].previewUrl : ''
    });
  };

  if (products.length === 0) {
    return <ProductPlaceholders />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link href={`/products/${product.id}`}>
              <div className="aspect-square relative">
                <img
                  src={product.designs[0].previewUrl}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="text-lg font-semibold mb-2 hover:text-blue-600">
                  {product.name}
                </h3>
              </Link>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">{formatPriceCZK(product.variants[0].price)}</span>
                <button
                  onClick={() => handleAddToCart(product, product.variants[0])}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Placeholder pro produkt, když nemáme data
const ProductPlaceholders: React.FC = () => {
  // Ukázkové produkty
  const placeholders = [
    {
      id: 'placeholder-1',
      title: 'Tričko "Minimalistický design"',
      price: 599,
    },
    {
      id: 'placeholder-2',
      title: 'Mikina "Urban Style"',
      price: 1299,
    },
    {
      id: 'placeholder-3',
      title: 'Plakát "Geometric Art"',
      price: 349,
    },
    {
      id: 'placeholder-4',
      title: 'Hrnek "Morning Coffee"',
      price: 299,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {placeholders.map((product) => (
        <div key={product.id} className="group relative">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              Obrázek produktu
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">{product.title}</h3>
            <p className="mt-1 text-sm text-gray-500">Více variant</p>
            <p className="mt-2 text-sm font-medium text-gray-900">{formatPriceCZK(product.price)}</p>
          </div>
          
          <div className="mt-4">
            <button
              className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Do košíku
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;