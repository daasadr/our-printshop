import { NextRequest, NextResponse } from 'next/server';
import { readVariants, createOrder, updateOrder, readOrders, createOrderItem } from '@/lib/directus';
// import { getServerSession } from 'next-auth/next'; // ODSTRANĚNO
// import { authOptions } from '@/lib/auth'; // ODSTRANĚNO
// import { Session } from 'next-auth'; // ODSTRANĚNO
import { jwtAuth } from '@/lib/jwt-auth';
import Stripe from 'stripe';
import { convertEurToCzkSync } from '@/utils/currency';
import { Product, Variant } from '@/types';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

// Přidáme export pro Next.js, aby věděl, že tato route je dynamická
export const dynamic = 'force-dynamic';

// Helper function to get user from JWT token
async function getUserFromRequest(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const user = await jwtAuth.getUserFromToken(token);
    return user;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shippingInfo } = body;
    
    const user = await getUserFromRequest(req);
    
    // 1. Ověřit, že všechny produkty existují a jsou dostupné
    const variantIds = items.map((item: { variantId: string }) => item.variantId);
    const variantsResult = await readVariants({
      filter: {
        id: { _in: variantIds },
        isActive: { _eq: true }
      },
      fields: ['*', 'product.*', 'product.designs.*']
    });
    
    const variants = (Array.isArray(variantsResult) ? variantsResult : []) as unknown as (Variant & { product: Product })[];
    
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
    
    // 3. Vytvořit order v Directus
    const orderResult = await createOrder({
      status: 'pending',
      total_price: total,
      ...(user?.email ? {
        user: user.email
      } : {})
    });

    const order = typeof orderResult === 'object' ? orderResult : { id: '' };

    // 3b. Uložit položky objednávky do order_items
    for (const item of orderItems) {
      await createOrderItem({
        order: order.id,
        product: item.product,
        variant: item.variantId,
        quantity: item.quantity,
        price: item.price
      });
    }
    
    // 4. Vytvořit Stripe Checkout Session
    const lineItems = orderItems.map((item: any) => {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) throw new Error('Varianta nenalezena');
      
      return {
        price_data: {
          currency: 'czk',
          product_data: {
            name: `${variant.product.name} - ${variant.name}`,
            images: variant.product.designs?.[0]?.previewUrl ? [variant.product.designs[0].previewUrl] : [],
          },
          unit_amount: Math.round(item.price * 100), // Stripe používá nejmenší jednotku měny (haléře)
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/cart`,
      metadata: {
        orderId: order.id,
        ...(user?.email ? { userEmail: user.email } : {})
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orders = await readOrders({
      filter: {
        user: { _eq: user.email }
      },
      fields: ['*', 'shippingInfo.*', 'items.*', 'items.variant.*', 'items.variant.product.*'],
      sort: ['-date_created']
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 