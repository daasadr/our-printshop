export interface Product {
  id: string;
  name: string;
  description: string;
  design_info?: string;
  printful_id: string;
  is_active: boolean;
  date_created: string;
  date_updated: string;
  category_id: string | null;
  mockups: string[];
  price?: number;
  categories?: Category[];
  designs?: Design[];
  // Prekladové polia
  name_cs?: string;
  name_sk?: string;
  name_en?: string;
  name_de?: string;
  description_cs?: string;
  description_sk?: string;
  description_en?: string;
  description_de?: string;
}

export interface Variant {
  id: string;
  product: string;
  name: string;
  sku: string;
  price: number;
  is_active: boolean;
}

export interface Design {
  id: string;
  name: string;
  printfulFileId: string;
  previewUrl: string;
  date_created: string;
  date_updated: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  displayName?: string;
  parentId?: string | null;
  isActive: boolean;
  date_created: string;
  date_updated: string;
}

export interface ProductWithRelations extends Omit<Product, 'categories'> {
  variants: (Variant & { price: number })[];
  designs: Design[];
  main_category?: string;
  // Prozatím odstraníme kategorie, dokud nevyřešíme oprávnění
  // categories: { category: Category; categoryId: string }[];
}

export interface Order {
  id: string;
  status: 'pending' | 'processing' | 'fulfilled' | 'cancelled';
  total_price: number;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  printfulOrderId?: string;
  date_created: string;
  date_updated: string;
  fulfilled_at?: string;
}

export interface OrderItem {
  id: string;
  order: string;
  product: string;
  variant: string;
  quantity: number;
  price: number;
}

export interface OrderItemWithRelations extends Omit<OrderItem, 'variant'> {
  variant: ProductVariant;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  product?: Product;
  printfulVariantId: string;
  design_url?: string;
}

export interface Cart {
  id: string;
  user_id: string;
  date_created: string;
  date_updated: string;
} 