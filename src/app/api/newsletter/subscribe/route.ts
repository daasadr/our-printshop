import { createNewsletterSubscriber, readNewsletterSubscribers } from '@/lib/directus';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * API route pre prihlásenie na newsletter.
 * Prijíma email v tele požiadavky, kontroluje duplicitu a ukladá do Directusu.
 * Po úspešnom zápise odošle potvrdzovací email cez Resend.
 * @param req - Next.js API request
 * @returns JSON odpoveď s výsledkom (úspech/chyba)
 */
export async function POST(req: NextRequest) {
  // Zakomentuj nebo odstraň celý obsah souboru, pokud není potřeba.
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email je povinný' },
        { status: 400 }
      );
    }

    // Kontrola duplicity
    const existing = await readNewsletterSubscribers({
      filter: { email: { _eq: email } }
    });
    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'Tento email je již zaregistrován' },
        { status: 400 }
      );
    }

    // Zápis do Directusu
    await createNewsletterSubscriber({ email });

    // Odoslanie potvrdzovacieho emailu cez Resend
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
    
    await resend.emails.send({
      from: 'HappyWilderness <onboarding@resend.dev>',
      to: email,
      subject: 'Děkujeme za přihlášení k odběru novinek!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Děkujeme za přihlášení k odběru novinek!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Vítejte v naší komunitě! Budeme vás informovat o nejnovějších produktech, 
            speciálních nabídkách a zajímavých novinkách.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            Pokud se v budoucnu budete chtít odhlásit z odběru, můžete tak učinit 
            kliknutím na odkaz níže:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${unsubscribeUrl}" 
               style="background-color: #dc2626; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Odhlásit se z newsletteru
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
            Tento email jste obdrželi, protože jste se přihlásili k odběru novinek na našem webu.
          </p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Chyba při registraci do newsletteru' },
      { status: 500 }
    );
  }
}