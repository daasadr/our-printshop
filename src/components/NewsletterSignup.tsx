"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const NewsletterSignup: React.FC = () => {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage(t('newsletter.error.email_required'));
      return;
    }
    
    // Základní validace e-mailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage(t('newsletter.error.invalid_email'));
      return;
    }
    
    setStatus('loading');
    
    try {
      // Zde by bylo připojení k vašemu API pro odběr novinek
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error(t('newsletter.error.subscription_failed'));
      }
      
      setStatus('success');
      setMessage(t('newsletter.success'));
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setMessage(t('newsletter.error.generic'));
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('newsletter.placeholder')}
            className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            className={`px-6 py-3 font-medium rounded-md text-white ${
              status === 'loading'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? t('newsletter.sending') : t('newsletter.subscribe')}
          </button>
        </div>
        
        {status === 'success' && (
          <p className="mt-2 text-sm text-green-600">{message}</p>
        )}
        
        {status === 'error' && (
          <p className="mt-2 text-sm text-red-600">{message}</p>
        )}
        
        <p className="mt-3 text-xs text-gray-500">
          {t('newsletter.privacy_notice')}
          <Link href="/privacy-policy" className="underline ml-1">
            {t('newsletter.privacy_policy')}
          </Link>.
        </p>
      </form>
    </div>
  );
};

export default NewsletterSignup;