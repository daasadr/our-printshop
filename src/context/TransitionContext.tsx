'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface TransitionContextType {
  isTransitioning: boolean;
  transitionType: 'fade' | 'slide' | 'scale' | 'none';
  setTransitionType: (type: 'fade' | 'slide' | 'scale' | 'none') => void;
  startTransition: () => void;
  endTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<'fade' | 'slide' | 'scale' | 'none'>('fade');

  const startTransition = () => {
    setIsTransitioning(true);
  };

  const endTransition = () => {
    setIsTransitioning(false);
  };

  // Automatické spustenie transition pri zmene pathname
  useEffect(() => {
    if (transitionType !== 'none') {
      startTransition();
      const timer = setTimeout(() => {
        endTransition();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [pathname, transitionType]);

  return (
    <TransitionContext.Provider value={{
      isTransitioning,
      transitionType,
      setTransitionType,
      startTransition,
      endTransition
    }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
}

// Hook pre custom transitions
export function usePageTransition() {
  const { isTransitioning, transitionType } = useTransition();
  
  const getTransitionClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-in-out';
    
    if (!isTransitioning) {
      return `${baseClasses} opacity-100 transform translate-y-0`;
    }
    
    switch (transitionType) {
      case 'fade':
        return `${baseClasses} opacity-0`;
      case 'slide':
        return `${baseClasses} opacity-0 transform translate-x-full`;
      case 'scale':
        return `${baseClasses} opacity-0 transform scale-95`;
      default:
        return baseClasses;
    }
  };

  return {
    isTransitioning,
    transitionType,
    transitionClasses: getTransitionClasses()
  };
}
