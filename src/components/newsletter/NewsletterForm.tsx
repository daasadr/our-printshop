"use client";

import { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';

export default function NewsletterForm() {
  const { t, i18n } = useTranslation('common');
  const [email, setEmail] = useState("");
  const [messageKey, setMessageKey] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (status !== 'idle') {
      setStatus('idle');
      setMessageKey('');
    }
  }, [i18n.language]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessageKey(""); // Clear previous messages
    setStatus('idle');

    if (!email) {
      setMessageKey('newsletter.error.email_required');
      setStatus('error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessageKey('newsletter.error.invalid_email');
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, lang: i18n.language }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessageKey(data.messageKey || 'newsletter.success');
        setStatus('success');
        setEmail(""); // Clear email field on success
      } else {
        setMessageKey(data.messageKey || 'newsletter.error.generic');
        setStatus('error');
      }
    } catch (error) {
      setMessageKey('newsletter.error.generic');
      setStatus('error');
      console.error("Subscription error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('newsletter.placeholder')}
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-gray-400"
          placeholder={t('newsletter.placeholder')}
          disabled={status === 'loading'}
        />
      </div>
      <button
        type="submit"
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          status === 'loading' 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? t('newsletter.sending') : t('newsletter.subscribe')}
      </button>
      {messageKey && (
        <p
          className={`mt-2 text-sm ${
            status === 'success' ? "text-green-600" : "text-red-600"
          }`}
        >
          {t(messageKey)}
        </p>
      )}
    </form>
  );
} 