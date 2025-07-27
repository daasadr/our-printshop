import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';
import { getDictionary } from '@/lib/dictionary';

interface RegisterPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: RegisterPageProps): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  
  return {
    title: `${dict.auth.register.title} | HappyWilderness`,
    description: dict.auth.register.description,
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const dict = await getDictionary(params.lang);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {dict.auth.register.title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {dict.auth.register.subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm dict={dict.auth.register} />
        </div>
      </div>
    </div>
  );
} 