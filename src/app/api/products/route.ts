console.log('LOADING /api/products/route.ts - start');
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const PRINTFUL_API_URL = 'https://api.printful.com';
console.log('set PRINTFUL_API_KEY and PRINTFUL_API_URL');

// Fixné ceny dopravy pre SK
const SHIPPING_PRICES = {
  MIN: 5.99,
  MAX: 9.99
};
console.log('set SHIPPING_PRICES');

export async function GET(req: NextRequest) {
  console.log('HIT /api/products');
  try {
    const { searchParams } = new URL(req.url);
    const priceMin = searchParams.get('price_min');
    const priceMax = searchParams.get('price_max');
    const name = searchParams.get('name');
    const categoryId = searchParams.get('category');
    const color = searchParams.get('color');
    const size = searchParams.get('size');

    // 1. Zostav query na nájdenie produktov v našej DB podľa lokálnych filtrov
    const whereClause: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (categoryId) whereClause.categoryId = categoryId;

    const variantFilter: Prisma.VariantWhereInput = {};
    if (color) variantFilter.color = color;
    if (size) variantFilter.size = size;

    if (Object.keys(variantFilter).length > 0) {
      whereClause.variants = { some: variantFilter };
    }

    const localProducts = await prisma.product.findMany({
      where: whereClause,
      select: { printfulId: true },
    });
    
    const printfulProductIds = localProducts.map(p => p.printfulId);

    if (printfulProductIds.length === 0) {
      return NextResponse.json([]); // Žiadne produkty nevyhovujú DB filtrom
    }

    // 2. Získaj zoznam produktov z Printfulu podľa IDčiek
    const productListUrl = `${PRINTFUL_API_URL}/store/products?product_ids=${printfulProductIds.join(',')}`;
      
    const response = await fetch(productListUrl, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Chyba pri získavaní zoznamu produktov z Printful:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch product list from Printful' }, { status: response.status });
    }

    const data = await response.json();
    if (!data.result || !Array.isArray(data.result)) {
      return NextResponse.json([]);
    }

    // 3. Načítaj detaily produktov v dávkach
    const processItem = async (item: any) => {
      try {
        const detailRes = await fetch(`${PRINTFUL_API_URL}/store/products/${item.id}`, {
          headers: { 'Authorization': `Bearer ${PRINTFUL_API_KEY}` }
        });
        if (!detailRes.ok) return null;
        
        const detailData = await detailRes.json();
        const firstVariant = detailData.result?.sync_variants?.[0];
        if (!firstVariant) return null;

        return {
          id: item.id,
          name: item.name,
          image: item.thumbnail_url || '/placeholder.jpg',
          price: firstVariant?.retail_price ? parseFloat(firstVariant.retail_price) : null,
          currency: firstVariant?.currency || 'EUR',
          shippingPrice: SHIPPING_PRICES,
          printfulId: item.id.toString()
        };
      } catch (err) { return null; }
    };

    const productsWithDetails = [];
    for (let i = 0; i < data.result.length; i += 10) {
        const chunk = data.result.slice(i, i + 10);
        const chunkResults = await Promise.all(chunk.map(processItem));
        productsWithDetails.push(...chunkResults.filter(Boolean));
        if (i + 10 < data.result.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // 4. Aplikuj filtre na dáta z Printfulu (cena, názov)
    let filteredProducts = productsWithDetails;
    
    if (name) {
      filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (priceMin) {
      const min = parseFloat(priceMin);
      filteredProducts = filteredProducts.filter(p => p.price !== null && p.price >= min);
    }
    if (priceMax) {
      const max = parseFloat(priceMax);
      filteredProducts = filteredProducts.filter(p => p.price !== null && p.price <= max);
    }
    
    return NextResponse.json(filteredProducts);

  } catch (error) {
    console.error('Error fetching products from Printful:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}