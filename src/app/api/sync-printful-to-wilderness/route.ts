import { NextRequest, NextResponse } from 'next/server';
import { sync } from './sync';

// Force dynamic rendering - don't generate static pages for this API
export const dynamic = 'force-dynamic';

const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

if (!PRINTFUL_API_KEY || !DIRECTUS_URL || !DIRECTUS_TOKEN) {
  console.error('Chybí PRINTFUL_API_KEY, NEXT_PUBLIC_DIRECTUS_URL nebo DIRECTUS_TOKEN v .env');
}

export async function GET(request: NextRequest) {
  try {
    if (!PRINTFUL_API_KEY || !DIRECTUS_URL || !DIRECTUS_TOKEN) {
      return NextResponse.json(
        { error: 'Missing required environment variables' },
        { status: 500 }
      );
    }

    const results = await sync();
    
    return NextResponse.json({ results });

    
    // return NextResponse.json({
    //   message: 'Synchronizace dokončena',
    //   results,
    //   totalProcessed: results.length,
    //   successful: results.filter(r => r.status === 'success').length,
    //   failed: results.filter(r => r.status === 'error').length
    // });
  } catch (error) {
    console.error('Chyba při synchronizaci:', error);
    return NextResponse.json(
      { error: 'Synchronization failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}