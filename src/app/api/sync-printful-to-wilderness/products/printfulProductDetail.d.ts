export interface ProductDetailApiResponse {
  code: number;
  result: Result;
  extra: any[];
}

export interface Result {
  sync_product: SyncProduct;
  sync_variants: SyncVariant[];
}

export interface SyncProduct {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url: string;
  is_ignored: boolean;
  description?: string; // Přidáno pole pro popis produktu
}

export interface SyncVariant {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  synced: boolean;
  variant_id: number;
  main_category_id: number;
  warehouse_product_id: number | null;
  warehouse_product_variant_id: number | null;
  retail_price: string;
  sku: string;
  currency: string;
  product: VariantProduct;
  files: VariantFile[];
  options: VariantOption[];
  is_ignored: boolean;
  size: string;
  color: string;
  availability_status: string;
}

export interface VariantProduct {
  variant_id: number;
  product_id: number;
  image: string;
  name: string;
  description?: string; // Přidáno pole pro popis produktu
}

export interface VariantFile {
  id: number;
  type: string;
  hash: string | null;
  url: string | null;
  filename: string;
  mime_type: string;
  size: number;
  width: number;
  height: number;
  dpi: number | null;
  status: string;
  created: number;
  thumbnail_url: string | null;
  preview_url: string | null;
  visible: boolean;
  is_temporary: boolean;
  message: string;
  stitch_count_tier: string | null;
}

export interface VariantOption {
  id: string;
  value: string;
}
