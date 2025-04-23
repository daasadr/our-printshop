import fetch from 'node-fetch';
import { PrintfulApiResponse, PrintfulFile, PrintfulProductData, PrintfulOrderData, PrintfulOrderResponse } from '@/types/printful';

const PRINTFUL_API_URL = 'https://api.printful.com';
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

// Pomocná funkce pro hlavičky
function getHeaders() {
  return {
    'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
    'Content-Type': 'application/json'
  };
}

// Získání všech produktů
export async function getProducts(): Promise<PrintfulApiResponse<PrintfulProductData[]>> {
  const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`Error fetching products: ${response.statusText}`);
  }

  return response.json() as Promise<PrintfulApiResponse<PrintfulProductData[]>>;
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

  return response.json() as Promise<PrintfulApiResponse<PrintfulProductData>>;
}

// Nahrání designu
export async function uploadDesign(file: File): Promise<PrintfulApiResponse<PrintfulFile>> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${PRINTFUL_API_URL}/files/designs`, {
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

  return response.json() as Promise<PrintfulApiResponse<PrintfulFile>>;
}

// Vytvoření objednávky v Printful
export async function createOrder(orderData: PrintfulOrderData): Promise<PrintfulApiResponse<PrintfulOrderResponse>> {
  const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    throw new Error(`Error creating order: ${response.statusText}`);
  }

  return response.json() as Promise<PrintfulApiResponse<PrintfulOrderResponse>>;
}

// Získání informací o objednávce
export async function getOrder(orderId: number): Promise<PrintfulApiResponse<PrintfulOrderResponse>> {
  const response = await fetch(`${PRINTFUL_API_URL}/orders/${orderId}`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`Error fetching order: ${response.statusText}`);
  }

  return response.json() as Promise<PrintfulApiResponse<PrintfulOrderResponse>>;
}

// Získání informací o produktu
export async function getProduct(productId: number): Promise<PrintfulApiResponse<PrintfulProductData>> {
  const response = await fetch(`${PRINTFUL_API_URL}/store/products/${productId}`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`Error fetching product: ${response.statusText}`);
  }

  return response.json() as Promise<PrintfulApiResponse<PrintfulProductData>>;
}

// Aktualizace produktu
export async function updateProduct(productId: number, productData: Partial<PrintfulProductData>): Promise<PrintfulApiResponse<PrintfulProductData>> {
  const response = await fetch(`${PRINTFUL_API_URL}/store/products/${productId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(productData)
  });

  if (!response.ok) {
    throw new Error(`Error updating product: ${response.statusText}`);
  }

  return response.json() as Promise<PrintfulApiResponse<PrintfulProductData>>;
}

// Smazání produktu
export async function deleteProduct(productId: number): Promise<PrintfulApiResponse<void>> {
  const response = await fetch(`${PRINTFUL_API_URL}/store/products/${productId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`Error deleting product: ${response.statusText}`);
  }

  return response.json() as Promise<PrintfulApiResponse<void>>;
}