import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Wild Shop | Originální oblečení s autorskými potisky',
    template: '%s | Wild Shop'
  },
  description: 'Objevte unikátní kolekci oblečení s autorskými potisky. Každý kus je vyroben na míru podle vašich požadavků.',
  keywords: ['autorské potisky', 'originální oblečení', 'print on demand', 'český design', 'trička s potiskem'],
  authors: [{ name: 'Vaše Jméno' }],
  creator: 'Vaše Jméno',
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://www.vasbrand.cz',
    siteName: 'Wild Shop',
    title: 'Wild Shop | Originální oblečení s autorskými potisky',
    description: 'Objevte unikátní kolekci oblečení s autorskými potisky. Každý kus je vyroben na míru podle vašich požadavků.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Wild Shop - Originální oblečení s autorskými potisky'
      }
    ]
  }
}; 