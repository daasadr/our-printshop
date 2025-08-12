import Link from 'next/link';
import Image from 'next/image';

// Přesné mapování slugů na obrázky
const placeholderImages: Record<string, string> = {
  'home-decor': '/images/home.jpg',
  'women': '/images/women.jpeg',
  'men': '/images/men.jpg',
  'kids': '/images/kids.jpeg',
  'unisex': '/images/unisex.jpg',
  'home': '/images/home.jpg',
  'decor': '/images/home.jpg',
  'kids-youth': '/images/kids.jpeg',
  'mens-clothing': '/images/men.jpg',
  'womens-clothing': '/images/women.jpeg',
  'kids-youth-clothing': '/images/kids.jpeg',
  'accessories': '/images/home.jpg',
};

function normalizeKey(str: string) {
  return str
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

interface CategoryTilesProps {
  categories?: any[];
  dictionary?: any;
  lang?: string;
}

const CategoryTiles = ({ categories = [], dictionary, lang = 'cs' }: CategoryTilesProps) => {
  
  // Default kategórie ak nie sú poskytnuté
  const defaultCategories = [
    { id: 1, name: 'Domov a dekorace', slug: 'home-decor' },
    { id: 2, name: 'Stylově pro dámy', slug: 'women' },
    { id: 3, name: 'Pánská kolekce', slug: 'men' },
    { id: 4, name: 'Pro malé objevitele', slug: 'kids' },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className={`container mx-auto px-4`}>
      <h2 className={`text-3xl font-bold text-center mb-6 text-white`}>
        {dictionary?.categories || "Naše kategorie"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayCategories.map((category) => {
          const slug = category.slug || normalizeKey(category.name || '');
          const imageSrc = placeholderImages[slug] || '/images/home.jpg';
          
          // Preklady pre kategórie
          const categoryName = category.name || '';
          const translatedName = dictionary?.[`category_${slug}`] || categoryName;
          
          return (
            <Link
              key={category.id}
              href={`/${lang}/products?category=${slug}`}
              className="group category-tile relative rounded-lg overflow-hidden aspect-[4/3] glass-card transition-all duration-500 hover:scale-105 hover-3d"
            >
              <Image
                src={imageSrc}
                alt={translatedName}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-6 transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                <h3 className="text-xl font-semibold text-white group-hover:text-green-300 transition-colors duration-300">
                  {translatedName.charAt(0).toUpperCase() + translatedName.slice(1)}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTiles;