import { ProductList } from '@/components/ProductList';
import { ProductWithRelations } from '@/types';

interface ProductsPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  
  console.log('ProductsPage - searchParams:', searchParams);
  console.log('ProductsPage - category:', category);
  
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
  
  const apiUrl = category 
    ? `${baseUrl}/api/products?category=${encodeURIComponent(category)}&limit=1000`
    : `${baseUrl}/api/products?limit=1000`;
  
  console.log('ProductsPage - apiUrl:', apiUrl);
  console.log('ProductsPage - isLocalhost:', isLocalhost);
  
  let products: ProductWithRelations[] = [];
  
  try {
    const response = await fetch(apiUrl, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.ok) {
      products = await response.json();
      console.log('ProductsPage - fetched products count:', products.length);
      console.log('ProductsPage - first 3 products:', products.slice(0, 3).map(p => ({ id: p.id, name: p.name, main_category: p.main_category })));
    } else {
      console.error('Failed to fetch products:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
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