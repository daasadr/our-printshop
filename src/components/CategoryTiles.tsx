"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

interface Category {
  id: string;
  name: string;
  imagePlaceholder: string;
  image: string;
}

interface CategoryTilesProps {
  showTitle?: boolean;
  titleClassName?: string;
  categories: Category[];
  className?: string;
}

const defaultCategories: Category[] = [
  {
    id: 'home-decor',
    name: 'home-decor',
    imagePlaceholder: 'Domov',
    image: '/images/home.jpg'
  },
  {
    id: 'women',
    name: 'women',
    imagePlaceholder: 'Ženy',
    image: '/images/women.jpeg'
  },
  {
    id: 'men',
    name: 'men',
    imagePlaceholder: 'Muži',
    image: '/images/men.jpg'
  },
  {
    id: 'kids',
    name: 'kids',
    imagePlaceholder: 'Děti',
    image: '/images/kids.jpeg'
  }
];

const CategoryTiles: React.FC<CategoryTilesProps> = ({
  showTitle = true,
  titleClassName = "",
  categories = defaultCategories,
  className = ""
}) => {
  const { t } = useTranslation('common');

  return (
    <div className={`container mx-auto px-4 ${className}`}>
      {showTitle && (
        <h2 className={`text-3xl font-bold text-center mb-6 ${titleClassName}`}>
          {t('categories')}
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.name}`}
            className="group relative rounded-lg overflow-hidden aspect-[4/3] bg-black/40 backdrop-blur-sm 
                     transition-transform hover:scale-105 hover:shadow-xl"
          >
            <Image
              src={category.image}
              alt={t(`category_${category.name}`)}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:opacity-75 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-xl font-semibold text-white">
                {t(`category_${category.name}`)}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryTiles;