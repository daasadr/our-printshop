import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next'; // ODSTRANĚNO
// import { authOptions } from '@/lib/auth'; // ODSTRANĚNO
import { jwtAuth } from '@/lib/jwt-auth';
import { readOrder, updateOrder, readVariants } from '@/lib/directus';
import { createPrintfulOrder } from '@/lib/printful';
import { Order } from '@/types';

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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await readOrder(params.id, {
      fields: [
        '*',
        'items.*',
        'items.variant.*',
        'items.variant.product.*',
        'shippingInfo.*'
      ]
    }) as unknown as Order | null;

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'pending') {
      return NextResponse.json({ error: 'Order is not pending' }, { status: 400 });
    }

    const printfulOrder = await createPrintfulOrder({
      external_id: order.id,
      shipping: {
        address1: order.shippingInfo.address1,
        city: order.shippingInfo.city,
        country_code: order.shippingInfo.country,
        state_code: order.shippingInfo.state,
        zip: order.shippingInfo.zip
      },
      items: await Promise.all(order.items.map(async item => {
        const variants = await readVariants({ filter: { id: { _eq: item.variant } } });
        const variantObj = variants?.[0];
        if (!variantObj) {
          throw new Error(`Variant not found for item ${item.id}`);
        }
        if (!variantObj.printfulVariantId) {
          throw new Error(`Missing printfulVariantId for variant ${variantObj.id}`);
        }
        if (!variantObj.design_url) {
          throw new Error(`Missing design_url for variant ${variantObj.id}`);
        }
        return {
          variant_id: parseInt(variantObj.printfulVariantId),
          quantity: item.quantity,
          files: [{
            url: variantObj.design_url
          }]
        };
      }))
    });

    await updateOrder(order.id, {
      status: 'processing',
      printfulOrderId: printfulOrder.id
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error fulfilling order:', error);
    return NextResponse.json(
      { error: 'Failed to fulfill order' },
      { status: 500 }
    );
  }
}