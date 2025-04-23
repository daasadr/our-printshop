// Základní typy pro API odpovědi
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

// Základní typy pro soubory
export interface PrintfulFile {
    id: string | number;
    type: string;
    url: string;
    options?: string[];
    filename?: string;
    mime_type?: string;
    size?: number;
    width?: number;
    height?: number;
    dpi?: number;
    status?: string;
    created?: string;
    thumbnail_url?: string;
    preview_url?: string;
    visible?: boolean;
    position?: string;
}

// Základní typy pro produkty
export interface PrintfulProductData {
    id?: string | number;
    external_id?: string;
    name: string;
    variants?: PrintfulVariant[];
    sync_product: {
        id?: number;
        name: string;
        thumbnail_url?: string;
        external_id?: string;
    };
    sync_variants?: Array<{
        variant_id: number;
        retail_price: number;
        external_id?: string;
        files?: PrintfulFile[];
    }>;
    thumbnail_url?: string;
    is_ignored?: boolean;
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

// Typy pro objednávky
export interface PrintfulRecipient {
    name: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state_code?: string;
    state_name?: string;
    country_code: string;
    country_name?: string;
    zip: string;
    phone?: string;
    email: string;
}

export interface PrintfulOrderItem {
    id?: number;
    external_id?: string;
    variant_id: number;
    quantity: number;
    price?: string;
    retail_price?: string;
    name?: string;
    product?: {
        variant_id: number;
        product_id: number;
        image: string;
        name: string;
    };
    sync_variant_id?: number;
    files?: PrintfulFile[];
    options?: PrintfulItemOption[];
}

export interface PrintfulItemOption {
    id: string;
    value: string;
}

export interface PrintfulOrderData {
    external_id?: string;
    recipient: PrintfulRecipient;
    items: PrintfulOrderItem[];
    retail_costs?: {
        subtotal?: string | number;
        discount?: string | number;
        shipping?: string | number;
        tax?: string | number;
        total?: number;
        currency?: string;
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

export interface PrintfulOrderResponse {
    id: number;
    external_id: string;
    status: string;
    shipping: string;
    created: string;
    updated: string;
    recipient: PrintfulRecipient;
    items: PrintfulOrderItem[];
    costs: {
        subtotal: string;
        discount: string;
        shipping: string;
        tax: string;
        total: string;
        currency: string;
    };
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
