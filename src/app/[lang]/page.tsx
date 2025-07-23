import { getDictionary } from '@/lib/getDictionary';
import HomePage from '@/components/HomePage';

interface PageProps {
  params: {
    lang: string;
  };
}

export default async function LocalePage({ params: { lang } }: PageProps) {
  const dictionary = await getDictionary(lang);

  return <HomePage dictionary={dictionary} lang={lang} />;
} 