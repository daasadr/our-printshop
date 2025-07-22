import { NextResponse } from 'next/server';
import { fetchPrintfulProducts } from '../sync-printful-to-wilderness/products/fetchPrintfulProducts';

export async function GET() {
  try {
    console.log('Testing Printful products fetch...');
    
    const products = await fetchPrintfulProducts();
    
    console.log(`Fetched ${products.length} products from Printful`);
    
    // Najdeme produkt "Hero's Journey"
    const heroProduct = products.find(p => 
      p.name.toLowerCase().includes('hero') || 
      p.name.toLowerCase().includes('journey') ||
      p.name.toLowerCase().includes('canvas') ||
      p.name.toLowerCase().includes('shoes')
    );
    
    const result = {
      totalProducts: products.length,
      heroProductFound: !!heroProduct,
      heroProduct: heroProduct ? {
        id: heroProduct.id,
        name: heroProduct.name,
        thumbnail_url: heroProduct.thumbnail_url
      } : null,
      first5Products: products.slice(0, 5).map(p => ({
        id: p.id,
        name: p.name
      })),
      last5Products: products.slice(-5).map(p => ({
        id: p.id,
        name: p.name
      }))
    };
    
    console.log('Test result:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error testing Printful products:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 