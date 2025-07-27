'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginFormProps {
  dict: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    login: string;
    forgotPassword: string;
    noAccount: string;
    register: string;
    errors: {
      invalidCredentials: string;
      emailNotVerified: string;
      general: string;
    };
  };
}

export default function LoginForm({ dict }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'Email není ověřený') {
          setError(dict.errors.emailNotVerified);
        } else {
          setError(dict.errors.invalidCredentials);
        }
      } else {
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

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {dict.email}
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {dict.password}
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link
            href="/cs/zapomenute-heslo"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {dict.forgotPassword}
          </Link>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Přihlašování...' : dict.login}
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {dict.noAccount}{' '}
          <Link
            href="/cs/registrace"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {dict.register}
          </Link>
        </p>
      </div>
    </form>
  );
} 