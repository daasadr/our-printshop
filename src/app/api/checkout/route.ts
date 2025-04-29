import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import { convertEurToCzkSync } from '@/utils/currency';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const prisma = new PrismaClient();

// Přidáme export pro Next.js, aby věděl, že tato route je dynamická
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shippingDetails } = body;

    if (!items?.length) {
      return NextResponse.json(
        { error: 'Košík je prázdný' },
        { status: 400 }
      );
    }

    if (!shippingDetails) {
      return NextResponse.json(
        { error: 'Chybí dodací údaje' },
        { status: 400 }
      );
    }
    
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    
    // 1. Ověřit, že všechny produkty existují a jsou dostupné
    const variantIds = items.map((item: { variantId: string }) => item.variantId);
    console.log('Variant IDs:', variantIds);
    
    const variants = await prisma.variant.findMany({
      where: {
        id: { in: variantIds },
        isActive: true
      },
      include: {
        product: {
          include: {
            designs: true
          }
        }
      }
    });
    console.log('Found variants:', variants.length);
    
    if (variants.length !== variantIds.length) {
      return NextResponse.json(
        { error: 'Některé produkty nejsou dostupné' },
        { status: 400 }
      );
    }
    
    // 2. Vypočítat celkovou cenu
    let total = 0;
    const orderItems = items.map((item: { variantId: string; quantity: number }) => {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) throw new Error('Varianta nenalezena');
      
      const priceInCzk = convertEurToCzkSync(variant.price);
      const itemTotal = priceInCzk * item.quantity;
      total += itemTotal;
      
      return {
        variantId: item.variantId,
        quantity: item.quantity,
        price: priceInCzk
      };
    });
    console.log('Total price:', total);
    
    // 3. Vytvořit order v databázi
    const order = await prisma.order.create({
      data: {
        status: 'pending',
        total,
        items: {
          create: orderItems
        },
        shippingInfo: {
          create: {
            name: shippingDetails.name,
            email: shippingDetails.email,
            phone: shippingDetails.phone || '',
            address1: shippingDetails.address,
            city: shippingDetails.city,
            zip: shippingDetails.zip,
            country: shippingDetails.country || 'CZ'
          }
        },
        ...(session?.user?.email ? {
          user: {
            connect: {
              email: session.user.email
            }
          }
        } : {})
      }
    });
    console.log('Created order:', order.id);

    // 4. Vytvořit Stripe Checkout Session
    const lineItems = orderItems.map((item: { variantId: string; quantity: number; price: number }) => {
      const variant = variants.find(v => v.id === item.variantId);
      if (!variant) throw new Error('Varianta nenalezena při vytváření line items');
      
      const priceInCzk = convertEurToCzkSync(variant.price);
      
      return {
        price_data: {
          currency: 'czk',
          product_data: {
            name: `${variant.product.title} - ${variant.name}`,
            images: variant.product.designs?.[0]?.previewUrl ? [variant.product.designs[0].previewUrl] : [],
          },
          unit_amount: Math.round(priceInCzk * 100),
        },
        quantity: item.quantity,
      };
    });

    // Přidat poštovné
    const shippingCost = 129;
    lineItems.push({
      price_data: {
        currency: 'czk',
        product_data: {
          name: 'Poštovné',
          images: [],
        },
        unit_amount: shippingCost * 100,
      },
      quantity: 1,
    });

    console.log('Creating Stripe session with line items:', lineItems);

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      metadata: {
        orderId: order.id
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/cancelled`,
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ['CZ', 'SK'],
      },
      billing_address_collection: 'required',
      customer_email: shippingDetails.email,
    });
    
    console.log('Created Stripe session:', checkoutSession.id);

    // 5. Aktualizovat objednávku s Stripe Session ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: checkoutSession.id
      }
    });
    
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření objednávky' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        shippingInfo: true,
        items: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 