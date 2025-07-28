import { NextRequest, NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { refresh } from '@directus/sdk';

export async function POST(request: NextRequest) {
  try {
    console.log("Directus Auth refresh API called");
    
    const { refresh_token } = await request.json();

    if (!refresh_token) {
      return NextResponse.json({
        error: "Refresh token je povinný"
      }, { status: 400 });
    }

    // Refresh tokenu pomocí Directus Auth
    const response = await directus.request(refresh('json', refresh_token));

    console.log("Directus Auth refresh successful");

    return NextResponse.json({
      success: true,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
      expires: response.expires
    });

  } catch (error) {
    console.error("Refresh error details:", error);
    
    return NextResponse.json({ 
      error: "Neplatný refresh token", 
      details: error instanceof Error ? error.message : "Neznámá chyba" 
    }, { status: 401 });
  }
} 