const PRINTFUL_API_URL = 'https://api.printful.com';

interface PrintfulOrderItem {
  variant_id: number;
  quantity: number;
  files: {
    url: string;
  }[];
}

interface PrintfulAddress {
  name: string;
  address1: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
  email: string;
  phone?: string;
}

interface PrintfulOrder {
  external_id: string;
  shipping: {
    address1: string;
    city: string;
    country_code: string;
    state_code: string;
    zip: string;
  };
  items: PrintfulOrderItem[];
}

export async function createPrintfulOrder(order: PrintfulOrder) {
  const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
    },
    body: JSON.stringify(order)
  });

  if (!response.ok) {
    throw new Error(`Failed to create Printful order: ${response.statusText}`);
  }

  return response.json();
}

export async function getPrintfulOrder(orderId: string) {
  const response = await fetch(`${PRINTFUL_API_URL}/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get Printful order: ${response.statusText}`);
  }

  return response.json();
}

export async function getShippingRates(order: PrintfulOrder) {
  const response = await fetch(`${PRINTFUL_API_URL}/shipping/rates`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipient: order.shipping,
      items: order.items,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get shipping rates: ${response.statusText}`);
  }

  return response.json();
} 