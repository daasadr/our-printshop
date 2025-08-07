import { fetchPrintfulProducts, PrintfulProduct } from "./fetchPrintfulProducts";
import { directus } from "@/lib/directus";
import { readItems, createItem, updateItem, deleteItem } from '@directus/sdk';
import { fetchPrintfulProductDetails } from "./fetchPrintfulProductDetails";
import { fetchPrintfulCatalogProduct } from "./fetchPrintfulCatalogProduct";
import type { Result, SyncProduct, SyncVariant } from "./printfulProductDetail";
import { generateDescriptionForNewProduct } from "../../../../../scripts/generateProductDescriptions";

// Types based on the attached schema
interface ProductData {
  printful_id: string;
  external_id?: string | null;
  name: string;
  description?: string | null;
  design_info?: string | null;
  product_info?: string | null;
  price: number;
  thumbnail_url?: string | null;
  mockup_images: string[];
  category?: number | null;
  main_category?: string | null;
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
  size?: string;
  color?: string;
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

// Helper function to extract size and color from variant name
function extractSizeAndColor(variantName: string): { size: string | null; color: string | null } {
  // Pattern: "Product Name color / SIZE" or "Product Name / SIZE"
  const sizePattern = /\s+\/\s+([A-Z0-9]+)$/;
  
  const sizeMatch = variantName.match(sizePattern);
  const size = sizeMatch ? sizeMatch[1] : null;
  
  // Extract color: look for the last word before "/ SIZE"
  let color = null;
  if (sizeMatch) {
    const beforeSize = variantName.substring(0, sizeMatch.index);
    const parts = beforeSize.trim().split(' ');
    
    // Look for common color words at the end
    const colorWords = ['white', 'black', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'brown', 'gray', 'grey'];
    const lastWord = parts[parts.length - 1]?.toLowerCase();
    
    if (lastWord && colorWords.includes(lastWord)) {
      color = lastWord;
    } else {
      // If no common color found, try to extract the last word that's not part of the product name
      // For "Ancient Heroine Skater Dress white / XS", we want "white"
      const productNameParts = ['ancient', 'heroine', 'skater', 'dress'];
      const lastPart = parts[parts.length - 1]?.toLowerCase();
      
      if (lastPart && !productNameParts.includes(lastPart)) {
        color = lastPart;
      }
    }
  }
  
  return { size, color };
}

// Funkcia na vyčistenie HTML tagov
function stripHtmlTags(text: string): string {
  if (!text) return text;
  return text
    .replace(/<[^>]*>/g, '') // Odstráň HTML tagy
    .replace(/&lt;/g, '<')   // Dekóduj HTML entity
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

const processProduct = async (
  printfulProduct: PrintfulProduct,
  existingProductsMap: Map<string, any>,
  existingVariantsMap: Map<string, any>
) => {
  try {
    const printfulProductId = printfulProduct.id.toString();

    console.log(`Fetching details for product ${printfulProductId}...`);
    
    // Pridáme timeout pre API volania
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('API timeout')), 30000)
    );
    
    const productDetailPromise = fetchPrintfulProductDetails(printfulProduct.id);
    const productDetail: Result = await Promise.race([productDetailPromise, timeoutPromise]) as Result;

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

    // Zkusíme načíst catalog produkt pro dlouhý popis
    let catalogDescription = null;
    
    if (syncVariants.length > 0) {
      // Zkusíme různé způsoby získání catalog product ID
      const catalogProductId = syncVariants[0].product?.product_id || 
                              syncVariants[0].variant_id || 
                              syncVariants[0].id;
      
      if (catalogProductId) {
        try {
          // Pridáme timeout aj pre catalog API
          const catalogPromise = fetchPrintfulCatalogProduct(catalogProductId);
          const catalogProduct = await Promise.race([catalogPromise, timeoutPromise]) as any;
          
          if (catalogProduct && catalogProduct.description) {
            catalogDescription = catalogProduct.description;
          } else if (catalogProduct && catalogProduct.description_text) {
            catalogDescription = catalogProduct.description_text;
          } else if (catalogProduct && catalogProduct.description_html) {
            // Odstraníme HTML tagy pro čistý text
            catalogDescription = catalogProduct.description_html.replace(/<[^>]*>/g, '');
          }
        } catch (catalogError) {
          console.log(`Could not fetch catalog product details for ${catalogProductId}:`, catalogError);
          // Pokračujeme bez catalog popisu
        }
      }
    }

    // Find the category ID from the first variant's main_category_id (for reference only)
    let categoryId = null;
    if (syncVariants.length > 0 && syncVariants[0].main_category_id) {
      try {
      categoryId = await findCategoryId(syncVariants[0].main_category_id);
      } catch (error) {
        console.log(`Could not find category for main_category_id ${syncVariants[0].main_category_id}:`, error);
      }
    }

    // Extract mockup images
    const mockupImages = extractMockupImages(syncProduct, syncVariants);

    // Map Printful product to Directus schema
    const variantDescription = syncVariants.length > 0 ? syncVariants[0].product?.description : null;
    const syncProductDescription = productDetail?.sync_product?.description;
    
    // Prioritizujeme catalog description, potom variant description, nakonec sync product description
    const rawDescription = catalogDescription || variantDescription || syncProductDescription || 'Popis není k dispozici.';
    
    // Odstránime všetky HTML tagy z popisu
    const finalDescription = stripHtmlTags(rawDescription);

    const productData: ProductData = {
      printful_id: printfulProductId,
      external_id: syncProduct.external_id,
      name: syncProduct.name,
      description: finalDescription,
      design_info: syncProduct.design_info || null,
      product_info: null, // Toto pole zatím nepoužíváme
      price: parseFloat(syncVariants[0]?.retail_price || '0'),
      thumbnail_url: syncProduct.thumbnail_url,
      mockup_images: mockupImages,
      category: categoryId,
      date_updated: new Date().toISOString(),
    };
    
    console.log(`✅ Final description for ${syncProduct.name}: ${productData.description ? productData.description.substring(0, 100) + '...' : 'null'}`);

    // Check if product exists
    const existingProduct = existingProductsMap.get(printfulProductId);
    let productId: number;

    if (existingProduct) {
      // Zachováme ručně vyplněná pole z existujícího produktu
      const updateData = {
        ...productData,
        // Zachováme main_category pokud už existuje a není null
        main_category: existingProduct.main_category || productData.main_category,
        // Zachováme design_info pokud už existuje (i prázdný string)
        design_info: existingProduct.design_info !== null && existingProduct.design_info !== undefined 
          ? existingProduct.design_info 
          : productData.design_info,
        // Zachováme product_info pokud už existuje (i prázdný string)
        product_info: existingProduct.product_info !== null && existingProduct.product_info !== undefined 
          ? existingProduct.product_info 
          : productData.product_info,
        // Zachováme description pokud už existuje a není prázdný, ale vyčistíme HTML tagy
        description: existingProduct.description && existingProduct.description.trim() !== '' 
          ? stripHtmlTags(existingProduct.description)
          : productData.description,
        // Vyčistíme HTML tagy z všetkých jazykových verzií popiskov
        description_cs: existingProduct.description_cs ? stripHtmlTags(existingProduct.description_cs) : null,
        description_sk: existingProduct.description_sk ? stripHtmlTags(existingProduct.description_sk) : null,
        description_en: existingProduct.description_en ? stripHtmlTags(existingProduct.description_en) : null,
        description_de: existingProduct.description_de ? stripHtmlTags(existingProduct.description_de) : null,
      };

      // Check if update is needed (ensure all description fields are checked)
      const needsUpdate =
        existingProduct.name !== updateData.name ||
        existingProduct.description !== updateData.description ||
        existingProduct.price !== updateData.price ||
        existingProduct.thumbnail_url !== updateData.thumbnail_url ||
        existingProduct.category !== updateData.category ||
        JSON.stringify(existingProduct.mockup_images) !==
          JSON.stringify(updateData.mockup_images) ||
        existingProduct.description_cs !== updateData.description_cs ||
        existingProduct.description_sk !== updateData.description_sk ||
        existingProduct.description_en !== updateData.description_en ||
        existingProduct.description_de !== updateData.description_de;

      if (needsUpdate) {
        console.log(`Updating existing product: ${updateData.name}`);
        await directus.request(
          updateItem("products", existingProduct.id, updateData)
        );
        console.log(
          `Updated product: ${updateData.name} (ID: ${printfulProductId})`
        );
      }
      productId = existingProduct.id;
    } else {
      // Create new product
      console.log(`Creating new product: ${productData.name}`);
      
      const newProductData = {
        ...productData,
        date_created: new Date().toISOString(),
      };
      
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
        // Use size and color directly from Printful API
        const size = syncVariant.size || null;
        const color = syncVariant.color || null;
        
        console.log(`Processing variant: ${syncVariant.name} -> size: ${size}, color: ${color}`);
        console.log(`Raw variant data:`, {
          id: syncVariant.id,
          name: syncVariant.name,
          size: syncVariant.size,
          color: syncVariant.color,
          retail_price: syncVariant.retail_price,
          sku: syncVariant.sku
        });
        
        const variantData: VariantData = {
          product: productId,
          product_id: productId,
          name: syncVariant.name,
          sku: syncVariant.sku,
          price: parseFloat(syncVariant.retail_price),
          is_active: syncVariant.availability_status === "active",
          printful_variant_id: syncVariant.id.toString(),
          size: size,
          color: color,
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
            existingVariant.sku !== variantData.sku ||
            existingVariant.size !== variantData.size ||
            existingVariant.color !== variantData.color;

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
    console.log("Starting simple product sync...");

    // Validate environment variables
    const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
    const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
    const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

    if (!PRINTFUL_API_KEY) {
      throw new Error("PRINTFUL_API_KEY environment variable is missing");
    }
    if (!DIRECTUS_URL) {
      throw new Error("NEXT_PUBLIC_DIRECTUS_URL environment variable is missing");
    }
    if (!DIRECTUS_TOKEN) {
      throw new Error("DIRECTUS_TOKEN environment variable is missing");
    }

    console.log("Environment variables validated successfully");

    // Test Directus connection
    try {
      console.log("Testing Directus connection...");
      const testQuery = await directus.request(readItems("categories", { limit: 1 }));
      console.log("Directus connection successful");
    } catch (directusError) {
      console.error("Directus connection failed:", directusError);
      throw new Error(`Cannot connect to Directus: ${directusError}`);
    }

    // Fetch products from Printful
    console.log("Fetching products from Printful...");
    const products = await fetchPrintfulProducts();
    console.log(`Fetched ${products.length} products from Printful`);

    // Get existing products from Directus
    console.log("Fetching existing products from Directus...");
    const existingProducts = await directus.request(
        readItems("products", {
        fields: ["id", "printful_id", "name"],
      })
    );

    console.log(`Found ${existingProducts.length} existing products`);

    // Create lookup maps
    const existingProductsMap = new Map(
      existingProducts.map((product) => [product.printful_id, product])
    );

    // Create set of Printful product IDs for easy lookup
    const printfulProductIds = new Set(products.map(p => p.id.toString()));

    let processedCount = 0;
    let createdCount = 0;
    let updatedCount = 0;
    let deletedCount = 0;
    const totalProducts = products.length;

    console.log(`Starting to process ${totalProducts} products...`);

    // First, delete products that no longer exist in Printful
    console.log("Checking for products to delete...");
    for (const existingProduct of existingProducts) {
      if (existingProduct.printful_id) {
        // Delete products with printful_id that no longer exist in Printful
        if (!printfulProductIds.has(existingProduct.printful_id)) {
          console.log(`Deleting product that no longer exists in Printful: ${existingProduct.name} (ID: ${existingProduct.id})`);
          try {
            await directus.request(deleteItem("products", existingProduct.id));
            deletedCount++;
          } catch (error) {
            console.error(`Failed to delete product ${existingProduct.id}:`, error);
          }
        }
      } else {
        // Delete products without printful_id (old test products)
        console.log(`Deleting product without printful_id: ${existingProduct.name} (ID: ${existingProduct.id})`);
        try {
          await directus.request(deleteItem("products", existingProduct.id));
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete product ${existingProduct.id}:`, error);
        }
      }
    }

    // Process products sequentially
    for (const product of products) {
      try {
        console.log(`Processing product ${processedCount + 1}/${totalProducts}: ${product.name || product.id}`);
        
        const printfulProductId = product.id.toString();
        const existingProduct = existingProductsMap.get(printfulProductId);

        if (existingProduct) {
          // Update existing product
          console.log(`Updating existing product: ${product.name}`);
          await directus.request(
            updateItem("products", existingProduct.id, {
              name: product.name,
              thumbnail_url: product.thumbnail_url,
              date_updated: new Date().toISOString(),
            })
          );
          updatedCount++;
        } else {
          // Create new product
          console.log(`Creating new product: ${product.name}`);
          await directus.request(
            createItem("products", {
              printful_id: printfulProductId,
              name: product.name,
              description: `Popis pre ${product.name}`,
              price: 0,
              thumbnail_url: product.thumbnail_url,
              mockup_images: [],
              date_created: new Date().toISOString(),
              date_updated: new Date().toISOString(),
            })
          );
          createdCount++;
        }

        processedCount++;

        // Add small delay to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Failed to process product ${product.id}:`, error);
        // Continue with next product
      }
    }

    console.log(`Product sync completed: ${processedCount}/${totalProducts} products processed`);
    console.log(`Created: ${createdCount}, Updated: ${updatedCount}, Deleted: ${deletedCount}`);

    return {
      success: true,
      stats: {
        total: totalProducts,
        processed: processedCount,
        created: createdCount,
        updated: updatedCount,
        deleted: deletedCount,
        failed: totalProducts - processedCount,
      },
    };
  } catch (error) {
    console.error("Error syncing products:", error);
    throw new Error(`Failed to sync products: ${error}`);
  }
}