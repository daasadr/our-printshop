import { NextResponse } from 'next/server';
import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

export async function GET() {
  try {
    console.log("Testing users collection access...");
    
    // Test 1: Zkusíme přečíst users kolekci
    try {
      const users = await directus.request(readItems('users', { limit: 1 }));
      console.log("Users collection access SUCCESS:", users);
      return NextResponse.json({ 
        success: true, 
        message: "Users collection accessible",
        usersCount: users.length 
      });
    } catch (error) {
      console.log("Users collection access FAILED:", error);
      return NextResponse.json({ 
        success: false, 
        message: "Users collection not accessible",
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