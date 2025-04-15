import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['shipping_details', 'customer_details']
    });
    
    if (!session || !session.shipping_details || !session.customer_details?.email) {
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 400 }
      );
    }

    const shippingDetails = session.shipping_details;
    const customerEmail = session.customer_details.email;

    // Create order in database
    const order = await prisma.order.create({
      data: {
        stripePaymentIntentId: session.payment_intent as string,
        status: 'pending',
        total: (session.amount_total || 0) / 100,
        shippingInfo: {
          create: {
            name: shippingDetails.name || 'Unknown',
            address1: shippingDetails.address?.line1 || '',
            address2: shippingDetails.address?.line2 || null,
            city: shippingDetails.address?.city || '',
            state: shippingDetails.address?.state || '',
            zip: shippingDetails.address?.postal_code || '',
            country: shippingDetails.address?.country || '',
            email: customerEmail,
            phone: shippingDetails.phone || null,
          },
        },
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error processing checkout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 