import Link from 'next/link';
import Image from 'next/image';
import { readItems } from '@directus/sdk';
import { directus } from '@/lib/directus';
import { Category } from '@/types';

const placeholderImages: Record<string, string> = {
  'home-decor': '/images/home.jpg',
  'women': '/images/women.jpeg',
  'men': '/images/men.jpg',
  'kids': '/images/kids.jpeg',
  'other': '/images/placeholder.jpg',
};

// Explicitně říkáme, že tato komponenta se má VŽDY renderovat dynamicky a brát čerstvá data
export const dynamic = 'force-dynamic';

const CategoryTiles = async () => {
  let categories: Category[] = [];
  try {
    // Používáme přímo funkci z directus.ts, žádné API
    const response = await directus.request(readItems('categories', {
      fields: ['id', 'name', 'slug'],
      limit: 4,
    }));
    // Ujistíme se, že response je pole
    if(Array.isArray(response)){
      categories = response as Category[];
    }
  } catch (error) {
    console.error("FINÁLNÍ CHYBA PŘI NAČÍTÁNÍ KATEGORIÍ:", error);
    // V případě chyby se komponenta nevykreslí, aby nepadala celá stránka.
    return null;
  }

  return (
    <div className={`container mx-auto px-4`}>
      <h2 className={`text-3xl font-bold text-center mb-6 text-white`}>Naše kategorie</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug || category.name}`}
            className="group relative rounded-lg overflow-hidden aspect-[4/3] bg-black/40 backdrop-blur-sm transition-transform hover:scale-105 hover:shadow-xl"
          >
            <Image
              src={placeholderImages[category.slug || 'other']}
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
        ))}
      </div>
    </div>
  );
};

export default CategoryTiles;