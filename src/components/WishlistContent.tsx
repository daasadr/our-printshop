'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useLocale } from '@/context/LocaleContext';
import { formatPrice, convertCurrency } from '@/utils/currency';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { FiHeart, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '@/hooks/useCart';

export default function WishlistContent() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { locale, currency } = useLocale();
  const [dictionary, setDictionary] = useState<any>(null);

  // Načtení dictionary pro aktuální jazyk
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dict = await import(`../../public/locales/${locale}/common.json`);
        setDictionary(dict.default);
        console.log('WishlistContent - loaded dictionary for locale:', locale, dict.default);
      } catch (error) {
        console.warn('Failed to load dictionary:', error);
      }
    };

    loadDictionary();
  }, [locale]);

  const handleAddToCart = (item: any) => {
    addToCart({
      variantId: item.variantId,
      quantity: 1,
      name: item.name,
      price: item.price, // Originálna cena v EUR
      image: item.image || '',
      sourceCurrency: 'EUR'
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center text-white">
        <div className="mb-6">
          <FiHeart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl mb-4">{dictionary?.wishlist?.empty || 'Váš seznam oblíbených je prázdný'}</p>
        </div>
        <Link href={`/${locale}/products`} className="text-green-400 hover:text-green-300">
          {dictionary?.wishlist?.view_products || 'Prohlédnout produkty'}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
      {/* Header s počtem položek a tlačidlem na vymazanie */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {dictionary?.wishlist?.title || 'Oblíbené produkty'}
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-green-300">
            {items.length} {dictionary?.wishlist?.items_count || 'produktů v oblíbených'}
          </span>
          <Button
            onClick={clearWishlist}
            variant="danger"
            size="sm"
            className="flex items-center gap-2"
          >
            <FiTrash2 className="w-4 h-4" />
            {dictionary?.wishlist?.clear_wishlist || 'Vymazat oblíbené'}
          </Button>
        </div>
      </div>

      {/* Seznam obľúbených produktov */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
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
                {formatPrice(convertCurrency(item.price, currency), currency)}
              </p>
              <p className="text-sm text-gray-400">
                {dictionary?.wishlist?.added_to_wishlist || 'Přidáno do oblíbených'}: {new Date(item.addedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleAddToCart(item)}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <FiShoppingCart className="w-4 h-4" />
                {dictionary?.cart?.add_to_cart || 'Do košíku'}
              </Button>
              <Button
                onClick={() => removeFromWishlist(item.productId)}
                variant="danger"
                size="sm"
                className="flex items-center gap-2"
                aria-label={`${dictionary?.wishlist?.remove_from_wishlist || 'Odebrat z oblíbených'} ${item.name}`}
              >
                <FiHeart className="w-4 h-4" />
                {dictionary?.wishlist?.remove_from_wishlist || 'Odebrat'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Celková cena */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex justify-between items-center text-white">
          <span className="text-lg">{dictionary?.cart?.total || 'Celková cena:'}</span>
          <span className="text-2xl font-bold text-green-300">
            {formatPrice(items.reduce((sum, item) => sum + (convertCurrency(item.price, currency)), 0), currency)}
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
