import { NextRequest, NextResponse } from 'next/server';
import { readVariants, createOrder, readOrders, createOrderItem } from '@/lib/directus';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Session } from 'next-auth';
import { Order, OrderItem, Variant } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { items, shippingInfo } = body;

    if (!items?.length || !shippingInfo) {
      return NextResponse.json(
        { error: 'Items and shipping info are required' },
        { status: 400 }
      );
    }

    // Vypočítat celkovou cenu
    let total = 0;
    const orderItems: OrderItem[] = await Promise.all(
      items.map(async (item: { variantId: string; quantity: number }) => {
        const variants = await readVariants({
          filter: {
            id: { _eq: item.variantId }
          }
        });

        const variant = variants?.[0] as unknown as Variant | undefined;
        if (!variant) throw new Error('Varianta nenalezena');

        const itemTotal = variant.price * item.quantity;
        total += itemTotal;

        return {
          variantId: item.variantId,
          product: variant.product,
          quantity: item.quantity,
          price: variant.price
        };
      })
    );

    // Vytvořit objednávku
    const order = await createOrder({
      status: 'pending',
      total_price: total,
      ...(session?.user?.email ? { user: session.user.email } : {}),
      shippingInfo
    });

    // Uložit položky objednávky do order_items
    for (const item of orderItems) {
      await createOrderItem({
        order: order.id,
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await readOrders({
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