import HeroSection from '@/components/homepage/HeroSection';
import CategoriesAndProductsSection from '@/components/homepage/CategoriesAndProductsSection';
import CallToActionSection from '@/components/homepage/CallToActionSection';
import NewsletterSection from '@/components/homepage/NewsletterSection';
import { getLatestProducts, getCategories } from '@/lib/directus';

export default async function Home() {

  const categories = await getCategories();
  const products = await getLatestProducts(4); // Explicitně 4 nejnovější produkty

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-amber-50 to-teal-50">
      {/* Hero sekce */}
      <HeroSection />

      {/* Kategorie a nejnovější produkty s khaki gradientem */}
      <CategoriesAndProductsSection
        categories={categories}
        products={products}
      />

      {/* Výzva k akci s vlastním gradientem */}
      <CallToActionSection />

      {/* Newsletter signup s khaki gradientem */}
      <NewsletterSection />
    </div>
  );
}