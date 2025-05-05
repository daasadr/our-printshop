import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Metadata stránky
export const metadata = {
  title: 'Objednávka úspěšně dokončena | HappyWilderness',
  description: 'Děkujeme za vaši objednávku!'
};

// Funkce pro získání objednávky podle ID
async function getOrder(orderId) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        },
        shippingInfo: true
      }
    });
    
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

// Hlavní komponenta stránky
export default async function CheckoutSuccessPage({ searchParams }) {
  // Získáme ID objednávky z URL parametrů
  const orderId = searchParams.orderId;
  
  // Pokud není ID, přesměrujeme na hlavní stránku
  if (!orderId) {
    redirect('/');
  }
  
  // Ověření uživatele
  const session = await getServerSession(authOptions);
  
  // Načtení informací o objednávce
  const order = await getOrder(orderId);
  
  // Pokud není objednávka nalezena
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Objednávka nenalezena</h1>
        <p className="mb-8">Bohužel jsme nenašli požadovanou objednávku.</p>
        <Link href="/" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700">
          Zpět na hlavní stránku
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Objednávka byla úspěšně dokončena!</h1>
          <p className="text-gray-600">Děkujeme za Váš nákup. Potvrzení bylo odesláno na Váš e-mail.</p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Přehled objednávky</h2>
          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex justify-between">
                <span className="font-medium">Číslo objednávky:</span>
                <span>{orderId}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-medium">Datum:</span>
                <span>{new Date(order.createdAt).toLocaleDateString('cs-CZ')}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-medium">Stav:</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {order.status === 'paid' ? 'Zaplaceno' : 'Zpracovává se'}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-3">Položky</h3>
              <ul className="divide-y">
                {order.items.map((item) => (
                  <li key={item.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{item.variant.product?.title}</p>
                      <p className="text-sm text-gray-600">
                        {item.variant.name}{item.variant.size ? `, ${item.variant.size}` : ''}
                        {item.variant.color ? `, ${item.variant.color}` : ''}
                      </p>
                      <p className="text-sm text-gray-500">Množství: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                    </p>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 pt-4 border-t flex justify-between">
                <span className="font-semibold">Celkem:</span>
                <span className="font-semibold text-lg">
                  {order.total.toLocaleString('cs-CZ')} Kč
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {order.shippingInfo && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Doručovací adresa</h2>
            <div className="border rounded-md p-4">
              <p className="font-medium">{order.shippingInfo.name}</p>
              <p>{order.shippingInfo.address1}</p>
              {order.shippingInfo.address2 && <p>{order.shippingInfo.address2}</p>}
              <p>{order.shippingInfo.city}, {order.shippingInfo.zip}</p>
              <p>{order.shippingInfo.country}</p>
              {order.shippingInfo.phone && <p>Tel: {order.shippingInfo.phone}</p>}
            </div>
          </div>
        )}
        
        <div className="text-center pt-6">
          <Link href="/" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 inline-block">
            Pokračovat v nákupu
          </Link>
          
          {session && (
            <Link 
              href="/account/orders" 
              className="ml-4 text-blue-600 hover:text-blue-800 inline-block"
            >
              Moje objednávky
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}