"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { FormattedProduct } from '@/types/prisma';
import { formatPriceCZK } from '@/utils/currency';

const LatestProducts: React.FC<{ limit?: number }> = ({ limit = 4 }) => {
  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setError(null);
        const response = await fetch(`/api/products/latest?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error(`Chyba serveru: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching latest products:', error);
        setError('Nepodařilo se načíst nejnovější produkty. Zkuste to prosím později.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestProducts();
  }, [limit]);

  const handleAddToCart = (product: FormattedProduct) => {
    // Přidáme produkt do košíku pouze pokud má varianty
    if (product.variants && product.variants.length > 0) {
      addToCart({
        variantId: product.variants[0].id,
        quantity: 1,
        name: `${product.title}`,
        price: product.price,
        image: product.previewUrl || ''
      });
    }
  };

  if (isLoading) {
    return <ProductsLoading />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Pokud nemáme žádné produkty, zobrazíme placeholdery
  if (!products || products.length === 0) {
    return <ProductPlaceholders />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg">
          <div className="aspect-square overflow-hidden">
            {product.previewUrl ? (
              <Link href={`/products/${product.id}`}>
                <div className="relative w-full h-full">
                  <Image
                    src={product.previewUrl}
                    alt={product.title}
                    fill
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                Obrázek produktu
              </div>
            )}
          </div>
         
          <div className="p-4">
            <Link href={`/products/${product.id}`}>
              <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600">
                {product.title}
              </h3>
            </Link>
            
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {product.description}
            </p>
            
            <div className="mt-4 flex justify-between items-center">
              {product.price > 0 ? (
                <p className="text-lg font-medium text-gray-900">
                  {formatPriceCZK(product.price)}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Cena není k dispozici
                </p>
              )}
              
              <button
                onClick={() => handleAddToCart(product)}
                className={`px-3 py-1.5 ${
                  product.variants && product.variants.length > 0 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                } text-white text-sm font-medium rounded-md transition-colors`}
                disabled={!product.variants || product.variants.length === 0}
              >
                Do košíku
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Komponenta pro načítání produktů
const ProductsLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
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
        <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md">
          <div className="aspect-square overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              Obrázek produktu
            </div>
          </div>
         
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900">{product.title}</h3>
            <p className="mt-1 text-sm text-gray-500">Více variant</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-lg font-medium text-gray-900">
                {formatPriceCZK(product.price)}
              </p>
              <button
                className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Do košíku
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestProducts;