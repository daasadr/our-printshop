import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Dočasně zakomentovaná Stripe implementace
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-02-24.acacia',
// });

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
        status: 'pending', // Změněno z 'draft' na 'pending', protože nemáme Stripe
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
      }
    });

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
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { message: 'Chyba při vytváření objednávky' },
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