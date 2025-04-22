import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

<<<<<<< HEAD
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
=======
// Dočasně zakomentovaná Stripe implementace
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-02-24.acacia',
// });
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8

const prisma = new PrismaClient();

// Opraveno: odstranění nepoužívaných typů

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shippingInfo } = body;
    
    const session = await getServerSession(authOptions);
    
    // 1. Ověřit, že všechny produkty existují a jsou dostupné
    const variantIds = items.map((item: { variantId: string }) => item.variantId);
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
    const orderItems = items.map((item: { variantId: string; quantity: number }) => {
      const variant = variants.find((v) => v.id === item.variantId);
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
<<<<<<< HEAD
        status: 'pending',
=======
        status: 'pending', // Změněno z 'draft' na 'pending', protože nemáme Stripe
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8
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
<<<<<<< HEAD
    
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
=======

    // Dočasně zakomentovaná Stripe implementace
    // 4. Vytvořit platební záměr Stripe
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(total * 100),
    //   currency: 'czk',
    //   metadata: {
    //     orderId: order.id
    //   }
    // });
    
    // 5. Aktualizovat objednávku s klientským tajemstvím
    // await prisma.order.update({
    //   where: { id: order.id },
    //   data: {
    //     stripePaymentIntentId: paymentIntent.id,
    //     stripeClientSecret: paymentIntent.client_secret
    //   }
    // });
    
    // Vrátit ID objednávky (bez Stripe client secret)
    return NextResponse.json({
      orderId: order.id,
      message: 'Objednávka byla úspěšně vytvořena'
>>>>>>> e449c3b44f6253a2868e63056d129262234349f8
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

export async function GET() {
  try {
    // Oprava: Změna z 'shippingAddress' na 'shippingInfo' v souladu s vaším schématem
    const orders = await prisma.order.findMany({
      include: {
        shippingInfo: true,
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