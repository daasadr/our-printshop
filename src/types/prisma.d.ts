import { Prisma } from '@prisma/client';

declare global {
  namespace PrismaTypes {
    type ProductWithRelations = Prisma.ProductGetPayload<{
      include: {
        variants: true;
        designs: true;
        category: true;
      }
    }>;
  }
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormattedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  previewUrl: string;
  variants: Array<{
    id: string;
    name: string;
    price: number;
    isActive: boolean;
    productId: string;
    printfulVariantId: string;
    size?: string | null;
    color?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
  designs: Array<{
    id: string;
    name: string;
    previewUrl: string;
    printfulFileId: string;
    productId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>;
  category: string;
  categoryId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  printfulId: string;
  printfulSync: boolean;
} 