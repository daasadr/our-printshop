import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializace Stripe s vaším tajným klíčem
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

interface RequestBody {
  amount: number;
  currency: string;
  paymentMethodType: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody;
    const { amount, currency, paymentMethodType } = body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: [paymentMethodType],
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
} 