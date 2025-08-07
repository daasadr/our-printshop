import { NextRequest, NextResponse } from 'next/server';

// MyMemory API - bezplatná služba
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

export async function POST(request: NextRequest) {
  try {
    const { text, from, to } = await request.json();

    if (!text || !from || !to) {
      return NextResponse.json(
        { error: 'Chýbajú povinné parametre: text, from, to' },
        { status: 400 }
      );
    }

    console.log(`Prekladám z ${from} do ${to}:`, text.substring(0, 50) + '...');

    // MyMemory API používa GET request s query parametrami
    const params = new URLSearchParams({
      q: text,
      langpair: `${from}|${to}`,
      de: 'your-email@domain.com' // voliteľné, pre vyššie limity
    });

    const response = await fetch(`${MYMEMORY_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.responseStatus !== 200) {
      throw new Error(`MyMemory API error: ${data.responseStatus} - ${data.responseDetails}`);
    }

    const translatedText = data.responseData.translatedText;

    console.log('Preložený text:', translatedText.substring(0, 50) + '...');

    return NextResponse.json({
      success: true,
      translatedText,
      originalText: text,
      from,
      to
    });

  } catch (error) {
    console.error('Chyba pri preklade:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Chyba pri preklade',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 