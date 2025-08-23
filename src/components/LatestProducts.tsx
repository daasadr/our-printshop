'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice, formatPriceForDisplay, getRegionalPrice } from '@/utils/pricing';
import { getProductImages } from '@/utils/productImage';
import { Button } from '@/components/ui/Button';
import { useLocale } from '@/context/LocaleContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { FiHeart } from 'react-icons/fi';
import { ClientOnlyPrice } from '@/components/ClientOnly';

const fallbackImage = '/images/placeholder.jpg';

interface LatestProductsProps {
  products?: any[];
  dictionary?: any;
  lang?: string;
}

const LatestProducts: React.FC<LatestProductsProps> = ({ products = [], dictionary, lang = 'cs' }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { locale, currency } = useLocale();
  const { countryCode, isLoading: geolocationLoading } = useGeolocation();
  
  console.log('LatestProducts - Geolocation:', { countryCode, geolocationLoading, locale, currency });

  // Rotácia produktov - 4 produkty, rotujúce každých 5 sekúnd
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [shuffleSeed, setShuffleSeed] = useState(Date.now());

  // Náhodne premiešané produkty s seed pre konzistentné poradie
  const shuffledProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    // Vytvoríme kópiu produktov a premiešame ich
    const productsCopy = [...products];
    const shuffled = [];
    
    // Použijeme seed pre konzistentné premiešanie
    let seed = shuffleSeed;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    while (productsCopy.length > 0) {
      const index = Math.floor(random() * productsCopy.length);
      shuffled.push(productsCopy.splice(index, 1)[0]);
    }
    
    return shuffled;
  }, [products, shuffleSeed]);

  // Rozdelenie produktov do skupín po 4
  const groupedProducts = useMemo(() => {
    const groups = [];
    for (let i = 0; i < shuffledProducts.length; i += 4) {
      groups.push(shuffledProducts.slice(i, i + 4));
    }
    return groups;
  }, [shuffledProducts]);

  // Rotácia každých 5 sekúnd
  useEffect(() => {
    if (groupedProducts.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentGroupIndex((prev) => (prev + 1) % groupedProducts.length);
    }, 5000); // 5 sekúnd

    return () => clearInterval(interval);
  }, [groupedProducts.length]);

  // Zmena seed každých 30 sekúnd pre nové poradie
  useEffect(() => {
    const interval = setInterval(() => {
      setShuffleSeed(Date.now());
    }, 30000); // 30 sekúnd

    return () => clearInterval(interval);
  }, []);

  // Aktuálne zobrazované produkty
  const currentProducts = groupedProducts[currentGroupIndex] || [];

  // Přepočítáme ceny produktů podle regionálnej cenovej politiky
  const productsWithConvertedPrices = useMemo(() => {
    return currentProducts.map(product => {
      let priceEur = product.price || product.variants?.[0]?.price || 0;
      
      // Fallback cena pre produkty bez cien
      if (priceEur === 0) {
        console.warn(`⚠️ PRODUCT WITHOUT PRICE: ${product.name} (ID: ${product.id}) - using fallback price`);
        priceEur = 15.99; // Fallback cena v EUR
      }
      
      console.log(`LatestProducts - Product ${product.name}: price=${product.price}, variantPrice=${product.variants?.[0]?.price}, finalPrice=${priceEur}`);
      
      // Použijeme regionálnu cenovú politiku podľa geolokácie
      const regionalPrice = getRegionalPrice(priceEur, countryCode);
      console.log(`LatestProducts - Regional price for ${product.name}: ${regionalPrice.price} ${regionalPrice.zone.currency} (country: ${countryCode})`);
      
      return {
        ...product,
        convertedPrice: regionalPrice.price, // Regionálna cena
        regionalPrice: regionalPrice
      };
    });
  }, [currentProducts, countryCode]);

  const handleAddToCart = (product: any) => {
    if (product.variants && product.variants.length > 0) {
      // Použijeme základnú cenu v EUR pre košík (regionálne úpravy sa aplikujú v useCart)
      const priceEur = product.price || product.variants?.[0]?.price || 0;
      console.log('LatestProducts - Adding to cart:', {
        name: product.name,
        basePrice: priceEur,
        countryCode,
        regionalPrice: product.convertedPrice
      });
      addToCart({
        variantId: product.variants[0].id,
        quantity: 1,
        name: product.name,
        price: priceEur, // Základná cena v EUR
        image: getProductImages(product).main,
        sourceCurrency: 'EUR'
      });
    }
  };

  // Čakáme na načítanie geolokácie, aby sme predišli hydration erroru
  if (geolocationLoading) {
    return <ProductPlaceholders dictionary={dictionary} currency={currency} />;
  }

  if (!products || products.length === 0) {
    return <ProductPlaceholders dictionary={dictionary} currency={currency} />;
  }

  return (
    <div className="relative">
      {/* Produkty s animáciou */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {productsWithConvertedPrices.map((product) => {
          return (
            <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
              {/* Wishlist tlačidlo */}
              <button
                onClick={() => isInWishlist(product.id) 
                  ? removeFromWishlist(product.id) 
                  : addToWishlist(product.id)
                }
                className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                aria-label={isInWishlist(product.id) ? 'Odobrať z obľúbených' : 'Pridať do obľúbených'}
              >
                <FiHeart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current text-red-500' : 'text-gray-400'}`} />
              </button>
              
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <Image
                  src={getProductImages(product).main}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== '/images/placeholder.jpg') {
                      target.src = '/images/placeholder.jpg';
                    }
                  }}
                />
              </div>
              
              <div className="p-4">
                <Link href={`/${lang}/products/${product.id}`}>
                  <h3 className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="mt-4 flex justify-between items-center">
                  {product.convertedPrice > 0 ? (
                            <span className="text-xl font-bold text-gray-800">
          {formatPriceForDisplay(product.convertedPrice, 'EUR', currency)}
        </span>
                  ) : (
                            <span className="text-xl font-bold text-gray-800">
          {formatPriceForDisplay(16, 'EUR', currency)} {/* Fallback cena pre testovanie */}
        </span>
                  )}
                  
                  <Button
                    onClick={() => handleAddToCart(product)}
                    variant={product.variants && product.variants.length > 0 ? "primary" : "secondary"}
                    size="sm"
                    disabled={!product.variants || product.variants.length === 0}
                  >
                    {dictionary?.product?.add_to_cart || "Do košíku"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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

interface ProductPlaceholdersProps {
  dictionary?: any;
  currency?: string;
}

const ProductPlaceholders: React.FC<ProductPlaceholdersProps> = ({ dictionary, currency = 'CZK' }) => {
  const placeholders = [
    { id: 'placeholder-1', name: 'Tričko "Minimalistický design"', price: 599, },
    { id: 'placeholder-2', name: 'Mikina "Urban Style"', price: 1299, },
    { id: 'placeholder-3', name: 'Plakát "Geometric Art"', price: 349, },
    { id: 'placeholder-4', name: 'Hrnek "Morning Coffee"', price: 299, },
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
              <ClientOnlyPrice className="text-xl font-bold text-gray-900">
                {formatPriceForDisplay(product.price, 'EUR', currency as any)}
              </ClientOnlyPrice>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                {dictionary?.product?.add_to_cart || "Do košíku"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestProducts;