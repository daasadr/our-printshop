import HeroSection from '@/components/homepage/HeroSection';
import CategoriesAndProductsSection from '@/components/homepage/CategoriesAndProductsSection';
import CallToActionSection from '@/components/homepage/CallToActionSection';
import NewsletterSection from '@/components/homepage/NewsletterSection';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-emerald-50 via-amber-50 to-teal-50">
      {/* Hero sekce */}
      <HeroSection />

      {/* Kategorie a nejnovější produkty s khaki gradientem */}
      <CategoriesAndProductsSection />

      {/* Výzva k akci s vlastním gradientem */}
      <CallToActionSection />

      {/* Newsletter signup s khaki gradientem */}
      <NewsletterSection />
    </div>
  );
}