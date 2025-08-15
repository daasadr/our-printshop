import React from 'react';

export function ProductFilterSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="space-y-6">
        {/* Nadpis filtrov */}
        <div className="border-b border-gray-200 pb-4">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 mb-2">
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Search skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20">
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg">
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Kategórie skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24">
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          <div className="space-y-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded">
                  <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20">
                  <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cena skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16">
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12">
                <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded">
                <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12">
                <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded">
                <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* Zoradenie skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20">
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded">
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Tlačidlá skeleton */}
        <div className="flex space-x-3 pt-4">
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24">
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24">
            <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

