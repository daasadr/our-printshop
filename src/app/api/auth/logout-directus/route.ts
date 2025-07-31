import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("JWT Auth logout API called");

    // Získáme refresh token z requestu (pokud existuje)
    const { refresh_token } = await request.json();

    console.log("Logout request received");

    // Vytvoříme response s vyčištěnými cookies
    const response = NextResponse.json({
      success: true,
      message: "Odhlášení úspěšné"
    });

    // Vyčistíme všechny autentifikační cookies
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('user_data');
    response.cookies.delete('auth_token');
    
    // Vyčistíme také NextAuth cookies (pro případ, že by byly použity)
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('next-auth.callback-url');
    response.cookies.delete('_Host-next-auth.csrf-token');
    response.cookies.delete('_Secure-next-auth.session-token');

    console.log("JWT Auth logout successful - cookies cleared");

    return response;

  } catch (error) {
    console.error("Logout error details:", error);
    
    // I když se logout nezdaří, vrátíme úspěch
    // protože token už může být neplatný
    const response = NextResponse.json({
      success: true,
      message: "Odhlášení dokončeno"
    });

    // Stále vyčistíme cookies
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('user_data');
    response.cookies.delete('auth_token');
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('next-auth.callback-url');
    response.cookies.delete('_Host-next-auth.csrf-token');
    response.cookies.delete('_Secure-next-auth.session-token');

    return response;
  }
}

// GET endpoint pro případ, že by někdo volal logout přes GET
export async function GET(request: NextRequest) {
  try {
    console.log("JWT Auth logout GET API called");

    const response = NextResponse.json({
      success: true,
      message: "Odhlášení úspěšné"
    });

    // Vyčistíme všechny autentifikační cookies
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('user_data');
    response.cookies.delete('auth_token');
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('next-auth.callback-url');
    response.cookies.delete('_Host-next-auth.csrf-token');
    response.cookies.delete('_Secure-next-auth.session-token');

    console.log("JWT Auth logout GET successful - cookies cleared");

    return response;

  } catch (error) {
    console.error("Logout GET error:", error);
    
    const response = NextResponse.json({
      success: true,
      message: "Odhlášení dokončeno"
    });

    // Stále vyčistíme cookies
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    response.cookies.delete('user_data');
    response.cookies.delete('auth_token');
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('next-auth.callback-url');
    response.cookies.delete('_Host-next-auth.csrf-token');
    response.cookies.delete('_Secure-next-auth.session-token');

    return response;
  }
} 