import { readProducts } from '@/lib/directus';
import { ProductList } from '@/components/ProductList';
import { ProductWithRelations } from '@/types';

export default async function ProductsPage() {
  // Načtení produktů včetně kategorií, variant a mockup obrázků
  const response = await readProducts({
    fields: [
      '*',
      'categories.*',
      'variants.*',
      'designs.*'
    ]
  }) as unknown as ProductWithRelations[];

  // Pokud response není pole, použijeme prázdné pole
  const products = Array.isArray(response) ? response : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Produkty</h1>
      <ProductList products={products} />
    </div>
  );
} 