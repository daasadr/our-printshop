import type { CatalogProductApiResponse } from "./printfulCatalogProduct";

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

export async function fetchPrintfulCatalogProduct(catalogProductId: number, locale?: string): Promise<any> {
  try {
    // Zkusíme přidat jazykový parametr, pokud je specifikován
    const url = locale 
      ? `https://api.printful.com/catalog/products/${catalogProductId}?locale=${locale}`
      : `https://api.printful.com/catalog/products/${catalogProductId}`;
    
    console.log(`Fetching Printful catalog product details with URL: ${url}`);
    
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${PRINTFUL_API_KEY}` },
    });

    if (!res.ok)
      throw new Error(
        `Chyba při načítání catalog detailu produktu z Printful ${url} - ${res.status} ${res.statusText}`
      );

    const data: CatalogProductApiResponse = await res.json();

    return data.result;
  } catch (error) {
    console.error(`Chyba při načítání catalog detailu produktu s ID ${catalogProductId}:`, error);
    throw error;
  }
} 