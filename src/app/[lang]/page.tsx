'use client';

import Hero from '@/components/Hero';
import LatestProducts from '@/components/LatestProducts';
import CategoryTiles from '@/components/CategoryTiles';
import NewsletterSignup from '@/components/NewsletterSignup';

console.log('HomePage component loading...');

export default function HomePage() {
  console.log('HomePage render function called');
  
  return (
    <>
      <Hero />
      <CategoryTiles />
      <LatestProducts />
      <NewsletterSignup />
    </>
  );
} 