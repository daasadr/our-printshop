import { Product as PrismaProduct, Variant, Design, Order, OrderItem, ShippingInfo, User, Category, Prisma } from '@prisma/client';

// Produkt s variantami a designy
export interface ProductWithRelations extends PrismaProduct {
  variants: Variant[];
  designs: Design[];
  categoryRelation?: Category | null;
}

// Pro zpětnou kompatibilitu - stejný typ jako ProductWithRelations
export interface ProductWithDetails extends PrismaProduct {
  variants: Variant[];
  designs: Design[];
  categoryRelation?: Category | null;
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
  shippingInfo: ShippingInfo | null;
  user: User | null;
}

// Formátovaný produkt pro klienta
export interface FormattedProduct {
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  price: number;
  variants: Variant[];
  designs: Design[];
  category?: string;
  categoryRelation?: Category | null;
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
  variants: ProductVariant[];
  designs: ProductDesign[];
}


