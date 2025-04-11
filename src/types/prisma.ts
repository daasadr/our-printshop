import { Product as PrismaProduct, Variant, Design, Order, OrderItem, ShippingInfo, User, Category } from '@prisma/client';

// Produkt s variantami a designy
export interface ProductWithRelations extends PrismaProduct {
  variants: Variant[];
  designs: Design[];
}

// Pro zpětnou kompatibilitu - stejný typ jako ProductWithRelations
export interface ProductWithDetails extends PrismaProduct {
  variants: Variant[];
  designs: Design[];
}

// Varianta produktu s odkazem na produkt
export interface VariantWithProduct extends Variant {
  product: PrismaProduct;
}

// Objednávka s položkami a informacemi o dopravě
export interface OrderWithRelations extends Order {
  items: (OrderItem & {
    variant: VariantWithProduct;
  })[];
  shippingAddress: ShippingInfo | null;
  user: User | null;
}

// Formátovaný produkt pro klienta
export interface FormattedProduct {
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  price: number;
  variants: (Variant & { price: number })[];
  designs: Design[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  categoryId: string | null;
  printfulId: string;
  printfulSync: boolean;
}

// Kategorie s produkty
export interface CategoryWithProducts extends Category {
  products: PrismaProduct[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  variants: ProductVariant[];
  designs: ProductDesign[];
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  previewUrl: string;
  productId: string;
  printfulVariantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDesign {
  id: string;
  previewUrl: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductWithRelations extends Product {
  variants: ProductVariant[];
  designs: ProductDesign[];
}

export interface FormattedProduct {
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  price: number;
  variants: (Variant & { price: number })[];
  designs: Design[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  categoryId: string | null;
  printfulId: string;
  printfulSync: boolean;
}


