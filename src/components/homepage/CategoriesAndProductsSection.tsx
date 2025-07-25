import LatestProducts from '@/components/LatestProducts';
import CategoryTiles from '@/components/CategoryTiles';

interface CategoriesAndProductsSectionProps {
  categories: any;
  products: any;
  dictionary: any;
  lang: string;
}

export default function CategoriesAndProductsSection({ 
  categories, 
  products, 
  dictionary, 
  lang 
}: CategoriesAndProductsSectionProps) {
  return (
    <div className="bg-gradient-to-br from-[#1a2a1b] via-[#3a4a3b] to-[#1a2a1b] text-white py-16">
      {/* Kategorie */}
      <div className="mb-24">
          <CategoryTiles categories={categories} dictionary={dictionary} lang={lang} />
      </div>

      {/* Nejnovější produkty */}
      <div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {dictionary.latest_products || "Nejnovější produkty"}
          </h2>
          <LatestProducts products={products} dictionary={dictionary} lang={lang} />
        </div>
      </div>
    </div>
  );
} 