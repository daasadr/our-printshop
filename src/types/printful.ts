// Základní typy pro produkty
export interface PrintfulProductData {
    id: string;
    name: string;
    variants: PrintfulVariant[];
    sync_product: {
        id: number;
        name: string;
        thumbnail_url: string;
    };
    thumbnail_url: string;
    is_ignored: boolean;
}

export interface PrintfulVariant {
    id: string;
    product_id: string;
    name: string;
    size: string;
    color: string;
    price: number;
    retail_price: number;
    inventory: number;
    sync_variant_id: number;
    variant_id: number;
    files: PrintfulFile[];
}

export interface PrintfulFile {
    id: string;
    type: string;
    url: string;
    options: string[];
    filename: string;
    mime_type: string;
    size: number;
    width: number;
    height: number;
    dpi: number;
    status: string;
    created: string;
    thumbnail_url: string;
    preview_url: string;
    visible: boolean;
}

// Typy pro objednávky
export interface PrintfulResponse {
    id: number;
    external_id: string;
    status: string;
    shipping: string;
    created: string;
    updated: string;
    recipient: PrintfulRecipient;
    items: PrintfulOrderItem[];
}

export interface PrintfulOrderData {
    external_id?: string;
    recipient: PrintfulRecipient;
    items: Array<{
        variant_id: number;
        quantity: number;
        retail_price?: string;
    }>;
    retail_costs?: {
        subtotal: number;
        discount: number;
        shipping: number;
        tax: number;
        total: number;
    };
    gift?: {
        subject?: string;
        message?: string;
    };
    packing_slip?: {
        email?: string;
        phone?: string;
        message?: string;
        logo_url?: string;
    };
}

export interface PrintfulRecipient {
    name: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state_code: string;
    state_name: string;
    country_code: string;
    country_name: string;
    zip: string;
    phone?: string;
    email: string;
}

export interface PrintfulOrderItem {
    variant_id: string;
    quantity: number;
    retail_price: string;
    name: string;
    sync_variant_id?: number;
    files?: PrintfulFile[];
    options?: PrintfulItemOption[];
}

export interface PrintfulItemOption {
    id: string;
    value: string;
}

// Typy pro shipping
export interface PrintfulShippingRate {
    id: string;
    name: string;
    rate: string;
    currency: string;
    minDeliveryDays: number;
    maxDeliveryDays: number;
}

// Typy pro synchronizaci
export interface PrintfulSyncProduct {
    id: number;
    external_id: string;
    name: string;
    variants: number;
    synced: number;
    thumbnail_url: string;
    is_ignored: boolean;
}

// Typy pro chyby
export interface PrintfulError {
    code: number;
    message: string;
    fields?: {
        [key: string]: string[];
    };
}

// Typy pro odpovědi API
export interface PrintfulApiResponse<T> {
    code: number;
    result: T;
    extra: any[];
    paging?: {
        total: number;
        offset: number;
        limit: number;
    };
}

export interface PrintfulOrderResponse {
    id: number;
    external_id: string;
    status: string;
    shipping: string;
    created: string;
    updated: string;
    recipient: PrintfulRecipient;
    items: Array<{
        id: number;
        external_id: string;
        variant_id: number;
        quantity: number;
        price: string;
        retail_price: string;
        name: string;
        product: {
            variant_id: number;
            product_id: number;
            image: string;
            name: string;
        };
    }>;
    costs: {
        subtotal: string;
        discount: string;
        shipping: string;
        tax: string;
        total: string;
        currency: string;
    };
}