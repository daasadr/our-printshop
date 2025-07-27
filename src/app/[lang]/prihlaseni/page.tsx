import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import { getDictionary } from '@/lib/dictionary';

interface LoginPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  
  return {
    title: `${dict.auth.login.title} | HappyWilderness`,
    description: dict.auth.login.description,
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const dict = await getDictionary(params.lang);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {dict.auth.login.title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {dict.auth.login.subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm dict={dict.auth.login} />
        </div>
      </div>
    </div>
  );
} 