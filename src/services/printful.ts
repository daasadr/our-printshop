import fetch from 'node-fetch';

const PRINTFUL_API_URL = 'https://api.printful.com';
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

// Základní hlavičky pro autentizaci
const getHeaders = () => ({
  'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
  'Content-Type': 'application/json'
});

// Získání seznamu všech produktů z Printful
export async function getProducts() {
  const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching products: ${response.statusText}`);
  }
  
  return response.json();
}

// Vytvoření nového produktu s designem
export async function createProduct(productData) {
  const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(productData)
  });
  
  if (!response.ok) {
    throw new Error(`Error creating product: ${response.statusText}`);
  }
  
  return response.json();
}

// Nahrání designu
export async function uploadDesign(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${PRINTFUL_API_URL}/files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error(`Error uploading design: ${response.statusText}`);
  }
  
  return response.json();
}

// Vytvoření objednávky
export async function createOrder(orderData) {
  const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(orderData)
  });
  
  if (!response.ok) {
    throw new Error(`Error creating order: ${response.statusText}`);
  }
  
  return response.json();
}

// Získání informací o objednávce
export async function getOrder(orderId) {
  const response = await fetch(`${PRINTFUL_API_URL}/orders/${orderId}`, {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching order: ${response.statusText}`);
  }
  
  return response.json();
}

// Sledování stavu zásob
export async function getProductVariantStock(variantId) {
  const response = await fetch(`${PRINTFUL_API_URL}/store/variants/${variantId}`, {
    headers: getHeaders()
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching variant: ${response.statusText}`);
  }
  
  return response.json();
}