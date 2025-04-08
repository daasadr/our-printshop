import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Konfigurace transportéru pro Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'happypomeloofficial@gmail.com',
    pass: 'jday lwvr egsl ilaq' // App password from Google
  }
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    // Validace vstupních dat
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Všechna pole jsou povinná' },
        { status: 400 }
      );
    }

    // Nastavení e-mailu
    const mailOptions = {
      from: `"Kontaktní formulář" <happypomeloofficial@gmail.com>`,
      to: 'happypomeloofficial@gmail.com',
      subject: `Nová zpráva od ${name}`,
      text: `Jméno: ${name}\nEmail: ${email}\n\nZpráva:\n${message}`,
      html: `
        <h3>Nová zpráva z kontaktního formuláře</h3>
        <p><strong>Jméno:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Zpráva:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Odeslání e-mailu
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'E-mail byl úspěšně odeslán' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při odesílání e-mailu' },
      { status: 500 }
    );
  }
} 