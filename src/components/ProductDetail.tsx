"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Product, Variant, Design } from '@/types/prisma';;
import { useCart } from '@/hooks/useCart';

interface ProductDetailProps {
  product: Product & {
    variants: Variant[];
    designs: Design[];
  };
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const currentVariant = product.variants.find(v => v.id === selectedVariant);
  
  const handleAddToCart = () => {
    if (!selectedVariant || !currentVariant) return;
    
    addToCart({
      variantId: selectedVariant,
      quantity,
      name: `${product.title} - ${currentVariant.name}`,
      price: currentVariant.price,
      image: product.designs[0]?.previewUrl || ''
    });
  };
  
  // Grupování variant podle barvy pro barevný výběr
  const colorVariants = product.variants.reduce<Record<string, Variant[]>>((acc, variant) => {
    const color = variant.color || 'default';
    if (!acc[color]) {
      acc[color] = [];
    }
    acc[color].push(variant);
    return acc;
  }, {});
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="rounded-lg overflow-hidden bg-gray-100 p-4">
        {product.designs.length > 0 && (
          <Image 
            src={product.designs[0].previewUrl}
            alt={product.title}
            width={600}
            height={600}
            className="w-full h-auto object-contain"
            priority
          />
        )}
      </div>
      
      <div>
        <h1 className="text-3xl font-bold mb-3">{product.title}</h1>
        <p className="text-gray-600 mb-6">{product.description}</p>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Barva</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(colorVariants).map(([color, variants]) => (
              <button
                key={color}
                onClick={() => setSelectedVariant(variants[0].id)}
                className={`w-8 h-8 rounded-full ${
                  variants.some(v => v.id === selectedVariant)
                    ? 'ring-2 ring-offset-2 ring-blue-500'
                    : 'ring-1 ring-gray-300'
                }`}
                style={{ 
                  backgroundColor: color === 'default' ? '#e5e7eb' : color,
                  border: color === 'white' ? '1px solid #e5e7eb' : 'none'
                }}
                title={color}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Velikost</h2>
          <div className="flex flex-wrap gap-2">
            {product.variants
              .filter(v => v.color === currentVariant?.color)
              .map(variant => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant.id)}
                  className={`px-4 py-2 border ${
                    selectedVariant === variant.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700'
                  } rounded-md`}
                >
                  {variant.size}
                </button>
              ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Množství</h2>
          <div className="flex items-center">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="px-3 py-1 border border-gray-300 rounded-l-md"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center border-y border-gray-300 py-1"
            />
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="px-3 py-1 border border-gray-300 rounded-r-md"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-2xl font-bold">
              {currentVariant ? `${currentVariant.price.toFixed(2)} Kč` : ''}
            </span>
            <span className="text-sm text-gray-500 ml-2">Včetně DPH</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Přidat do košíku
          </button>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-2">Detaily produktu</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Materiál: 100% bavlna</li>
            <li>Potisk: Digitální tisk vysoké kvality</li>
            <li>Výroba: Potisk na vyžádání, každý kus je originál</li>
            <li>Expedice: 2-5 pracovních dnů</li>
            <li>Doručení: 3-10 pracovních dnů</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;