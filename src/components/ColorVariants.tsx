'use client';

import React from 'react';

interface ColorVariant {
  id: string;
  name: string;
  color: string;
  hex?: string;
}

interface ColorVariantsProps {
  variants: ColorVariant[];
  selectedVariant?: string;
  onVariantSelect: (variantId: string) => void;
  className?: string;
}

const ColorVariants: React.FC<ColorVariantsProps> = ({ 
  variants, 
  selectedVariant, 
  onVariantSelect, 
  className = '' 
}) => {
  if (!variants || variants.length <= 1) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700">Farba:</h4>
      <div className="flex gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onVariantSelect(variant.id)}
            className={`relative w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
              selectedVariant === variant.id
                ? 'border-gray-900 ring-2 ring-gray-300'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            style={{
              backgroundColor: variant.hex || variant.color,
              boxShadow: selectedVariant === variant.id ? '0 0 0 2px white, 0 0 0 4px #374151' : 'none'
            }}
            title={variant.name}
            aria-label={`Vybrať farbu: ${variant.name}`}
          >
            {selectedVariant === variant.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorVariants;
