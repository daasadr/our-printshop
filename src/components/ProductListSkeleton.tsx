import React from 'react';

export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(12)].map((_, index) => (
        <div key={index} className="group relative bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
          {/* Obrázok skeleton */}
          <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          
          {/* Názov produktu skeleton */}
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-2">
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          
          {/* Popis skeleton */}
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full mb-2">
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 mb-4">
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          
          {/* Cena a tlačidlo skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20">
              <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24">
              <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 