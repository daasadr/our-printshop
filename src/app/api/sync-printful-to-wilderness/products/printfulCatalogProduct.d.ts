export interface CatalogProductApiResponse {
  code: number;
  result: CatalogProduct;
  extra: any[];
}

export interface CatalogProduct {
  id: number;
  title: string;
  description: string; // Dlouhý popis produktu
  brand: string;
  model: string;
  image: string;
  variant_count: number;
  currency: string;
  options: CatalogProductOption[];
  is_discontinued: boolean;
  avg_fulfillment_time: number;
  description_text: string; // Další možný popis
  description_html: string; // HTML verze popisu
}

export interface CatalogProductOption {
  id: string;
  title: string;
  type: string;
  values: CatalogProductOptionValue[];
}

export interface CatalogProductOptionValue {
  id: string;
  title: string;
  colors?: string[];
} 