'use client';

import React from 'react';
import PageTransition from './PageTransition';

interface ClientPageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function ClientPageTransition({ children, className = '' }: ClientPageTransitionProps) {
  return (
    <PageTransition className={className}>
      {children}
    </PageTransition>
  );
}
