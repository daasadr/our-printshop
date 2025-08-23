"use client";

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';

interface NewsletterSignupProps {
  dictionary: any;
  lang: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ dictionary, lang }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage(dictionary.newsletter?.error || 'Zadejte prosím e-mailovou adresu.');
      return;
    }
    
    // Základní validace e-mailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage(dictionary.newsletter?.invalid_email || 'Zadejte prosím platnou e-mailovou adresu.');
      return;
    }

    // GDPR consent validation
    if (!gdprConsent) {
      setStatus('error');
      setMessage(dictionary.newsletter?.gdpr_required || 'Musíte souhlasit se zpracováním osobních údajů.');
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
        throw new Error(dictionary.newsletter?.error || 'Nastala chyba při přihlašování k odběru.');
      }
      
      setStatus('success');
      setMessage(dictionary.newsletter?.success || 'Děkujeme za přihlášení k odběru novinek!');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setMessage(dictionary.newsletter?.error || 'Omlouváme se, nastala chyba. Zkuste to prosím znovu později.');
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
            placeholder={dictionary.newsletter?.placeholder || "Váš e-mail"}
            className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
            {status === 'loading' 
              ? (dictionary.newsletter?.subscribing || 'Přihlašování...') 
              : (dictionary.newsletter?.button || 'Přihlásit se')
            }
          </button>
        </div>
        
        {status === 'success' && (
          <p className="mt-2 text-sm text-green-600">{message}</p>
        )}
        
        {status === 'error' && (
          <p className="mt-2 text-sm text-red-600">{message}</p>
        )}
        
        {/* GDPR Consent */}
        <div className="mt-3 flex items-start space-x-2">
          <input
            type="checkbox"
            id="gdpr-consent"
            checked={gdprConsent}
            onChange={(e) => setGdprConsent(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="gdpr-consent" className="text-xs text-gray-500">
            {dictionary.newsletter?.privacy_notice || "Přihlášením k odběru souhlasíte se zpracováním vašich osobních údajů v souladu s našimi"}
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="underline ml-1 text-blue-600 hover:text-blue-800"
            >
              {dictionary.newsletter?.privacy_policy || "zásadami ochrany soukromí"}
            </button>
            .
          </label>
        </div>
      </form>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowPrivacyModal(false)} />
          <div className="relative bg-white rounded-lg p-6 shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {dictionary.newsletter?.privacy_policy_title || "Zásady ochrany soukromí"}
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="text-sm text-gray-700 space-y-4">
              <p>
                <strong>{dictionary.newsletter?.gdpr_title || "GDPR - Obecné nařízení o ochraně osobních údajů"}</strong>
              </p>
              
              <p>
                {dictionary.newsletter?.gdpr_intro || "V souladu s Nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR) vás informujeme o zpracování vašich osobních údajů:"}
              </p>
              
              <div className="space-y-2">
                <p><strong>{dictionary.newsletter?.data_controller || "Správce údajů:"}</strong> HappyWilderness</p>
                <p><strong>{dictionary.newsletter?.purpose || "Účel zpracování:"}</strong> {dictionary.newsletter?.purpose_text || "Zasílání newsletteru s novinkami a nabídkami"}</p>
                <p><strong>{dictionary.newsletter?.legal_basis || "Právní základ:"}</strong> {dictionary.newsletter?.legal_basis_text || "Váš souhlas (čl. 6 odst. 1 písm. a) GDPR)"}</p>
                <p><strong>{dictionary.newsletter?.retention || "Doba uchovávání:"}</strong> {dictionary.newsletter?.retention_text || "Do odvolání souhlasu nebo 3 roky od poslední aktivity"}</p>
                <p><strong>{dictionary.newsletter?.rights || "Vaše práva:"}</strong> {dictionary.newsletter?.rights_text || "Právo na přístup, opravu, výmaz, omezení zpracování a přenositelnost údajů"}</p>
              </div>
              
              <p>
                {dictionary.newsletter?.gdpr_contact || "Pro uplatnění vašich práv nás kontaktujte na:"} 
                <a href="mailto:privacy@happywilderness.sk" className="text-blue-600 hover:text-blue-800 ml-1">
                  privacy@happywilderness.sk
                </a>
              </p>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {dictionary.newsletter?.close || "Zavřít"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterSignup;