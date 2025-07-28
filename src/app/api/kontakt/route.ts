import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/services/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Všechna pole jsou povinná' },
        { status: 400 }
      );
    }

    await sendContactEmail({ name, email, subject, message });

    return NextResponse.json(
      { message: 'Zpráva byla úspěšně odeslána' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in contact form:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se odeslat zprávu' },
      { status: 500 }
    );
  }
} 