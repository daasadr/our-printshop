import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Načtení .env souboru
dotenv.config();

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const WEBHOOK_URL = 'https://happywilderness.cz/api/printful-webhook';

async function setupPrintfulWebhook() {
  try {
    console.log('Setting up webhook for URL:', WEBHOOK_URL);
    console.log('Using Printful API key:', PRINTFUL_API_KEY);

    const response = await fetch('https://api.printful.com/webhooks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        types: [
          'order_created',
          'order_updated',
          'order_failed'
        ]
      })
    });

    const data = await response.json();
    console.log('Raw API response:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      throw new Error(`Failed to setup webhook: ${JSON.stringify(data)}`);
    }

    if (!data.result || !data.result.secret) {
      console.log('Warning: No webhook secret received in response');
      console.log('Full response:', data);
      return;
    }

    console.log('Printful webhook setup successful!');
    console.log('Add this to your .env file:');
    console.log(`PRINTFUL_WEBHOOK_SECRET=${data.result.secret}`);
  } catch (error) {
    console.error('Error setting up Printful webhook:', error);
  }
}

setupPrintfulWebhook(); 