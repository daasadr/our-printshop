import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

interface CheckoutSession {
  id: string;
  amount_total: number;
  customer_email: string;
  shipping: {
    address: {
      city: string;
      country: string;
      line1: string;
      line2: string | null;
      postal_code: string;
      state: string;
    };
    name: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    
    const session = await stripe.checkout.sessions.retrieve(sessionId) as CheckoutSession;
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        email: session.customer_email,
        total: session.amount_total / 100,
        status: 'pending',
        shippingAddress: {
          create: {
            name: session.shipping.name,
            street: session.shipping.address.line1,
            street2: session.shipping.address.line2,
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