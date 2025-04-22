const PRINTFUL_API_URL = 'https://api.printful.com';

interface PrintfulOrderItem {
  variant_id: number;
  quantity: number;
  retail_price: string;
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
  recipient: PrintfulAddress;
  items: PrintfulOrderItem[];
}

export async function createPrintfulOrder(order: PrintfulOrder) {
  try {
    const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: order.recipient,
        items: order.items,
      }),
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Printful order:', error);
    throw error;
  }
}

export async function getShippingRates(order: PrintfulOrder) {
  try {
    const response = await fetch(`${PRINTFUL_API_URL}/shipping/rates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: order.recipient,
        items: order.items,
      }),
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting shipping rates:', error);
    throw error;
  }
} 