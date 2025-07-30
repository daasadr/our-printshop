import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializace Stripe s kontrolou existence API klíče
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2025-05-28.basil',
}) : null;

interface RequestBody {
  amount: number;
  currency: string;
  paymentMethodType: string;
}

export async function POST(request: Request) {
  try {
    // Kontrola, jestli je Stripe nakonfigurovaný
    if (!stripe) {
      console.error('Stripe is not configured - missing STRIPE_SECRET_KEY');
      return NextResponse.json(
        { error: 'Payment service is not configured' },
        { status: 503 }
      );
    }

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