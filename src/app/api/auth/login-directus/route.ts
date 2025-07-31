import { NextRequest, NextResponse } from "next/server";
import { jwtAuth } from "@/lib/jwt-auth";

export async function POST(request: NextRequest) {
  try {
    console.log("JWT Auth login called");
    
    const { email, password } = await request.json();
    console.log("Login data:", { email, passwordLength: password?.length });

    // Validace vstupních dat
    if (!email || !password) {
      console.log("Validation failed - missing fields");
      return NextResponse.json({
        error: "Email a heslo jsou povinné"
      }, { status: 400 });
    }

    console.log("Authenticating user with JWT Auth...");

    // Přihlásíme uživatele pomocí JWT Auth
    const result = await jwtAuth.loginUser(email, password);

    console.log("Login successful for user:", result.user.id);

    return NextResponse.json({
      success: true,
      message: "Přihlášení úspěšné",
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hodin
      user: {
        id: result.user.id,
        email: result.user.email,
        first_name: result.user.first_name,
        last_name: result.user.last_name
      }
    });

  } catch (error) {
    console.error("Login error details:", error);
    
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      
      if (error.message.includes('Neplatný email nebo heslo')) {
        return NextResponse.json({ error: "Neplatný email nebo heslo" }, { status: 401 });
      }
      
      if (error.message.includes('User is not active')) {
        return NextResponse.json({ error: "Účet není aktivní" }, { status: 401 });
      }

      if (error.message.includes('User suspended')) {
        return NextResponse.json({ error: "Účet je pozastaven" }, { status: 401 });
      }

      if (error.message.includes('collection')) {
        return NextResponse.json({ error: "Kolekce app_users neexistuje - kontaktujte administrátora" }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      error: "Chyba při přihlašování", 
      details: error instanceof Error ? error.message : "Neznámá chyba" 
    }, { status: 500 });
  }
} 