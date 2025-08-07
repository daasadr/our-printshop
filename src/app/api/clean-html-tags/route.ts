import { NextRequest, NextResponse } from 'next/server';
import { createDirectus, rest, staticToken, readItems, updateItem } from '@directus/sdk';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL!)
  .with(rest())
  .with(staticToken(process.env.DIRECTUS_TOKEN!));

// Funkcia na vyčistenie HTML tagov
function stripHtmlTags(text: string): string {
  if (!text) return text;
  return text
    .replace(/<[^>]*>/g, '') // Odstráň HTML tagy
    .replace(/&lt;/g, '<')   // Dekóduj HTML entity
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Načítavam všetky produkty...');
    
    // Načítaj všetky produkty
    const products = await directus.request(
      readItems('products', {
        fields: ['id', 'name', 'description_cs', 'description_sk', 'description_en', 'description_de', 'description']
      })
    );

    console.log(`📦 Našiel som ${products.length} produktov`);

    let updatedCount = 0;

    for (const product of products) {
      const originalDescriptions = {
        description: product.description,
        description_cs: product.description_cs,
        description_sk: product.description_sk,
        description_en: product.description_en,
        description_de: product.description_de
      };

      const cleanedDescriptions = {
        description: stripHtmlTags(product.description),
        description_cs: stripHtmlTags(product.description_cs),
        description_sk: stripHtmlTags(product.description_sk),
        description_en: stripHtmlTags(product.description_en),
        description_de: stripHtmlTags(product.description_de)
      };

      // Skontroluj, či sa niečo zmenilo
      const hasChanges = Object.keys(originalDescriptions).some(key => 
        originalDescriptions[key] !== cleanedDescriptions[key]
      );

      if (hasChanges) {
        console.log(`🧹 Čistím HTML tagy z produktu: ${product.name}`);
        
        // Aktualizuj produkt
        await directus.request(
          updateItem('products', product.id, cleanedDescriptions)
        );
        
        updatedCount++;
      }
    }

    console.log(`✅ Hotovo! Aktualizovaných ${updatedCount} produktov`);
    return NextResponse.json({ success: true, message: `Vyčistených ${updatedCount} produktov` });

  } catch (error) {
    console.error('❌ Chyba pri čistení HTML tagov:', error);
    return NextResponse.json({ success: false, error: 'Chyba pri čistení HTML tagov' }, { status: 500 });
  }
} 