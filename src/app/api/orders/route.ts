import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { createOrder } from '@/services/printful';
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // aktualizujte podle nejnovější verze
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
      const variant = variants.find(v => v.id === item.variantId);
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
        status: 'draft',
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
    
    // 4. Vytvořit platební záměr Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe používá centy
      currency: 'czk',
      metadata: {
        orderId: order.id
      }
    });
    
    // 5. Aktualizovat objednávku s klientským tajemstvím
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripePaymentIntentId: paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret
      }
    });
    
    // 6. Vrátit klientské tajemství pro dokončení platby
    return NextResponse.json({
      orderId: order.id,
      clientSecret: paymentIntent.client_secret
    });
    
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { message: 'Chyba při vytváření objednávky' },
      { status: 500 }
    );
  }
}

// src/app/api/orders/[id]/fulfill/route.ts
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
    // 1. Načíst objednávku z databáze
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: true
          }
        },
        shippingInfo: true
      }
    });
    
    if (!order) {
      return NextResponse.json(
        { message: `Order ${orderId} not found` },
        { status: 404 }
      );
    }
    
    // 2. Vytvořit data pro Printful API
    const printfulOrderData = {
      recipient: {
        name: order.shippingInfo?.name,
        address1: order.shippingInfo?.address1,
        address2: order.shippingInfo?.address2 || undefined,
        city: order.shippingInfo?.city,
        state_code: order.shippingInfo?.state || undefined,
        country_code: order.shippingInfo?.country,
        zip: order.shippingInfo?.zip,
        phone: order.shippingInfo?.phone || undefined,
        email: order.shippingInfo?.email
      },
      items: order.items.map(item => ({
        variant_id: parseInt(item.variant.printfulVariantId),
        quantity: item.quantity
      }))
    };
    
    // 3. Odeslat objednávku do Printful
    const printfulResponse = await createOrder(printfulOrderData);
    
    // 4. Aktualizovat objednávku v databázi
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        printfulOrderId: printfulResponse.id.toString(),
        status: 'processing'
      }
    });
    
    return NextResponse.json({
      order: updatedOrder,
      printfulOrder: printfulResponse
    });
    
  } catch (error) {
    console.error('Error fulfilling order with Printful:', error);
    return NextResponse.json(
      { message: 'Chyba při zpracování objednávky' },
      { status: 500 }
    );
  }
}