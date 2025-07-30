import { NextRequest, NextResponse } from 'next/server';
import { readProducts, translateProducts } from "@/lib/directus";

// Force dynamic rendering - don't generate static pages for this API
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'cs'; // Jazyk pre preklady
    
    const response = await readProducts({
      fields: [
        '*', 
        'variants.*'
        // Prekladové polia budú pridané neskôr: 'name_cs', 'name_sk', 'name_en', 'name_de', 'description_cs', 'description_sk', 'description_en', 'description_de'
      ],
      sort: ['-date_created'],
      limit: 8
    });
    
    // Preklad produktov podľa jazyka
    const translatedProducts = translateProducts(response, locale);
    
    return NextResponse.json(translatedProducts);
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest products' },
      { status: 500 }
    );
  }
}