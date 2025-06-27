import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Directus connection only...');
    
    // Check environment variables
    const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
    const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;
    
    console.log('Environment variables:', {
      DIRECTUS_URL: DIRECTUS_URL || 'MISSING',
      DIRECTUS_TOKEN: DIRECTUS_TOKEN ? `${DIRECTUS_TOKEN.substring(0, 10)}...` : 'MISSING',
      DIRECTUS_TOKEN_LENGTH: DIRECTUS_TOKEN ? DIRECTUS_TOKEN.length : 0
    });
    
    if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
      return NextResponse.json({
        error: 'Missing environment variables',
        details: {
          DIRECTUS_URL: !!DIRECTUS_URL,
          DIRECTUS_TOKEN: !!DIRECTUS_TOKEN
        }
      }, { status: 500 });
    }
    
    // Test 1: Raw fetch to Directus
    console.log('Testing raw fetch to Directus...');
    try {
      const response = await fetch(`${DIRECTUS_URL}/server/info`);
      console.log('Raw fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Server info:', data);
      } else {
        const errorText = await response.text();
        console.log('Raw fetch error response:', errorText);
      }
    } catch (fetchError) {
      console.error('Raw fetch failed:', fetchError);
      return NextResponse.json({
        error: 'Raw fetch to Directus failed',
        details: {
          message: fetchError instanceof Error ? fetchError.message : String(fetchError),
          url: `${DIRECTUS_URL}/server/info`
        }
      }, { status: 500 });
    }
    
    // Test 2: Authenticated fetch
    console.log('Testing authenticated fetch...');
    try {
      const response = await fetch(`${DIRECTUS_URL}/items/categories?limit=1`, {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Authenticated fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Categories data:', data);
        
        return NextResponse.json({
          success: true,
          message: 'Directus connection successful',
          data: {
            serverReachable: true,
            authenticationWorking: true,
            categoriesCollection: data
          }
        });
      } else {
        const errorText = await response.text();
        console.log('Auth fetch error response:', errorText);
        
        return NextResponse.json({
          error: 'Authenticated request failed',
          details: {
            status: response.status,
            statusText: response.statusText,
            response: errorText,
            url: `${DIRECTUS_URL}/items/categories`
          }
        }, { status: 500 });
      }
    } catch (authError) {
      console.error('Authenticated fetch failed:', authError);
      return NextResponse.json({
        error: 'Authenticated fetch failed',
        details: {
          message: authError instanceof Error ? authError.message : String(authError),
          url: `${DIRECTUS_URL}/items/categories`
        }
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Directus test failed:', error);
    return NextResponse.json({
      error: 'Directus test failed',
      details: {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
}
