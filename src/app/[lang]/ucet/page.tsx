'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDictionary } from '@/lib/getDictionary';

interface AccountPageProps {
  params: {
    lang: string;
  };
}

export default function AccountPage({ params: { lang } }: AccountPageProps) {
  const router = useRouter();
  const [dict, setDict] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load dictionary
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dictionary = await getDictionary(lang);
        setDict(dictionary);
      } catch (error) {
        console.error('Error loading dictionary:', error);
      }
    };
    loadDictionary();
  }, [lang]);

  // JWT Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Account page: Checking auth status...');
        const accessToken = localStorage.getItem('access_token');
        console.log('Account page: Access token found:', !!accessToken);
        
        if (!accessToken) {
          console.log('Account page: No access token, redirecting to login');
          // Přesměrujeme na přihlášení
          router.push(`/${lang}/prihlaseni`);
          return;
        }

        console.log('Account page: Verifying token on server...');
        const response = await fetch('/api/auth/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: accessToken }),
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('Account page: Token verified, setting user:', userData.user.email);
          setUser(userData.user);
        } else {
          console.log('Account page: Token verification failed, redirecting to login');
          // Token je neplatný, přesměrujeme na přihlášení
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
          router.push(`/${lang}/prihlaseni`);
        }
      } catch (error) {
        console.error('Account page: Auth check error:', error);
        router.push(`/${lang}/prihlaseni`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, lang]);

  // Listen for auth status changes
  useEffect(() => {
    const handleAuthStatusChange = async () => {
      console.log('Account page: Auth status changed, checking again...');
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          const response = await fetch('/api/auth/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: accessToken }),
          });

          if (response.ok) {
            const userData = await response.json();
            console.log('Account page: Token verified after event, setting user:', userData.user.email);
            setUser(userData.user);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Account page: Auth check error after event:', error);
        }
      }
    };

    window.addEventListener('auth-status-changed', handleAuthStatusChange);

    return () => {
      window.removeEventListener('auth-status-changed', handleAuthStatusChange);
    };
  }, []);

  // JWT Logout function
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      // Voláme náš logout endpoint
      const response = await fetch('/api/auth/logout-directus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        console.log('Logout successful');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Vždy vyčistíme localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      
      // Vyvoláme custom event pro ostatní komponenty
      window.dispatchEvent(new Event('auth-status-changed'));
      
      // Přesměrujeme na hlavní stránku
      router.push(`/${lang}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Router už přesměruje na přihlášení
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Můj účet
              </h1>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Vítejte ve vašem účtu
                  </h2>
                  <p className="text-gray-600">
                    Zde můžete spravovat své objednávky, adresy a nastavení účtu.
                  </p>
                  {user && (
                    <p className="text-sm text-gray-500 mt-2">
                      Přihlášen jako: {user.first_name || user.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Objednávky
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Zobrazte historii vašich objednávek
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Zobrazit objednávky
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Adresy
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Spravujte své dodací a fakturační adresy
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Spravovat adresy
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Oblíbené
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Zobrazte vaše oblíbené produkty
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Zobrazit oblíbené
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nastavení
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Upravte své osobní údaje a heslo
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Upravit nastavení
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button 
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Odhlásit se
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 