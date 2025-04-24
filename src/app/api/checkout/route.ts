import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const { variantIds, quantities } = await req.json();

    // 1. Ověřit, že všechny produkty existují
    const variants = await prisma.variant.findMany({
      where: {
        id: {
          in: variantIds
        }
      },
      include: {
        product: true
      }
    });

    if (variants.length !== variantIds.length) {
      return NextResponse.json(
        { error: 'Některé produkty nejsou dostupné' },
        { status: 400 }
      );
    }

    // 2. Vypočítat celkovou cenu
    const total = variants.reduce((sum, variant, index) => {
      return sum + variant.price * quantities[index];
    }, 0);

    // 3. Vytvořit order v databázi
    const order = await prisma.order.create({
      data: {
        status: 'pending',
        total,
        items: {
          create: variants.map((variant, index) => ({
            quantity: quantities[index],
            price: variant.price,
            variantId: variant.id,
            productId: variant.productId
          }))
        }
      }
    });

    // 4. Vytvořit Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: variants.map((variant, index) => ({
        price_data: {
          currency: 'czk',
          product_data: {
            name: `${variant.product.title} - ${variant.name}`,
            images: [variant.product.imageUrl]
          },
          unit_amount: variant.price * 100 // Stripe používá nejmenší jednotku měny (haléře)
        },
        quantity: quantities[index]
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/${order.id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart?canceled=true`,
      metadata: {
        orderId: order.id
      },
      shipping_address_collection: {
        allowed_countries: ['CZ', 'SK'],
      },
    });

    // 5. Aktualizovat order o Stripe Session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id }
    });

    return NextResponse.json({ 
      sessionId: session.id,
      orderId: order.id
    });

  } catch (error) {
    console.error('Error in checkout:', error);
    return NextResponse.json(
      { error: 'Došlo k chybě při zpracování objednávky' },
      { status: 500 }
    );
  }
} 