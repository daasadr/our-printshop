"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Label } from '@/components/ui/Form';
import { useAccessibility } from '@/hooks/useAccessibility';
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

interface ContactFormProps {
  dictionary?: any;
}

const ContactForm = ({ dictionary }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // Spam ochrana - skryté pole
    gdpr_consent: false
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const { announce, LiveRegionElement } = useAccessibility();

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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = dictionary?.contact?.validation?.name_required || 'Jméno je povinné.';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = dictionary?.contact?.validation?.email_required || 'E-mail je povinný.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = dictionary?.contact?.validation?.email_invalid || 'Zadejte prosím platnou e-mailovou adresu.';
      }
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = dictionary?.contact?.validation?.subject_required || 'Předmět zprávy je povinný.';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = dictionary?.contact?.validation?.message_required || 'Zpráva je povinná.';
    }
    
    if (!formData.gdpr_consent) {
      newErrors.gdpr_consent = dictionary?.contact?.gdpr_required || 'Musíte souhlasit se zpracováním osobních údajů.';
    }
    
    // Spam ochrana - ak je honeypot vyplnené, je to spam
    if (formData.honeypot.trim()) {
      console.log('Spam detected - honeypot field filled');
      return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus('error');
      setMessage(dictionary?.contact?.validation?.form_errors || 'Prosím opravte chyby ve formuláři.');
      announce('Formulář obsahuje chyby. Prosím opravte je.', 'assertive');
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
      setMessage(`${dictionary?.contact?.success?.title || 'Děkujeme za vaši zprávu!'} ${dictionary?.contact?.success?.message || 'Budeme vás kontaktovat co nejdříve.'}`);
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '', gdpr_consent: false });
      setErrors({});
      announce('Zpráva byla úspěšně odeslána!', 'assertive');
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');
      setMessage(`${dictionary?.contact?.error?.title || 'Omlouváme se, nastala chyba.'} ${dictionary?.contact?.error?.message || 'Zkuste to prosím znovu později.'}`);
      announce(dictionary?.contact?.error?.sending_error || 'Nastala chyba při odesílání zprávy.', 'assertive');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      <LiveRegionElement />
      {showConfetti && <Confetti {...confettiProps} />}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Honeypot pole pre spam ochranu */}
        <div className="absolute left-[-9999px] opacity-0 pointer-events-none">
          <input
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
        </div>
        
        <div>
          <Label htmlFor="name" size="md">
            {dictionary?.contact?.form?.name || 'Jméno'} *
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={status === 'loading'}
            required
            error={errors.name}
            aria-required="true"
          />
        </div>

        <div>
          <Label htmlFor="email" size="md">
            {dictionary?.contact?.form?.email || 'E-mail'} *
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={status === 'loading'}
            required
            error={errors.email}
            aria-required="true"
          />
        </div>

        <div>
          <Label htmlFor="subject" size="md">
            {dictionary?.contact?.form?.subject || 'Předmět zprávy'} *
          </Label>
          <Input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            disabled={status === 'loading'}
            required
            error={errors.subject}
            aria-required="true"
          />
        </div>

        <div>
          <Label htmlFor="message" size="md">
            {dictionary?.contact?.form?.message || 'Zpráva'} *
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            disabled={status === 'loading'}
            required
            error={errors.message}
            aria-required="true"
          />
        </div>

        {/* GDPR Consent */}
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="gdpr_consent"
            name="gdpr_consent"
            checked={formData.gdpr_consent}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="gdpr_consent" className="text-sm text-gray-700">
            {dictionary?.contact?.gdpr_consent || 'Souhlasím se zpracováním osobních údajů pro účely odpovědi na mou zprávu'}
          </label>
        </div>

        {errors.gdpr_consent && (
          <p className="text-sm text-red-600">{errors.gdpr_consent}</p>
        )}

        <div className="text-xs text-gray-500 mb-4">
          {dictionary?.contact?.gdpr_info || 'Vaše údaje potřebujeme k odpovědi na vaši zprávu. Zpracováváme je v souladu s GDPR.'}
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          width="full"
          roundness="full"
          loading={status === 'loading'}
          loadingText={dictionary?.contact?.form?.sending || 'Odesílání...'}
          disabled={status === 'loading'}
        >
          {dictionary?.contact?.form?.submit || 'Odeslat zprávu'}
        </Button>

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