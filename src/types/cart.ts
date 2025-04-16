export interface CartItem {
  variantId: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface ShippingInfo {
  name: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  country: string;
  zip: string;
} 