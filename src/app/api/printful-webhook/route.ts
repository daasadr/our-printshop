import { NextRequest, NextResponse } from 'next/server';
import { readOrder, updateOrder } from '@/lib/directus';
import { Order } from '@/types';
import crypto from 'crypto';

// Printful webhook secret from environment variables
const PRINTFUL_WEBHOOK_SECRET = process.env.PRINTFUL_WEBHOOK_SECRET;

// Mapování Printful stavů na naše stavy
const PRINTFUL_STATUS_MAP: Record<string, Order['status']> = {
  'pending': 'pending',
  'processing': 'processing',
  'fulfilled': 'fulfilled',
  'cancelled': 'cancelled',
  'failed': 'cancelled'
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get('x-printful-signature');

    // Ověření podpisu
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    const hmac = crypto.createHmac('sha256', process.env.PRINTFUL_WEBHOOK_SECRET!);
    const digest = hmac.update(JSON.stringify(body)).digest('hex');

    if (digest !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const { type, data } = body;

    if (type !== 'order_status_changed') {
      return NextResponse.json({ success: true });
    }

    const { order_id, status: printfulStatus } = data;

    // Najít objednávku podle Printful ID
    const orders = await readOrder(order_id, {
      fields: ['*']
    }) as unknown as Order | null;

    if (!orders) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Mapovat Printful stav na náš stav
    const status = PRINTFUL_STATUS_MAP[printfulStatus] || 'processing';

    // Aktualizovat stav objednávky
    await updateOrder(orders.id, { status });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Printful webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
} 