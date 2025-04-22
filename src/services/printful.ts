import fetch from 'node-fetch';
<<<<<<< HEAD
import { PrintfulProductData, PrintfulOrderData, PrintfulApiResponse, PrintfulFile, PrintfulOrderResponse } from '@/types/printful';

=======
import { PrintfulFileResponse, PrintfulProductResponse, PrintfulProductData, PrintfulOrderData } from '@/types/printful';
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8

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
<<<<<<< HEAD
  
  const data = await response.json() as PrintfulApiResponse<PrintfulProductData[]>;
  return data;
}

// Vytvoření nového produktu s designem
export async function createProduct(productData: PrintfulProductData): Promise<PrintfulApiResponse<PrintfulProductData>> {
=======

  return response.json();
}

// Vytvoření nového produktu s designem
export async function createProduct(productData: PrintfulProductData) {
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8
  const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(productData)
  });

  if (!response.ok) {
    throw new Error(`Error creating product: ${response.statusText}`);
  }
<<<<<<< HEAD
  
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
=======

  return response.json();
}

// Nahrání designu
export async function uploadDesign(file: File) {
  // Oprava: Vytvořit FormData s Node.js kompatibilním způsobem
  const formData = new FormData();
  formData.append('file', file);

  // Použití TypeScriptu pro převod na správný typ pro fetch
  const response = await fetch(`${PRINTFUL_API_URL}/files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
      // Nebudeme nastavovat Content-Type, to udělá FormData automaticky
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Error uploading design: ${response.statusText}`);
  }

<<<<<<< HEAD
  const data = await response.json() as PrintfulApiResponse<PrintfulFile>;
  return data;
}

// Vytvoření objednávky
export async function createOrder(orderData: PrintfulOrderData): Promise<PrintfulApiResponse<PrintfulOrderResponse>> {
=======
  return response.json();
}

// Vytvoření objednávky
export async function createOrder(orderData: PrintfulOrderData) {
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8
  const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    throw new Error(`Error creating order: ${response.statusText}`);
  }
<<<<<<< HEAD
  
  const data = await response.json() as PrintfulApiResponse<PrintfulOrderResponse>;
  return data;
}

// Získání informací o objednávce
export async function getOrder(orderId: string): Promise<PrintfulApiResponse<PrintfulOrderData>> {
=======

  return response.json();
}

// Získání informací o objednávce
export async function getOrder(orderId: string) {
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8
  const response = await fetch(`${PRINTFUL_API_URL}/orders/${orderId}`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`Error fetching order: ${response.statusText}`);
  }
<<<<<<< HEAD
  
  const data = await response.json() as PrintfulApiResponse<PrintfulOrderData>;
  return data;
}

// Sledování stavu zásob
export async function getProductVariantStock(variantId: number | string): Promise<PrintfulApiResponse<{in_stock: boolean}>> {
=======

  return response.json();
}

// Sledování stavu zásob
export async function getProductVariantStock(variantId: number | string) {
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8
  const response = await fetch(`${PRINTFUL_API_URL}/store/variants/${variantId}`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    throw new Error(`Error fetching variant: ${response.statusText}`);
  }
<<<<<<< HEAD
  
  const data = await response.json() as PrintfulApiResponse<{in_stock: boolean}>;
  return data;
=======

  return response.json();
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8
}