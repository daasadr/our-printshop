import { NextResponse } from 'next/server';
import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

export async function GET() {
  try {
    console.log("Testing available collections...");
    
    const results: any = {};
    
    // Test různé kolekce
    const collections = ['products', 'variants', 'categories', 'users', 'cart', 'cart_items'];
    
    for (const collection of collections) {
      try {
        const items = await directus.request(readItems(collection, { limit: 1 }));
        results[collection] = { 
          accessible: true, 
          count: items.length,
          sample: items[0] ? { id: items[0].id } : null
        };
        console.log(`✅ ${collection}: accessible`);
      } catch (error) {
        results[collection] = { 
          accessible: false, 
          error: error instanceof Error ? error.message : "Unknown error"
        };
        console.log(`❌ ${collection}: not accessible - ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      collections: results,
      summary: {
        accessible: Object.values(results).filter((r: any) => r.accessible).length,
        total: collections.length
      }
    });
    
  } catch (error) {
    console.error("Test failed:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
} 