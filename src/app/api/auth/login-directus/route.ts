import { NextRequest, NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { readItems } from '@directus/sdk';
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    console.log("App users collection login called");
    
    const { email, password } = await request.json();
    console.log("Login data:", { email, passwordLength: password?.length });

    // Validace vstupních dat
    if (!email || !password) {
      console.log("Validation failed - missing fields");
      return NextResponse.json({
        error: "Email a heslo jsou povinné"
      }, { status: 400 });
    }

    console.log("Looking up user in app_users collection...");

    // Najdeme uživatele v app_users kolekci
    const users = await directus.request(
      readItems('app_users', {
        filter: {
          email: { _eq: email },
          is_active: { _eq: true }
        },
        limit: 1
      })
    );

    if (users.length === 0) {
      console.log("User not found");
      return NextResponse.json({ error: "Neplatný email nebo heslo" }, { status: 401 });
    }

    const user = users[0];
    console.log("User found:", user.id);

    // Ověříme heslo
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log("Invalid password");
      return NextResponse.json({ error: "Neplatný email nebo heslo" }, { status: 401 });
    }

    console.log("Login successful for user:", user.id);

    // Vytvoříme jednoduchý token (v produkci byste měli použít JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    const refreshToken = Buffer.from(`${user.id}:refresh:${Date.now()}`).toString('base64');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hodin

    return NextResponse.json({
      success: true,
      message: "Přihlášení úspěšné",
      access_token: token,
      refresh_token: refreshToken,
      expires: expires,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });

  } catch (error) {
    console.error("Login error details:", error);
    
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      
      if (error.message.includes('Invalid user credentials')) {
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