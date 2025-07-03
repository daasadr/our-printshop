'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FormattedProduct } from '@/types/prisma';
import { formatPriceByLocale, detectUserCountry } from '@/utils/currency';

type LatestProductsProps = {
  limit?: number;
};

const LatestProducts: React.FC<{ limit?: number }> = ({ limit = 8 }) => {
  const { t } = useTranslation();
  const { locale = 'cs' } = useRouter();
  const country = detectUserCountry();
  console.log('country:', country, typeof country);
  const countryCode = String(country || 'CZ').toUpperCase();
  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setError(null);
        const response = await fetch(`/api/products?limit=${limit}`);
        
        if (!response.ok) {
          throw new Error(`Chyba serveru: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Načtená data z API:', data);
        
        // Kontrola a zpracování URL adres obrázků
        const processedData = data.map((product: FormattedProduct) => {
          console.log(`Zpracovávám produkt: ${product.name}`);
          console.log(`Původní URL obrázku: ${product.previewUrl}`);
          
          let processedUrl = product.previewUrl;
          
          // Pokud URL neexistuje nebo je prázdná
          if (!processedUrl) {
            console.log(`Produkt ${product.name} nemá URL obrázku`);
            return {
              ...product,
              previewUrl: '/images/placeholder.jpg'
            };
          }

          // Kontrola, zda URL začíná protokolem
          if (!processedUrl.startsWith('http')) {
            processedUrl = `https://${processedUrl}`;
            console.log(`Upravená URL: ${processedUrl}`);
          }

          // Kontrola, zda URL není relativní cesta
          if (processedUrl.startsWith('/')) {
            processedUrl = `${window.location.origin}${processedUrl}`;
            console.log(`Převedeno na absolutní URL: ${processedUrl}`);
          }

          return {
            ...product,
            previewUrl: processedUrl
          };
        });
        
        console.log('Zpracovaná data produktů:', processedData);
        setProducts(processedData);
      } catch (error) {
        console.error('Chyba při načítání nejnovějších produktů:', error);
        setError('Nepodařilo se načíst nejnovější produkty. Zkuste to prosím později.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestProducts();
  }, [limit]);

  const processImageUrl = (url: string | null): string => {
    if (!url) {
      console.log('Chybí URL obrázku, používám placeholder');
      return '/images/placeholder.jpg';
    }

    // Ak je to lokálny obrázok (začína na /), vráť ho bez úpravy
    if (url.startsWith('/')) {
      return url;
    }

    try {
      // Zajistíme, že URL začíná na https://
      const processedUrl = url.startsWith('http') ? url : `https://${url}`;
      console.log(`Zpracovaná URL obrázku: ${processedUrl}`);
      return processedUrl;
    } catch (error) {
      console.error('Chyba při zpracování URL obrázku:', error);
      return '/images/placeholder.jpg';
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

  // Zobrazíme iba prvé 4 produkty
  const visibleProducts = products.slice(0, 4);

  // Funkcia na získanie textu o doprave podľa jazyka
  const getShippingInfo = () => {
    switch (locale) {
      case 'cs':
        return 'Doprava 151 Kč – 252 Kč';
      case 'sk':
        return 'Doprava €5,99 – €9,99';
      case 'en':
        return 'Shipping €5.99 – €9.99';
      case 'de':
        return 'Versand €5,99 – €9,99';
      default:
        return 'Shipping €5.99 – €9.99';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {visibleProducts.map((product) => {
        const imageUrl = product.previewUrl && product.previewUrl.startsWith('http')
          ? product.previewUrl
          : '/images/placeholder.jpg';
        return (
          <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
              <Image
                src={imageUrl}
                alt={product.name}
                width={500}
                height={500}
                className="h-full w-full object-cover object-center group-hover:opacity-75"
                onError={(e) => {
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
              <div className="mt-2 text-gray-500 text-sm">{getShippingInfo()}</div>
              <div className="mt-auto pt-4 flex justify-between items-center">
                <p className="text-lg font-bold text-gray-900">
                  {formatPriceByLocale(product.price, locale, countryCode)}
                </p>
                <button className="px-3 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-900 text-sm font-medium rounded-md transition-colors">
                  {t('product.add_to_cart')}
                </button>
              </div>
            </div>
          </div>
        );
      })}
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