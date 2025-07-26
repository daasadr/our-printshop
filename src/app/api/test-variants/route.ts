import { NextResponse } from 'next/server';
import { readProducts } from '@/lib/directus';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    console.log('Testing variants for product ID:', productId);

    const products = await readProducts({
      fields: [
        'id',
        'name',
        'variants.id',
        'variants.name',
        'variants.size',
        'variants.color',
        'variants.price',
        'variants.is_active',
        'variants.sku'
      ],
      filter: {
        id: { _eq: productId }
      },
      limit: 1
    });

    const product = products && products.length > 0 ? products[0] : null;

    console.log('Raw product data:', JSON.stringify(product, null, 2));

    return NextResponse.json({
      success: true,
      product: product,
      variantsCount: product?.variants?.length || 0,
      variants: product?.variants || []
    });

  } catch (error) {
    console.error('Error testing variants:', error);
    return NextResponse.json({ error: 'Failed to test variants' }, { status: 500 });
  }
} 