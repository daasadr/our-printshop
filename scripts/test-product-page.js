require('dotenv').config();

async function testGetProduct() {
  try {
    console.log('🧪 Testujem getProduct funkciu...');
    
    const response = await fetch('https://directus-on-fly.fly.dev/items/products/103?fields=*,variants.id,variants.name,variants.size,variants.color,variants.price,variants.is_active,variants.sku,designs.*,description_cs,description_sk,description_en,description_de,name_cs,name_sk,name_en,name_de');
    
    if (!response.ok) {
      console.log('❌ Response not ok:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    const product = data.data;

    console.log('✅ Produkt načítaný úspešne!');
    console.log('ID:', product.id);
    console.log('Názov:', product.name);
    console.log('Popis CS:', product.description_cs?.substring(0, 50) + '...');
    console.log('Popis SK:', product.description_sk?.substring(0, 50) + '...');
    console.log('Počet variantov:', product.variants?.length || 0);
    console.log('Počet designov:', product.designs?.length || 0);
    
  } catch (error) {
    console.error('❌ Chyba pri načítaní produktu:', error.message);
    console.error('Stack:', error.stack);
  }
}

testGetProduct(); 