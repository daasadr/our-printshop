import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, convertCurrency } from '@/utils/currency';
import { getRegionalPrice } from '@/utils/pricing';
import { getProductImages } from '@/utils/productImage';
import { useLocale } from '@/context/LocaleContext';
import { useWishlist } from '@/context/WishlistContext';
import { FiHeart, FiEye } from 'react-icons/fi';
import { useState } from 'react';
import StockIndicator from './StockIndicator';
import ColorVariants from './ColorVariants';
import QuickViewModal from './QuickViewModal';
import { ClientOnlyPrice } from './ClientOnly';

interface ProductCardProps {
  product: any;
  dictionary?: any;
}

export default function ProductCard({ product, dictionary }: ProductCardProps) {
  const { currency, locale } = useLocale();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedColorVariant, setSelectedColorVariant] = useState<any>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const priceEur = product.variants[0]?.price || 0;
  // Použijeme regionálnu cenovú politiku
  const regionalPrice = getRegionalPrice(priceEur, locale === 'de' ? 'DE' : locale === 'sk' ? 'SK' : 'CZ');
  const priceConverted = convertCurrency(regionalPrice.price, currency);
  const previewUrl = product.designs?.[0]?.previewUrl || '';
  const isInWishlistState = isInWishlist(product.id);

  // Funkce pro překlad názvu produktu
  const getTranslatedProductName = () => {
    if (locale === 'cs') return product.name;
    
    // Pro ostatní jazyky použijeme jednoduchý překlad
    const translations: { [key: string]: string } = {
      'sk': product.name, // Slovenčina používa rovnaký názov ako čeština
      'en': product.name.replace('tričko', 't-shirt'),
      'de': product.name.replace('tričko', 'T-Shirt')
    };
    
    return translations[locale] || product.name;
  };
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlistLoading) return;
    
    setIsWishlistLoading(true);
    
    if (isInWishlistState) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        variantId: product.variants[0]?.id || '',
        name: product.name,
        price: priceEur,
        image: previewUrl
      });
    }
    
    setTimeout(() => setIsWishlistLoading(false), 300);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  // Funkcia na určenie stavu skladu
  const getStockStatus = () => {
    // Pre Printful produkty - všetky sú "on demand"
    return 'on_demand' as const;
  };

  // Extrahujeme farby z variantov
  const colorVariants = product.variants?.filter((v: any) => v.color) || [];

  return (
    <Link href={`/${locale}/products/${product.id}`} className="group">
      <div className="relative glass-card rounded-lg overflow-hidden transition-all duration-500 hover:scale-105 hover-3d group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        {/* Action buttons */}
        <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleQuickView}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg"
            aria-label={locale === 'sk' ? 'Rýchly náhľad' : locale === 'en' ? 'Quick View' : locale === 'de' ? 'Schnellansicht' : 'Rychlý náhled'}
          >
            <FiEye className="w-5 h-5" />
          </button>
          <button
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg ${
              isInWishlistState 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            } ${isWishlistLoading ? 'opacity-50' : ''}`}
            aria-label={isInWishlistState 
              ? (locale === 'sk' ? 'Odobrať z obľúbených' : locale === 'en' ? 'Remove from Wishlist' : locale === 'de' ? 'Aus Favoriten entfernen' : 'Odebrat z oblíbených') 
              : (locale === 'sk' ? 'Pridať do obľúbených' : locale === 'en' ? 'Add to Wishlist' : locale === 'de' ? 'Zu Favoriten hinzufügen' : 'Přidat do oblíbených')
            }
          >
            <FiHeart className={`w-5 h-5 ${isInWishlistState ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className="relative aspect-square overflow-hidden">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-shimmer" />
          )}
          
          <Image
            src={getProductImages(product).main}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-300 transition-colors duration-300">
            {product.icon_cs && (
              <span 
                className="mr-1 transition-transform duration-300 group-hover:scale-110 inline-block" 
                style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}
              >
                {product.icon_cs}
              </span>
            )}
            {getTranslatedProductName()}
          </h3>
          
          {product.description && (
            <p className="text-sm text-gray-300 mb-2 line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
              {product.description}
            </p>
          )}
          
          {/* Stock indicator */}
          <div className="mt-2 transform transition-transform duration-300 group-hover:scale-105">
            <StockIndicator stockStatus={getStockStatus()} className="text-xs" />
          </div>
          
          {/* Color variants */}
          {colorVariants.length > 1 && (
            <div className="mt-3 transform transition-transform duration-300 group-hover:scale-105">
              <ColorVariants 
                variants={colorVariants} 
                selectedVariant={selectedColorVariant} 
                onVariantSelect={setSelectedColorVariant} 
                className="text-xs" 
              />
            </div>
          )}
          
          <ClientOnlyPrice className="text-green-400 font-bold mt-3 text-lg group-hover:text-green-300 transition-all duration-300 group-hover:scale-105">
            {formatPrice(priceConverted, currency)}
          </ClientOnlyPrice>
        </div>
        
        {/* Quick View Modal */}
        <QuickViewModal 
          product={product} 
          isOpen={isQuickViewOpen} 
          onClose={() => setIsQuickViewOpen(false)} 
        />
      </div>
    </Link>
  );
} 