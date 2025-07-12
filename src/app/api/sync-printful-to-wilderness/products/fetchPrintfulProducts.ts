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
    const res = await fetch(`https://api.printful.com/store/products?offset=${offset}&limit=${limit}`,
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
  } while (allProducts.length < total);

  return allProducts;
}
