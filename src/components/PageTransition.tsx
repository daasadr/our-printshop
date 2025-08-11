'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    
    // Krátky timeout pre animáciu
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isTransitioning 
          ? 'opacity-0 transform translate-y-4' 
          : 'opacity-100 transform translate-y-0'
      }`}
    >
      {children}
    </div>
  );
}

// Komponent pre fade-in animáciu
export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 500 
}: { 
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-${duration} ease-out ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-4'
      }`}
    >
      {children}
    </div>
  );
}

// Komponent pre stagger animácie (pre zoznamy)
export function StaggerContainer({ 
  children, 
  staggerDelay = 100 
}: { 
  children: React.ReactNode[];
  staggerDelay?: number;
}) {
  return (
    <div>
      {React.Children.map(children, (child, index) => (
        <FadeIn key={index} delay={index * staggerDelay}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
}
