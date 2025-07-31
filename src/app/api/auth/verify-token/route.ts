import { NextRequest, NextResponse } from "next/server";
import { jwtAuth } from "@/lib/jwt-auth";

export async function POST(request: NextRequest) {
  try {
    console.log("JWT Auth verify token API called");
    
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ 
        error: "Token je povinný" 
      }, { status: 400 });
    }

    console.log("Verifying token...");
    
    // Ověříme token pomocí JWT Auth
    const payload = jwtAuth.verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ 
        error: "Neplatný token" 
      }, { status: 401 });
    }

    // Získáme uživatele z databáze
    const user = await jwtAuth.getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ 
        error: "Uživatel nebyl nalezen" 
      }, { status: 404 });
    }

    console.log("Token verification successful for user:", user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Token verification error:", error);
    
    return NextResponse.json({ 
      error: "Chyba při ověření tokenu",
      details: error instanceof Error ? error.message : "Neznámá chyba"
    }, { status: 500 });
  }
} 