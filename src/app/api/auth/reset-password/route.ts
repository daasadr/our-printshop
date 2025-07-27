import { NextRequest, NextResponse } from "next/server";
import { readItems, updateItem } from "@directus/sdk";
import { directus } from "@/lib/directus";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({
        error: "Token a nové heslo jsou povinné"
      }, { status: 400 });
    }

    // Validace hesla
    if (password.length < 6) {
      return NextResponse.json({
        error: "Heslo musí mít alespoň 6 znaků"
      }, { status: 400 });
    }

    // Najít uživatele podle tokenu
    const users = await directus.request(
      readItems("users", {
        filter: {
          password_reset_token: { _eq: token },
          password_reset_expires: { _gt: new Date().toISOString() }
        },
        limit: 1
      })
    );

    if (users.length === 0) {
      return NextResponse.json({
        error: "Neplatný nebo vypršený reset token"
      }, { status: 400 });
    }

    const user = users[0];

    // Hashování nového hesla
    const hashedPassword = await bcrypt.hash(password, 12);

    // Aktualizace hesla a smazání tokenu
    await directus.request(
      updateItem("users", user.id, {
        password: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null
      })
    );

    return NextResponse.json({
      success: true,
      message: "Heslo bylo úspěšně změněno. Nyní se můžete přihlásit."
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({
      error: "Chyba při resetování hesla"
    }, { status: 500 });
  }
} 