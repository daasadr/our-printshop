'use client';

export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDictionary } from '@/lib/getDictionary';

interface LoginPageProps {
  params: {
    lang: string;
  };
}

export default function LoginPage({ params: { lang } }: LoginPageProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dict, setDict] = useState<any>(null);

  // Načteme překlady při mount
  useEffect(() => {
    const loadDict = async () => {
      try {
        const dictionary = await getDictionary(lang);
        setDict(dictionary.auth.login);
      } catch (error) {
        console.error('Error loading dictionary:', error);
      }
    };
    loadDict();
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('SignIn: Form submitted, starting login process...');
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    console.log('SignIn: Form data - email:', email, 'password length:', password.length);

    try {
      // Voláme náš JWT login endpoint
      const response = await fetch('/api/auth/login-directus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Přihlášení selhalo');
      } else {
        console.log('Login successful, saving tokens to localStorage...');
        
        // Uložíme tokeny do localStorage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        console.log('Tokens saved, dispatching auth-status-changed event...');
        
        // Vyvoláme custom event pro Navigation komponentu
        window.dispatchEvent(new Event('auth-status-changed'));
        
        console.log('Event dispatched, waiting 500ms before redirecting...');
        
        // Počkáme 500ms, aby se token uložil a event zpracoval
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Redirecting to home page...');
        
        // Přesměrujeme na hlavní stránku
        router.push(`/${lang}`);
        router.refresh();
      }
    } catch (error) {
      setError('Něco se pokazilo. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  if (!dict) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {dict.title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {dict.subtitle}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {dict.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={dict.email}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {dict.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={dict.password}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Přihlašování...' : dict.loginButton}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {dict.registerLink}{' '}
            <Link href={`/${lang}/registrace`} className="font-medium text-indigo-600 hover:text-indigo-500">
              Registrovat se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 