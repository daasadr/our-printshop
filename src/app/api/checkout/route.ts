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
      expand: ['shipping']
    });
    
    if (!session || !session.shipping || !session.customer_email) {
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 400 }
      );
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        email: session.customer_email,
        total: (session.amount_total || 0) / 100,
        status: 'pending',
        shippingAddress: {
          create: {
            name: session.shipping.name,
            street: session.shipping.address.line1,
            street2: session.shipping.address.line2 || null,
            city: session.shipping.address.city,
            state: session.shipping.address.state,
            postalCode: session.shipping.address.postal_code,
            country: session.shipping.address.country,
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