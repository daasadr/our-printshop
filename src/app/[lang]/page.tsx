import Hero from '@/components/Hero';
import CategoryTiles from '@/components/CategoryTiles';
import LatestProducts from '@/components/LatestProducts';
import NewsletterSignup from '@/components/NewsletterSignup';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative h-screen flex items-center justify-center text-white">
        <Image
          src="/images/jungle-bg.jpg"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <Hero />
        </div>
      </section>

      <section className="py-16 bg-white">
        <CategoryTiles />
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <LatestProducts />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <NewsletterSignup />
        </div>
      </section>
    </main>
  );
} 