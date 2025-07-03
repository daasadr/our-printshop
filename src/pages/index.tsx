import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/Hero';
import CategoryTiles from '@/components/CategoryTiles';
import LatestProducts from '@/components/LatestProducts';
import NewsletterSignup from '@/components/NewsletterSignup';
import { useTranslation } from 'next-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>HappyWilderness</title>
        <meta name="description" content={t('Index.description')} />
      </Head>
      <Header />
      <main className="min-h-screen flex flex-col gap-16">
        <section className="py-12 bg-gradient-to-b from-blue-100/40 to-white">
          <Hero />
        </section>
        <section className="py-12">
          <CategoryTiles />
        </section>
        <section className="py-12 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-8">{t('latest_products')}</h2>
          <div className="container mx-auto px-4">
            <LatestProducts />
          </div>
        </section>
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-8">{t('newsletter_title')}</h2>
          <NewsletterSignup />
        </section>
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'cs', ['common'])),
    },
  };
}; 