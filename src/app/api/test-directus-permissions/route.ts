import { NextRequest, NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { readItems, readCollections } from '@directus/sdk';

export async function GET(request: NextRequest) {
  try {
    console.log("Testing Directus permissions...");

    // 1. Zkontrolujeme, jestli můžeme číst kolekce
    console.log("1. Testing collections read...");
    const collections = await directus.request(readCollections());
    console.log("Collections found:", collections.length);

    // 2. Zkontrolujeme, jestli app_users kolekce existuje
    const appUsersCollection = collections.find(col => col.collection === 'app_users');
    console.log("app_users collection exists:", !!appUsersCollection);

    if (!appUsersCollection) {
      return NextResponse.json({
        error: "Kolekce app_users neexistuje",
        collections: collections.map(col => col.collection)
      }, { status: 404 });
    }

    // 3. Zkusíme číst z app_users kolekce
    console.log("2. Testing app_users read...");
    const users = await directus.request(readItems('app_users', { limit: 1 }));
    console.log("Users read successfully:", users.length);

    return NextResponse.json({
      success: true,
      message: "Directus permissions test successful",
      collectionsCount: collections.length,
      appUsersExists: true,
      canReadUsers: true,
      usersCount: users.length
    });

  } catch (error) {
    console.error("Directus permissions test failed:", error);
    
    return NextResponse.json({
      error: "Directus permissions test failed",
      details: error instanceof Error ? error.message : "Neznámá chyba",
      collections: error instanceof Error && error.message.includes('collections') ? 'Cannot read collections' : 'Unknown'
    }, { status: 500 });
  }
} 