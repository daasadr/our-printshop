"use client";

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';


const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Zadejte prosím e-mailovou adresu.');
      return;
    }
    
    // Základní validace e-mailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Zadejte prosím platnou e-mailovou adresu.');
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
        throw new Error('Nastala chyba při přihlašování k odběru.');
      }
      
      setStatus('success');
      setMessage('Děkujeme za přihlášení k odběru novinek!');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setMessage('Omlouváme se, nastala chyba. Zkuste to prosím znovu později.');
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
            placeholder="Vaše e-mailová adresa"
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
            {status === 'loading' ? 'Odesílání...' : 'Přihlásit se'}
          </button>
        </div>
        
        {status === 'success' && (
          <p className="mt-2 text-sm text-green-600">{message}</p>
        )}
        
        {status === 'error' && (
          <p className="mt-2 text-sm text-red-600">{message}</p>
        )}
        
        <p className="mt-3 text-xs text-gray-500">
          Přihlášením k odběru souhlasíte se zpracováním vašich osobních údajů v souladu s našimi 
          <Link href="/privacy-policy" className="underline ml-1">zásadami ochrany soukromí</Link>.
        </p>
      </form>
    </div>
  );
};

export default NewsletterSignup;