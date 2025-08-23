'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginFormProps {
  dict: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    loginButton: string;
    forgotPassword: string;
    registerLink: string;
    gdpr_info?: string;
    errors: {
      required: string;
      invalidCredentials: string;
      general: string;
    };
  };
}

export default function LoginForm({ dict }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validace
    if (!formData.email || !formData.password) {
      setError(dict.errors.required);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login-directus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || dict.errors.invalidCredentials);
      } else {
        console.log('LoginForm: Login successful, saving tokens to localStorage...');
        
        // Uložíme tokeny do localStorage se stejnými klíči jako Navigation komponenta
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          localStorage.setItem('user_data', JSON.stringify(data.user));
          
          console.log('LoginForm: Tokens saved, dispatching auth-status-changed event...');
          
          // Vyvoláme custom event pro Navigation komponentu
          window.dispatchEvent(new Event('auth-status-changed'));
          
          console.log('LoginForm: Event dispatched, redirecting to account page...');
        }
        
        // Úspěšné přihlášení
        router.push('/cs/ucet');
        router.refresh();
      }
    } catch (error) {
      setError(dict.errors.general);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{dict.title}</h1>
        <p className="text-gray-600 mt-2">{dict.subtitle}</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            {dict.email}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            {dict.password}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            required
          />
        </div>

        {/* GDPR Info */}
        {dict.gdpr_info && (
          <div className="text-xs text-gray-500 text-center">
            {dict.gdpr_info}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Přihlašuji...' : dict.loginButton}
        </button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-gray-600">
          <Link href="/cs/zapomenute-heslo" className="text-blue-600 hover:text-blue-500 font-medium">
            {dict.forgotPassword}
          </Link>
        </p>
        <p className="text-sm text-gray-600">
          {dict.registerLink}{' '}
          <Link href="/cs/registrace" className="text-blue-600 hover:text-blue-500 font-medium">
            Registrovat se
          </Link>
        </p>
      </div>
    </div>
  );
} 