import { z } from 'zod';

// Schéma pro produkt
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  printful_id: z.string().optional(),
  mockups: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  date_created: z.date().optional(),
  date_updated: z.date().optional(),
});

// Schéma pro variantu produktu
export const variantSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  sku: z.string(),
  product_id: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Schéma pro kategorii
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Typy odvozené ze schémat
export type Product = z.infer<typeof productSchema>;
export type Variant = z.infer<typeof variantSchema>;
export type Category = z.infer<typeof categorySchema>;

export const orderSchema = z.object({
  date_created: z.date().optional(),
  date_updated: z.date().optional(),
});

export const designSchema = z.object({
  date_created: z.date().optional(),
  date_updated: z.date().optional(),
}); 