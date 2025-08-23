'use client';

import { useState, useEffect } from 'react';

export type CountryCode = 'CZ' | 'SK' | 'DE' | 'AT' | 'CH' | 'FR' | 'BE' | 'NL' | 'LU' | 'IT' | 'ES' | 'PT' | 'PL' | 'HU' | 'HR' | 'SI' | 'GB' | 'US' | 'CA' | 'AU' | 'OTHER';

interface GeolocationData {
  countryCode: CountryCode;
  isLoading: boolean;
  error: string | null;
}

export function useGeolocation(): GeolocationData {
  const [countryCode, setCountryCode] = useState<CountryCode>('CZ');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Najprv skúsime z localStorage (ak už máme uloženú krajinu)
        const savedCountry = localStorage.getItem('detectedCountry') as CountryCode;
        if (savedCountry) {
          console.log('useGeolocation - Using saved country:', savedCountry);
          setCountryCode(savedCountry);
          setIsLoading(false);
          return;
        }

        // Ak nemáme uloženú krajinu, použijeme geolokáciu
        console.log('useGeolocation - Fetching geolocation data...');
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        console.log('useGeolocation - Raw geolocation data:', data);
        const detectedCountry = data.country_code as CountryCode;
        console.log('useGeolocation - Detected country:', detectedCountry, 'from IP:', data.ip);
        
        // Uložíme detekovanú krajinu
        localStorage.setItem('detectedCountry', detectedCountry);
        setCountryCode(detectedCountry);
        
      } catch (err) {
        console.error('useGeolocation - Error detecting country:', err);
        setError('Nepodarilo sa detekovať krajinu');
        // Fallback na CZ
        setCountryCode('CZ');
      } finally {
        setIsLoading(false);
      }
    };

    detectCountry();
  }, []);

  return { countryCode, isLoading, error };
}
