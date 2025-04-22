"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { IConfettiOptions } from 'react-confetti';

// Dynamicky importujeme Confetti komponentu, aby fungovala na klientovi
const Confetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

// Definujeme vlastní typy pro Confetti props
interface ConfettiProps extends Partial<IConfettiOptions> {
  width: number;
  height: number;
}

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (status === 'success') {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // Konfety se zobrazí na 5 sekund
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setMessage('Prosím vyplňte všechna pole.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('error');
      setMessage('Zadejte prosím platnou e-mailovou adresu.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/kontakt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Nastala chyba při odesílání zprávy.');
      }

      setStatus('success');
      setMessage('Děkujeme za vaši zprávu! Budeme vás kontaktovat co nejdříve.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setMessage('Omlouváme se, nastala chyba. Zkuste to prosím znovu později.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const confettiProps: ConfettiProps = {
    width: windowSize.width,
    height: windowSize.height,
    recycle: false,
    numberOfPieces: 1000,
    gravity: 0.5,
    initialVelocityY: 50,
    initialVelocityX: 20,
    colors: [
      '#4CAF50', // zelená
      '#8BC34A', // světle zelená
      '#CDDC39', // limetková
      '#FFEB3B', // žlutá
      '#FFC107', // zlatá
      '#FF9800', // oranžová
      '#FF5722', // tmavě oranžová
      '#E91E63', // růžová
      '#9C27B0', // fialová
      '#673AB7', // tmavě fialová
      '#3F51B5', // indigová
      '#2196F3', // modrá
      '#03A9F4', // světle modrá
      '#00BCD4', // tyrkysová
      '#009688', // teal
      '#FF4081', // růžová
      '#FF5252', // červená
      '#FF1744', // tmavě červená
      '#D50000', // karmínová
      '#C51162'  // vínová
    ]
  };

  return (
    <>
      {showConfetti && <Confetti {...confettiProps} />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Jméno
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            disabled={status === 'loading'}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            disabled={status === 'loading'}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Zpráva
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            disabled={status === 'loading'}
          />
        </div>

        <button
          type="submit"
          className={`w-full px-6 py-3 text-white font-medium rounded-full ${
            status === 'loading'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-800 hover:bg-green-700 shadow-[0_4px_0_0_rgba(0,0,0,0.3)] active:shadow-[0_2px_0_0_rgba(0,0,0,0.3)] active:translate-y-1 transition-all duration-200 bg-gradient-to-b from-green-800 to-green-900 border border-green-700'
          }`}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Odesílání...' : 'Odeslat zprávu'}
        </button>

        {status === 'success' && (
          <p className="mt-4 text-sm text-green-600">{message}</p>
        )}

        {status === 'error' && (
          <p className="mt-4 text-sm text-red-600">{message}</p>
        )}
      </form>
    </>
  );
};

export default ContactForm; 