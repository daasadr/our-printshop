import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export const metadata: Metadata = {
  title: 'Objednávka dokončena | HappyWilderness',
  description: 'Děkujeme za vaši objednávku',
};

async function getOrderFromSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session?.metadata?.orderId) return null;

    return await prisma.order.findUnique({
      where: { id: session.metadata.orderId },
      include: {
        shippingAddress: true,
        items: true,
      },
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  const sessionId = searchParams.session_id;
  if (!sessionId) {
    redirect('/');
  }

  const order = await getOrderFromSession(sessionId);
  if (!order) {
    redirect('/');
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 text-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Děkujeme za vaši objednávku!</h1>
            <p className="text-lg text-green-200">
              Vaše objednávka byla úspěšně dokončena a brzy ji začneme zpracovávat.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Detaily objednávky</h2>
              <p>Číslo objednávky: {order.id}</p>
              <p>Celková částka: {order.total.toLocaleString('cs-CZ')} Kč</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Doručovací adresa</h2>
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address1}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Objednané položky</h2>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString('cs-CZ')} Kč</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center mt-8">
              <p className="mb-4">
                Na e-mail {order.shippingAddress.email} jsme vám poslali potvrzení objednávky.
              </p>
              <Link
                href="/"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Zpět na hlavní stránku
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 