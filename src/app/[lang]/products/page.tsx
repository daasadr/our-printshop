import { ProductList } from '@/components/ProductList';
import CategoryTiles from '@/components/CategoryTiles';
import Pagination from '@/components/Pagination';
import ProductFilter from '@/components/ProductFilter';
import { ProductListSkeleton } from '@/components/ProductListSkeleton';
import { PageTransition } from '@/components/PageTransition';
import { getCategories } from '@/lib/directus';
import { getDictionary } from '@/lib/getDictionary';
import { ProductWithRelations } from '@/types';

interface ProductsPageProps {
  params: {
    lang: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const page = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const productsPerPage = 12;
  
  // Nové filtre
  const search = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
  const priceFrom = typeof searchParams?.priceFrom === 'string' ? searchParams.priceFrom : undefined;
  const priceTo = typeof searchParams?.priceTo === 'string' ? searchParams.priceTo : undefined;
  const sortBy = typeof searchParams?.sortBy === 'string' ? searchParams.sortBy : undefined;
  
  console.log('ProductsPage - searchParams:', searchParams);
  console.log('ProductsPage - category:', category);
  console.log('ProductsPage - page:', page);
  console.log('ProductsPage - filters:', { search, priceFrom, priceTo, sortBy });
  
  // Načítání kategorií pro tiles a filtry
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
  
  // Vytvorenie URL s filtrami
  const apiParams = new URLSearchParams();
  apiParams.set('limit', '1000');
  apiParams.set('locale', lang);
  
  if (category) apiParams.set('category', category);
  if (search) apiParams.set('search', search);
  if (priceFrom) apiParams.set('priceFrom', priceFrom);
  if (priceTo) apiParams.set('priceTo', priceTo);
  if (sortBy) apiParams.set('sortBy', sortBy);
  
  const apiUrl = `${baseUrl}/api/products?${apiParams.toString()}`;
  
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
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-amber-50 to-teal-50">
        {/* Kategorie tiles nahoře */}
        <div className="bg-gradient-to-br from-[#1a2a1b] via-[#3a4a3b] to-[#1a2a1b] text-white py-16">
          <CategoryTiles categories={categories} />
        </div>

        {/* Produkty s filtry a paginací */}
        <div className="container mx-auto px-4 py-8">
          {/* Filter komponent */}
          <ProductFilter categories={categories} dictionary={dict} />
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {category ? `${dict.products?.title || 'Produkty'} - ${category}` : dict.products?.all_products || 'Všechny produkty'}
            </h1>
            <div className="text-sm text-gray-600">
              {dict.products?.showing || 'Zobrazeno'} {startIndex + 1}-{Math.min(endIndex, totalProducts)} {dict.products?.of || 'z'} {totalProducts} {dict.products?.products || 'produktů'}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {dict.products?.no_products_found || 'Žádné produkty nenalezeny'}
              </h3>
              <p className="text-gray-600">
                {category 
                  ? `${dict.products?.no_products_in_category || 'V kategorii'} "${category}" ${dict.products?.no_products_found_in_category || 'nebyly nalezeny žádné produkty.'}`
                  : dict.products?.no_products_available || 'Momentálně nejsou k dispozici žádné produkty.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
} 