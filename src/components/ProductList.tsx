'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { formatPriceCZK } from '@/utils/currency';
import { FormattedProduct } from '@/types/prisma';
import { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const categories = ['all', ...new Set(products.map(product => product.category))];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'Vše' : category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{product.category}</p>
              <p className="mt-2 text-lg font-medium text-gray-900">
                {product.price.toLocaleString('cs-CZ', {
                  style: 'currency',
                  currency: 'CZK'
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: FormattedProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  // Zjistíme, zda produkt má obrázek a cenu
  const hasImage = product.previewUrl && product.previewUrl.length > 0;
  const hasPrice = product.price && product.price > 0;
  const hasVariants = product.variants && product.variants.length > 0;
  
  const handleAddToCart = () => {
    // Přidáme produkt do košíku pouze pokud má varianty
    if (hasVariants) {
      try {
        addToCart({
          variantId: product.variants[0].id,
          quantity: 1,
          name: product.title,
          price: product.price,
          image: product.previewUrl
        });
        
        // Zobrazíme potvrzení
        alert('Produkt byl přidán do košíku!');
      } catch (error) {
        console.error('Chyba při přidávání do košíku:', error);
        alert('Došlo k chybě při přidávání do košíku. Zkuste to prosím znovu.');
      }
    } else {
      // Pokud nemá varianty, přesměrujeme na detail produktu
      window.location.href = `/products/${product.id}`;
    }
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative">
          {hasImage ? (
            <Image
              src={product.previewUrl}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              Obrázek produktu
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
          {hasPrice ? (
            <span className="text-lg font-bold">{formatPriceCZK(product.price)}</span>
          ) : (
            <span className="text-sm text-gray-500">Cena není k dispozici</span>
          )}
          
          <button
            onClick={handleAddToCart}
            className={`px-3 py-1.5 ${
              hasVariants 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 hover:bg-gray-500'
            } text-white text-sm font-medium rounded-md transition-colors`}
          >
            {hasVariants ? 'Do košíku' : 'Zobrazit detail'}
          </button>
        </div>
      </div>
    </div>
  );
};