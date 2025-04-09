import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: 'Objednávka potvrzena | HappyWilderness',
  description: 'Potvrzení vaší objednávky',
};

async function getOrder(sessionId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      include: {
        shippingAddress: true,
      },
    });
    return order;
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
  const { session_id } = searchParams;

  if (!session_id) {
    redirect('/');
  }

  const order = await getOrder(session_id);

  if (!order) {
    redirect('/');
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-white">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Děkujeme za vaši objednávku!</h1>
            <p className="text-green-200">
              Vaše objednávka byla úspěšně přijata a zpracována.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Detaily objednávky</h2>
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <p>
                  <span className="font-medium">Číslo objednávky:</span>{' '}
                  {order.printfulOrderId}
                </p>
                <p>
                  <span className="font-medium">Celková částka:</span>{' '}
                  {order.total.toLocaleString('cs-CZ')} Kč
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Dodací adresa</h2>
              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && (
                  <p>{order.shippingAddress.address2}</p>
                )}
                <p>
                  {order.shippingAddress.zip} {order.shippingAddress.city}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div className="text-center text-green-200">
              <p>
                Potvrzovací email byl odeslán na adresu {order.customerEmail}.
              </p>
              <p className="mt-2">
                Sledujte prosím stav vaší objednávky v emailu.
              </p>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="inline-block bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
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