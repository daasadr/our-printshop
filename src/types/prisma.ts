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