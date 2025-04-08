export interface PrintfulFileResponse {
    id: number;
    url: string;
  }
  
  export interface PrintfulProductResponse {
    id: number;
    external_id: string;
    name: string;
    // další vlastnosti...
  }
  
  export interface PrintfulOrderResponse {
    id: number;
    external_id: string;
    status: string;
    // další vlastnosti...
  }
  
  // Pro createProduct
  export interface PrintfulProductData {
    sync_product: {
      name: string;
      thumbnail_url?: string;
      external_id?: string;
    };
    sync_variants: Array<{
      variant_id: number;
      retail_price: number;
      external_id?: string;
      files?: Array<{
        type: string;
        url?: string;
        file_id?: number;
        position?: string;
      }>;
    }>;
  }
  
  // Pro createOrder
  export interface PrintfulOrderData {
    recipient: {
      name: string;
      address1: string;
      address2?: string;
      city: string;
      state_code?: string;
      country_code: string;
      zip: string;
      phone?: string;
      email: string;
    };
    items: Array<{
      variant_id: number;
      quantity: number;
      external_variant_id?: string;
    }>;
    retail_costs?: {
      subtotal?: string;
      discount?: string;
      shipping?: string;
      tax?: string;
    };
  }

  