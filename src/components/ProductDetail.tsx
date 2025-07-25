'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { formatPriceCZK, convertEurToCzkSync } from '@/utils/currency';
import { getProductImages } from '@/utils/productImage';
import { Button, SelectionButton, QuantityButton } from '@/components/ui/Button';

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
  design_info?: string;
  variants: Variant[];
  designs: Design[];
  category?: string;
}

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  // Debug logging
  console.log('ProductDetail - received product data:', {
    id: product.id,
    name: product.name,
    description: product.description,
    design_info: product.design_info,
    hasDesignInfo: !!product.design_info,
    designInfoLength: product.design_info?.length || 0
  });
  
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.variants && product.variants.length > 0 && product.variants[0].size 
      ? product.variants[0].size 
      : null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.variants && product.variants.length > 0 && product.variants[0].color 
      ? product.variants[0].color 
      : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Funkce pro získání dostupných velikostí
  const getAvailableSizes = () => {
    if (!product.variants || product.variants.length === 0) return [];
    
    const sizes = product.variants
      .filter(v => v.size)
      .map(v => v.size)
      .filter((size, index, self) => size && self.indexOf(size) === index);
    
    return sizes as string[];
  };
  
  // Funkce pro získání dostupných barev
  const getAvailableColors = () => {
    if (!product.variants || product.variants.length === 0) return [];
    
    const colors = product.variants
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
    const variant = product.variants.find(v => 
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
    const variant = product.variants.find(v => 
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
      // Převedeme cenu na CZK
      const priceInCzk = convertEurToCzkSync(selectedVariant.price);
      
      addToCart({
        variantId: selectedVariant.id,
        quantity,
        name: `${product.name} ${selectedSize ? `- ${selectedSize}` : ''} ${selectedColor ? `- ${selectedColor}` : ''}`,
        price: priceInCzk,
        image: product.designs && product.designs.length > 0 ? (product.designs[0].previewUrl ?? '') : ''
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
  const hasVariants = product.variants && product.variants.length > 0;
  
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
                <Image src={img} alt={product.name + ' mockup ' + (idx+1)} fill sizes="96px" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Informace o produktu */}
      <div>
        <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
        
        {/* Design info od návrháře */}
        {product.design_info && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-700 leading-relaxed">{product.design_info}</p>
          </div>
        )}
        
        {/* Základní popis produktu */}
        {product.description && (
          <p className="text-gray-600 mb-6">{product.description}</p>
        )}
        
        {/* Cena */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Cena</h2>
          <p className="text-2xl font-bold text-blue-600">
            {selectedVariant ? formatPriceCZK(selectedVariant.price) : 'Není k dispozici'}
          </p>
        </div>
        
        {/* Velikosti */}
        {availableSizes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Velikost</h2>
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
            <h2 className="text-lg font-medium mb-2">Barva</h2>
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
          <h2 className="text-lg font-medium mb-2">Množství</h2>
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
              className="w-12 h-10 text-center focus:outline-none"
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
        
        {/* Tlačítko pro přidání do košíku */}
        <div className="mb-8">
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || isAddingToCart}
            variant={selectedVariant && !isAddingToCart ? "primary" : "secondary"}
            size="lg"
            width="full"
            state={isAddingToCart ? "loading" : "default"}
          >
            {isAddingToCart ? 'Přidávám...' : 'Přidat do košíku'}
          </Button>
          
          {!hasVariants && (
            <p className="text-red-500 text-sm mt-2">
              Tento produkt nemá žádné varianty. Kontaktujte prosím správce obchodu.
            </p>
          )}
        </div>
        
        {/* Detaily produktu */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium mb-4">Detaily produktu</h2>
          <ul className="space-y-2 text-gray-600">
            <li><strong>Materiál:</strong> 100% bavlna</li>
            <li><strong>Potisk:</strong> Digitální tisk vysoké kvality</li>
            <li><strong>Výroba:</strong> Potisk na vyžádání, každý kus je originál</li>
            <li><strong>Expedice:</strong> 2-5 pracovních dnů</li>
            <li><strong>Doručení:</strong> 3-10 pracovních dnů</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;