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
    .replace(/['’]/g, '')
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const CategoryTiles = ({categories}) => {
  return (
    <div className={`container mx-auto px-4`}>
      <h2 className={`text-3xl font-bold text-center mb-6 text-white`}>Naše kategorie</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const slug = category.slug || normalizeKey(category.name || '');
          const imageSrc = placeholderImages[slug] || '/images/home.jpg';
          return (
            <Link
              key={category.id}
              href={`/products?category=${slug}`}
              className="group relative rounded-lg overflow-hidden aspect-[4/3] bg-black/40 backdrop-blur-sm transition-transform hover:scale-105 hover:shadow-xl"
            >
              <Image
                src={imageSrc}
                alt={category.name}
                fill
                className="object-cover group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-xl font-semibold text-white">
                  {(category.name.charAt(0).toUpperCase() + category.name.slice(1))}
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