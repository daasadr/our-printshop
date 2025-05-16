export const dynamic = "force-dynamic";
import Image from 'next/image';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Kontakt | HappyWilderness',
  description: 'Kontaktujte nás s jakýmkoliv dotazem ohledně našich produktů nebo služeb.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen relative">
      <Image
        src="/images/tropical.jpg"
        alt="Background"
        fill
        className="object-cover fixed inset-0 z-0"
        priority
      />
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Kontaktujte nás</h1>
          <p className="text-gray-600 mb-8 text-center">
            Máte dotaz? Neváhejte nás kontaktovat. Odpovíme vám co nejdříve.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
} 