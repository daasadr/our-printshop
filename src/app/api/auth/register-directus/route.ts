import { NextRequest, NextResponse } from "next/server";
import { jwtAuth } from "@/lib/jwt-auth";

export async function POST(request: NextRequest) {
  try {
    console.log("JWT Auth registration called");
    
    const { email, name, password, gdpr_consent } = await request.json();
    console.log("Registration data:", { email, name, gdpr_consent, passwordLength: password?.length });

    // Validace vstupních dat
    if (!email || !name || !password || !gdpr_consent) {
      console.log("Validation failed - missing fields");
      return NextResponse.json({
        error: "Všechna pole jsou povinná"
      }, { status: 400 });
    }

    // Validace emailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Validation failed - invalid email format");
      return NextResponse.json({
        error: "Neplatný formát emailu"
      }, { status: 400 });
    }

    // Validace hesla (minimálně 6 znaků)
    if (password.length < 6) {
      console.log("Validation failed - password too short");
      return NextResponse.json({
        error: "Heslo musí mít alespoň 6 znaků"
      }, { status: 400 });
    }

    console.log("Creating user with JWT Auth...");
    
    // Rozdělíme jméno na first_name a last_name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Registrujeme uživatele pomocí JWT Auth
    const result = await jwtAuth.registerUser({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      gdpr_consent
    });

    console.log("User created successfully with JWT:", result.user.id);

    return NextResponse.json({
      success: true,
      message: "Uživatel byl úspěšně vytvořen. Nyní se můžete přihlásit.",
      user: {
        id: result.user.id,
        email: result.user.email,
        first_name: result.user.first_name,
        last_name: result.user.last_name
      },
      access_token: result.accessToken,
      refresh_token: result.refreshToken
    });

  } catch (error) {
    console.error("Registration error details:", error);
    
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      
      if (error.message.includes('duplicate key') || error.message.includes('already exists')) {
        return NextResponse.json({ error: "Uživatel s tímto emailem již existuje" }, { status: 409 });
      }
      
      if (error.message.includes('validation')) {
        return NextResponse.json({ error: "Neplatná data - zkontrolujte vyplněné údaje" }, { status: 400 });
      }

      if (error.message.includes('role')) {
        return NextResponse.json({ error: "Chyba při nastavení role uživatele" }, { status: 400 });
      }

      if (error.message.includes('permission')) {
        return NextResponse.json({ error: "Chyba oprávnění - kontaktujte administrátora" }, { status: 403 });
      }

      if (error.message.includes('collection')) {
        return NextResponse.json({ error: "Kolekce app_users neexistuje - kontaktujte administrátora" }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      error: "Chyba při registraci uživatele", 
      details: error instanceof Error ? error.message : "Neznámá chyba" 
    }, { status: 500 });
  }
} 