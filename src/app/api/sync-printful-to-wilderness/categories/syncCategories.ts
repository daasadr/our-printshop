import { directus } from "../directus";
import { readItems, createItem, updateItem, deleteItem } from '@directus/sdk';
import { fetchPrintfulCategories } from "./fetchPrintfulCategories";
// import type { Category } from "./printfulCategories";

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to check if category exists by printful_id
function categoryExists(printfulId: number, categoriesMap: Map<number, any>): boolean {
  // Ensure we're comparing numbers
  const numericId = Number(printfulId);
  return categoriesMap.has(numericId);
}

// Helper function to get existing category by printful_id
function getExistingCategory(printfulId: number, categoriesMap: Map<number, any>) {
  // Ensure we're comparing numbers
  const numericId = Number(printfulId);
  return categoriesMap.get(numericId);
}

// Helper function to debug why a category might not be found
function debugCategoryLookup(printfulId: number, categoriesMap: Map<number, any>) {
  const numericId = Number(printfulId);
  console.log(`  Debug lookup for printful_id ${printfulId}:`);
  console.log(`    Original type: ${typeof printfulId}, Numeric conversion: ${numericId}`);
  console.log(`    Map has key: ${categoriesMap.has(numericId)}`);
  console.log(`    Map size: ${categoriesMap.size}`);
  console.log(`    Map keys sample:`, Array.from(categoriesMap.keys()).slice(0, 10));
  
  // Check if there's a matching value in the map with any type
  let foundWithLooseEquality = false;
  for (const [key, value] of categoriesMap) {
    if (key == printfulId) { // Use loose equality to check for type differences
      console.log(`    Found with loose equality! Key: ${key} (${typeof key}), printful_id: ${printfulId} (${typeof printfulId})`);
      foundWithLooseEquality = true;
      break;
    }
  }
  
  if (!foundWithLooseEquality) {
    console.log(`    No match found even with loose equality`);
  }
}

// Standalone function to check if a category exists by printful_id
export async function checkCategoryExists(printfulId: number): Promise<boolean> {
  try {
    const existingCategories = await directus.request(readItems('categories', {
      fields: ['id'],
      filter: {
        printful_id: {
          _eq: printfulId
        }
      },
      limit: 1
    }));
    
    return existingCategories.length > 0;
  } catch (error) {
    console.error(`Error checking category existence for printful_id ${printfulId}:`, error);
    return false;
  }
}

// Standalone function to get a category by printful_id
export async function getCategoryByPrintfulId(printfulId: number) {
  try {
    const categories = await directus.request(readItems('categories', {
      fields: ['id', 'printful_id', 'name', 'slug', 'parent_id', 'category_position', 'size', 'description', 'image_url'],
      filter: {
        printful_id: {
          _eq: printfulId
        }
      },
      limit: 1
    }));
    
    return categories.length > 0 ? categories[0] : null;
  } catch (error) {
    console.error(`Error fetching category by printful_id ${printfulId}:`, error);
    return null;
  }
}

// Function to clean up duplicate categories (keep the first one, delete the rest)
export async function cleanupDuplicateCategories() {
  try {
    console.log('Checking for duplicate categories...');
    
    // Get all categories with printful_id
    const allCategories = await directus.request(readItems('categories', {
      fields: ['id', 'printful_id', 'name'],
      filter: {
        printful_id: {
          _nnull: true
        }
      },
      sort: ['id'] // Sort by ID to keep the oldest ones
    }));

    // Group by printful_id
    const groupedByPrintfulId = new Map();
    
    for (const category of allCategories) {
      const printfulId = Number(category.printful_id);
      if (!groupedByPrintfulId.has(printfulId)) {
        groupedByPrintfulId.set(printfulId, []);
      }
      groupedByPrintfulId.get(printfulId).push(category);
    }

    // Find duplicates and delete them
    let deletedCount = 0;
    for (const [printfulId, categories] of groupedByPrintfulId) {
      if (categories.length > 1) {
        console.log(`Found ${categories.length} categories with printful_id ${printfulId}:`);
        categories.forEach((cat, index) => {
          console.log(`  ${index + 1}. ID: ${cat.id}, Name: ${cat.name}`);
        });
        
        // Keep the first one, delete the rest
        const toDelete = categories.slice(1);
        for (const categoryToDelete of toDelete) {
          console.log(`  Deleting duplicate: ID ${categoryToDelete.id}, Name: ${categoryToDelete.name}`);
          await directus.request(deleteItem('categories', categoryToDelete.id));
          deletedCount++;
        }
      }
    }

    console.log(`Cleanup completed: ${deletedCount} duplicate categories deleted`);
    return { deleted: deletedCount };
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
}

export async function syncCategories() {
  try {
    const categories = await fetchPrintfulCategories();
    console.log(`Fetched ${categories.length} categories from Printful`);

    // Get existing categories from Directus (only those with printful_id)
    const existingCategories = await directus.request(readItems('categories', {
      fields: ['id', 'printful_id', 'name', 'slug', 'parent_id', 'category_position', 'size', 'description', 'image_url'],
      filter: {
        printful_id: {
          _nnull: true // Only fetch categories that have a printful_id
        }
      }
    }));

    console.log(`Found ${existingCategories.length} existing categories in Directus with printful_id`);
    
    // Debug: Show some sample existing categories
    if (existingCategories.length > 0) {
      console.log(`Sample existing categories:`, existingCategories.slice(0, 3).map(cat => ({
        id: cat.id,
        printful_id: cat.printful_id,
        name: cat.name,
        parent_id: cat.parent_id
      })));
    }

    // Create a map of existing categories by printful_id for quick lookup
    // Filter out any categories without printful_id (extra safety)
    // Convert printful_id to number to ensure consistent comparison
    const existingCategoriesMap = new Map(
      existingCategories
        .filter(cat => cat.printful_id != null)
        .map(cat => [Number(cat.printful_id), cat])
    );
    
    console.log(`Created map with ${existingCategoriesMap.size} categories for lookup`);
    
    // Debug: Show the types and values in the map
    const mapEntries = Array.from(existingCategoriesMap.entries()).slice(0, 5);
    console.log(`Sample map entries:`, mapEntries.map(([key, value]) => ({
      key,
      keyType: typeof key,
      printful_id: value.printful_id,
      printful_id_type: typeof value.printful_id,
      name: value.name
    })));

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const printfulCategory of categories) {
      // Check if category already exists in Directus
      const existingCategory = getExistingCategory(printfulCategory.id, existingCategoriesMap);
      const exists = categoryExists(printfulCategory.id, existingCategoriesMap);
      
      // Normalize parent_id: convert 0 to null for consistency
      const normalizedParentId = printfulCategory.parent_id === 0 ? null : printfulCategory.parent_id;
      
      console.log(`Processing category "${printfulCategory.title}" (Printful ID: ${printfulCategory.id}) - ${exists ? 'EXISTS' : 'NEW'}`);
      if (!exists) {
        console.log(`  Raw parent_id: ${printfulCategory.parent_id}, normalized: ${normalizedParentId}`);
        debugCategoryLookup(printfulCategory.id, existingCategoriesMap);
      }
      
      // Map Printful category to Directus schema
      const categoryData = {
        printful_id: printfulCategory.id,
        parent_id: normalizedParentId,
        category_position: printfulCategory.catalog_position,
        slug: generateSlug(printfulCategory.title),
        name: printfulCategory.title,
        size: printfulCategory.size || null,
        description: null, // Printful doesn't provide description in categories API
        image_url: printfulCategory.image_url || null
      };

      if (exists) {
        // Helper function to normalize values for comparison
        const normalize = (value: any) => {
          if (value === 0 || value === undefined || value === null || value === '') {
            return null;
          }
          return value;
        };

        // Check if update is needed with proper null/undefined/0 handling
        const needsUpdate =
          existingCategory.name !== categoryData.name ||
          existingCategory.slug !== categoryData.slug ||
          normalize(existingCategory.parent_id) !== normalize(categoryData.parent_id) ||
          existingCategory.category_position !== categoryData.category_position ||
          normalize(existingCategory.size) !== normalize(categoryData.size) ||
          normalize(existingCategory.image_url) !== normalize(categoryData.image_url);

        if (needsUpdate) {
          console.log(`  UPDATE NEEDED for ${categoryData.name}:`);
          console.log(`    parent_id: ${normalize(existingCategory.parent_id)} -> ${normalize(categoryData.parent_id)}`);
          console.log(`    category_position: ${existingCategory.category_position} -> ${categoryData.category_position}`);
          console.log(`    size: ${normalize(existingCategory.size)} -> ${normalize(categoryData.size)}`);
          console.log(`    image_url: ${normalize(existingCategory.image_url)} -> ${normalize(categoryData.image_url)}`);
          
          await directus.request(updateItem('categories', existingCategory.id, categoryData));
          console.log(`Updated category: ${categoryData.name} (ID: ${printfulCategory.id})`);
          updatedCount++;
        } else {
          console.log(`Skipped category (no changes): ${categoryData.name} (ID: ${printfulCategory.id})`);
          skippedCount++;
        }
      } else {
        // Double-check using direct database query to prevent duplicates
        const doubleCheckExists = await checkCategoryExists(printfulCategory.id);
        
        if (doubleCheckExists) {
          console.log(`  WARNING: Category ${categoryData.name} (ID: ${printfulCategory.id}) exists in DB but not in map! Skipping creation.`);
          skippedCount++;
        } else {
          // Create new category
          console.log(`  CREATING new category: ${categoryData.name} with data:`, {
            printful_id: categoryData.printful_id,
            parent_id: categoryData.parent_id,
            category_position: categoryData.category_position,
            size: categoryData.size
          });
          
          try {
            await directus.request(createItem('categories', categoryData));
            console.log(`Created category: ${categoryData.name} (ID: ${printfulCategory.id})`);
            createdCount++;
          } catch (error) {
            console.error(`Error creating category ${categoryData.name}:`, error);
            // If it's a duplicate key error, count as skipped instead of failing
            if (error.message && error.message.includes('duplicate') || error.message.includes('unique')) {
              console.log(`  Duplicate detected, counting as skipped`);
              skippedCount++;
            } else {
              throw error;
            }
          }
        }
      }
    }

    console.log(`Category sync completed: ${createdCount} created, ${updatedCount} updated, ${skippedCount} skipped`);
    
    return {
      success: true,
      stats: {
        total: categories.length,
        created: createdCount,
        updated: updatedCount,
        skipped: skippedCount
      }
    };
  } catch (error) {
    console.error('Error syncing categories:', error);
    throw new Error(`Failed to sync categories: ${JSON.stringify(error, null, 2)}`);
  }
}