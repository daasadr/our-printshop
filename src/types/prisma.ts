import { Prisma } from '@prisma/client';

// Použití generického typu Record místo nenalezených GetPayload typů
export type Product = {
  id: string;
  title: string;
  description: string;
  printfulId: string;
  printfulSync: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Variant = {
  id: string;
  productId: string;
  printfulVariantId: string;
  name: string;
  size?: string | null;
  color?: string | null;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Design = {
  id: string;
  name: string;
  printfulFileId: string;
  previewUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface ProductWithDetails extends Product {
  variants: Variant[];
  designs: Design[];
}