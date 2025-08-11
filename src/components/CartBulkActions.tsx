'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/context/WishlistContext';
import { useLocale } from '@/context/LocaleContext';
import { getDictionary } from '@/lib/getDictionary';
import { Button } from '@/components/ui/Button';
import { FiTrash2, FiHeart, FiDownload, FiShare2 } from 'react-icons/fi';

interface CartBulkActionsProps {
  items: any[];
  onSelectAll?: (selected: boolean) => void;
  onBulkAction?: (action: string, selectedItems: string[]) => void;
  className?: string;
}

export default function CartBulkActions({ 
  items, 
  onSelectAll, 
  onBulkAction, 
  className = '' 
}: CartBulkActionsProps) {
  const { clearCart, removeFromCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { locale } = useLocale();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [dictionary, setDictionary] = useState<any>(null);

  // Load dictionary
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dict = await getDictionary(locale);
        setDictionary(dict);
      } catch (error) {
        console.warn('Failed to load dictionary:', error);
      }
    };
    loadDictionary();
  }, [locale]);

  // Automaticky vybrať všetky položky pri načítaní
  useEffect(() => {
    if (items.length > 0 && selectedItems.size === 0) {
      const allItemIds = new Set(items.map(item => item.variantId));
      setSelectedItems(allItemIds);
      setIsSelectAll(true);
    }
  }, [items, selectedItems.size]);

  const handleSelectAll = () => {
    const newSelectAll = !isSelectAll;
    setIsSelectAll(newSelectAll);
    
    if (newSelectAll) {
      const allItemIds = new Set(items.map(item => item.variantId));
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems(new Set());
    }
    
    onSelectAll?.(newSelectAll);
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

  const handleBulkRemove = () => {
    if (selectedItems.size === 0) return;
    
    if (confirm(`${dictionary?.cart?.confirm_remove || 'Opravdu chcete odobrať'} ${selectedItems.size} položiek z košíka?`)) {
      selectedItems.forEach(itemId => {
        removeFromCart(itemId);
      });
      setSelectedItems(new Set());
      setIsSelectAll(false);
      onBulkAction?.('remove', Array.from(selectedItems));
    }
  };

  const handleBulkMoveToWishlist = () => {
    if (selectedItems.size === 0) return;
    
    const selectedItemsData = items.filter(item => selectedItems.has(item.variantId));
    
    selectedItemsData.forEach(item => {
      addToWishlist({
        productId: item.productId || item.variantId,
        variantId: item.variantId,
        name: item.name,
        price: item.price,
        image: item.image
      });
    });
    
    // Remove from cart after moving to wishlist
    selectedItems.forEach(itemId => {
      removeFromCart(itemId);
    });
    
    setSelectedItems(new Set());
    setIsSelectAll(false);
    onBulkAction?.('moveToWishlist', Array.from(selectedItems));
  };

  const handleClearCart = () => {
    if (confirm(dictionary?.cart?.confirm_clear || 'Opravdu chcete vyprázdniť celý košík?')) {
      clearCart();
      setSelectedItems(new Set());
      setIsSelectAll(false);
      onBulkAction?.('clear', []);
    }
  };

  const handleExportCart = () => {
    const cartData = {
      items: items,
      totalItems: items.length,
      totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(cartData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cart-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareCart = () => {
    const cartItems = items.map(item => `${item.name} (${item.quantity}x)`).join('\n');
    const shareText = `Môj košík:\n${cartItems}\n\nCelková cena: ${items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}€`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Môj košík',
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Košík bol skopírovaný do schránky!');
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelectAll}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
                      <span className="text-sm font-medium text-gray-700">
            {dictionary?.cart?.select_all || 'Vybrať všetko'} ({items.length})
          </span>
          </label>
        </div>
        
        <div className="text-sm text-gray-500">
          {selectedItems.size} {dictionary?.cart?.selected_items || 'položiek vybraných'}
        </div>
      </div>

      {/* Bulk action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleBulkRemove}
          disabled={selectedItems.size === 0}
          variant="secondary"
          size="sm"
          className="flex items-center space-x-1"
        >
          <FiTrash2 className="w-4 h-4" />
          <span>{dictionary?.cart?.bulk_actions?.remove_selected || 'Odobrať vybrané'}</span>
        </Button>

        <Button
          onClick={handleBulkMoveToWishlist}
          disabled={selectedItems.size === 0}
          variant="secondary"
          size="sm"
          className="flex items-center space-x-1"
        >
          <FiHeart className="w-4 h-4" />
          <span>{dictionary?.cart?.bulk_actions?.move_to_wishlist || 'Presunúť do obľúbených'}</span>
        </Button>

        <Button
          onClick={handleExportCart}
          variant="secondary"
          size="sm"
          className="flex items-center space-x-1"
        >
          <FiDownload className="w-4 h-4" />
          <span>{dictionary?.cart?.bulk_actions?.export_cart || 'Exportovať košík'}</span>
        </Button>

        <Button
          onClick={handleShareCart}
          variant="secondary"
          size="sm"
          className="flex items-center space-x-1"
        >
          <FiShare2 className="w-4 h-4" />
          <span>{dictionary?.cart?.bulk_actions?.share_cart || 'Zdieľať košík'}</span>
        </Button>

        <Button
          onClick={handleClearCart}
          variant="danger"
          size="sm"
          className="flex items-center space-x-1"
        >
          <FiTrash2 className="w-4 h-4" />
          <span>{dictionary?.cart?.bulk_actions?.clear_cart || 'Vyprázdniť košík'}</span>
        </Button>
      </div>

      {/* Individual item checkboxes */}
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <label key={item.variantId} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 rounded">
            <input
              type="checkbox"
              checked={selectedItems.has(item.variantId)}
              onChange={() => handleItemSelect(item.variantId)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-900">{item.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({item.quantity}x)
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
