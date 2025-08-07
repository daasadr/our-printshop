import { NextRequest, NextResponse } from 'next/server';
import { createDirectus, rest, staticToken, readItem } from '@directus/sdk';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL!)
  .with(staticToken(process.env.DIRECTUS_TOKEN!))
  .with(rest());

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    console.log('Fetching product:', productId);

    // Načítaj produkt z Directus
    const product = await directus.request(readItem('products', productId, {
      fields: [
        '*',
        'variants.id',
        'variants.name',
        'variants.size',
        'variants.color',
        'variants.price',
        'variants.is_active',
        'variants.sku',
        'designs.*',
        'description_cs',
        'description_sk',
        'description_en',
        'description_de',
        'name_cs',
        'name_sk',
        'name_en',
        'name_de'
      ]
    }));

    console.log('Product found:', product.id, product.name);

    return NextResponse.json(product);

  } catch (error) {
    console.error('Error fetching product:', error);
    
    if (error.message?.includes('not found') || error.message?.includes('404')) {
      return NextResponse.json(
        { error: 'Produkt nenalezen' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Chyba při načítání produktu' },
      { status: 500 }
    );
  }
} 