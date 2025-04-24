import fetch from 'node-fetch';

interface PrintfulWebhookResponse {
  result: {
    secret: string;
  };
}

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
        secret: process.env.PRINTFUL_WEBHOOK_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to setup webhook: ${response.statusText}`);
    }

    const data = await response.json() as PrintfulWebhookResponse;
    
    console.log('Printful webhook setup successful:', data);
    // Uložte si secret z odpovědi do .env jako PRINTFUL_WEBHOOK_SECRET
    console.log('Add this to your .env file:');
    console.log(`PRINTFUL_WEBHOOK_SECRET=${data.result.secret}`);
  } catch (error) {
    console.error('Error setting up Printful webhook:', error);
  }
}

setupPrintfulWebhook(); 