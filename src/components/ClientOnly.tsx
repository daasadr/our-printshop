'use client';

import React, { useState, useEffect } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Variant pre ceny - zobrazí skeleton počas hydratácie
export function ClientOnlyPrice({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
      </div>
    );
  }

  return <>{children}</>;
}

// Variant pre komponenty s cenami
export function ClientOnlyPriceComponent({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ClientOnly fallback={
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
    }>
      {children}
    </ClientOnly>
  );
}
