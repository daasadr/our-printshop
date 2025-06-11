'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { readCategories } from '@/lib/directus';

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  displayName?: string;
  imagePlaceholder?: string;
}

interface CategoryTilesProps {
  categories: Category[];
  title?: string;
  showTitle?: boolean;
  titleClassName?: string;
  className?: string;
}

const placeholderImages: Record<string, string> = {
  'home-decor': '/images/categories/home-decor.jpg',
  'women': '/images/categories/women.jpg',
  'men': '/images/categories/men.jpg',
  'kids': '/images/categories/kids.jpg',
};

const CategoryTiles: React.FC<CategoryTilesProps> = ({
  categories,
  title = "Naše kategorie",
  showTitle = true,
  titleClassName = "",
  className = ""
}) => {
  return (
    <div className={`container mx-auto px-4 ${className}`}>
      {showTitle && (
        <h2 className={`text-3xl font-bold text-center mb-6 ${titleClassName}`}>{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.name}`}
            className="group relative rounded-lg overflow-hidden aspect-[4/3] bg-black/40 backdrop-blur-sm transition-transform hover:scale-105 hover:shadow-xl"
          >
            <Image
              src={category.image || placeholderImages[category.name] || '/images/placeholder.jpg'}
              alt={category.name}
              fill
              className="object-cover group-hover:opacity-75 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-xl font-semibold text-white">
                {(category.displayName || category.name.charAt(0).toUpperCase() + category.name.slice(1))}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryTiles;