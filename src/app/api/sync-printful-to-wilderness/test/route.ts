import { NextRequest, NextResponse } from 'next/server';
import { directus } from '../directus';
import { readItems } from '@directus/sdk';
import { fetchPrintfulProducts } from "../products/fetchPrintfulProducts";

export async function GET(request: NextRequest) {
  try {
    console.log('Testing sync components...');
    
    // Test 1: Environment variables
    const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
    const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
    const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;
    
    console.log('Environment check:', {
      PRINTFUL_API_KEY: !!PRINTFUL_API_KEY,
      DIRECTUS_URL: !!DIRECTUS_URL,
      DIRECTUS_TOKEN: !!DIRECTUS_TOKEN
    });
    
    if (!PRINTFUL_API_KEY || !DIRECTUS_URL || !DIRECTUS_TOKEN) {
      return NextResponse.json({
        error: 'Missing environment variables',
        details: {
          PRINTFUL_API_KEY: !!PRINTFUL_API_KEY,
          DIRECTUS_URL: !!DIRECTUS_URL,
          DIRECTUS_TOKEN: !!DIRECTUS_TOKEN
        }
      }, { status: 500 });
    }
    
    // Test 2: Directus connection
    try {
      console.log('Testing Directus connection...');
      console.log('Directus configuration:', {
        url: DIRECTUS_URL,
        tokenExists: !!DIRECTUS_TOKEN,
        tokenLength: DIRECTUS_TOKEN ? DIRECTUS_TOKEN.length : 0,
        tokenPrefix: DIRECTUS_TOKEN ? DIRECTUS_TOKEN.substring(0, 10) + '...' : 'none'
      });
      
      // Test basic connection first
      try {
        const response = await fetch(`${DIRECTUS_URL}/server/info`, {
          headers: {
            'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Directus server info response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Directus server info error:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const serverInfo = await response.json();
        console.log('Directus server info:', serverInfo);
      } catch (fetchError) {
        console.error('Direct fetch to Directus failed:', fetchError);
        throw new Error(`Direct fetch failed: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`);
      }
      
      // Test SDK connection
      const categories = await directus.request(readItems('categories', { limit: 1 }));
      console.log('Directus SDK connection successful, found categories:', categories.length);
      
      // Test other collections
      try {
        const products = await directus.request(readItems('products', { limit: 1 }));
        console.log('Products collection test successful, found:', products.length);
      } catch (productError) {
        console.warn('Products collection test failed:', productError);
      }
      
      try {
        const variants = await directus.request(readItems('variants', { limit: 1 }));
        console.log('Variants collection test successful, found:', variants.length);
      } catch (variantError) {
        console.warn('Variants collection test failed:', variantError);
      }
      
    } catch (directusError) {
      console.error('Directus connection failed:', directusError);
      console.error('Error type:', typeof directusError);
      console.error('Error details:', {
        name: directusError?.name,
        message: directusError?.message,
        stack: directusError?.stack,
        response: directusError?.response,
        status: directusError?.status,
        statusText: directusError?.statusText
      });
      
      return NextResponse.json({
        error: 'Directus connection failed',
        details: {
          message: directusError instanceof Error ? directusError.message : String(directusError),
          type: typeof directusError,
          name: directusError?.name,
          stack: directusError?.stack,
          response: directusError?.response,
          status: directusError?.status,
          statusText: directusError?.statusText,
          config: {
            url: DIRECTUS_URL,
            tokenExists: !!DIRECTUS_TOKEN,
            tokenLength: DIRECTUS_TOKEN ? DIRECTUS_TOKEN.length : 0
          }
        }
      }, { status: 500 });
    }
    
    // Test 3: Printful API connection
    try {
      console.log('Testing Printful API connection...');
      const products = await fetchPrintfulProducts();
      console.log('Printful API connection successful, found products:', products.length);
      
      return NextResponse.json({
        success: true,
        tests: {
          environment: 'OK',
          directus: 'OK',
          printful: 'OK'
        },
        data: {
          printfulProducts: products.length,
          sampleProduct: products[0] || null
        }
      });
    } catch (printfulError) {
      console.error('Printful API connection failed:', printfulError);
      return NextResponse.json({
        error: 'Printful API connection failed',
        details: printfulError instanceof Error ? printfulError.message : String(printfulError)
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
