import { Product, Design } from '@prisma/client';

export type ProductVariant = {
  id: string;
  productId: string;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductWithRelations = Product & {
  variants: (ProductVariant & { price: number })[];
  designs: Design[];
};

export type FormattedProduct = {
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  price: number;
  variants: (ProductVariant & { price: number })[];
  designs: Design[];
  category?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  categoryId?: string | null;
  printfulId?: string | null;
  printfulSync?: boolean;
};