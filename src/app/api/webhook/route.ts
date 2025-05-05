import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fulfillOrder } from '@/services/printful';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    ) as Stripe.Event;

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          throw new Error('No orderId found in session metadata');
        }

        // 1. Nejprve označit objednávku jako zaplacenou
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'paid',
            stripePaymentIntentId: session.payment_intent as string,
            stripeSessionId: session.id
          }
        });

        // 2. Odeslat objednávku do Printful
        await fulfillOrder(orderId);

        // 3. Vymazat košík, pokud existuje
        if (session.metadata?.cartId) {
          await prisma.cart.delete({
            where: { id: session.metadata.cartId }
          });
        }

        break;
      }

      case 'payment_intent.succeeded': {
        const orderId = event.data.object.metadata.orderId;
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'paid' },
          });
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const failedOrderId = event.data.object.metadata.orderId;
        if (failedOrderId) {
          await prisma.order.update({
            where: { id: failedOrderId },
            data: { status: 'failed' },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Došlo k chybě při zpracování webhoku' },
      { status: 500 }
    );
  }
} 