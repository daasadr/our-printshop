import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Printful webhook secret from environment variables
const PRINTFUL_WEBHOOK_SECRET = process.env.PRINTFUL_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const headersList = headers();
  const signature = headersList.get('X-Printful-Signature');

  if (!signature || signature !== PRINTFUL_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { type, data: eventData } = data;

    // Najít objednávku podle Printful ID
    const order = await prisma.order.findUnique({
      where: { printfulOrderId: eventData.order.id.toString() }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Aktualizovat status objednávky podle události z Printful
    let newStatus;
    switch (type) {
      case 'package_shipped':
        newStatus = 'shipped';
        break;
      case 'package_delivered':
        newStatus = 'delivered';
        break;
      case 'order_failed':
        newStatus = 'error';
        break;
      case 'order_canceled':
        newStatus = 'cancelled';
        break;
      default:
        console.log(`Unhandled Printful event type: ${type}`);
        return NextResponse.json({ received: true });
    }

    // Aktualizovat objednávku v databázi
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
        notes: eventData.reason || `Status updated from Printful: ${type}`
      }
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Printful webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 