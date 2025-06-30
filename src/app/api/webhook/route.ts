import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fulfillOrder } from '@/services/printful';
import { updateOrder, deleteCart } from '@/lib/directus';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Zpracování události
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          console.error('No orderId in session metadata');
          return NextResponse.json(
            { error: 'No orderId in session metadata' },
            { status: 400 }
          );
        }

        // 1. Nejprve označit objednávku jako zaplacenou
        await updateOrder(orderId, {
          status: 'processing',
          stripePaymentIntentId: session.payment_intent as string,
          stripeSessionId: session.id
        });

        // 2. Odeslat objednávku do Printful
        await fulfillOrder(orderId);

        // 3. Vymazat košík, pokud existuje
        if (session.metadata?.cartId) {
          await deleteCart(session.metadata.cartId);
        }

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('Payment failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 