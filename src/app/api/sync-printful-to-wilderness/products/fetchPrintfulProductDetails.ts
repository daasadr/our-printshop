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

export async function fetchPrintfulProductDetails(id: number, locale?: string): Promise<Result> {
  try {
    // Zkusíme přidat jazykový parametr, pokud je specifikován
    const url = locale 
      ? `https://api.printful.com/store/products/${id}?locale=${locale}`
      : `https://api.printful.com/store/products/${id}`;
    
    console.log(`Fetching Printful product details with URL: ${url}`);
    
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${PRINTFUL_API_KEY}` },
    });

    if (!res.ok)
      throw new Error(
        `Chyba při načítání detailu produktu z Printful ${url} l ${res.status} ${res.statusText}`
      );

    const data: ProductDetailApiResponse = await res.json();

    return data.result;
  } catch (error) {
    console.error(`Chyba při načítání detailu produktu s ID ${id}:`, error);
    throw error;
  }
}
