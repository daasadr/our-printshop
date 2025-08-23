import React from 'react';
import HeroSection from './homepage/HeroSection';
import CategoriesAndProductsSection from './homepage/CategoriesAndProductsSection';
import ShippingInfoSection from './homepage/ShippingInfoSection';
import CallToActionSection from './homepage/CallToActionSection';
import NewsletterSection from './homepage/NewsletterSection';
import PageTransition from './PageTransition';
import { getCategories } from '@/lib/directus';

interface HomePageProps {
  dictionary: any;
  lang: string;
}

async function getLatestProducts(lang: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/products/latest?locale=${lang}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('Failed to fetch latest products:', response.status);
      return [];
    }
    
    const products = await response.json();
    console.log(`getLatestProducts - got ${products.length} products from API`);
    return products;
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return [];
  }
}

export default async function HomePage({ dictionary, lang }: HomePageProps) {
  // Načítanie skutočných produktov z API
  const products = await getLatestProducts(lang);
  
  // Načítanie lokalizovaných kategórií
  const categories = await getCategories(lang);

  return (
    <PageTransition>
      <main>
        <HeroSection dictionary={dictionary} lang={lang} />
        <CategoriesAndProductsSection 
          categories={categories} 
          products={products}
          dictionary={dictionary} 
          lang={lang} 
        />
        <ShippingInfoSection dictionary={dictionary} lang={lang} />
        <CallToActionSection dictionary={dictionary} lang={lang} />
        <NewsletterSection dictionary={dictionary} lang={lang} />
      </main>
    </PageTransition>
  );
} 