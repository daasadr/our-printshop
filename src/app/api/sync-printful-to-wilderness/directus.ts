import {
  createDirectus,
  rest,
  staticToken,
  readItems,
  createItem,
  updateItem,
} from "@directus/sdk";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

// Validate environment variables
if (!DIRECTUS_URL) {
  console.error('NEXT_PUBLIC_DIRECTUS_URL environment variable is missing');
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL environment variable is required');
}

if (!DIRECTUS_TOKEN) {
  console.error('DIRECTUS_TOKEN environment variable is missing');
  throw new Error('DIRECTUS_TOKEN environment variable is required');
}

console.log('Creating Directus client with URL:', DIRECTUS_URL);
console.log('Token length:', DIRECTUS_TOKEN.length);

export const directus = createDirectus(DIRECTUS_URL)
  .with(staticToken(DIRECTUS_TOKEN))
  .with(rest());
