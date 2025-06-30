import { fetchPrintfulProducts, PrintfulProduct } from "./fetchPrintfulProducts";
import { directus } from "@/lib/directus";
import { readItems, createItem, updateItem } from '@directus/sdk';
import { fetchPrintfulProductDetails } from "./fetchPrintfulProductDetails";
import type { Result, SyncProduct, SyncVariant } from "./printfulProductDetail";

// Types based on the attached schema
interface ProductData {
  printful_id: string;
  external_id?: string | null;
  name: string;
  description?: string | null;
  price: number;
  thumbnail_url?: string | null;
  mockup_images: string[];
  category?: number | null;
  date_created?: string;
  date_updated: string;
}

interface VariantData {
  product: number;
  product_id: number;
  name: string;
  sku: string;
  price: number;
  is_active: boolean;
  printful_variant_id: string;
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to find category ID by printful category ID
async function findCategoryId(printfulCategoryId: number): Promise<number | null> {
  try {
    const categories = await directus.request(readItems('categories', {
      filter: { printful_id: { _eq: printfulCategoryId } },
      fields: ['id']
    }));
    return categories.length > 0 ? categories[0].id : null;
  } catch (error) {
    console.warn(`Could not find category for printful_id ${printfulCategoryId}:`, error);
    return null;
  }
}

// Helper function to extract mockup images from sync variants
function extractMockupImages(syncProduct: SyncProduct, syncVariants: SyncVariant[]): string[] {
  const mockupImages: string[] = [];
  
  // Add main product thumbnail
  if (syncProduct.thumbnail_url) {
    mockupImages.push(syncProduct.thumbnail_url);
  }
  
  // Add preview images from variant files
  syncVariants.forEach(variant => {
    if (variant.files && Array.isArray(variant.files)) {
      variant.files.forEach(file => {
        if (file.type === 'preview' && file.preview_url && !file.is_temporary) {
          mockupImages.push(file.preview_url);
        }
      });
    }
  });
  
  // Remove duplicates
  return [...new Set(mockupImages)];
}

const processProduct = async (
  printfulProduct: PrintfulProduct,
  existingProductsMap: Map<string, any>,
  existingVariantsMap: Map<string, any>
) => {
  try {
    const printfulProductId = printfulProduct.id.toString();

    console.log(`Fetching details for product ${printfulProductId}...`);
    const productDetail: Result = await fetchPrintfulProductDetails(
      printfulProduct.id
    );

    if (!productDetail || !productDetail.sync_product) {
      throw new Error(
        `Sync product detail missing for product ${printfulProductId}`
      );
    }

    const syncProduct: SyncProduct = productDetail.sync_product;
    const syncVariants: SyncVariant[] = productDetail.sync_variants || [];

    console.log(
      `Processing product: ${syncProduct.name} with ${syncVariants.length} variants`
    );

    // Find the category ID from the first variant's main_category_id
    let categoryId = null;
    if (syncVariants.length > 0 && syncVariants[0].main_category_id) {
      categoryId = await findCategoryId(syncVariants[0].main_category_id);
      if (!categoryId) {
        console.warn(
          `Category not found for main_category_id ${syncVariants[0].main_category_id}, product will have no category`
        );
      }
    }

    // Extract mockup images
    const mockupImages = extractMockupImages(syncProduct, syncVariants);

    // Map Printful product to Directus schema
    const productData: ProductData = {
      printful_id: printfulProductId,
      external_id: syncProduct.external_id || null,
      name: syncProduct.name,
      description: null, // No description in sync_product
      price:
        syncVariants.length > 0 ? parseFloat(syncVariants[0].retail_price) : 0, // Use first variant price as base price
      thumbnail_url: syncProduct.thumbnail_url || null,
      mockup_images: mockupImages,
      category: categoryId,
      date_updated: new Date().toISOString(),
    };

    // Check if product exists
    const existingProduct = existingProductsMap.get(printfulProductId);
    let productId: number;

    if (existingProduct) {
      // Check if update is needed
      const needsUpdate =
        existingProduct.name !== productData.name ||
        existingProduct.description !== productData.description ||
        existingProduct.price !== productData.price ||
        existingProduct.thumbnail_url !== productData.thumbnail_url ||
        existingProduct.category !== productData.category ||
        JSON.stringify(existingProduct.mockup_images) !==
          JSON.stringify(productData.mockup_images);

      if (needsUpdate) {
        console.log(`Updating existing product: ${productData.name}`);
        await directus.request(
          updateItem("products", existingProduct.id, productData)
        );
        console.log(
          `Updated product: ${productData.name} (ID: ${printfulProductId})`
        );
      }
      productId = existingProduct.id;
    } else {
      // Create new product - add date_created for new products
      const newProductData = {
        ...productData,
        date_created: new Date().toISOString(),
      };
      console.log(`Creating new product: ${productData.name}`);
      const newProduct = await directus.request(
        createItem("products", newProductData)
      );
      console.log(
        `Created product: ${productData.name} (ID: ${printfulProductId})`
      );
      productId = newProduct.id;
    }

    // Process variants
    console.log(
      `Processing ${syncVariants.length} variants for product ${productId}`
    );
    for (const syncVariant of syncVariants) {
      try {
        const variantData: VariantData = {
          product: productId,
          product_id: productId,
          name: syncVariant.name,
          sku: syncVariant.sku,
          price: parseFloat(syncVariant.retail_price),
          is_active: syncVariant.availability_status === "active",
          printful_variant_id: syncVariant.id.toString(),
        };

        const existingVariant = existingVariantsMap.get(
          syncVariant.id.toString()
        );

        console.log(`Checking variant ${syncVariant.id}: ${syncVariant.name}`);
        console.log(
          `  - Looking for printful_variant_id: "${syncVariant.id.toString()}"`
        );
        console.log(
          `  - Found existing variant:`,
          existingVariant ? `ID ${existingVariant.id}` : "NO"
        );

        if (existingVariant) {
          // Check if variant update is needed
          const needsVariantUpdate =
            existingVariant.name !== variantData.name ||
            existingVariant.price !== variantData.price ||
            existingVariant.is_active !== variantData.is_active ||
            existingVariant.sku !== variantData.sku;

          if (needsVariantUpdate) {
            await directus.request(
              updateItem("variants", existingVariant.id, variantData)
            );
            console.log(
              `Updated variant: ${variantData.name} (ID: ${syncVariant.id})`
            );
          } else {
            console.log(
              `Variant ${variantData.name} (ID: ${syncVariant.id}) is up to date`
            );
          }
        } else {
          // Double-check: query database directly for this printful_variant_id to prevent duplicates
          console.log(
            `Double-checking for existing variant with printful_variant_id: ${syncVariant.id}`
          );
          const doubleCheckVariants = await directus.request(
            readItems("variants", {
              filter: {
                printful_variant_id: { _eq: syncVariant.id.toString() },
              },
              fields: ["id", "printful_variant_id", "name"],
            })
          );

          if (doubleCheckVariants.length > 0) {
            console.log(
              `⚠️  Found existing variant in database that wasn't in our map:`,
              doubleCheckVariants[0]
            );
            console.log(
              `Updating existing variant instead of creating new one`
            );
            await directus.request(
              updateItem("variants", doubleCheckVariants[0].id, variantData)
            );
            console.log(
              `Updated variant: ${variantData.name} (ID: ${syncVariant.id})`
            );
          } else {
            // Create new variant
            await directus.request(createItem("variants", variantData));
            console.log(
              `Created variant: ${variantData.name} (ID: ${syncVariant.id})`
            );
          }
        }
      } catch (variantError) {
        console.error(
          `Error processing variant ${syncVariant.id}:`,
          variantError
        );
        // Continue with next variant
      }
    }
  } catch (error) {
    console.error(`Error processing product ${printfulProduct.id}:`, error);
    console.error("Product details:", {
      id: printfulProduct.id,
      name: printfulProduct.name,
      sync_product: printfulProduct.sync_product,
    });
    throw error;
  }
};

export async function syncProducts() {
  try {
    console.log("Starting product sync...");

    // Validate environment variables
    const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
    const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
    const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

    if (!PRINTFUL_API_KEY) {
      throw new Error("PRINTFUL_API_KEY environment variable is missing");
    }
    if (!DIRECTUS_URL) {
      throw new Error(
        "NEXT_PUBLIC_DIRECTUS_URL environment variable is missing"
      );
    }
    if (!DIRECTUS_TOKEN) {
      throw new Error("DIRECTUS_TOKEN environment variable is missing");
    }

    console.log("Environment variables validated successfully");

    // Test Directus connection
    try {
      console.log("Testing Directus connection...");
      console.log("Directus URL:", DIRECTUS_URL);
      console.log("Directus Token exists:", !!DIRECTUS_TOKEN);
      console.log(
        "Directus Token length:",
        DIRECTUS_TOKEN ? DIRECTUS_TOKEN.length : 0
      );

      const testQuery = await directus.request(
        readItems("categories", { limit: 1 })
      );
      console.log(
        "Directus connection successful, categories found:",
        testQuery.length
      );
    } catch (directusError) {
      console.error("Directus connection failed:", directusError);
      console.error("Error type:", typeof directusError);
      console.error("Error constructor:", directusError?.constructor?.name);

      let errorDetails = "Unknown Directus error";

      if (directusError instanceof Error) {
        errorDetails = `${directusError.name}: ${directusError.message}`;
        console.error("Error stack:", directusError.stack);
      } else if (directusError && typeof directusError === "object") {
        if ("response" in directusError) {
          console.error("HTTP Response error:", directusError.response);
        }
        if ("status" in directusError) {
          console.error("HTTP Status:", directusError.status);
        }
        if ("statusText" in directusError) {
          console.error("HTTP Status Text:", directusError.statusText);
        }
        if ("data" in directusError) {
          console.error("Response data:", directusError.data);
        }
        errorDetails = JSON.stringify(directusError, null, 2);
      } else {
        errorDetails = String(directusError);
      }

      // Try to provide more specific error information
      if (
        errorDetails.includes("401") ||
        errorDetails.includes("Unauthorized")
      ) {
        throw new Error(
          `Cannot connect to Directus: Authentication failed. Check your DIRECTUS_TOKEN.`
        );
      } else if (
        errorDetails.includes("404") ||
        errorDetails.includes("Not Found")
      ) {
        throw new Error(
          `Cannot connect to Directus: URL not found. Check your NEXT_PUBLIC_DIRECTUS_URL: ${DIRECTUS_URL}`
        );
      } else if (
        errorDetails.includes("ECONNREFUSED") ||
        errorDetails.includes("ENOTFOUND")
      ) {
        throw new Error(
          `Cannot connect to Directus: Connection refused. Check if Directus is running at: ${DIRECTUS_URL}`
        );
      } else if (errorDetails.includes("categories")) {
        throw new Error(
          `Cannot connect to Directus: 'categories' collection not found. Check your Directus schema.`
        );
      } else {
        throw new Error(`Cannot connect to Directus: ${errorDetails}`);
      }
    }

    const products = await fetchPrintfulProducts();
    // return products; // For testing purposes, return the fetched products
    console.log(`Fetched ${products.length} products from Printful`);

    // Get existing products and variants from Directus
    console.log("Fetching existing products and variants from Directus...");
    const [existingProducts, existingVariants] = await Promise.all([
      directus.request(
        readItems("products", {
          fields: [
            "id",
            "printful_id",
            "name",
            "description",
            "price",
            "thumbnail_url",
            "mockup_images",
            "category",
          ],
        })
      ),
      directus.request(
        readItems("variants", {
          fields: [
            "id",
            "printful_variant_id",
            "name",
            "price",
            "is_active",
            "product_id",
            "sku",
          ],
        })
      ),
    ]);

    console.log(
      `Found ${existingProducts.length} existing products and ${existingVariants.length} existing variants`
    );

    // Create lookup maps
    const existingProductsMap = new Map(
      existingProducts.map((product) => [product.printful_id, product])
    );

    const existingVariantsMap = new Map(
      existingVariants.map((variant) => [
        String(variant.printful_variant_id),
        variant,
      ])
    );

    console.log("Existing variants map populated:");
    console.log(`  - Map size: ${existingVariantsMap.size}`);
    if (existingVariants.length > 0) {
      console.log("  - Sample entries:");
      existingVariants.slice(0, 3).forEach((variant) => {
        console.log(
          `    - Key: "${variant.printful_variant_id}" (type: ${typeof variant.printful_variant_id}) -> Variant ID: ${variant.id}, Name: ${variant.name}`
        );
      });
    }

    // Check for duplicate printful_variant_ids in the database
    const printfulVariantIds = existingVariants.map(
      (v) => v.printful_variant_id
    );
    const duplicateIds = printfulVariantIds.filter(
      (id, index) => printfulVariantIds.indexOf(id) !== index
    );
    if (duplicateIds.length > 0) {
      console.warn(
        `⚠️  Found duplicate printful_variant_ids in database:`,
        duplicateIds
      );
    }

    let processedCount = 0;
    const totalProducts = products.length;

    console.log(`Starting to process ${totalProducts} products...`);

    // Process products sequentially to avoid API rate limits
    for (const product of products) {
      try {
        console.log(
          `Processing product ${processedCount + 1}/${totalProducts}: ${product.name || product.id}`
        );
        await processProduct(product, existingProductsMap, existingVariantsMap);
        processedCount++;

        if (processedCount % 10 === 0) {
          console.log(`Processed ${processedCount}/${totalProducts} products`);
        }

        // Add small delay to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to process product ${product.id}:`, error);
        console.error("Product data:", JSON.stringify(product, null, 2));
        // Continue with next product instead of stopping the entire sync
      }
    }

    console.log(
      `Product sync completed: ${processedCount}/${totalProducts} products processed`
    );

    return {
      success: true,
      stats: {
        total: totalProducts,
        processed: processedCount,
        failed: totalProducts - processedCount,
      },
    };
  } catch (error) {
    console.error("Error syncing products:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    // Provide more specific error information
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error && typeof error === "object") {
      errorMessage = JSON.stringify(error);
    }

    throw new Error(`Failed to sync products: ${errorMessage}`);
  }
}
