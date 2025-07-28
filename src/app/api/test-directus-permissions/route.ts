import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { readItems, createItem } from '@directus/sdk';

export async function GET() {
  try {
    console.log("Testing Directus permissions...");
    
    const results = {
      canRead: false,
      canCreate: false,
      canUpdate: false,
      canDelete: false,
      errors: [] as string[]
    };

    // Test 1: Čtení directus_users
    try {
      const users = await directus.request(
        readItems('directus_users', {
          limit: 1
        })
      );
      results.canRead = true;
      console.log("✅ Can read directus_users");
    } catch (error) {
      results.canRead = false;
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      results.errors.push(`Read error: ${errorMsg}`);
      console.log("❌ Cannot read directus_users:", errorMsg);
    }

    // Test 2: Vytvoření testovacího uživatele (pak ho smažeme)
    try {
      const testUser = {
        email: `test-${Date.now()}@example.com`,
        password: '$2a$10$test.hash.for.testing',
        first_name: 'Test',
        last_name: 'User',
        status: 'active',
        role: 'public'
      };

      const newUser = await directus.request(
        createItem('directus_users', testUser)
      );
      
      results.canCreate = true;
      console.log("✅ Can create in directus_users, created user ID:", newUser.id);
      
      // Pokusíme se smazat testovacího uživatele
      try {
        await directus.request({
          method: 'DELETE',
          path: `/items/directus_users/${newUser.id}`
        });
        console.log("✅ Can delete from directus_users");
        results.canDelete = true;
      } catch (deleteError) {
        console.log("❌ Cannot delete from directus_users:", deleteError);
        results.errors.push(`Delete error: ${deleteError instanceof Error ? deleteError.message : "Unknown error"}`);
      }
      
    } catch (error) {
      results.canCreate = false;
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      results.errors.push(`Create error: ${errorMsg}`);
      console.log("❌ Cannot create in directus_users:", errorMsg);
    }

    return NextResponse.json({
      success: true,
      message: "Directus permissions test completed",
      permissions: results,
      summary: {
        hasFullAccess: results.canRead && results.canCreate && results.canUpdate && results.canDelete,
        canManageUsers: results.canCreate && results.canDelete
      }
    });

  } catch (error) {
    console.error("Permissions test error:", error);
    
    return NextResponse.json({
      error: "Chyba při testování oprávnění",
      details: error instanceof Error ? error.message : "Neznámá chyba"
    }, { status: 500 });
  }
} 