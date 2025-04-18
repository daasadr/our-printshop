import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializace Stripe s vaším tajným klíčem
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingInfo } = body;

    // Vypočítáme celkovou cenu
    const amount = items.reduce((acc: number, item: any) => {
      return acc + (item.price * item.quantity);
    }, 0);

    // Přidáme poštovné (můžete upravit podle vašich potřeb)
    const shippingCost = 129; // 129 Kč za dopravu
    const totalAmount = amount + shippingCost;

    // Vytvoříme Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        ...items.map((item: any) => ({
          price_data: {
            currency: 'czk',
            product_data: {
              name: item.name,
              images: item.image ? [item.image] : [],
            },
            unit_amount: item.price * 100, // Stripe používá nejmenší jednotku měny (haléře)
          },
          quantity: item.quantity,
        })),
        {
          price_data: {
            currency: 'czk',
            product_data: {
              name: 'Poštovné',
            },
            unit_amount: shippingCost * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        shippingInfo: JSON.stringify(shippingInfo),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating payment session:', error);
    return NextResponse.json(
      { error: 'Nepodařilo se vytvořit platební session' },
      { status: 500 }
    );
  }
} 