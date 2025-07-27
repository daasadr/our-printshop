import { NextRequest, NextResponse } from "next/server";
import { readItems, updateItem } from "@directus/sdk";
import { directus } from "@/lib/directus";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({
        error: "Email je povinný"
      }, { status: 400 });
    }

    // Najít uživatele podle emailu
    const users = await directus.request(
      readItems("users", {
        filter: {
          email: { _eq: email },
          is_active: { _eq: true }
        },
        limit: 1
      })
    );

    if (users.length === 0) {
      // Pro bezpečnost vracíme stejnou zprávu i když uživatel neexistuje
      return NextResponse.json({
        success: true,
        message: "Pokud email existuje, obdržíte instrukce pro reset hesla."
      });
    }

    const user = users[0];

    // Generování reset tokenu
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hodina

    // Uložení reset tokenu
    await directus.request(
      updateItem("users", user.id, {
        password_reset_token: resetToken,
        password_reset_expires: resetExpires.toISOString()
      })
    );

    // TODO: Odeslání emailu s reset odkazem
    // Zde budeme později implementovat odeslání emailu s reset odkazem

    return NextResponse.json({
      success: true,
      message: "Pokud email existuje, obdržíte instrukce pro reset hesla."
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({
      error: "Chyba při zpracování žádosti"
    }, { status: 500 });
  }
} 