/**
 * Represents a single category item.
 */
export interface Category {
  id: number;
  parent_id: number;
  image_url: string;
  catalog_position: number;
  size: string; // Or a more specific literal type like 'small' if it's always the same
  title: string;
}

/**
 * Represents the 'result' object which contains the list of categories.
 */
interface Result {
  categories: Category[];
}

/**
 * Represents the main 'results' object from the API response.
 */
export interface ApiResponse {
  code: number;
  result: Result;
}
