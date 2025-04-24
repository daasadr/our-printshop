// Základní typy pro API odpovědi
export interface PrintfulApiResponse<T> {
    code: number;
    result: T;
    extra: Array<{
        code: string;
        message: string;
    }>;
    paging?: {
        total: number;
        offset: number;
        limit: number;
    };
}

// Základní typy pro soubory
export interface PrintfulFile {
    id: number;
    type: string;
    hash: string;
    url: string;
    filename: string;
    mime_type: string;
    size: number;
    width: number;
    height: number;
    dpi: number;
    created: number;
    thumbnail_url: string;
    preview_url: string;
    visible: boolean;
}

// Základní typy pro produkty
export interface PrintfulProductData {
    id: number;
    name: string;
    variants: Array<{
        id: number;
        product_id: number;
        name: string;
        size: string;
        color: string;
        price: string;
        in_stock: boolean;
    }>;
    files: Array<{
        id: number;
        type: string;
        hash: string;
        url: string;
        filename: string;
        mime_type: string;
        size: number;
        width: number;
        height: number;
        dpi: number;
        created: number;
        thumbnail_url: string;
        preview_url: string;
        visible: boolean;
    }>;
    options: Array<{
        id: string;
        name: string;
        values: Array<{
            id: string;
            name: string;
        }>;
    }>;
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
    external_id: string;
    shipping: string;
    recipient: {
        name: string;
        address1: string;
        city: string;
        state_code: string;
        country_code: string;
        zip: string;
    };
    items: Array<{
        variant_id: number;
        quantity: number;
    }>;
}

export interface PrintfulOrderResponse {
    id: number;
    external_id: string;
    status: string;
    shipping: string;
    created: number;
    updated: number;
    recipient: {
        name: string;
        address1: string;
        city: string;
        state_code: string;
        country_code: string;
        zip: string;
    };
    items: Array<{
        id: number;
        quantity: number;
        variant_id: number;
        name: string;
        product_id: number;
        sku: string;
        retail_price: string;
    }>;
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
