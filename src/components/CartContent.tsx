'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { formatPriceByLocale, convertEurToCzkSync, convertEurToGbpSync } from '@/utils/currency';
import { useRouter } from 'next/router';

export default function CartContent() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { locale = 'cs' } = useRouter();

  if (items.length === 0) {
    return (
      <div className="text-center text-white">
        <p className="mb-4">Váš košík je prázdný</p>
        <Link href="/products" className="text-green-400 hover:text-green-300">
          Prohlédnout produkty
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.variantId}
            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
          >
            {item.image && (
              <div className="relative w-20 h-20">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-white font-medium">
                {item.name}
              </h3>
              <p className="text-green-300">
                {formatPriceByLocale(locale === 'cs' ? convertEurToCzkSync(item.price) : (locale === 'en-GB' ? convertEurToGbpSync(item.price) : item.price), locale)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.variantId, Math.max(0, item.quantity - 1))}
                className="text-white hover:text-green-300"
              >
                -
              </button>
              <span className="text-white w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                className="text-white hover:text-green-300"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.variantId)}
              className="text-red-400 hover:text-red-300"
            >
              Odstranit
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex justify-between items-center text-white">
          <span className="text-lg">Celková cena:</span>
          <span className="text-2xl font-bold text-green-300">
            {formatPriceByLocale(locale === 'cs' ? convertEurToCzkSync(totalPrice) : (locale === 'en-GB' ? convertEurToGbpSync(totalPrice) : totalPrice), locale)}
          </span>
        </div>
        <div className="mt-4">
          <Link
            href="/checkout"
            className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-center font-semibold"
          >
            Pokračovat k objednávce
          </Link>
        </div>
      </div>
    </div>
  );
} 