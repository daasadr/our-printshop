import Image from 'next/image';
import ContactForm from '@/components/ContactForm';
import { Metadata } from 'next';
import { getDictionary } from '@/lib/getDictionary';

interface ContactPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  
  return {
    title: `${dict.contact?.title || 'Kontakt'} | HappyWilderness`,
    description: dict.contact?.subtitle || 'Kontaktujte nás s jakýmkoliv dotazem ohledně našich produktů nebo služeb.',
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
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
              {dict.contact?.title || 'Kontaktujte nás'}
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
              {dict.contact?.subtitle || 'Máte dotaz? Neváhejte nás kontaktovat. Odpovíme vám co nejdříve.'}
            </p>
          </div>
          
          {/* Kontaktný formulár */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 border border-white/20">
            <ContactForm dictionary={dict} />
          </div>
          
          {/* Dodatočné informácie */}
          <div className="mt-12 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
              <div className="space-y-2">
                <div className="text-3xl mb-2">📧</div>
                <h3 className="font-semibold text-lg">{dict.contact_info?.email || 'Email'}</h3>
                <p className="text-green-100">happyones@happywilderness.cz</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl mb-2">⏰</div>
                <h3 className="font-semibold text-lg">{dict.contact_info?.response_time || 'Odpoveď'}</h3>
                <p className="text-green-100">{dict.contact_info?.response_time_value || 'Do 24 hodín'}</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl mb-2">🌍</div>
                <h3 className="font-semibold text-lg">{dict.contact_info?.languages || 'Jazyky'}</h3>
                <p className="text-green-100">{dict.contact_info?.languages_value || 'CS, SK, EN, DE'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 