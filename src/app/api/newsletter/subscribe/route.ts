import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { message: 'E-mail je povinný' },
        { status: 400 }
      );
    }
    
    // Základní validace e-mailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Neplatná e-mailová adresa' },
        { status: 400 }
      );
    }
    
    // Zde by byl kód pro reálné přidání odběratele do systému
    // Například zápis do databáze nebo odeslání do služby jako Mailchimp, SendGrid, apod.
    
    // Příklad zápisu do databáze (pokud byste měli tabulku pro odběratele)
    /*
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { updatedAt: new Date() },
      create: {
        email,
        subscribedAt: new Date(),
      },
    });
    */
    
    // Simulace úspěšné odpovědi
    return NextResponse.json({
      success: true,
      message: 'Odběr byl úspěšně zaregistrován',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { message: 'Chyba při zpracování požadavku' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}