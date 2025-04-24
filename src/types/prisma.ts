export type Product = {
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  printfulId: string;
  printfulSync: boolean;
  categoryId: string | null;
};

export type Design = {
  id: string;
  name: string;
  previewUrl: string;
  printfulFileId: string;
  productId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Variant = {
  id: string;
  name: string;
  price: number;
  productId: string;
  printfulVariantId: string;
  size?: string | null;
  color?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  id: string;
  name: string;
  displayName: string;
};

// Typ pro produkt jak ho vrací Prisma query
export type PrismaProduct = {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  printfulId: string;
  printfulSync: boolean;
  categoryId: string | null;
  variants: Array<{
    id: string;
    name: string;
    price: number;
    productId: string;
    printfulVariantId: string;
    size: string | null;
    color: string | null;
    isActive: boolean;
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
  category: {
    id: string;
    name: string;
    displayName: string;
  } | null;
};

export type FormattedProduct = {
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  price: number;
  variants: Variant[];
  designs: Omit<Design, 'productId'>[];
  category: string;
  categoryId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  printfulId: string;
  printfulSync: boolean;
};

// Types for Prisma queries
export type ProductWhereInput = {
  isActive?: boolean;
  categoryId?: string;
};

export type ProductInclude = {
  variants?: {
    where?: { isActive?: boolean };
    orderBy?: { price?: 'asc' | 'desc' };
  };
  designs?: boolean;
  category?: boolean;
};