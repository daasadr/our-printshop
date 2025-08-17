'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/context/WishlistContext';
import { useLocale } from '@/context/LocaleContext';
import { formatPrice, convertCurrency } from '@/utils/currency';
import { getProductImages } from '@/utils/productImage';
import { Button, SelectionButton, QuantityButton } from '@/components/ui/Button';
import { FiHeart } from 'react-icons/fi';
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
  name_cs?: string;
  name_sk?: string;
  name_en?: string;
  name_de?: string;
  description: string;
  design_info?: string;
  product_info?: string;
  variants: Variant[];
  designs: Design[];
  category?: string;
  icon_cs?: string;
  icon_sk?: string;
  icon_en?: string;
  icon_de?: string;
}

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currency, locale } = useLocale();
  const [dictionary, setDictionary] = useState<any>(null);

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
  
  // Debug logging
  console.log('ProductDetail - received product data:', {
    id: product.id,
    name: product.name,
    description: product.description,
    design_info: product.design_info,
    product_info: product.product_info,
    hasDesignInfo: !!product.design_info,
    hasProductInfo: !!product.product_info,
    designInfoLength: product.design_info?.length || 0,
    productInfoLength: product.product_info?.length || 0,
    variantsCount: product.variants?.length || 0,
    variants: product.variants?.map(v => ({
      id: v.id,
      name: v.name,
      size: v.size,
      color: v.color,
      price: v.price
    })) || []
  });

  // Přepočítáme ceny variant podle aktuální měny
  const convertedVariants = useMemo(() => {
    return product.variants.map(variant => ({
      ...variant,
      price: convertCurrency(variant.price, currency)
    }));
  }, [product.variants, currency]);
  
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    convertedVariants && convertedVariants.length > 0 ? convertedVariants[0] : null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    convertedVariants && convertedVariants.length > 0 && convertedVariants[0].size 
      ? convertedVariants[0].size 
      : null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    convertedVariants && convertedVariants.length > 0 && convertedVariants[0].color 
      ? convertedVariants[0].color 
      : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Aktualizujeme selectedVariant při změně měny
  React.useEffect(() => {
    if (convertedVariants && convertedVariants.length > 0) {
      const currentVariant = convertedVariants.find(v => 
        v.id === selectedVariant?.id
      );
      if (currentVariant) {
        setSelectedVariant(currentVariant);
      } else {
        setSelectedVariant(convertedVariants[0]);
      }
    }
  }, [convertedVariants, selectedVariant?.id, currency]);
  
  // Funkce pro získání dostupných velikostí
  const getAvailableSizes = () => {
    if (!convertedVariants || convertedVariants.length === 0) return [];
    
    const sizes = convertedVariants
      .filter(v => v.size)
      .map(v => v.size)
      .filter((size, index, self) => size && self.indexOf(size) === index);
    
    return sizes as string[];
  };
  
  // Funkce pro získání dostupných barev
  const getAvailableColors = () => {
    if (!convertedVariants || convertedVariants.length === 0) return [];
    
    const colors = convertedVariants
      .filter(v => v.color)
      .map(v => v.color)
      .filter((color, index, self) => color && self.indexOf(color) === index);
    
    return colors as string[];
  };
  
  // Funkce pro změnu množství
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1;
    setQuantity(newQuantity);
  };
  
  // Funkce pro změnu velikosti
  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    
    // Najdeme variantu, která odpovídá vybrané velikosti a barvě
    const variant = convertedVariants.find(v => 
      v.size === size && 
      (!selectedColor || v.color === selectedColor)
    );
    
    if (variant) {
      setSelectedVariant(variant);
      if (variant.color) setSelectedColor(variant.color);
    }
  };
  
  // Funkce pro změnu barvy
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    
    // Najdeme variantu, která odpovídá vybrané barvě a velikosti
    const variant = convertedVariants.find(v => 
      v.color === color && 
      (!selectedSize || v.size === selectedSize)
    );
    
    if (variant) {
      setSelectedVariant(variant);
      if (variant.size) setSelectedSize(variant.size);
    }
  };
  
  // Funkce pro přidání do košíku
  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    setIsAddingToCart(true);
    
    try {
      // Cena už je přepočítaná podle aktuální měny
      const priceInSelectedCurrency = selectedVariant.price;
      
      addToCart({
        variantId: selectedVariant.id,
        quantity,
        name: `${product.name} ${selectedSize ? `- ${selectedSize}` : ''} ${selectedColor ? `- ${selectedColor}` : ''}`,
        price: priceInSelectedCurrency,
        image: product.designs && product.designs.length > 0 ? (product.designs[0].previewUrl ?? '') : '',
        sourceCurrency: 'EUR'
      });
      
      // Zobrazíme potvrzení
      alert('Produkt byl přidán do košíku!');
    } catch (error) {
      console.error('Chyba při přidávání do košíku:', error);
      alert('Došlo k chybě při přidávání do košíku. Zkuste to prosím znovu.');
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  // Zobrazení náhledu produktu
  const previewImage = product.designs && product.designs.length > 0 
    ? product.designs[0].previewUrl 
    : null;
  
  // Dostupné velikosti a barvy
  const availableSizes = getAvailableSizes();
  const availableColors = getAvailableColors();
  
  // Zkontrolujeme, zda máme varianty
  const hasVariants = convertedVariants && convertedVariants.length > 0;
  
  const { main: mainImage, others: otherImages } = getProductImages(product);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Obrázek produktu */}
      <div className="rounded-lg overflow-hidden">
        {mainImage ? (
          <div className="relative aspect-square bg-white">
            <Image 
              src={mainImage} 
              alt={product.name} 
              fill
              className="object-contain"
              loader={({ src }) => src}
            />
          </div>
        ) : (
          <div className="aspect-square bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Obrázek není k dispozici</span>
          </div>
        )}
        {otherImages.length > 0 && (
          <div className="flex gap-2 mt-2">
            {otherImages.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border">
                <Image src={img} alt={product.name + ' mockup ' + (idx+1)} fill sizes="96px" className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Informace o produktu */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
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
        
        {/* Design info od návrháře */}
        {product.design_info && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-700 leading-relaxed">{product.design_info}</p>
          </div>
        )}
        
        {/* Základní popis produktu */}
        {product.description && (
          <div 
            className="prose prose-lg max-w-none"
          >
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}
        
        {/* Cena */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-500 pb-2">💰 {dictionary?.price || 'Cena'}</h2>
          <p className="text-2xl font-bold text-blue-600">
            {selectedVariant ? formatPrice(selectedVariant.price, currency) : dictionary?.product?.price_not_available || 'Není k dispozici'}
          </p>
        </div>
        
        {/* Velikosti */}
        {availableSizes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-500 pb-2">📏 {dictionary?.size || 'Velikost'}</h2>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => (
                <SelectionButton
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  selected={selectedSize === size}
                >
                  {size}
                </SelectionButton>
              ))}
            </div>
          </div>
        )}
        
        {/* Barvy */}
        {availableColors.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-500 pb-2">🎨 {dictionary?.color || 'Barva'}</h2>
            <div className="flex flex-wrap gap-2">
              {availableColors.map(color => (
                <SelectionButton
                  key={color}
                  onClick={() => handleColorChange(color)}
                  selected={selectedColor === color}
                >
                  {color}
                </SelectionButton>
              ))}
            </div>
          </div>
        )}
        
        {/* Množství */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-500 pb-2">📦 {dictionary?.cart?.quantity || 'Množství'}</h2>
          <div className="flex items-center border border-gray-300 rounded-md w-32">
            <QuantityButton
              onClick={() => handleQuantityChange(quantity - 1)}
              variant="default"
              size="md"
              className="border-r border-gray-300"
            >
              -
            </QuantityButton>
            <input
              type="number"
              value={quantity}
              onChange={e => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-16 h-10 text-center focus:outline-none text-lg font-medium text-gray-900 bg-white"
              min="1"
            />
            <QuantityButton
              onClick={() => handleQuantityChange(quantity + 1)}
              variant="default"
              size="md"
              className="border-l border-gray-300"
            >
              +
            </QuantityButton>
          </div>
        </div>
        
        {/* Tlačítka pro přidání do košíku a obľúbených */}
        <div className="mb-8 space-y-4">
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || isAddingToCart}
            variant={selectedVariant && !isAddingToCart ? "primary" : "secondary"}
            size="lg"
            width="full"
            state={isAddingToCart ? "loading" : "default"}
          >
            {isAddingToCart 
              ? (locale === 'sk' ? 'Pridávam...' : locale === 'en' ? 'Adding...' : locale === 'de' ? 'Hinzufügen...' : 'Přidávám...') 
              : (locale === 'sk' ? 'Pridať do košíka' : locale === 'en' ? 'Add to Cart' : locale === 'de' ? 'In den Warenkorb' : 'Přidat do košíku')
            }
          </Button>
          
          {/* Wishlist tlačidlo */}
          <Button
            onClick={() => {
              if (isInWishlist(product.id)) {
                removeFromWishlist(product.id);
              } else {
                addToWishlist({
                  productId: product.id,
                  variantId: selectedVariant?.id || product.variants[0]?.id || '',
                  name: product.name,
                  price: selectedVariant?.price || product.variants[0]?.price || 0,
                  image: product.designs && product.designs.length > 0 ? (product.designs[0].previewUrl ?? '') : ''
                });
              }
            }}
            variant={isInWishlist(product.id) ? "danger" : "secondary"}
            size="lg"
            width="full"
            className="flex items-center justify-center gap-2"
          >
            <FiHeart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            {isInWishlist(product.id) 
              ? (locale === 'sk' ? 'Odobrať z obľúbených' : locale === 'en' ? 'Remove from Wishlist' : locale === 'de' ? 'Aus Favoriten entfernen' : 'Odebrat z oblíbených') 
              : (locale === 'sk' ? 'Pridať do obľúbených' : locale === 'en' ? 'Add to Wishlist' : locale === 'de' ? 'Zu Favoriten hinzufügen' : 'Přidat do oblíbených')
            }
          </Button>
          
          {!hasVariants && (
            <p className="text-red-500 text-sm mt-2">
              Tento produkt nemá žádné varianty. Kontaktujte prosím správce obchodu.
            </p>
          )}
        </div>
        
        {/* Informace o produktu z Directus */}
        {product.product_info && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium mb-4">Informace o produktu</h2>
            <div className="text-gray-600 leading-relaxed">
              {product.product_info}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;