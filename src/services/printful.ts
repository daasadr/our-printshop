import { PrintfulApiResponse, PrintfulFile, PrintfulProductData, PrintfulOrderData, PrintfulOrderResponse } from '@/types/printful';
import { readItem, updateItem, readOrder, updateOrder } from '@/lib/directus';

const PRINTFUL_API_URL = 'https://api.printful.com';
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

if (!PRINTFUL_API_KEY) {
  throw new Error('PRINTFUL_API_KEY is not defined');
}

interface PrintfulError {
  code: number;
  message: string;
}

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

  const response = await fetch(`${PRINTFUL_API_URL}/files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Printful API error:', error);
    throw new Error('Printful API error');
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

export async function fulfillOrder(orderId: string) {
  try {
    // 1. Načíst objednávku z Directus
    const order = await readOrder(orderId, {
      fields: ['*', 'items.*', 'items.variant.*', 'shippingInfo.*']
    });

    if (!order || !order.shippingInfo) {
      throw new Error('Order not found or missing shipping info');
    }

    // 2. Vytvořit data pro Printful API
    const printfulOrderData: PrintfulOrderData = {
      external_id: order.id,
      recipient: {
        name: order.shippingInfo.name,
        address1: order.shippingInfo.address1,
        city: order.shippingInfo.city,
        state_code: order.shippingInfo.state || '',
        country_code: order.shippingInfo.country,
        zip: order.shippingInfo.zip
      },
      items: order.items.map((item: { variant: { printfulVariantId: string }, quantity: number, price: number }) => ({
        variant_id: parseInt(item.variant.printfulVariantId),
        quantity: item.quantity,
        retail_price: item.price.toString()
      }))
    };

    // 3. Odeslat objednávku do Printful
    const response = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
      },
      body: JSON.stringify(printfulOrderData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Printful API error: ${JSON.stringify(error)}`);
    }

    const printfulResponse = await response.json() as PrintfulOrderResponse;

    // 4. Aktualizovat objednávku v Directus
    await updateOrder(orderId, {
      printfulOrderId: printfulResponse.result.id.toString(),
      status: 'processing'
    });

    return true;
  } catch (error) {
    console.error('Error fulfilling order with Printful:', error);
    // Aktualizovat stav objednávky na cancelled
    await updateOrder(orderId, {
      status: 'cancelled'
    });
    throw error;
  }
}

async function fetchPrintful(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${PRINTFUL_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Printful API error:', error);
    throw new Error('Printful API error');
  }

  return response.json();
}

export async function createPrintfulOrder(order: PrintfulOrderData): Promise<PrintfulApiResponse<PrintfulOrderResponse>> {
  return fetchPrintful('/orders', {
    method: 'POST',
    body: JSON.stringify(order)
  });
}