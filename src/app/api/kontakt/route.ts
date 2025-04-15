import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { data, error } = await resend.emails.send({
      from: 'HappyWilderness <onboarding@resend.dev>',
      to: 'happypomeloofficial@gmail.com',
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
    });

    if (error) {
      console.error('Chyba při odesílání:', error);
      throw error;
    }

    console.log('E-mail úspěšně odeslán:', data?.id);

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