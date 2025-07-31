import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { readItems, readCollections } from "@directus/sdk";

export async function GET() {
  try {
    console.log("Testing Directus connection...");
    
    // Test 1: Ověření environment proměnných
    const hasDirectusUrl = !!process.env.NEXT_PUBLIC_DIRECTUS_URL;
    const hasDirectusToken = !!process.env.DIRECTUS_TOKEN;
    
    console.log("Environment variables:", {
      hasDirectusUrl,
      hasDirectusToken,
      directusUrl: process.env.NEXT_PUBLIC_DIRECTUS_URL
    });

    if (!hasDirectusUrl || !hasDirectusToken) {
      return NextResponse.json({
        error: "Missing Directus environment variables",
        hasDirectusUrl,
        hasDirectusToken
      }, { status: 500 });
    }

    // Test 2: Kontrola dostupných kolekcí
    console.log("Testing available collections...");
    
    try {
      const collections = await directus.request(readCollections());
      console.log("Available collections:", collections.map(c => c.collection));
      
      const hasUsersCollection = collections.some(c => c.collection === 'users');
      console.log("Has users collection:", hasUsersCollection);
      
      if (!hasUsersCollection) {
        return NextResponse.json({
          error: "Users collection does not exist",
          availableCollections: collections.map(c => c.collection),
          environment: {
            hasDirectusUrl,
            hasDirectusToken
          }
        }, { status: 500 });
      }
      
    } catch (collectionsError) {
      console.error("Collections test failed:", collectionsError);
      
      return NextResponse.json({
        error: "Cannot access collections - permission issue",
        details: collectionsError instanceof Error ? collectionsError.message : "Unknown error",
        environment: {
          hasDirectusUrl,
          hasDirectusToken
        }
      }, { status: 500 });
    }

    // Test 3: Pokus o načtení users kolekce
    console.log("Testing users collection access...");
    
    try {
      const users = await directus.request(
        readItems("users", {
          limit: 1,
          fields: ['id', 'email', 'name']
        })
      );
      
      console.log("Users collection test successful:", users.length, "users found");
      
      return NextResponse.json({
        success: true,
        message: "Directus connection successful",
        usersCount: users.length,
        environment: {
          hasDirectusUrl,
          hasDirectusToken
        },
        testResults: {
          collectionsAccess: "OK",
          usersCollection: "OK",
          usersFound: users.length
        }
      });
      
    } catch (usersError) {
      console.error("Users collection test failed:", usersError);
      
      return NextResponse.json({
        error: "Users collection access failed",
        details: usersError instanceof Error ? usersError.message : "Unknown error",
        environment: {
          hasDirectusUrl,
          hasDirectusToken
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Directus test error:", error);
    
    return NextResponse.json({
      error: "Directus test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 