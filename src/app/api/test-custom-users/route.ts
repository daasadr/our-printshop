import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { readItems, createItem } from '@directus/sdk';

export async function GET() {
  try {
    console.log("Testing app_users collection...");
    
    const results = {
      collectionExists: false,
      canRead: false,
      canCreate: false,
      canDelete: false,
      errors: [] as string[]
    };

    // Test 1: Kontrola existence kolekce a čtení
    try {
      const users = await directus.request(
        readItems('app_users', {
          limit: 1
        })
      );
      results.collectionExists = true;
      results.canRead = true;
      console.log("✅ app_users collection exists and can be read");
    } catch (error) {
      results.collectionExists = false;
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      results.errors.push(`Read error: ${errorMsg}`);
      console.log("❌ app_users collection error:", errorMsg);
    }

    // Test 2: Vytvoření testovacího uživatele (pak ho smažeme)
    if (results.canRead) {
      try {
        const testUser = {
          email: `test-${Date.now()}@example.com`,
          password: '$2a$10$test.hash.for.testing',
          first_name: 'Test',
          last_name: 'User',
          is_active: true,
          role: 'public',
          gdpr_consent: true,
          gdpr_consent_date: new Date().toISOString(),
          registration_source: 'test',
          email_verified: false
        };

        const newUser = await directus.request(
          createItem('app_users', testUser)
        );
        
        results.canCreate = true;
        console.log("✅ Can create in app_users, created user ID:", newUser.id);
        
        // Pokusíme se smazat testovacího uživatele
        try {
          await directus.request({
            method: 'DELETE',
            path: `/items/app_users/${newUser.id}`
          });
          console.log("✅ Can delete from app_users");
          results.canDelete = true;
        } catch (deleteError) {
          console.log("❌ Cannot delete from app_users:", deleteError);
          results.errors.push(`Delete error: ${deleteError instanceof Error ? deleteError.message : "Unknown error"}`);
        }
        
      } catch (error) {
        results.canCreate = false;
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        results.errors.push(`Create error: ${errorMsg}`);
        console.log("❌ Cannot create in app_users:", errorMsg);
      }
    }

    return NextResponse.json({
      success: true,
      message: "App users collection test completed",
      results,
      summary: {
        readyForAuth: results.collectionExists && results.canRead && results.canCreate,
        canManageUsers: results.canCreate && results.canDelete
      }
    });

  } catch (error) {
    console.error("App users test error:", error);
    
    return NextResponse.json({
      error: "Chyba při testování app_users kolekce",
      details: error instanceof Error ? error.message : "Neznámá chyba"
    }, { status: 500 });
  }
} 