const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

export type PrintfulProduct = {
  id: number;
  name: string;
  thumbnail_url?: string;
  sync_product: { id: number; name: string; thumbnail_url?: string };
};

export async function fetchPrintfulProducts() {
  let allProducts: PrintfulProduct[] = [];
  let offset = 0;
  const limit = 20;
  let total = 0;

  do {
    // Zkusíme načíst všechny produkty včetně draftů a skrytých
    const res = await fetch(`https://api.printful.com/store/products?offset=${offset}&limit=${limit}&status=all`,
      {
        headers: { Authorization: `Bearer ${PRINTFUL_API_KEY}` },
      }
    );
    if (!res.ok) throw new Error('Chyba při načítání produktů z Printful');
    const data = await res.json();
    const products = (data as any).result as PrintfulProduct[];
    allProducts = allProducts.concat(products);
    total = data.paging?.total || products.length;
    offset += limit;
    
    console.log(`Fetched ${products.length} products (offset: ${offset}, total: ${total})`);
  } while (allProducts.length < total);

  console.log(`Total products fetched: ${allProducts.length}`);
  
  // Logujeme všechny produkty pro debugging
  allProducts.forEach((product, index) => {
    console.log(`${index + 1}. ID: ${product.id}, Name: ${product.name}`);
  });

  return allProducts;
}
