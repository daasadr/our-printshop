import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('Missing SENDGRID_API_KEY environment variable');
}

// Nastavení SendGrid API klíče
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req: NextRequest) {
  try {
    console.log('Začátek zpracování POST požadavku');
    const { name, email, message } = await req.json();
    console.log('Přijatá data:', { name, email, messageLength: message?.length });

    // Validace vstupních dat
    if (!name || !email || !message) {
      console.log('Chybějící povinná data');
      return NextResponse.json(
        { error: 'Všechna pole jsou povinná' },
        { status: 400 }
      );
    }

    // Nastavení e-mailu
    const msg = {
      to: 'happypomeloofficial@gmail.com',
      from: {
        email: 'happypomeloofficial@gmail.com',
        name: 'Kontaktní formulář HappyWilderness'
      },
      subject: `Nová zpráva od ${name}`,
      text: `Jméno: ${name}\nEmail: ${email}\n\nZpráva:\n${message}`,
      html: `
        <h3>Nová zpráva z kontaktního formuláře</h3>
        <p><strong>Jméno:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Zpráva:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email
    };

    console.log('Pokus o odeslání e-mailu');
    const response = await sgMail.send(msg);
    console.log('E-mail úspěšně odeslán:', response[0].statusCode);

    return NextResponse.json(
      { message: 'E-mail byl úspěšně odeslán' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Detailní chyba při odesílání:', error);
    if (error instanceof Error) {
      console.error('Typ chyby:', error.name);
      console.error('Zpráva chyby:', error.message);
      console.error('Stack trace:', error.stack);
    }
    return NextResponse.json(
      { 
        error: 'Nastala chyba při odesílání e-mailu',
        details: error instanceof Error ? error.message : 'Neznámá chyba'
      },
      { status: 500 }
    );
  }
} 