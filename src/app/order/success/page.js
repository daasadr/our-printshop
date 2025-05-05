import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Metadata stránky
export const metadata = {
  title: 'Objednávka dokončena | HappyWilderness',
  description: 'Děkujeme za vaši objednávku!'
};

// Funkce pro získání objednávky podle Stripe Session ID
async function getOrderBySessionId(sessionId) {
  try {
    // Hledáme objednávku podle Stripe session ID
    const order = await prisma.order.findFirst({
      where: { 
        stripeSessionId: sessionId 
      },
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
    console.error('Error fetching order by session ID:', error);
    return null;
  }
}

// Hlavní komponenta stránky
export default async function OrderSuccessPage({ searchParams }) {
  // Získáme session ID z URL parametrů
  const sessionId = searchParams.session_id;
  
  // Pokud není session ID, přesměrujeme na hlavní stránku
  if (!sessionId) {
    redirect('/');
  }
  
  // Ověření uživatele
  const session = await getServerSession(authOptions);
  
  // Načtení informací o objednávce
  const order = await getOrderBySessionId(sessionId);
  
  // Pokud není objednávka nalezena
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Objednávka nenalezena</h1>
        <p className="mb-8">Bohužel jsme nenašli vaši objednávku. Kontaktujte nás prosím pro další pomoc.</p>
        <div className="flex justify-center gap-4">
          <Link href="/" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700">
            Zpět na hlavní stránku
          </Link>
          <Link href="/contact" className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700">
            Kontaktujte nás
          </Link>
        </div>
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
                <span>{order.id}</span>
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
                        {item.variant.name}{item.variant.size ? `