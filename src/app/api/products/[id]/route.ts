import { NextRequest, NextResponse } from 'next/server';
import { readProducts } from '@/lib/directus';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    console.log('Fetching product:', productId);

    // Načítaj všetky produkty z Directus (rovnako ako v /api/products)
    const products = await readProducts({
      fields: [
        '*',
        'variants.*',
        'designs.*',
        'main_category',
        'description_cs',
        'description_sk',
        'description_en',
        'description_de',
        'icon_cs',
        'icon_sk',
        'icon_en',
        'icon_de'
      ]
    });

    // Nájdi produkt podľa ID
    const product = products.find(p => p.id.toString() === productId || p.id === parseInt(productId));

    if (!product) {
      console.log('Product not found:', productId);
      return NextResponse.json(
        { error: 'Produkt nenalezen' },
        { status: 404 }
      );
    }

    console.log('Product found:', product.id, product.name);

    return NextResponse.json(product);

  } catch (error) {
    console.error('Error fetching product:', error);
    
    return NextResponse.json(
      { error: 'Chyba při načítání produktu' },
      { status: 500 }
    );
  }
} 