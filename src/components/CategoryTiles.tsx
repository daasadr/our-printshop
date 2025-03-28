import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  displayName: string;
  imagePlaceholder: string;
  image?: string;
}

interface CategoryTilesProps {
  title?: string;
  showTitle?: boolean;
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
  categories = defaultCategories,
  className = ""
}) => {
  return (
    <div className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {showTitle && (
          <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.name}`} className="group">
              <div className="relative overflow-hidden rounded-lg aspect-square shadow-md hover:shadow-lg transition-all">
                <div className="absolute inset-0 bg-gray-200">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.displayName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                      {category.imagePlaceholder}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{category.displayName}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTiles;