import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Získat IP adresu
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0] : realIp || request.ip || '127.0.0.1';

    // Pokud je localhost, použít testovací IP
    const testIp = ip === '127.0.0.1' || ip === '::1' ? '8.8.8.8' : ip;

    // Volat free geolocation API
    const response = await fetch(`http://ip-api.com/json/${testIp}?fields=countryCode,country`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch geolocation');
    }

    const data = await response.json();
    
    // Mapovat země na jazyky
    const countryToLanguage: { [key: string]: string } = {
      'CZ': 'cs', // Česká republika
      'SK': 'sk', // Slovensko
      'DE': 'de', // Německo
      'AT': 'de', // Rakousko
      'CH': 'de', // Švýcarsko
      'LI': 'de', // Lichtenštejnsko
      'LU': 'de', // Lucembursko
    };

    const detectedLanguage = countryToLanguage[data.countryCode] || 'en';
    
    return NextResponse.json({
      success: true,
      countryCode: data.countryCode,
      country: data.country,
      detectedLanguage,
      ip: ip
    });

  } catch (error) {
    console.error('Geolocation error:', error);
    
    // Fallback na angličtinu při chybě
    return NextResponse.json({
      success: false,
      detectedLanguage: 'en',
      error: 'Failed to detect location'
    });
  }
} 