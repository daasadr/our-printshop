import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { readMe } from '@directus/sdk';

export async function GET() {
  try {
    console.log("Testing Directus Auth connection...");
    
    // Test 1: Kontrola Directus URL a tokenu
    const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
    const directusToken = process.env.DIRECTUS_TOKEN;
    
    console.log("Directus URL:", directusUrl);
    console.log("Directus Token length:", directusToken?.length || 0);
    
    if (!directusUrl || !directusToken) {
      return NextResponse.json({
        error: "Chybí Directus URL nebo token",
        directusUrl: !!directusUrl,
        directusToken: !!directusToken
      }, { status: 500 });
    }

    // Test 2: Získání informací o aktuálním uživateli (admin token)
    try {
      const me = await directus.request(readMe());
      console.log("Current user (admin):", {
        id: me.id,
        email: me.email,
        role: me.role?.name,
        status: me.status
      });
    } catch (error) {
      console.error("Error reading current user:", error);
      return NextResponse.json({
        error: "Chyba při čtení aktuálního uživatele",
        details: error instanceof Error ? error.message : "Neznámá chyba"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Directus Auth test úspěšný",
      directusUrl,
      tokenLength: directusToken.length,
      adminUser: {
        hasAccess: true,
        message: "Admin token funguje správně"
      }
    });

  } catch (error) {
    console.error("Directus Auth test error:", error);
    
    return NextResponse.json({
      error: "Chyba při testování Directus Auth",
      details: error instanceof Error ? error.message : "Neznámá chyba"
    }, { status: 500 });
  }
} 