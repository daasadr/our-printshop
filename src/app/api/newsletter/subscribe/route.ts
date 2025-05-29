import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email address is required.' }, { status: 400 });
    }

    // Send confirmation email via Resend
    try {
      const unsubscribeUrl = `http://localhost:3001/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
      await resend.emails.send({
        from: 'no-reply@resend.dev',
        to: email,
        subject: 'Thank you for subscribing!',
        html: `
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #222;">
            <p>Hi!<br/>Thank you for subscribing to our newsletter. You will now receive the latest news and offers from us.</p>
            <hr style="margin: 24px 0;" />
            <p style="margin-top: 24px;">
              <strong>If you wish to unsubscribe, click the link below:</strong><br/>
              <a href="${unsubscribeUrl}" style="color: #d32f2f; font-weight: bold;">Unsubscribe from newsletter</a>
            </p>
            <p style="font-size: 12px; color: #888; margin-top: 16px;">
              Or copy and paste this URL into your browser:<br/>
              <span style="word-break: break-all;">${unsubscribeUrl}</span>
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Resend email error:', emailError);
      return NextResponse.json({ message: 'Failed to send confirmation email.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Thank you for subscribing!' }, { status: 200 });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ message: 'A server error occurred.' }, { status: 500 });
  }
}