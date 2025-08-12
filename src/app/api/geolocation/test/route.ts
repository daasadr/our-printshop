import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Získat IP adresu
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0] : realIp || request.ip || '127.0.0.1';

    // Získat Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || '';

    // Volat geolocation API
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode,country,region,regionName,city,timezone,isp`);
    
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
      ip: ip,
      acceptLanguage: acceptLanguage,
      geolocation: data,
      detectedLanguage,
      countryToLanguage: countryToLanguage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Geolocation test error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to detect location',
      timestamp: new Date().toISOString()
    });
  }
} 