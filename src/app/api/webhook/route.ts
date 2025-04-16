import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const prisma = new PrismaClient();

interface PrintfulOrderItem {
  variantId: string;
  quantity: number;
  price: number;
}

interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

const createPrintfulOrder = async (session: Stripe.Checkout.Session) => {
  const { shippingDetails, orderItems } = session.metadata || {};
  
  if (!shippingDetails || !orderItems) {
    throw new Error('Chybí informace o objednávce');
  }

  const shipping = JSON.parse(shippingDetails) as ShippingDetails;
  const items = JSON.parse(orderItems) as PrintfulOrderItem[];

  // Vytvoření objednávky v Printful
  const response = await fetch('https://api.printful.com/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipient: {
        name: shipping.name,
        address1: shipping.address,
        city: shipping.city,
        state_code: '',
        country_code: shipping.country,
        zip: shipping.zip,
        phone: shipping.phone,
        email: shipping.email
      },
      items: items.map(item => ({
        sync_variant_id: item.variantId,
        quantity: item.quantity,
        retail_price: item.price
      })),
      retail_costs: {
        currency: 'CZK',
        subtotal: session.amount_subtotal ? session.amount_subtotal / 100 : 0,
        discount: 0,
        shipping: 0,
        tax: 0
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Chyba při vytváření Printful objednávky: ${JSON.stringify(error)}`);
  }

  return await response.json();
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const error = err as Error;
    console.error(`Webhook Error: ${error.message}`);
    return NextResponse.json(
      { message: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Vytvoření objednávky v Printful
      const printfulOrder = await createPrintfulOrder(session);

      // Uložení objednávky do naší databáze
      await prisma.order.create({
        data: {
          status: 'PAID',
          total: session.amount_total ? session.amount_total / 100 : 0,
          printfulOrderId: printfulOrder.result.id.toString(),
          shippingInfo: {
            create: {
              name: session.shipping_details?.name || '',
              address1: session.shipping_details?.address?.line1 || '',
              address2: session.shipping_details?.address?.line2 || null,
              city: session.shipping_details?.address?.city || '',
              state: null,
              country: session.shipping_details?.address?.country || '',
              zip: session.shipping_details?.address?.postal_code || '',
              email: session.customer_details?.email || '',
              phone: session.customer_details?.phone || null
            }
          }
        }
      });

      return NextResponse.json({ status: 'success' });
    } catch (error) {
      console.error('Chyba při zpracování objednávky:', error);
      return NextResponse.json(
        { message: 'Chyba při zpracování objednávky' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ status: 'success' });
} 