import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  displayName: string;
  imagePlaceholder: string;
  image: string;
}

interface CategoryTilesProps {
  title?: string;
  showTitle?: boolean;
  titleClassName?: string;
  categories: Category[];
  className?: string;
}

const defaultCategories: Category[] = [
  {
    id: 'home-decor',
    name: 'home-decor',
    displayName: 'Domov a dekorace',
    imagePlaceholder: 'Domov',
    image: '/images/categories/home-decor.jpg'
  },
  {
    id: 'women',
    name: 'women',
    displayName: 'Stylově pro dámy',
    imagePlaceholder: 'Ženy',
    image: '/images/categories/women.jpg'
  },
  {
    id: 'men',
    name: 'men',
    displayName: 'Pánská kolekce',
    imagePlaceholder: 'Muži',
    image: '/images/categories/men.jpg'
  },
  {
    id: 'kids',
    name: 'kids',
    displayName: 'Pro malé objevitele',
    imagePlaceholder: 'Děti',
    image: '/images/categories/kids.jpg'
  }
];

const CategoryTiles: React.FC<CategoryTilesProps> = ({
  title = "Naše kategorie",
  showTitle = true,
  titleClassName = "",
  categories = defaultCategories,
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
            className="group relative rounded-lg overflow-hidden aspect-[4/3] bg-black/40 backdrop-blur-sm 
                     transition-transform hover:scale-105 hover:shadow-xl"
          >
            <Image
              src={category.image}
              alt={category.displayName}
              fill
              className="object-cover group-hover:opacity-75 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-xl font-semibold text-white">
                {category.displayName}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryTiles;