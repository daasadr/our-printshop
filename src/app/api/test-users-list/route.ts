import { NextResponse } from 'next/server';
import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

export async function GET() {
  try {
    console.log("Testing users list...");
    
    try {
      // Zkusíme přečíst všechny uživatele
      const users = await directus.request(readItems('users', { 
        limit: 10,
        fields: ['id', 'email', 'name', 'first_name', 'last_name', 'status', 'is_active']
      }));
      
      console.log("Users found:", users.length);
      
      return NextResponse.json({ 
        success: true, 
        usersCount: users.length,
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          first_name: user.first_name,
          last_name: user.last_name,
          status: user.status,
          is_active: user.is_active
        }))
      });
    } catch (error) {
      console.log("Users list failed:", error);
      return NextResponse.json({ 
        success: false, 
        message: "Cannot access users collection",
        error: error instanceof Error ? error.message : "Unknown error"
      }, { status: 403 });
    }
    
  } catch (error) {
    console.error("Test failed:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
} 