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

interface StripeWebhookEvent {
  type: string;
  data: {
    object: {
      id: string;
      metadata: {
        orderId: string;
        [key: string]: string;
      };
      [key: string]: unknown;
    };
  };
}

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

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

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
    ) as StripeWebhookEvent;

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

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 400 }
    );
  }
} 