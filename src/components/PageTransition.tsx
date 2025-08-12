'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

interface TransitionState {
  isEntering: boolean;
  isExiting: boolean;
  key: string;
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isEntering: false,
    isExiting: false,
    key: pathname
  });

  useEffect(() => {
    if (pathname !== transitionState.key) {
      // Start exit animation
      setTransitionState(prev => ({
        ...prev,
        isExiting: true
      }));

      // After exit animation, change page and start enter animation
      const timer = setTimeout(() => {
        setTransitionState({
          isEntering: true,
          isExiting: false,
          key: pathname
        });

        // End enter animation
        const enterTimer = setTimeout(() => {
          setTransitionState(prev => ({
            ...prev,
            isEntering: false
          }));
        }, 300);

        return () => clearTimeout(enterTimer);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [pathname, transitionState.key]);

  const getTransitionClasses = () => {
    const baseClasses = 'transition-all duration-300 ease-in-out';
    
    if (transitionState.isExiting) {
      return `${baseClasses} opacity-0 transform translate-y-4`;
    }
    
    if (transitionState.isEntering) {
      return `${baseClasses} opacity-0 transform -translate-y-4`;
    }
    
    return `${baseClasses} opacity-100 transform translate-y-0`;
  };

  return (
    <div className={`${getTransitionClasses()} ${className}`}>
      {children}
    </div>
  );
}

// Variant pre fade transitions
export function FadeTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className={`transition-opacity duration-300 ease-in-out ${
      isVisible ? 'opacity-100' : 'opacity-0'
    } ${className}`}>
      {children}
    </div>
  );
}

// Variant pre slide transitions
export function SlideTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);

  const getSlideClasses = () => {
    const baseClasses = 'transition-transform duration-400 ease-in-out';
    
    if (isAnimating) {
      return `${baseClasses} transform ${
        slideDirection === 'left' ? '-translate-x-full' : 'translate-x-full'
      }`;
    }
    
    return `${baseClasses} transform translate-x-0`;
  };

  return (
    <div className={`${getSlideClasses()} ${className}`}>
      {children}
    </div>
  );
}

// Variant pre scale transitions
export function ScaleTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();
  const [isScaling, setIsScaling] = useState(false);

  useEffect(() => {
    setIsScaling(true);
    const timer = setTimeout(() => {
      setIsScaling(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className={`transition-all duration-300 ease-in-out transform ${
      isScaling ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
    } ${className}`}>
      {children}
    </div>
  );
}

// Loading overlay pre transitions
export function TransitionOverlay({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
}
