import { ProductList } from '@/components/ProductList';
import CategoryTiles from '@/components/CategoryTiles';
import Pagination from '@/components/Pagination';
import { getCategories } from '@/lib/directus';
import { ProductWithRelations } from '@/types';

interface ProductsPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const page = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const productsPerPage = 12;
  
  console.log('ProductsPage - searchParams:', searchParams);
  console.log('ProductsPage - category:', category);
  console.log('ProductsPage - page:', page);
  
  // Načítání kategorií pro tiles
  const categories = await getCategories();
  
  // Načítání produktů z API endpoint
  // Automaticky detekuje prostředí a port
  const isLocalhost = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development';
  
  // Funkce pro testování portu
  const testPort = async (port: number): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:${port}/api/products?limit=1`, {
        method: 'HEAD',
        cache: 'no-store'
      });
      return response.ok;
    } catch {
      return false;
    }
  };
  
  // Automatická detekce portu
  let baseUrl;
  if (isLocalhost) {
    // Zkusíme porty 3000, 3001, 3002...
    let port = 3000;
    let foundPort = false;
    
    for (let i = 0; i < 5; i++) {
      if (await testPort(port)) {
        baseUrl = `http://localhost:${port}`;
        foundPort = true;
        console.log(`ProductsPage - Found server on port ${port}`);
        break;
      }
      port++;
    }
    
    if (!foundPort) {
      // Fallback na 3000
      baseUrl = 'http://localhost:3000';
      console.log('ProductsPage - Using fallback port 3000');
    }
  } else {
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://happywilderness.cz';
  }
  
  // Načítáme všechny produkty pro kategorii (bez limitu pro paginaci)
  const apiUrl = category 
    ? `${baseUrl}/api/products?category=${encodeURIComponent(category)}&limit=1000`
    : `${baseUrl}/api/products?limit=1000`;
  
  console.log('ProductsPage - apiUrl:', apiUrl);
  console.log('ProductsPage - isLocalhost:', isLocalhost);
  
  let allProducts: ProductWithRelations[] = [];
  
  try {
    const response = await fetch(apiUrl, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.ok) {
      allProducts = await response.json();
      console.log('ProductsPage - fetched all products count:', allProducts.length);
      console.log('ProductsPage - first 3 products:', allProducts.slice(0, 3).map(p => ({ id: p.id, name: p.name, main_category: p.main_category })));
    } else {
      console.error('Failed to fetch products:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  // Paginace
  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = allProducts.slice(startIndex, endIndex);

  console.log('ProductsPage - pagination:', {
    totalProducts,
    totalPages,
    currentPage: page,
    productsPerPage,
    startIndex,
    endIndex,
    currentProductsCount: currentProducts.length
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-amber-50 to-teal-50">
      {/* Kategorie tiles nahoře */}
      <div className="bg-gradient-to-br from-[#1a2a1b] via-[#3a4a3b] to-[#1a2a1b] text-white py-16">
        <CategoryTiles categories={categories} />
      </div>

      {/* Produkty s paginací */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {category ? `Produkty - ${category}` : 'Všechny produkty'}
          </h1>
          <div className="text-sm text-gray-600">
            Zobrazeno {startIndex + 1}-{Math.min(endIndex, totalProducts)} z {totalProducts} produktů
          </div>
        </div>
        
        {currentProducts.length > 0 ? (
          <>
            <ProductList products={currentProducts} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalProducts={totalProducts}
              productsPerPage={productsPerPage}
              category={category}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Žádné produkty nenalezeny</h3>
            <p className="text-gray-600">
              {category 
                ? `V kategorii "${category}" nebyly nalezeny žádné produkty.`
                : 'Momentálně nejsou k dispozici žádné produkty.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 