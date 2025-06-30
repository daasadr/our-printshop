"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const NewsletterSignup: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [messageKey, setMessageKey] = useState('');
  
  useEffect(() => {
    if (status !== 'idle') {
      setStatus('idle');
      setMessageKey('');
    }
  }, [i18n.language]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessageKey('newsletter.error.email_required');
      return;
    }
    
    // Základní validace e-mailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessageKey('newsletter.error.invalid_email');
      return;
    }
    
    setStatus('loading');
    setMessageKey('');
    
    try {
      // Zde by bylo připojení k vašemu API pro odběr novinek
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, lang: i18n.language }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setStatus('error');
        setMessageKey(data.messageKey || 'newsletter.error.subscription_failed');
        return;
      }
      
      setStatus('success');
      setMessageKey(data.messageKey || 'newsletter.success');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setMessageKey('newsletter.error.generic');
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
        
        {status === 'success' && messageKey && (
          <p className="mt-2 text-sm text-green-600">{t(messageKey)}</p>
        )}
        
        {status === 'error' && messageKey && (
          <p className="mt-2 text-sm text-red-600">{t(messageKey)}</p>
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