import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: EmailData) {
  try {
    const { data: response, error } = await resend.emails.send({
      from: 'HappyWilderness <onboarding@resend.dev>',
      to: 'happypomeloofficial@gmail.com',
      subject: `Nová zpráva: ${data.subject} - od ${data.name}`,
      text: `Jméno: ${data.name}\nEmail: ${data.email}\nPředmět: ${data.subject}\n\nZpráva:\n${data.message}`,
      html: `
        <h3>Nová zpráva z kontaktního formuláře</h3>
        <p><strong>Jméno:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Předmět:</strong> ${data.subject}</p>
        <p><strong>Zpráva:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: data.email
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    return response;
  } catch (error) {
    console.error('Error in sendContactEmail:', error);
    throw error;
  }
} 