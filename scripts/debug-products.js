require('dotenv').config();
const { createDirectus, rest, readItems } = require('@directus/sdk');

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL)
  .with(rest());

async function debugProducts() {
  try {
    console.log('🔍 Debugujem produkty...');
    
    const response = await directus.request(readItems('products', {
      fields: ['id', 'name'],
      limit: 5
    }));
    
    console.log('Response typ:', typeof response);
    console.log('Response:', JSON.stringify(response, null, 2));
    
    if (Array.isArray(response)) {
      console.log('✅ Response je pole s', response.length, 'produktmi');
    } else if (response && response.data) {
      console.log('✅ Response má data s', response.data.length, 'produktmi');
    } else {
      console.log('❌ Neznámy formát response');
    }
    
  } catch (error) {
    console.error('❌ Chyba:', error.message);
  }
}

debugProducts(); 