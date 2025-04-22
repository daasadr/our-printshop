import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { createOrder } from '@/services/printful';
import { PrintfulOrderData } from '@/types/printful';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const prisma = new PrismaClient();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function fulfillOrder(orderId: string) {
  try {
    // 1. Načíst objednávku z databáze
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: true
          }
        },
        shippingInfo: true
      }
    });

    if (!order || !order.shippingInfo) {
      throw new Error('Order not found or missing shipping info');
    }

    // 2. Vytvořit data pro Printful API
    const printfulOrderData: PrintfulOrderData = {
      external_id: order.id,
      recipient: {
        name: order.shippingInfo.name,
        address1: order.shippingInfo.address1,
        address2: order.shippingInfo.address2 || undefined,
        city: order.shippingInfo.city,
        state_code: order.shippingInfo.state || '',
        state_name: order.shippingInfo.state || '',
        country_code: order.shippingInfo.country,
        country_name: order.shippingInfo.country,
        zip: order.shippingInfo.zip,
        phone: order.shippingInfo.phone || undefined,
        email: order.shippingInfo.email
      },
      items: order.items.map((item) => ({
        variant_id: parseInt(item.variant.printfulVariantId),
        quantity: item.quantity,
        retail_price: item.price.toString()
      })),
      retail_costs: {
        currency: 'CZK',
        subtotal: order.total,
        discount: 0,
        shipping: 0,
        tax: 0
      }
    };

    // 3. Odeslat objednávku do Printful
    const printfulResponse = await createOrder(printfulOrderData);

    // 4. Aktualizovat objednávku v databázi
    await prisma.order.update({
      where: { id: orderId },
      data: {
        printfulOrderId: printfulResponse.result.id.toString(),
        status: 'processing'
      }
    });

    return true;
  } catch (error) {
    console.error('Error fulfilling order with Printful:', error);
    // Aktualizovat stav objednávky na error
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'error',
        notes: `Error fulfilling with Printful: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    });
    return false;
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const sig = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    // Zpracování různých typů událostí
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
          },
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
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
        
        // Najít a označit objednávku jako selhanou
        const order = await prisma.order.findFirst({
          where: { stripePaymentIntentId: paymentIntent.id }
        });

        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: { 
              status: 'failed',
              notes: 'Payment failed'
            }
          });
        }
        
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 