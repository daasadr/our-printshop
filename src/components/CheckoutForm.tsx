'use client';

import { useState } from 'react';
import { CartItem } from '@/types/cart';
import { Button } from '@/components/ui/Button';

interface CheckoutFormProps {
  cartItems: CartItem[];
  total: number;
  dictionary?: any;
}

interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  gdpr_consent: boolean;
}

export default function CheckoutForm({ cartItems, total, dictionary }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ShippingDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: 'CZ',
    gdpr_consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // GDPR validation
    if (!formData.gdpr_consent) {
      alert(dictionary?.checkout?.gdpr_required || 'Musíte souhlasit se zpracováním osobních údajů pro doručení');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          shippingDetails: formData,
          total,
        }),
      });

      if (!response.ok) {
        throw new Error('Chyba při vytváření objednávky');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Došlo k chybě při zpracování objednávky. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Jméno a příjmení
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Adresa
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Město
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
              PSČ
            </label>
            <input
              type="text"
              id="zip"
              name="zip"
              required
              value={formData.zip}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telefon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            {dictionary?.checkout?.gdpr_consent || 'Souhlasím se zpracováním osobních údajů pro účely doručení objednávky'}
          </label>
        </div>

        <div className="text-xs text-gray-500 mb-4">
          {dictionary?.checkout?.gdpr_info || 'Vaše údaje potřebujeme k doručení objednávky. Zpracováváme je v souladu s GDPR.'}
        </div>

        <div>
          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
            size="md"
            width="full"
            state={isLoading ? 'loading' : 'default'}
          >
            {isLoading ? (dictionary?.checkout?.processing || 'Zpracování...') : (dictionary?.checkout?.complete_order || 'Pokračovat k platbě')}
          </Button>
        </div>
      </div>
    </form>
  );
} 