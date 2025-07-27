import { NextRequest, NextResponse } from "next/server";
import { readItems, updateItem } from "@directus/sdk";
import { directus } from "@/lib/directus";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({
        error: "Chybí ověřovací token"
      }, { status: 400 });
    }

    // Najít uživatele podle tokenu
    const users = await directus.request(
      readItems("users", {
        filter: {
          email_verification_token: { _eq: token },
          email_verified: { _eq: false }
        },
        limit: 1
      })
    );

    if (users.length === 0) {
      return NextResponse.json({
        error: "Neplatný nebo již použitý ověřovací token"
      }, { status: 400 });
    }

    const user = users[0];

    // Ověřit email a smazat token
    await directus.request(
      updateItem("users", user.id, {
        email_verified: true,
        email_verification_token: null
      })
    );

    return NextResponse.json({
      success: true,
      message: "Email byl úspěšně ověřen. Nyní se můžete přihlásit."
    });

  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({
      error: "Chyba při ověřování emailu"
    }, { status: 500 });
  }
} 