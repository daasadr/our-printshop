import { NextResponse } from 'next/server';
import { directus } from '@/lib/directus';
import { readMe } from '@directus/sdk';

export async function GET() {
  try {
    console.log("Testing token role...");
    
    try {
      // Zkusíme získat informace o aktuálním uživateli/tokenu
      const me = await directus.request(readMe());
      console.log("Token info:", me);
      
      return NextResponse.json({ 
        success: true, 
        tokenInfo: me,
        message: "Token role retrieved successfully"
      });
    } catch (error) {
      console.log("Token role check failed:", error);
      return NextResponse.json({ 
        success: false, 
        message: "Token role check failed",
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