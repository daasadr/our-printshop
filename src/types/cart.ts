export interface CartItem {
  id: string;
  variant_id: string;
  quantity: number;
  variant?: {
    id: string;
    name: string;
    price: number;
    product?: {
      id: string;
      name: string;
      mockups?: string[];
    };
  };
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
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