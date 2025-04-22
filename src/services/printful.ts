import fetch from 'node-fetch';
import { PrintfulProductData, PrintfulOrderData, PrintfulApiResponse, PrintfulFile, PrintfulOrderResponse } from '@/types/printful';


const PRINTFUL_API_URL = 'https://api.printful.com';
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

// Základní hlavičky pro autentizaci
const getHeaders = () => ({
  'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
  'Content-Type': 'application/json'
});

// Získání seznamu všech produktů z Printful
export async function getProducts(): Promise<PrintfulApiResponse<PrintfulProductData[]>> {
  const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching products: ${response.statusText}`);
  }
  
  const data = await response.json() as PrintfulApiResponse<PrintfulProductData[]>;
  return data;
}

// Vytvoření nového produktu s designem
export async function createProduct(productData: PrintfulProductData): Promise<PrintfulApiResponse<PrintfulProductData>> {
  const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(productData)
  });
  
  if (!response.ok) {
    throw new Error(`Error creating product: ${response.statusText}`);
  }
  
  const data = await response.json() as PrintfulApiResponse<PrintfulProductData>;
  return data;
}

// Upload designu
export async function uploadDesign(file: File): Promise<PrintfulApiResponse<PrintfulFile>> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${PRINTFUL_API_URL}/files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`
      // Nepřidáváme Content-Type, nechť jej nastaví browser pro FormData
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Error uploading design: ${response.statusText}`);
  }

  const data = await response.json() as PrintfulApiResponse<PrintfulFile>;
  return data;
}

// Vytvoření objednávky
export async function createOrder(orderData: PrintfulOrderData): Promise<PrintfulApiResponse<PrintfulOrderResponse>> {
  const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(orderData)
  });
  
  if (!response.ok) {
    throw new Error(`Error creating order: ${response.statusText}`);
  }
  
  const data = await response.json() as PrintfulApiResponse<PrintfulOrderResponse>;
  return data;
}

// Získání informací o objednávce
export async function getOrder(orderId: string): Promise<PrintfulApiResponse<PrintfulOrderData>> {
  const response = await fetch(`${PRINTFUL_API_URL}/orders/${orderId}`, {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching order: ${response.statusText}`);
  }
  
  const data = await response.json() as PrintfulApiResponse<PrintfulOrderData>;
  return data;
}

// Sledování stavu zásob
export async function getProductVariantStock(variantId: number | string): Promise<PrintfulApiResponse<{in_stock: boolean}>> {
  const response = await fetch(`${PRINTFUL_API_URL}/store/variants/${variantId}`, {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching variant: ${response.statusText}`);
  }
  
  const data = await response.json() as PrintfulApiResponse<{in_stock: boolean}>;
  return data;
}