import { NextRequest, NextResponse } from "next/server";
import { directusPublic } from "@/lib/directus-public";
import { readItems } from '@directus/sdk';

export async function POST(request: NextRequest) {
  try {
    console.log("Testing if user exists...");
    
    const { email } = await request.json();
    console.log("Looking for user with email:", email);

    // Zkusíme najít uživatele pomocí Public role
    const users = await directusPublic.request(readItems('app_users', {
      filter: {
        email: { _eq: email }
      },
      limit: 10 // Zvýšíme limit, abychom viděli všechny uživatele
    }));

    console.log("Users found:", users.length);
    console.log("All users in database:", users.map(u => ({
      id: u.id,
      email: u.email,
      first_name: u.first_name,
      last_name: u.last_name,
      is_active: u.is_active,
      role: u.role,
      date_created: u.date_created
    })));

    if (users.length > 0) {
      console.log("User found:", {
        id: users[0].id,
        email: users[0].email,
        first_name: users[0].first_name,
        last_name: users[0].last_name,
        is_active: users[0].is_active,
        role: users[0].role,
        date_created: users[0].date_created
      });
    }

    return NextResponse.json({
      success: true,
      userExists: users.length > 0,
      userCount: users.length,
      allUsers: users.map(u => ({
        id: u.id,
        email: u.email,
        first_name: u.first_name,
        last_name: u.last_name,
        is_active: u.is_active,
        role: u.role,
        date_created: u.date_created
      })),
      user: users.length > 0 ? {
        id: users[0].id,
        email: users[0].email,
        first_name: users[0].first_name,
        last_name: users[0].last_name,
        is_active: users[0].is_active,
        role: users[0].role,
        date_created: users[0].date_created
      } : null
    });

  } catch (error) {
    console.error("Test user exists failed:", error);
    
    return NextResponse.json({
      error: "Test failed",
      details: error instanceof Error ? error.message : "Neznámá chyba"
    }, { status: 500 });
  }
} 