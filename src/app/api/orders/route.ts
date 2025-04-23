import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const prisma = new PrismaClient();

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
        product: {
          include: {
            designs: true
          }
        }
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
            variant: {
              include: {
                product: {
                  include: {
                    designs: true
                  }
                }
              }
            }
          }
        }
      }
    });
    
    // 4. Vytvořit Stripe Checkout Session
    const lineItems = order.items.map(item => ({
      price_data: {
        currency: 'czk',
        product_data: {
          name: `${item.variant.product.title} - ${item.variant.name}`,
          images: item.variant.product.designs?.[0]?.previewUrl ? [item.variant.product.designs[0].previewUrl] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe používá nejmenší jednotku měny (haléře)
      },
      quantity: item.quantity,
    }));

    // Přidat poštovné
    const shippingCost = 129; // 129 Kč za dopravu
    lineItems.push({
      price_data: {
        currency: 'czk',
        product_data: {
          name: 'Poštovné',
          images: [], // Prázdné pole pro poštovné
        },
        unit_amount: shippingCost * 100,
      },
      quantity: 1,
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      metadata: {
        orderId: order.id
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/cancelled`,
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ['CZ', 'SK'],
      },
      billing_address_collection: 'required',
      customer_email: shippingInfo.email,
    });
    
    // 5. Aktualizovat objednávku s Stripe Session ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: checkoutSession.id
      }
    });
    
    return NextResponse.json({ url: checkoutSession.url });
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
    const orders = await prisma.order.findMany({
      include: {
        shippingInfo: true,
        items: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        }
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