'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/context/WishlistContext';
import { useLocale } from '@/context/LocaleContext';
import { formatPrice, convertCurrency } from '@/utils/currency';
import { getProductImages } from '@/utils/productImage';
import { Button, SelectionButton, QuantityButton } from '@/components/ui/Button';
import { FiHeart, FiX, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
import { getDictionary } from '@/lib/getDictionary';

interface Variant {
  id: string;
  name: string;
  size?: string | null;
  color?: string | null;
  price: number;
}

interface Design {
  id: string;
  name: string;
  previewUrl: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  designs: Design[];
  icon_cs?: string;
  icon_sk?: string;
  icon_en?: string;
  icon_de?: string;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currency, locale } = useLocale();
  const [dictionary, setDictionary] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  // Načtení dictionary pro aktuální jazyk
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dict = await getDictionary(locale);
        setDictionary(dict);
      } catch (error) {
        console.warn('Failed to load dictionary:', error);
      }
    };

    loadDictionary();
  }, [locale]);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0] || null);
      setQuantity(1);
      setCurrentImageIndex(0);
    }
  }, [product]);

  // Handle close animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!product || !isOpen) return null;

  const images = getProductImages(product);
  const priceEur = selectedVariant?.price || product.variants[0]?.price || 0;
  const priceConverted = convertCurrency(priceEur, currency);
  const isInWishlistState = isInWishlist(product.id);

  // Funkce pro překlad názvu produktu
  const getTranslatedProductName = () => {
    if (locale === 'cs') return product.name;
    
    const translations: { [key: string]: string } = {
      'sk': product.name,
      'en': product.name.replace('tričko', 't-shirt'),
      'de': product.name.replace('tričko', 'T-Shirt')
    };
    
    return translations[locale] || product.name;
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        price: selectedVariant.price,
        image: images.main,
        quantity
      });
      handleClose();
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlistState) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        variantId: selectedVariant?.id || '',
        name: product.name,
        price: priceEur,
        image: images.main
      });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.others.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.others.length - 1 : prev - 1
    );
  };

  const currentImage = currentImageIndex === 0 ? images.main : images.others[currentImageIndex - 1];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transition-all duration-200 ${
            isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {dictionary?.quick_view?.title || 'Rýchly náhľad'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              aria-label="Zavřít"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="relative">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={currentImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Navigation arrows */}
                  {images.others.length > 0 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <FiChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <FiChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Thumbnail navigation */}
                {images.others.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setCurrentImageIndex(0)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === 0 ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={images.main}
                        alt="Main"
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </button>
                    {images.others.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index + 1)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          currentImageIndex === index + 1 ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Image ${index + 1}`}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.icon_cs && (
                      <span 
                        className="mr-2" 
                        style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}
                      >
                        {product.icon_cs}
                      </span>
                    )}
                    {getTranslatedProductName()}
                  </h1>
                  <p className="text-2xl font-semibold text-green-600">
                    {formatPrice(priceConverted, currency)}
                  </p>
                </div>
                
                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {dictionary?.product?.description || 'Popis'}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
                
                {/* Variants */}
                {product.variants.length > 1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {dictionary?.product?.variants || 'Varianty'}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {product.variants.map((variant) => (
                        <SelectionButton
                          key={variant.id}
                          selected={selectedVariant?.id === variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className="text-sm"
                        >
                          {variant.name}
                        </SelectionButton>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Quantity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {dictionary?.product?.quantity || 'Množstvo'}
                  </h3>
                  <div className="flex items-center gap-4">
                    <QuantityButton
                      quantity={quantity}
                      onQuantityChange={setQuantity}
                      min={1}
                      max={99}
                    />
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant}
                    className="flex-1"
                  >
                    {dictionary?.product?.add_to_cart || 'Pridať do košíka'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleWishlistToggle}
                    className="px-4"
                  >
                    <FiHeart className={`w-5 h-5 ${isInWishlistState ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
                
                {/* View Full Details */}
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    onClick={handleClose}
                    className="w-full"
                  >
                    <FiEye className="w-4 h-4 mr-2" />
                    {dictionary?.quick_view?.view_full_details || 'Zobraziť úplné detaily'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
