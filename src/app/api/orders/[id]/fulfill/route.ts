import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createOrder } from '@/services/printful';
import { PrintfulOrderData, PrintfulApiResponse, PrintfulOrderResponse } from '@/types/printful';

const prisma = new PrismaClient();

interface OrderItem {
  quantity: number;
  price: number;
  variant: {
    printfulVariantId: string;
  };
}

interface ShippingInfo {
  name: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string | null;
  country: string;
  zip: string;
  phone: string | null;
  email: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  shippingInfo: ShippingInfo | null;
}

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
      }) as Order | null;
      
      if (!order || !order.shippingInfo) {
        return NextResponse.json(
          { message: `Order ${orderId} not found or missing shipping info` },
          { status: 404 }
        );
      }
      
      // 2. Vytvořit data pro Printful API
      const printfulOrderData: PrintfulOrderData = {
        external_id: order.id,
        recipient: {
          name: order.shippingInfo.name,
          address1: order.shippingInfo.address1,
          address2: order.shippingInfo.address2 || undefined,
          city: order.shippingInfo.city,
          state_code: order.shippingInfo.state || '',
          state_name: order.shippingInfo.state || '',
          country_code: order.shippingInfo.country,
          country_name: order.shippingInfo.country,
          zip: order.shippingInfo.zip,
          phone: order.shippingInfo.phone || undefined,
          email: order.shippingInfo.email
        },
        items: order.items.map((item: OrderItem) => ({
          variant_id: parseInt(item.variant.printfulVariantId),
          quantity: item.quantity,
          retail_price: item.price.toString()
        }))
      };
      
      // 3. Odeslat objednávku do Printful
      const printfulResponse = await createOrder(printfulOrderData) as PrintfulApiResponse<PrintfulOrderResponse>;
      
      // 4. Aktualizovat objednávku v databázi
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          printfulOrderId: printfulResponse.result.id.toString(),
          status: 'processing'
        }
      });
      
      return NextResponse.json({
        order: updatedOrder,
        printfulOrder: printfulResponse.result
      });
      
    } catch (error) {
      console.error('Error fulfilling order with Printful:', error);
      return NextResponse.json(
        { message: 'Chyba při zpracování objednávky' },
        { status: 500 }
      );
    }
  }