import React from 'react';
import HeroSection from './homepage/HeroSection';
import CategoriesAndProductsSection from './homepage/CategoriesAndProductsSection';
import CallToActionSection from './homepage/CallToActionSection';
import NewsletterSection from './homepage/NewsletterSection';

interface HomePageProps {
  dictionary: any;
  lang: string;
}

async function getLatestProducts(lang: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/latest?locale=${lang}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('Failed to fetch latest products:', response.status);
      return [];
    }
    
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return [];
  }
}

export default async function HomePage({ dictionary, lang }: HomePageProps) {
  // Načítanie skutočných produktov z API
  const products = await getLatestProducts(lang);
  
  // Default kategórie
  const defaultCategories = [
    { id: 1, name: 'Domov a dekorace', slug: 'home-decor' },
    { id: 2, name: 'Stylově pro dámy', slug: 'women' },
    { id: 3, name: 'Pánská kolekce', slug: 'men' },
    { id: 4, name: 'Pro malé objevitele', slug: 'kids' },
  ];

  return (
    <main>
      <HeroSection dictionary={dictionary} lang={lang} />
      <CategoriesAndProductsSection 
        categories={defaultCategories} 
        products={products}
        dictionary={dictionary} 
        lang={lang} 
      />
      <CallToActionSection dictionary={dictionary} lang={lang} />
      <NewsletterSection dictionary={dictionary} lang={lang} />
    </main>
  );
} 