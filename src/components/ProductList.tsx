'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  price: number;
  // další vlastnosti...
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart({
      variantId: product.id,
      quantity: 1,
      name: product.title,
      price: product.price,
      image: product.previewUrl
    });
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative">
          {product.previewUrl ? (
            <Image
              src={product.previewUrl}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              No image
            </div>
          )}
        </div>
      </Link>
     
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold hover:text-blue-600">{product.title}</h3>
        </Link>
       
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
       
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold">{product.price.toFixed(2)} Kč</span>
         
          <button
            onClick={handleAddToCart}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Do košíku
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;