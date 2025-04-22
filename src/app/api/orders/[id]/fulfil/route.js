import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createOrder } from '@/services/printful';

const prisma = new PrismaClient();

// JS verze route handleru bez typování
export async function POST(request, context) {
  try {
    const orderId = context.params.id;
    
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
        name: order.shippingInfo?.name || "No name provided",
        address1: order.shippingInfo?.address1 || "No address provided",
        address2: order.shippingInfo?.address2 || undefined,
        city: order.shippingInfo?.city || "No city provided",
        state_code: order.shippingInfo?.state || undefined,
        country_code: order.shippingInfo?.country || "CZ",
        zip: order.shippingInfo?.zip || "00000",
        phone: order.shippingInfo?.phone || undefined,
        email: order.shippingInfo?.email || "noemail@example.com"
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