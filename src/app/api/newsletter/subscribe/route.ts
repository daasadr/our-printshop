// import { createNewsletterSubscriber, readNewsletterSubscribers } from '@/lib/directus';
import { NextRequest, NextResponse } from 'next/server';

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

    // Kontrola, zda email již není zaregistrován
    // const existingSubscribers = await readNewsletterSubscribers({
    //   filter: {
    //     email: { _eq: email }
    //   }
    // });

    if (false) {
      return NextResponse.json(
        { error: 'Tento email je již zaregistrován' },
        { status: 400 }
      );
    }

    // Vytvoření nového odběratele
    // const subscriber = await createNewsletterSubscriber({
    //   email,
    //   status: 'active'
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Chyba při registraci do newsletteru' },
      { status: 500 }
    );
  }
}