import { NextRequest, NextResponse } from "next/server";
import { createItem, readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    console.log("Registration API called");
    
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

    console.log("Checking if user exists...");
    
    // Kontrola, zda uživatel již existuje
    const existingUsers = await directus.request(
      readItems("users", {
        filter: {
          email: { _eq: email }
        },
        limit: 1
      })
    );

    console.log("Existing users found:", existingUsers.length);

    if (existingUsers.length > 0) {
      console.log("User already exists");
      return NextResponse.json({
        error: "Uživatel s tímto emailem již existuje"
      }, { status: 409 });
    }

    console.log("Hashing password...");
    
    // Hashování hesla
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("Generating verification token...");
    
    // Generování ověřovacího tokenu
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    console.log("Creating user in Directus...");
    
    // Vytvoření nového uživatele
    const userData = {
      email,
      name,
      password: hashedPassword,
      email_verified: false,
      email_verification_token: emailVerificationToken,
      gdpr_consent: true,
      gdpr_consent_date: new Date().toISOString(),
      is_active: true
    };
    
    console.log("User data to create:", { ...userData, password: '[HIDDEN]' });

    const newUser = await directus.request(
      createItem("users", userData)
    );

    console.log("User created successfully:", newUser.id);

    // TODO: Odeslání ověřovacího emailu
    // Zde budeme později implementovat odeslání emailu s ověřovacím odkazem

    return NextResponse.json({
      success: true,
      message: "Uživatel byl úspěšně vytvořen. Zkontrolujte svůj email pro ověření.",
      userId: newUser.id
    });

  } catch (error) {
    console.error("Registration error details:", error);
    
    // Lepší error handling
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      // Kontrola specifických chyb
      if (error.message.includes('duplicate key')) {
        return NextResponse.json({
          error: "Uživatel s tímto emailem již existuje"
        }, { status: 409 });
      }
      
      if (error.message.includes('validation')) {
        return NextResponse.json({
          error: "Neplatná data - zkontrolujte vyplněné údaje"
        }, { status: 400 });
      }
    }
    
    return NextResponse.json({
      error: "Chyba při registraci uživatele",
      details: error instanceof Error ? error.message : "Neznámá chyba"
    }, { status: 500 });
  }
} 