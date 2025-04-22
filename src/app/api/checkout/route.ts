import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shippingInfo } = body;

    // 1. Ověřit dostupnost produktů a získat jejich ceny
    const variantIds = items.map((item: any) => item.variantId);
    const variants = await prisma.variant.findMany({
      where: {
        id: { in: variantIds },
        isActive: true
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

    // 2. Vytvořit objednávku v databázi
    const total = items.reduce((sum: number, item: any) => {
      const variant = variants.find(v => v.id === item.variantId);
      return sum + (variant?.price || 0) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        status: 'pending',
        total,
        items: {
          create: items.map((item: any) => {
            const variant = variants.find(v => v.id === item.variantId)!;
            return {
              variantId: item.variantId,
              quantity: item.quantity,
              price: variant.price
            };
          })
        },
        shippingInfo: {
          create: shippingInfo
        }
      }
    });

    // 3. Vytvořit Stripe Checkout Session
    const lineItems = items.map((item: any) => {
      const variant = variants.find(v => v.id === item.variantId)!;
      return {
        price_data: {
          currency: 'czk',
          product_data: {
            name: `${variant.product.title} - ${variant.name}`,
            images: [variant.product.imageUrl], // Předpokládáme, že máme URL obrázku
          },
          unit_amount: Math.round(variant.price * 100), // Stripe používá centy
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        orderId: order.id
      },
      shipping_address_collection: {
        allowed_countries: ['CZ', 'SK'], // Povolené země pro doručení
      },
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer_email: shippingInfo.email,
    });

    // 4. Aktualizovat objednávku s Stripe Session ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: session.id
      }
    });

    return NextResponse.json({ sessionId: session.id, orderId: order.id });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření platební session' },
      { status: 500 }
    );
  }
} 