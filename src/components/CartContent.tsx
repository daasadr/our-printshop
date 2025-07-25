'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useLocale } from '@/context/LocaleContext';
import { formatPriceCZK } from '@/utils/currency';
import { Button, QuantityButton } from '@/components/ui/Button';
import { useEffect, useState } from 'react';

export default function CartContent() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { locale } = useLocale();
  const [dictionary, setDictionary] = useState<any>(null);

  // Načtení dictionary pro aktuální jazyk
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dict = await import(`../../public/locales/${locale}/common.json`);
        setDictionary(dict.default);
      } catch (error) {
        console.warn('Failed to load dictionary:', error);
      }
    };

    loadDictionary();
  }, [locale]);

  if (items.length === 0) {
    return (
      <div className="text-center text-white">
        <p className="mb-4">{dictionary?.cart?.empty || 'Váš košík je prázdný'}</p>
        <Link href={`/${locale}/products`} className="text-green-400 hover:text-green-300">
          {dictionary?.product?.view_product || 'Prohlédnout produkty'}
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
                {formatPriceCZK(item.price)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <QuantityButton
                onClick={() => updateQuantity(item.variantId, Math.max(0, item.quantity - 1))}
                variant="light"
                size="sm"
                aria-label={`Snížit ${dictionary?.cart?.quantity?.toLowerCase() || 'množství'} ${item.name}`}
              >
                -
              </QuantityButton>
              <span className="text-white w-8 text-center" aria-label={`${dictionary?.cart?.quantity || 'Množství'}: ${item.quantity}`}>
                {item.quantity}
              </span>
              <QuantityButton
                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                variant="light"
                size="sm"
                aria-label={`Zvýšit ${dictionary?.cart?.quantity?.toLowerCase() || 'množství'} ${item.name}`}
              >
                +
              </QuantityButton>
            </div>
            <Button
              onClick={() => removeFromCart(item.variantId)}
              variant="danger"
              size="sm"
              aria-label={`${dictionary?.cart?.remove || 'Odebrat'} ${item.name} z košíku`}
            >
              {dictionary?.cart?.remove || 'Odstranit'}
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex justify-between items-center text-white">
          <span className="text-lg">{dictionary?.cart?.total || 'Celková cena:'}</span>
          <span className="text-2xl font-bold text-green-300">
            {formatPriceCZK(totalPrice)}
          </span>
        </div>
        <div className="mt-4">
          <Link
            href={`/${locale}/checkout`}
            className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-center font-semibold"
          >
            {dictionary?.cart?.checkout || 'Pokračovat k objednávce'}
          </Link>
        </div>
      </div>
    </div>
  );
} 