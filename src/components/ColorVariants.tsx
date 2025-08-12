import React from 'react';

interface ColorVariant {
  id: string;
  name: string;
  color?: string;
}

interface ColorVariantsProps {
  variants: ColorVariant[];
  selectedVariant?: ColorVariant;
  onVariantSelect: (variant: ColorVariant) => void;
  className?: string;
}

export default function ColorVariants({ 
  variants, 
  selectedVariant, 
  onVariantSelect, 
  className = '' 
}: ColorVariantsProps) {
  // Extrahujeme unikátne farby z variantov
  const uniqueColors = variants
    .map(variant => variant.color)
    .filter((color, index, self) => color && self.indexOf(color) === index);

  if (uniqueColors.length <= 1) {
    return null; // Nezobrazujeme ak je len jedna farba
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-gray-600">Farba:</span>
      <div className="flex gap-1">
        {uniqueColors.map((color) => {
          const isSelected = selectedVariant?.color === color;
          return (
            <button
              key={color}
              onClick={() => {
                const variant = variants.find(v => v.color === color);
                if (variant) onVariantSelect(variant);
              }}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                isSelected 
                  ? 'border-gray-800 scale-110 shadow-md' 
                  : 'border-gray-300 hover:border-gray-500'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Farba: ${color}`}
            />
          );
        })}
      </div>
    </div>
  );
}
