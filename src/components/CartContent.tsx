'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useLocale } from '@/context/LocaleContext';
import { formatPrice, formatPriceForDisplay } from '@/utils/pricing';
import { Button, QuantityButton } from '@/components/ui/Button';
import { ClientOnlyPrice } from '@/components/ClientOnly';
import { useEffect, useState, useMemo } from 'react';
import CartBulkActions from './CartBulkActions';
import CartRecommendations from './CartRecommendations';

interface CartContentProps {
  dictionary?: any;
}

export default function CartContent({ dictionary }: CartContentProps) {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { locale, currency } = useLocale();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectAll, setIsSelectAll] = useState(false);

  // Ceny sú už aplikované s regionálnymi úpravami z useCart hooku
  const cartItems = items;
  
  console.log('CartContent - Cart items with prices:', cartItems.map(item => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    total: item.price * item.quantity
  })));

  const cartTotalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  // Funkcie pre správu výberu položiek
  const handleSelectAll = () => {
    const newSelectAll = !isSelectAll;
    setIsSelectAll(newSelectAll);
    
    if (newSelectAll) {
      const allItemIds = new Set(items.map(item => item.variantId));
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleItemSelect = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
    setIsSelectAll(newSelected.size === items.length);
  };

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
      {/* Bulk Actions */}
      <CartBulkActions 
        items={items} 
        className="mb-6"
        selectedItems={selectedItems}
        isSelectAll={isSelectAll}
        onSelectAll={handleSelectAll}
        onItemSelect={handleItemSelect}
        dictionary={dictionary}
      />
      
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.variantId}
            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
          >
            {/* Checkbox for bulk selection */}
            <input
              type="checkbox"
              checked={selectedItems.has(item.variantId)}
              onChange={() => handleItemSelect(item.variantId)}
              className="rounded border-white/30 text-green-600 focus:ring-green-500 bg-white/20"
            />
            
            <div className="relative w-20 h-20">
              <Image
                src={item.image || '/images/placeholder.jpg'}
                alt={item.name}
                fill
                className="object-cover rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== '/images/placeholder.jpg') {
                    target.src = '/images/placeholder.jpg';
                  }
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">
                {item.name}
              </h3>
              <ClientOnlyPrice className="text-green-300">
                {formatPriceForDisplay(item.price, 'EUR', currency)}
              </ClientOnlyPrice>
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
          <ClientOnlyPrice className="text-2xl font-bold text-green-300">
            {formatPriceForDisplay(cartTotalPrice, 'EUR', currency)}
          </ClientOnlyPrice>
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

      {/* Recommendations */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <CartRecommendations />
      </div>
    </div>
  );
} 