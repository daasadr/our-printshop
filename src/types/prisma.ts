export type Product = {
  id: string;
  name: string;
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
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// Typ pro produkt jak ho vrací Prisma query
export type PrismaProduct = {
  id: string;
  name: string;
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
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

export type FormattedProduct = {
  id: string;
  name: string;
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
  } | boolean;
  designs?: boolean;
  category?: boolean;
};

export type CartItem = {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  variant: {
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
    product: {
      id: string;
      name: string;
      description: string;
      previewUrl?: string;
    };
  };
};

export type CartWithItems = {
  id: string;
  userId: string | null;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
};