import { readProducts } from '@/lib/directus';
import { ProductList } from '@/components/ProductList';
import { ProductWithRelations } from '@/types';

interface ProductsPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const params: any = {
    fields: [
      '*',
      'variants.*',
      'designs.*'
    ]
  };
  
  // Prozatím odstraníme filtrování podle kategorie, dokud nevyřešíme oprávnění
  // if (category) {
  //   params.filter = {
  //     'categories.category_id.slug': { _eq: category }
  //   };
  // }
  
  const response = await readProducts(params) as unknown as ProductWithRelations[];
  const products = Array.isArray(response) ? response : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {category ? `Produkty - ${category}` : 'Všechny produkty'}
      </h1>
      <ProductList products={products} />
    </div>
  );
} 