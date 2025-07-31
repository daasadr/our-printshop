import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { readItems } from '@directus/sdk';

export async function GET() {
  try {
    console.log("Testing collections existence...");
    
    // Seznam kolekcí k testování
    const collectionsToTest = [
      'users',
      'directus_users', 
      'custom_users',
      'app_users',
      'products',
      'variants',
      'cart',
      'cart_items'
    ];

    const results: Record<string, { exists: boolean; error?: string }> = {};

    for (const collectionName of collectionsToTest) {
      try {
        console.log(`Testing collection: ${collectionName}`);
        
        // Pokus o čtení z kolekce
        await directus.request(
          readItems(collectionName as any, {
            limit: 1
          })
        );
        
        results[collectionName] = { exists: true };
        console.log(`✅ ${collectionName} exists and is accessible`);
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        results[collectionName] = { exists: false, error: errorMsg };
        console.log(`❌ ${collectionName} error: ${errorMsg}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Collections test completed",
      results,
      summary: {
        availableCollections: Object.keys(results).filter(key => results[key].exists),
        totalTested: collectionsToTest.length
      }
    });

  } catch (error) {
    console.error("Collections test error:", error);
    
    return NextResponse.json({
      error: "Chyba při testování kolekcí",
      details: error instanceof Error ? error.message : "Neznámá chyba"
    }, { status: 500 });
  }
} 