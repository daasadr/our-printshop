'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RegisterFormProps {
  dict: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    gdprConsent: string;
    registerButton: string;
    loginLink: string;
    errors: {
      required: string;
      invalidEmail: string;
      passwordMismatch: string;
      passwordTooShort: string;
      general: string;
    };
    success: {
      title: string;
      message: string;
    };
  };
}

export default function RegisterForm({ dict }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gdpr_consent: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validace
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(dict.errors.required);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(dict.errors.passwordMismatch);
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(dict.errors.passwordTooShort);
      setIsLoading(false);
      return;
    }

    if (!formData.gdpr_consent) {
      setError('Musíte souhlasit se zpracováním osobních údajů');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register-directus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gdpr_consent: formData.gdpr_consent
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || dict.errors.general);
      } else {
        setSuccess(true);
        // Přesměrování na přihlášení po 3 sekundách
        setTimeout(() => {
          router.push('/cs/prihlaseni');
        }, 3000);
      }
    } catch (error) {
      setError(dict.errors.general);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-lg rounded-lg shadow-md p-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{dict.success.title}</h2>
          <p className="text-gray-600">{dict.success.message}</p>
          <p className="text-sm text-gray-500 mt-4">Přesměrování na přihlášení...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white/95 backdrop-blur-lg rounded-lg shadow-md p-4">

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {dict.name}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {dict.email}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {dict.password}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {dict.confirmPassword}
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800"
            required
          />
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="gdpr_consent"
            name="gdpr_consent"
            checked={formData.gdpr_consent}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            required
          />
          <label htmlFor="gdpr_consent" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            {dict.gdprConsent}
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Registruji...' : dict.registerButton}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {dict.loginLink.split('?')[0]}?{' '}
          <Link href="/cs/prihlaseni" className="text-blue-600 hover:text-blue-500 font-medium">
            {dict.loginLink.split('?')[1] || 'Přihlásit se'}
          </Link>
        </p>
      </div>
    </div>
  );
} 