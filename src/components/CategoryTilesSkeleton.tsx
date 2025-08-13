import React from 'react';

export function CategoryTilesSkeleton() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        {/* Nadpis skeleton */}
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 mx-auto mb-4">
          <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
        
        {/* Podnadpis skeleton */}
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-96 mx-auto">
          <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Grid kategórií skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="group relative">
            {/* Kategória tile skeleton */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              {/* Shimmer efekt */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Názov kategórie skeleton */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-6 bg-gradient-to-r from-white/80 to-white/60 rounded w-3/4 mb-2">
                  <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
                
                {/* Počet produktov skeleton */}
                <div className="h-4 bg-gradient-to-r from-white/60 to-white/40 rounded w-1/2">
                  <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

