import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PrintfulOrderResponse } from '@/types/printful';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Session } from 'next-auth';
import { OrderItem } from '@/types/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
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
        { error: 'Objednávka nenalezena' },
        { status: 404 }
      );
    }

    if (!order.shippingInfo) {
      return NextResponse.json(
        { error: 'Chybí dodací údaje' },
        { status: 400 }
      );
    }

    // Vytvoříme objednávku v Printful
    const printfulOrder = {
      external_id: order.id,
      recipient: {
        name: order.shippingInfo.name,
        address1: order.shippingInfo.address1,
        city: order.shippingInfo.city,
        state_code: order.shippingInfo.state || '',
        state_name: order.shippingInfo.state || '',
        country_code: order.shippingInfo.country,
        zip: order.shippingInfo.zip
      },
      items: order.items.map((item: OrderItem) => ({
        variant_id: parseInt(item.variant.printfulVariantId),
        quantity: item.quantity,
        retail_price: item.price.toString()
      }))
    };

    const response = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`
      },
      body: JSON.stringify(printfulOrder)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Printful API error:', error);
      return NextResponse.json(
        { error: 'Chyba při vytváření objednávky v Printful' },
        { status: 500 }
      );
    }

    const printfulResponse = await response.json() as PrintfulOrderResponse;

    // Aktualizujeme objednávku v databázi
    await prisma.order.update({
      where: { id: order.id },
      data: {
        printfulOrderId: printfulResponse.result.id.toString(),
        status: 'processing'
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error fulfilling order:', error);
    return NextResponse.json(
      { error: 'Došlo k chybě při zpracování objednávky' },
      { status: 500 }
    );
  }
}