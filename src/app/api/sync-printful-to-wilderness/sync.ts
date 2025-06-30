import { syncCategories } from "./categories/syncCategories";
import { syncProducts } from "./products/syncProducts";

export async function sync() {
  console.log("Starting Printful to Directus sync...");

  try {
    // First sync categories
    console.log("Syncing categories...");
    const categoryResults = await syncCategories();

    // Check if categoryResults has stats property (our new implementation)
    if ("stats" in categoryResults) {
      console.log("Categories synced:", categoryResults.stats);
    } else {
      // console.log('Categories synced:', { total: categoryResults?.length });
    }

    // Then sync products (which depend on categories)
    console.log("Syncing products...");
    const productResults = await syncProducts();
    // console.log('Products synced:', productResults.stats);

    return {
      success: true,
      categories: "stats" in categoryResults && categoryResults.stats,
      products: productResults,
      message: "Sync completed successfully",
    };
  } catch (error) {
    console.error("Sync failed:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      type: typeof error,
      error: error,
    });
    throw error;
  }
}
