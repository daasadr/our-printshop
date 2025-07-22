import { NextResponse } from "next/server";
import { readProducts } from "@/lib/directus";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || searchParams.get('main_category'); // Podporuje oba parametry
    const limit = parseInt(searchParams.get('limit') || '1000', 10); // Vysoký limit pro všechny produkty
    const sort = searchParams.get('sort') || '-id'; // Změna na -id místo -date_created
    const params: any = {
      fields: [
        '*',
        'variants.*',
        'designs.*',
        'main_category' // Explicitně přidám main_category
      ],
      sort,
      limit: limit // Vždy nastavit limit
    };
    
    console.log('API Products - Request params:', { category, limit, sort });
    
    // Filtrování podle main_category
    if (category) {
      const SLUG_TO_MAIN_CATEGORY: Record<string, string> = {
        'men': 'men',
        'women': 'women',
        'kids': 'kids',
        'kids-youth-clothing': 'kids',
        'home-decor': 'home/decor',
        'accessories': 'home/decor',
        'unisex': 'unisex',
        'mens-clothing': 'men',
        'womens-clothing': 'women',
      };
      
      const mainCategory = SLUG_TO_MAIN_CATEGORY[category.toLowerCase()] || category;
      console.log('API Products - Category mapping:', { category, mainCategory });
      
      // Speciální logika pro men a women - zahrnout i unisex produkty
      if (mainCategory === 'men' || mainCategory === 'women') {
        params.filter = {
          _or: [
            { main_category: { _eq: mainCategory } },
            { main_category: { _eq: 'unisex' } }
          ]
        };
      } else {
        params.filter = {
          main_category: { _eq: mainCategory }
        };
      }
      
      console.log('API Products - Filter params:', params.filter);
    }
    
    const response = await readProducts(params);
    console.log('API Products - Response count:', response.length);
    
    // Debug: vypíšu main_category prvních 5 produktů
    if (response.length > 0) {
      console.log('API Products - First 5 products main_category:', 
        response.slice(0, 5).map(p => ({ id: p.id, name: p.name, main_category: p.main_category }))
      );
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}