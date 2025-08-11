import React from 'react';

interface PageLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PageLoader({ message = 'Načítavam...', size = 'md' }: PageLoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Spinner */}
        <div className="flex justify-center mb-4">
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`} />
        </div>
        
        {/* Loading message */}
        <p className="text-gray-600 text-lg font-medium animate-pulse">
          {message}
        </p>
        
        {/* Animated dots */}
        <div className="flex justify-center mt-2 space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

// Komponent pre loading stavy sekcií
export function SectionLoader({ message = 'Načítavam...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto mb-3" />
        <p className="text-gray-600 text-sm animate-pulse">{message}</p>
      </div>
    </div>
  );
}

// Komponent pre loading stavy tlačidiel
export function ButtonLoader({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-white border-t-transparent`} />
  );
}
