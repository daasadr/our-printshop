import fetch from 'node-fetch';

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const WEBHOOK_URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/printful-webhook';

async function setupPrintfulWebhook() {
  try {
    const response = await fetch('https://api.printful.com/webhooks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        types: [
          'package_shipped',
          'package_delivered',
          'order_failed',
          'order_canceled'
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Failed to setup webhook: ${JSON.stringify(data)}`);
    }

    console.log('Printful webhook setup successful:', data);
    // Uložte si secret z odpovědi do .env jako PRINTFUL_WEBHOOK_SECRET
    console.log('Add this to your .env file:');
    console.log(`PRINTFUL_WEBHOOK_SECRET=${data.result.secret}`);
  } catch (error) {
    console.error('Error setting up Printful webhook:', error);
  }
}

setupPrintfulWebhook(); 