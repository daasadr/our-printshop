import { NextResponse } from "next/server";
import { readProducts } from "@/lib/directus";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const params: any = {
      fields: [
        '*',
        'categories.category_id.*', // join na kategorie
        'variants.*'
      ]
    };
    if (category) {
      // Filtrujeme produkty, které mají přiřazenou danou kategorii
      params.filter = {
        'categories.category_id.name': { _eq: category }
      };
    }
    const response = await readProducts(params);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}