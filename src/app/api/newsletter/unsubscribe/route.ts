import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ message: 'Email address is required.' }, { status: 400 });
    }
    // Tu by sa v produkcii e-mail vymazal alebo označil v databáze
    console.log(`Unsubscribed from newsletter: ${email}`);
    return NextResponse.json({ message: 'Unsubscribed successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ message: 'A server error occurred.' }, { status: 500 });
  }
} 