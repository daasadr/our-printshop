import { NextRequest, NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { readMe, readItems } from '@directus/sdk';

export async function GET(request: NextRequest) {
  try {
    console.log("Testing token permissions...");

    // Test 1: Zkusíme získat informace o aktuálním uživateli
    console.log("1. Testing current user...");
    const me = await directus.request(readMe());
    console.log("Current user:", me);

    // Test 2: Zkusíme číst z app_users kolekce
    console.log("2. Testing app_users read...");
    const users = await directus.request(readItems('app_users', { limit: 1 }));
    console.log("Users read successfully:", users.length);

    return NextResponse.json({
      success: true,
      message: "Token permissions test successful",
      currentUser: me,
      canReadUsers: true,
      usersCount: users.length
    });

  } catch (error) {
    console.error("Token permissions test failed:", error);
    
    return NextResponse.json({
      error: "Token permissions test failed",
      details: error instanceof Error ? error.message : "Neznámá chyba",
      token: process.env.DIRECTUS_TOKEN ? `${process.env.DIRECTUS_TOKEN.substring(0, 10)}...` : 'NOT_SET'
    }, { status: 500 });
  }
} 