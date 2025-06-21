"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from 'next-i18next';

export default function UnsubscribePage() {
  const { t, i18n } = useTranslation('common');
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [messageKey, setMessageKey] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status !== 'idle') {
      setStatus('idle');
      setMessageKey('');
    }
  }, [i18n.language]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessageKey("");
    setStatus('loading');
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason, lang: i18n.language }),
      });
      
      const data = await res.json();

      if (res.ok) {
        setMessageKey(data.messageKey || 'newsletter.unsubscribe_success');
        setStatus('success');
      } else {
        setMessageKey(data.messageKey || 'newsletter.error.generic');
        setStatus('error');
      }
    } catch (error) {
      setMessageKey('newsletter.error.generic');
      setStatus('error');
    }
  };

  const isUnsubscribed = status === 'success';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isUnsubscribed ? t('newsletter.unsubscribe_title') : t('newsletter.unsubscribe_title')}
        </h2>
        {!isUnsubscribed && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {t('newsletter.unsubscribe_subtitle')}
            </p>
        )}
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isUnsubscribed ? (
             <p className="text-center text-green-600">{t(messageKey)}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  placeholder={t('newsletter.placeholder')}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('newsletter.unsubscribe_reason_label')}</label>
                <fieldset className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input id="reason-too-many" name="reason" type="radio" value="too_many" onChange={e => setReason(e.target.value)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                    <label htmlFor="reason-too-many" className="ml-3 block text-sm text-gray-900">{t('newsletter.unsubscribe_reason_too_many')}</label>
                  </div>
                   <div className="flex items-center">
                    <input id="reason-not-relevant" name="reason" type="radio" value="not_relevant" onChange={e => setReason(e.target.value)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                    <label htmlFor="reason-not-relevant" className="ml-3 block text-sm text-gray-900">{t('newsletter.unsubscribe_reason_not_relevant')}</label>
                  </div>
                   <div className="flex items-center">
                    <input id="reason-other" name="reason" type="radio" value="other" onChange={e => setReason(e.target.value)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
                    <label htmlFor="reason-other" className="ml-3 block text-sm text-gray-900">{t('newsletter.unsubscribe_reason_other')}</label>
                  </div>
                </fieldset>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? t('newsletter.unsubscribing') : t('newsletter.unsubscribe_button')}
              </button>
              {status === 'error' && messageKey && (
                <p className="mt-2 text-sm text-red-600">{t(messageKey)}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 