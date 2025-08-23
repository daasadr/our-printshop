'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/context/WishlistContext';
import { useLocale } from '@/context/LocaleContext';
import { Button } from '@/components/ui/Button';
import { FiTrash2, FiHeart, FiDownload, FiShare2 } from 'react-icons/fi';
import ConfirmModal from '@/components/ConfirmModal';

interface CartBulkActionsProps {
  items: any[];
  selectedItems?: Set<string>;
  isSelectAll?: boolean;
  onSelectAll?: (selected: boolean) => void;
  onItemSelect?: (itemId: string) => void;
  onBulkAction?: (action: string, selectedItems: string[]) => void;
  className?: string;
  dictionary?: any;
}

export default function CartBulkActions({ 
  items, 
  selectedItems: externalSelectedItems,
  isSelectAll: externalIsSelectAll,
  onSelectAll, 
  onItemSelect,
  onBulkAction, 
  className = '',
  dictionary: externalDictionary
}: CartBulkActionsProps) {
  const { clearCart, removeFromCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { locale } = useLocale();
  // Používame externý state ak je poskytnutý, inak vlastný
  const selectedItems = externalSelectedItems || new Set<string>();
  const isSelectAll = externalIsSelectAll || false;
  const [dictionary, setDictionary] = useState<any>(externalDictionary || null);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [showBulkRemoveModal, setShowBulkRemoveModal] = useState(false);

  // Používame externý dictionary
  useEffect(() => {
    if (externalDictionary) {
      console.log('CartBulkActions - Using external dictionary:', externalDictionary?.cart?.confirm_remove);
      setDictionary(externalDictionary);
    }
  }, [externalDictionary]);

  // Automaticky vybrať všetky položky pri načítaní (len ak nemáme externý state)
  useEffect(() => {
    if (!externalSelectedItems && items.length > 0 && selectedItems.size === 0) {
      const allItemIds = new Set(items.map(item => item.variantId));
      if (onSelectAll) {
        onSelectAll(true);
      }
    }
  }, [items, selectedItems.size, externalSelectedItems, onSelectAll]);

  const handleSelectAll = () => {
    const newSelectAll = !isSelectAll;
    
    if (newSelectAll) {
      const allItemIds = new Set(items.map(item => item.variantId));
      // Ak máme externý callback, použijeme ho
      if (onSelectAll) {
        onSelectAll(true);
      }
    } else {
      // Ak máme externý callback, použijeme ho
      if (onSelectAll) {
        onSelectAll(false);
      }
    }
  };

  const handleItemSelect = (itemId: string) => {
    onItemSelect?.(itemId);
  };

  const handleBulkRemove = () => {
    if (selectedItems.size === 0) return;
    setShowBulkRemoveModal(true);
  };

  const handleConfirmBulkRemove = () => {
    console.log('CartBulkActions - Removing items:', Array.from(selectedItems));
    selectedItems.forEach(itemId => {
      console.log('CartBulkActions - Removing item:', itemId);
      removeFromCart(itemId);
    });
    // Resetujeme externý state cez callback
    if (onSelectAll) {
      onSelectAll(false);
    }
    onBulkAction?.('remove', Array.from(selectedItems));
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
    
    // Resetujeme externý state cez callback
    if (onSelectAll) {
      onSelectAll(false);
    }
    onBulkAction?.('moveToWishlist', Array.from(selectedItems));
  };

  const handleClearCart = () => {
    setShowClearCartModal(true);
  };

  const handleConfirmClearCart = () => {
    clearCart();
    // Resetujeme externý state cez callback
    if (onSelectAll) {
      onSelectAll(false);
    }
    onBulkAction?.('clear', []);
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
      }).catch(error => {
        console.log('Share cancelled or failed:', error);
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
          alert('Košík bol skopírovaný do schránky!');
        }).catch(clipboardError => {
          console.error('Clipboard write failed:', clipboardError);
        });
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Košík bol skopírovaný do schránky!');
      }).catch(error => {
        console.error('Clipboard write failed:', error);
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 ${className}`}>
      {/* Bulk action buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          onClick={handleBulkRemove}
          disabled={selectedItems.size === 0}
          variant="secondary"
          size="sm"
          className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white border-red-600"
        >
          <FiTrash2 className="w-4 h-4" />
          <span>{dictionary?.cart?.bulk_actions?.remove_selected || 'Odobrať vybrané'}</span>
        </Button>

        <Button
          onClick={handleBulkMoveToWishlist}
          disabled={selectedItems.size === 0}
          variant="secondary"
          size="sm"
          className="flex items-center space-x-1 bg-pink-600 hover:bg-pink-700 text-white border-pink-600"
        >
          <FiHeart className="w-4 h-4" />
          <span>{dictionary?.cart?.bulk_actions?.move_to_wishlist || 'Presunúť do obľúbených'}</span>
        </Button>

        <Button
          onClick={handleExportCart}
          variant="secondary"
          size="sm"
          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
        >
          <FiDownload className="w-4 h-4" />
          <span>{dictionary?.cart?.bulk_actions?.export_cart || 'Exportovať košík'}</span>
        </Button>

        <Button
          onClick={handleShareCart}
          variant="secondary"
          size="sm"
          className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
        >
          <FiShare2 className="w-4 h-4" />
          <span>{dictionary?.cart?.bulk_actions?.share_cart || 'Zdieľať košík'}</span>
        </Button>

        <Button
          onClick={handleClearCart}
          variant="danger"
          size="sm"
          className="flex items-center space-x-1 bg-red-700 hover:bg-red-800 text-white border-red-700"
        >
          <FiTrash2 className="w-4 h-4" />
          <span>{dictionary?.cart?.bulk_actions?.clear_cart || 'Vyprázdniť košík'}</span>
        </Button>
      </div>

      {/* Selection info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelectAll}
              onChange={handleSelectAll}
              className="rounded border-white/30 text-green-600 focus:ring-green-500 bg-white/20"
            />
            <span className="text-sm font-medium text-white">
              {dictionary?.cart?.select_all || 'Vybrať všetko'} ({items.reduce((total, item) => total + item.quantity, 0)})
            </span>
          </label>
        </div>
        
        <div className="text-sm text-white/70">
          {Array.from(selectedItems).reduce((total, itemId) => {
            const item = items.find(i => i.variantId === itemId);
            return total + (item?.quantity || 0);
          }, 0)} {dictionary?.cart?.selected_items || 'položiek vybraných'}
        </div>
      </div>
    </div>
    
    {/* Modal pre potvrdenie vyprázdnenia košíka */}
    <ConfirmModal
      isOpen={showClearCartModal}
      onClose={() => setShowClearCartModal(false)}
      onConfirm={handleConfirmClearCart}
      title={dictionary?.cart?.clear_cart || 'Vyprázdniť košík'}
      message={dictionary?.cart?.confirm_clear || 'Opravdu chcete vyprázdniť celý košík?'}
      dictionary={dictionary}
    />

    {/* Modal pre potvrdenie odobrania vybraných položiek */}
    <ConfirmModal
      isOpen={showBulkRemoveModal}
      onClose={() => setShowBulkRemoveModal(false)}
      onConfirm={handleConfirmBulkRemove}
      title={dictionary?.cart?.bulk_actions?.remove_selected || 'Odobrať vybrané'}
      message={`${dictionary?.cart?.confirm_remove || 'Opravdu chcete odobrať'} ${selectedItems.size} ${dictionary?.cart?.items_from_cart || 'položiek z košíka'}?`}
      dictionary={dictionary}
    />
    {/* Debug info */}
    {showBulkRemoveModal && (
      <div style={{display: 'none'}}>
        Debug: locale={locale}, confirm_remove={dictionary?.cart?.confirm_remove}, items_from_cart={dictionary?.cart?.items_from_cart}
      </div>
    )}
    

    </>
  );
}
