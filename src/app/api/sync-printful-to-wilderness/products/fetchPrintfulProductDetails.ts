import type { ProductDetailApiResponse, Result } from "./printfulProductDetail";

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

export type PrintfulVariant = {
  id: number;
  name: string;
  retail_price: string;
  sku: string;
  in_stock?: boolean;
  files?: Array<{ url?: string; type?: string }>;
};

export async function fetchPrintfulProductDetails(id: number): Promise<Result> {
  try {
    const res = await fetch(`https://api.printful.com/store/products/${id}`, {
      headers: { Authorization: `Bearer ${PRINTFUL_API_KEY}` },
    });

    if (!res.ok)
      throw new Error(
        `Chyba při načítání detailu produktu z Printful https://api.printful.com/store/products/${id} l ${PRINTFUL_API_KEY} l ${res.status} ${res.statusText}`
      );

    const data: ProductDetailApiResponse = await res.json();

    return data.result;
  } catch (error) {
    console.error(`Chyba při načítání detailu produktu s ID ${id}:`, error);
    throw error;
  }
}
