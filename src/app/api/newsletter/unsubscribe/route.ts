import { deleteNewsletterSubscriber } from '@/lib/directus';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route pre odhlásenie z newsletteru.
 * Prijíma email v tele požiadavky a odstráni ho z Directusu.
 * @param req - Next.js API request
 * @returns JSON odpoveď s výsledkom (úspech/chyba)
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email je povinný' },
        { status: 400 }
      );
    }

    // Odhlásenie z Directusu
    await deleteNewsletterSubscriber(email);

    return NextResponse.json({ 
      success: true, 
      message: 'Úspešne ste sa odhlásili z newsletteru' 
    });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Chyba pri odhlásení z newsletteru' },
      { status: 500 }
    );
  }
} 