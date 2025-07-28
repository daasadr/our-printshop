import { NextRequest, NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { logout } from '@directus/sdk';

export async function POST(request: NextRequest) {
  try {
    console.log("Directus Auth logout API called");

    // Odhlášení pomocí Directus Auth
    await directus.request(logout());

    console.log("Directus Auth logout successful");

    return NextResponse.json({
      success: true,
      message: "Odhlášení úspěšné"
    });

  } catch (error) {
    console.error("Logout error details:", error);
    
    // I když se odhlášení nezdaří, vrátíme úspěch
    // protože token už může být neplatný
    return NextResponse.json({
      success: true,
      message: "Odhlášení dokončeno"
    });
  }
} 