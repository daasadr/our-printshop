import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { createOrder } from '@/services/printful';
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shippingInfo } = body;
    
    // Volitelně: Získání uživatelské session pro přihlášené uživatele
    const session = await getServerSession(authOptions);
    
    // 1. Ověřit, že všechny produkty existují a jsou dostupné
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
        { message: 'Některé produkty nejsou dostupné' },
        { status: 400 }
      );
    }
    
    // 2. Vypočítat celkovou cenu
    let total = 0;
    const orderItems = items.map((item: any) => {
      const variant = variants.find(( v : any) => v.id === item.variantId);
      if (!variant) throw new Error('Varianta nenalezena');
      
      const itemTotal = variant.price * item.quantity;
      total += itemTotal;
      
      return {
        variantId: item.variantId,
        quantity: item.quantity,
        price: variant.price
      };
    });
    
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
            ...shippingInfo
          }
        },
        ...(session?.user?.email ? { 
          user: {
            connect: {
              email: session.user.email
            }
          } 
        } : {})
      },
      include: {
        items: {
          include: {
            variant: true
          }
        }
      }
    });
    
    // 4. Vytvořit Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      metadata: {
        orderId: order.id
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/cancelled`,
      line_items: order.items.map(item => ({
        price_data: {
          currency: 'czk',
          product_data: {
            name: item.variant.name || 'Product',
            // Můžete přidat obrázek produktu
            // images: [item.variant.imageUrl]
          },
          unit_amount: Math.round(item.price * 100), // Stripe používá nejmenší jednotku měny (haléře)
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: {
        allowed_countries: ['CZ', 'SK'],
      },
    });
    
    return NextResponse.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

