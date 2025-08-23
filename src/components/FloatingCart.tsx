'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '@/hooks/useCart';
import { useLocale } from '@/context/LocaleContext';
import { FiShoppingCart, FiMove } from 'react-icons/fi';
import { formatPrice } from '@/utils/pricing';
import Link from 'next/link';
import Image from 'next/image';

interface FloatingCartProps {
  lang: string;
  dictionary: any;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ lang, dictionary }) => {
  const { items, totalPrice, totalItems } = useCart();
  const { currency } = useLocale();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Animácia pridaní položky
  useEffect(() => {
    if (totalItems > 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [totalItems]);

  // Začiatok drag (mouse)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    console.log('Mouse down on cart');
    
    // Nezačneme drag ak klikli na link
    if (e.target instanceof HTMLElement && e.target.closest('a')) {
      console.log('Clicked on link, not starting drag');
      return;
    }
    
    console.log('Starting drag');
    setIsDragging(true);
    
    const rect = cartRef.current?.getBoundingClientRect();
    if (rect) {
      dragStartRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
    
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Začiatok drag (touch)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    console.log('Touch start on cart');
    
    // Nezačneme drag ak klikli na link
    if (e.target instanceof HTMLElement && e.target.closest('a')) {
      console.log('Clicked on link, not starting drag');
      return;
    }
    
    console.log('Starting touch drag');
    setIsDragging(true);
    
    const touch = e.touches[0];
    const rect = cartRef.current?.getBoundingClientRect();
    if (rect) {
      dragStartRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
    
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Drag pohyb (mouse)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !cartRef.current) return;
    
    console.log('Dragging cart', e.clientX, e.clientY);
    
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    
    // Obmedzenie na hranice obrazovky
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 100;
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    cartRef.current.style.left = `${constrainedX}px`;
    cartRef.current.style.top = `${constrainedY}px`;
  }, [isDragging]);

  // Drag pohyb (touch)
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !cartRef.current) return;
    
    console.log('Touch dragging cart');
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStartRef.current.x;
    const newY = touch.clientY - dragStartRef.current.y;
    
    // Obmedzenie na hranice obrazovky
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 100;
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    cartRef.current.style.left = `${constrainedX}px`;
    cartRef.current.style.top = `${constrainedY}px`;
    
    e.preventDefault();
  }, [isDragging]);

  // Koniec drag (mouse)
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      console.log('Ending drag');
      setIsDragging(false);
    }
  }, [isDragging]);

  // Koniec drag (touch)
  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      console.log('Ending touch drag');
      setIsDragging(false);
    }
  }, [isDragging]);

  // Event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <>
      {/* Plávajúci košík - vždy viditeľný */}
      <div 
        ref={cartRef}
        className="fixed bottom-6 right-6 z-50 select-none"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'none' : 'all 0.3s ease'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className={`bg-green-500 rounded-xl shadow-2xl border border-green-400 overflow-hidden backdrop-blur-sm transform ${
          isDragging ? 'scale-105 shadow-3xl' : 'hover:scale-105 hover:shadow-3xl'
        }`}>
          {/* Drag handle */}
          <div className="absolute top-2 right-2 z-10">
            <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <FiMove className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Hlavná časť košíka */}
          <div className="flex items-center p-4 hover:bg-green-600 transition-colors">
            {/* Ikona košíka */}
            <div className="relative mr-3">
              <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                isAnimating ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
              }`}>
                <FiShoppingCart className="w-4 h-4 text-green-600" />
              </div>
              {totalItems > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold animate-pulse shadow-lg">
                  {totalItems > 99 ? '99+' : totalItems}
                </div>
              )}
            </div>

            {/* Informácie o košíku */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">
                {dictionary?.floating_cart?.title || 'Košík'}
              </div>
              <div className="text-xs text-green-100">
                {totalItems === 0 
                  ? dictionary?.floating_cart?.empty || 'Prázdny košík'
                  : totalItems === 1 
                    ? '1 položka'
                    : `${totalItems} položiek`
                }
              </div>
            </div>
          </div>

          {/* Klikateľný link pre otvorenie košíka */}
          <Link 
            href={`/${lang}/cart`} 
            className="absolute inset-0 z-20"
            onClick={(e) => {
              if (isDragging) {
                console.log('Preventing link click during drag');
                e.preventDefault();
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default FloatingCart;
