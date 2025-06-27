import { Suspense } from 'react';
import LatestProducts from '@/components/LatestProducts';
import CategoryTiles from '@/components/CategoryTiles';

export default function CategoriesAndProductsSection() {
  return (
    <div className="bg-gradient-to-br from-[#1a2a1b] via-[#3a4a3b] to-[#1a2a1b] text-white py-16">
      {/* Kategorie */}
      <div className="mb-24">
        <Suspense fallback={<div className="text-center text-white">Načítám kategorie...</div>}>
          <CategoryTiles />
        </Suspense>
      </div>

      {/* Nejnovější produkty */}
      <div>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nejnovější produkty</h2>
          <LatestProducts limit={4} />
        </div>
      </div>
    </div>
  );
} 