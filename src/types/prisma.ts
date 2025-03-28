import { Product, Variant, Design, Order, OrderItem, ShippingInfo, User, Prisma } from '@prisma/client';

// Produkt s variantami a designy
export interface ProductWithRelations extends Product {
  variants: Variant[];
  designs: Design[];
}

// Pro zpětnou kompatibilitu - stejný typ jako ProductWithRelations
export interface ProductWithDetails extends Product {
  variants: Variant[];
  designs: Design[];
}

// Varianta produktu s odkazem na produkt
export interface VariantWithProduct extends Variant {
  product: Product;
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
}

// Typ pro dotaz na produkty
export type ProductQueryInput = {
  where: {
    isActive: boolean;
    category?: string;
  };
  include: {
    variants: {
      where: {
        isActive: boolean;
      };
      orderBy: {
        price: Prisma.SortOrder;
      };
    };
    designs: boolean;
  };
  take?: number;
  orderBy?: {
    createdAt: Prisma.SortOrder;
  };
};