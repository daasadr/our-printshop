import Hero from '@/components/Hero';
import LatestProducts from '@/components/LatestProducts';
import CategoryTiles from '@/components/CategoryTiles';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryTiles />
      <LatestProducts />
      <NewsletterSignup />
    </>
  );
} 