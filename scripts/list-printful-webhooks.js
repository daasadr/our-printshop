import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

async function listWebhooks() {
  try {
    const response = await fetch('https://api.printful.com/webhooks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    console.log('Existing webhooks:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error listing webhooks:', error);
  }
}

listWebhooks(); 