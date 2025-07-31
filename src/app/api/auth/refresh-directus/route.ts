import { NextRequest, NextResponse } from "next/server";
import { jwtAuth } from "@/lib/jwt-auth";

export async function POST(request: NextRequest) {
  try {
    console.log("JWT Auth refresh API called");
    
    const { refresh_token } = await request.json();

    if (!refresh_token) {
      return NextResponse.json({
        error: "Refresh token je povinný"
      }, { status: 400 });
    }

    // Obnovíme token pomocí JWT Auth
    const result = await jwtAuth.refreshAccessToken(refresh_token);

    if (!result) {
      return NextResponse.json({
        error: "Neplatný refresh token"
      }, { status: 401 });
    }

    console.log("JWT Auth refresh successful");

    return NextResponse.json({
      success: true,
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hodin
    });

  } catch (error) {
    console.error("Refresh error details:", error);
    
    return NextResponse.json({ 
      error: "Neplatný refresh token", 
      details: error instanceof Error ? error.message : "Neznámá chyba" 
    }, { status: 401 });
  }
} 