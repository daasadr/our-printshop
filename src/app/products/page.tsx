import { readProducts } from '@/lib/directus';
import { ProductList } from '@/components/ProductList';
import { ProductWithRelations } from '@/types';

interface ProductsPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Mapa slugů na main_category hodnoty
const SLUG_TO_MAIN_CATEGORY: Record<string, string> = {
  'men': 'Men',
  'women': 'Women',
  'kids': 'Kids',
  'kids-youth-clothing': 'Kids',
  'home-decor': 'Home/Decor',
  'accessories': 'Home/Decor',
  'unisex': 'Unisex',
  'mens-clothing': 'Men',
  'womens-clothing': 'Women',
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const params: any = {
    fields: [
      '*',
      'variants.*',
      'designs.*'
    ]
  };
  
  const response = await readProducts(params) as unknown as ProductWithRelations[];
  let products = Array.isArray(response) ? response : [];

  // Filtrování podle main_category a unisex s mapou slugů
  if (category) {
    const mainCategory = SLUG_TO_MAIN_CATEGORY[category.toLowerCase()] || category;
    const normalizedMainCategory = mainCategory.toLowerCase();
    products = products.filter((product) => {
      const mainCat = (product.main_category || '').toLowerCase();
      if (normalizedMainCategory === 'men' || normalizedMainCategory === 'women') {
        return mainCat === normalizedMainCategory || mainCat === 'unisex';
      }
      return mainCat === normalizedMainCategory;
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {category ? `Produkty - ${category}` : 'Všechny produkty'}
      </h1>
      <ProductList products={products} />
    </div>
  );
} 