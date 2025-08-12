import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiX, FiChevronLeft, FiChevronRight, FiHeart, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';
import { getProductImages } from '@/utils/productImage';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/Button';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  images: string[];
  variants?: Array<{
    id: string;
    name: string;
    color?: string;
    size?: string;
    price?: number;
  }>;
}

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const images = getProductImages(product.images);
  const isInWishlistState = isInWishlist(product.id);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setQuantity(1);
      // Auto-select first available size and color
      if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        setSelectedSize(firstVariant.size || '');
        setSelectedColor(firstVariant.color || '');
      }
    }
  }, [isOpen, product.variants]);

  const currentImage = images.others[currentImageIndex] || images.main;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < images.others.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : images.others.length - 1
    );
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(product.variants?.[0]?.id || product.id, quantity);
      onClose();
    } catch (error) {
      console.error('Chyba pri pridávaní do košíka:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    setIsAddingToWishlist(true);
    try {
      if (isInWishlistState) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist({
          productId: product.id,
          variantId: product.variants?.[0]?.id || product.id,
          name: product.name,
          price: product.price,
          image: images.main
        });
      }
    } catch (error) {
      console.error('Chyba pri práci s obľúbenými:', error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Extrahujeme dostupné veľkosti a farby
  const availableSizes = product.variants?.map(v => v.size).filter(Boolean) || [];
  const uniqueSizes = [...new Set(availableSizes)].filter(Boolean) as string[];
  
  const availableColors = product.variants?.map(v => v.color).filter(Boolean) || [];
  const uniqueColors = [...new Set(availableColors)].filter(Boolean) as string[];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Zatvoriť"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row">
            {/* Image Gallery */}
            <div className="lg:w-1/2 p-6">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image 
                  src={currentImage} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                />
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
              
              {/* Thumbnails */}
              {images.others.length > 0 && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setCurrentImageIndex(0)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === 0 ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <Image 
                      src={images.main} 
                      alt={product.name} 
                      fill 
                      className="object-cover"
                    />
                  </button>
                  {images.others.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <Image 
                        src={image} 
                        alt={product.name} 
                        fill 
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2 p-6">
              <div className="space-y-6">
                {/* Price */}
                <div className="text-2xl font-bold text-gray-900">
                  {product.price} {product.currency}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Size Selection */}
                {uniqueSizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Veľkosť
                    </label>
                    <div className="flex gap-2">
                      {uniqueSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border rounded-md transition-all ${
                            selectedSize === size
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {uniqueColors.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Farba
                    </label>
                    <div className="flex gap-2">
                      {uniqueColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            selectedColor === color
                              ? 'border-gray-800 scale-110'
                              : 'border-gray-300 hover:border-gray-500'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Farba: ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Množstvo
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    loading={isAddingToCart}
                    className="flex-1"
                  >
                    <FiShoppingCart className="w-4 h-4 mr-2" />
                    Pridať do košíka
                  </Button>
                  
                  <Button
                    onClick={handleWishlistToggle}
                    disabled={isAddingToWishlist}
                    variant="outline"
                    className="px-4"
                  >
                    <FiHeart className={`w-4 h-4 ${isInWishlistState ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
