const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

export type PrintfulProduct = {
  id: number;
  name: string;
  thumbnail_url?: string;
  sync_product: { id: number; name: string; thumbnail_url?: string };
};

export async function fetchPrintfulProducts() {
  const res = await fetch('https://api.printful.com/store/products', {
    headers: { Authorization: `Bearer ${PRINTFUL_API_KEY}` },
  });
  if (!res.ok) throw new Error('Chyba při načítání produktů z Printful');
  const data = await res.json();
  return (data as any).result as PrintfulProduct[];
}
