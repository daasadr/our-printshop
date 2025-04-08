import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { CartItem } from '@/types/cart';
import CheckoutForm from '@/components/CheckoutForm';

export const metadata: Metadata = {
  title: 'Pokladna | HappyWilderness',
  description: 'Dokončit objednávku a zadat doručovací údaje',
};

async function getCartItems(): Promise<CartItem[]> {
  const cartId = cookies().get('cartId')?.value;
  if (!cartId) return [];

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!cart) return [];

  return cart.items.map(item => ({
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    name: item.product.name,
    price: item.variant.price,
    quantity: item.quantity,
    image: item.product.image,
  }));
}

export default async function CheckoutPage() {
  const cartItems = await getCartItems();
  
  if (cartItems.length === 0) {
    redirect('/cart');
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Pokladna</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">Doručovací údaje</h2>
            <CheckoutForm cartItems={cartItems} total={total} />
          </div>

          {/* Order Summary */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">Shrnutí objednávky</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-300">Množství: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/20 pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Celkem</span>
                <span>{total.toLocaleString('cs-CZ')} Kč</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 