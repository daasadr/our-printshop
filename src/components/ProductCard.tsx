import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, convertCurrency } from '@/utils/currency';
import { getProductImages } from '@/utils/productImage';
import { useLocale } from '@/context/LocaleContext';
import { useWishlist } from '@/context/WishlistContext';
import { FiHeart } from 'react-icons/fi';
import { useState } from 'react';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { currency } = useLocale();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  
  const priceEur = product.variants[0]?.price || 0;
  const priceConverted = convertCurrency(priceEur, currency);
  const previewUrl = product.designs[0]?.previewUrl || '';
  const isInWishlistState = isInWishlist(product.id);
  
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

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden transition-transform hover:scale-105 relative">
        {/* Wishlist tlačidlo */}
        <button
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
            isInWishlistState 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
          } ${isWishlistLoading ? 'opacity-50' : ''}`}
          aria-label={isInWishlistState ? 'Odobrať z obľúbených' : 'Pridať do obľúbených'}
        >
          <FiHeart className={`w-5 h-5 ${isInWishlistState ? 'fill-current' : ''}`} />
        </button>
        
        <div className="relative aspect-square">
          <Image
            src={getProductImages(product).main}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
          <p className="text-green-200 font-medium">
            {formatPrice(priceConverted, currency)}
          </p>
        </div>
      </div>
    </Link>
  );
} 