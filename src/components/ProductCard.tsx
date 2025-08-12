import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, convertCurrency } from '@/utils/currency';
import { getProductImages } from '@/utils/productImage';
import { useLocale } from '@/context/LocaleContext';
import { useWishlist } from '@/context/WishlistContext';
import { FiHeart, FiEye } from 'react-icons/fi';
import { useState } from 'react';
import QuickViewModal from './QuickViewModal';
import StockIndicator from './StockIndicator';
import ColorVariants from './ColorVariants';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { currency, locale } = useLocale();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedColorVariant, setSelectedColorVariant] = useState<string>('');
  
  const priceEur = product.variants[0]?.price || 0;
  const priceConverted = convertCurrency(priceEur, currency);
  const previewUrl = product.designs[0]?.previewUrl || '';
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

  // Simulate color variants from product variants
  const colorVariants = product.variants
    .filter(variant => variant.color)
    .map(variant => ({
      id: variant.id,
      name: variant.color || '',
      color: variant.color || '',
      hex: variant.color || ''
    }));

  // Determine stock status (simplified logic)
  const getStockStatus = () => {
    // This would be replaced with actual stock logic
    return 'on_demand' as const;
  };

  return (
    <>
      <Link href={`/products/${product.id}`} className="group">
        <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden transition-transform hover:scale-105 relative">
          {/* Action buttons */}
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            {/* Quick View button */}
            <button
              onClick={handleQuickView}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
              aria-label="Rýchly náhľad"
            >
              <FiEye className="w-5 h-5" />
            </button>
            
            {/* Wishlist button */}
            <button
              onClick={handleWishlistToggle}
              disabled={isWishlistLoading}
              className={`p-2 rounded-full transition-all duration-300 ${
                isInWishlistState 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              } ${isWishlistLoading ? 'opacity-50' : ''}`}
              aria-label={isInWishlistState ? 'Odobrať z obľúbených' : 'Pridať do obľúbených'}
            >
              <FiHeart className={`w-5 h-5 ${isInWishlistState ? 'fill-current' : ''}`} />
            </button>
          </div>
        
        <div className="relative aspect-square">
          <Image
            src={getProductImages(product).main}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            {product.icon_cs && (
              <span 
                className="mr-1" 
                style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}
              >
                {product.icon_cs}
              </span>
            )}
            {getTranslatedProductName()}
          </h3>
          {product.description && (
            <p className="text-sm text-gray-300 mb-2 line-clamp-2">
              {product.description}
            </p>
          )}
          <p className="text-green-200 font-medium">
            {formatPrice(priceConverted, currency)}
          </p>
          
          {/* Stock indicator */}
          <div className="mt-2">
            <StockIndicator 
              stockStatus={getStockStatus()} 
              className="text-xs"
            />
          </div>
          
          {/* Color variants */}
          {colorVariants.length > 1 && (
            <div className="mt-3">
              <ColorVariants
                variants={colorVariants}
                selectedVariant={selectedColorVariant}
                onVariantSelect={setSelectedColorVariant}
                className="text-xs"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
    
    {/* Quick View Modal */}
    <QuickViewModal
      product={product}
      isOpen={isQuickViewOpen}
      onClose={() => setIsQuickViewOpen(false)}
    />
    </>
  );
} 