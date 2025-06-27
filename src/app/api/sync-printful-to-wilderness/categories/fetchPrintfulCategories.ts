import { ApiResponse, Category } from "./printfulCategories";

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

export async function fetchPrintfulCategories(): Promise<Category[]> {
  /**
   * refactor - fetchPrintful
   */
  const res = await fetch("https://api.printful.com/categories", {
    headers: { Authorization: `Bearer ${PRINTFUL_API_KEY}` },
  });
  if (!res.ok) throw new Error("Chyba při načítání kategorií z Printful");

  const data: ApiResponse = await res.json();

  const categories = data.result.categories;

  return categories;
}
