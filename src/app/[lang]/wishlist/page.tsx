import Image from 'next/image';
import WishlistContent from '@/components/WishlistContent';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/getDictionary';

interface WishlistPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: WishlistPageProps): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  
  return {
    title: `${dict.wishlist?.title || 'Oblíbené'} | HappyWilderness`,
    description: dict.wishlist?.empty || 'Vaše oblíbené produkty',
  };
}

export default async function WishlistPage({ params }: WishlistPageProps) {
  const dict = await getDictionary(params.lang);
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background s parallax efektom */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/tropical-jungle.jpg"
          alt="Tropical jungle background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/30 via-green-800/20 to-green-900/40"></div>
      </div>
      
      {/* Hlavný obsah */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header sekcia */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              {dict.wishlist?.title || 'Oblíbené produkty'}
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
              {dict.wishlist?.empty || 'Vaše oblíbené produkty na jednom místě'}
            </p>
          </div>
          
          {/* Wishlist obsah */}
          <WishlistContent />
        </div>
      </div>
    </div>
  );
} 