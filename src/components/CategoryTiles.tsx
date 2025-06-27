import Link from 'next/link';
import Image from 'next/image';

// const placeholderImages: Record<string, string> = {
//   'home-decor': '/images/home.jpg',
//   'women': '/images/women.jpeg',
//   'men': '/images/men.jpg',
//   'kids': '/images/kids.jpeg',
//   'other': '/images/placeholder.jpg',
// };

const CategoryTiles = ({categories}) => {

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
              src={category.image_url}
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