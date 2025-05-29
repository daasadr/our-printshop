"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
// import { useCart } from '@/hooks/useCart';
import { FormattedProduct } from '@/types/prisma';
import { formatPriceEUR } from '@/utils/currency';

const FEATURED_IDS = [
  '382862008', // Drawstring bag
  '382861448', // Tote bag
  '381597946', // Don't live in a comfort zone Unisex Hoodie
  '377907594', // Ancient Heroine Skater Dress white
];

type LatestProductsProps = {
  limit?: number;
};

const LatestProducts: React.FC<LatestProductsProps> = ({ limit = 4 }) => {
  const { t } = useTranslation('common');
  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [displayed, setDisplayed] = useState<FormattedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
//   const { addToCart } = useCart();

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setError(null);
        const response = await fetch(`/api/products`);
        
        if (!response.ok) {
          throw new Error(t('error.server_error', { status: response.status, statusText: response.statusText }));
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Chyba při načítání nejnovějších produktů:', error);
        setError(t('error.load_products'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  // Funkcia na výber náhodných N produktov
  const getRandomProducts = React.useCallback((arr: FormattedProduct[], n: number) => {
    if (!arr || arr.length === 0) return [];
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(n, arr.length));
  }, []);

  // Rotácia produktov každých 8 sekúnd
  useEffect(() => {
    if (!products || products.length === 0) return;
    
    // Nastavíme prvý výber hneď po načítaní
    setDisplayed(getRandomProducts(products, limit));
    
    const interval = setInterval(() => {
      setDisplayed(prev => {
        // Zabezpečíme, že nový výber bude iný ako predchádzajúci
        let newSelection;
        do {
          newSelection = getRandomProducts(products, limit);
        } while (JSON.stringify(newSelection) === JSON.stringify(prev));
        return newSelection;
      });
    }, 8000);
    
    return () => clearInterval(interval);
  }, [products, limit, getRandomProducts]);

//   const handleAddToCart = (product: FormattedProduct) => {
//     // Přidáme produkt do košíku pouze pokud má varianty
//     if (product.variants && product.variants.length > 0) {
//       addToCart({
//         variantId: product.variants[0].id,
//         quantity: 1,
//         name: `${product.name}`,
//         price: product.price,
//         image: product.previewUrl || ''
//       });
//     }
//   };

  const processImageUrl = (url: string | null): string => {
    if (!url || url === '/images/placeholder.jpg') {
      return '/placeholder.jpg';
    }
    return url.startsWith('http') ? url : `https://${url}`;
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

  if (!displayed || displayed.length === 0) {
    return <ProductPlaceholders />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayed.map((product) => (
        <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg">
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
            <Image
              src={processImageUrl(product.image)}
              alt={product.name}
              width={500}
              height={500}
              className="h-full w-full object-cover object-center group-hover:opacity-75"
              onError={(e) => {
                console.error(t('error.image_load', { product: product.name }), e);
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.jpg';
              }}
            />
          </div>
         
          <div className="p-4">
            <Link href={`/products/${product.id}`}>
              <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600">
                {product.name}
              </h3>
            </Link>
            
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {product.description}
            </p>
            
            <div className="mt-4 flex justify-between items-center">
              {product.price > 0 ? (
                <p className="text-lg font-medium text-gray-900">
                  {formatPriceEUR(product.price)}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  {t('product.price_not_available')}
                </p>
              )}
              
              <button
                className={`px-3 py-1.5 ${
                  product.variants && product.variants.length > 0 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                } text-white text-sm font-medium rounded-md transition-colors`}
                disabled={!product.variants || product.variants.length === 0}
              >
                {t('product.add_to_cart')}
              </button>
            </div>

            <div className="mt-1 text-sm text-gray-500">
              {product.shippingPrice 
                ? t('product.shipping_range', { 
                    min: formatPriceEUR(product.shippingPrice.min),
                    max: formatPriceEUR(product.shippingPrice.max)
                  })
                : t('product.shipping_by_country')}
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
      name: 'Tričko "Minimalistický design"',
      price: 599,
    },
    {
      id: 'placeholder-2',
      name: 'Mikina "Urban Style"',
      price: 1299,
    },
    {
      id: 'placeholder-3',
      name: 'Plakát "Geometric Art"',
      price: 349,
    },
    {
      id: 'placeholder-4',
      name: 'Hrnek "Morning Coffee"',
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
            <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500">Více variant</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-lg font-medium text-gray-900">
                {formatPriceEUR(product.price)}
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