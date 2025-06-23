import { NextResponse } from "next/server";
import { readProducts } from "@/lib/directus";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '4', 10);
    const sort = searchParams.get('sort') || '-date_created';
    const params: any = {
      fields: [
        '*',
        'variants.*'
      ],
      limit,
      sort
    };
    
    // Prozatím odstraníme filtrování podle kategorie, dokud nevyřešíme oprávnění
    // if (category) {
    //   params.filter = {
    //     'categories.category_id.name': { _eq: category }
    //   };
    // }
    
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