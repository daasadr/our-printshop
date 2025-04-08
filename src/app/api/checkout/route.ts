import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shippingDetails } = body;

    // Získáme produkty z databáze pro ověření cen
    const cartItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: {
            variants: {
              where: { id: item.variantId }
            }
          }
        });

        if (!product || !product.variants[0]) {
          throw new Error(`Produkt nebo varianta nenalezena: ${item.productId}`);
        }

        return {
          price_data: {
            currency: 'czk',
            product_data: {
              name: `${product.title} - ${product.variants[0].name}`,
              images: [product.variants[0].previewUrl],
            },
            unit_amount: Math.round(product.variants[0].price * 100), // Stripe používá nejmenší jednotku měny (haléře)
          },
          quantity: item.quantity,
        };
      })
    );

    // Vytvoříme Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      shipping_address_collection: {
        allowed_countries: ['CZ', 'SK'],
      },
      metadata: {
        shippingDetails: JSON.stringify(shippingDetails),
        orderItems: JSON.stringify(items),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Chyba při vytváření checkout session:', error);
    return NextResponse.json(
      { message: 'Chyba při zpracování objednávky' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 