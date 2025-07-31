'use client';

import { useState, useEffect, useCallback } from 'react';

interface DirectusUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status: string;
}

interface UseDirectusAuthReturn {
  user: DirectusUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

export function useDirectusAuth(): UseDirectusAuthReturn {
  const [user, setUser] = useState<DirectusUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('directus_access_token');
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login-directus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Přihlášení se nezdařilo');
      }

      // Uložíme tokeny
      localStorage.setItem('directus_access_token', data.access_token);
      localStorage.setItem('directus_refresh_token', data.refresh_token);
      localStorage.setItem('directus_token_expires', data.expires);
      localStorage.setItem('user_email', email);

      // Nastavíme uživatele
      setUser({
        id: 'temp', // ID získáme později
        email,
        first_name: '',
        last_name: '',
        status: 'active'
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Zkusíme odhlásit na serveru
      await fetch('/api/auth/logout-directus', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Vyčistíme localStorage
      localStorage.removeItem('directus_access_token');
      localStorage.removeItem('directus_refresh_token');
      localStorage.removeItem('directus_token_expires');
      localStorage.removeItem('user_email');
      
      // Vyčistíme stav
      setUser(null);
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('directus_refresh_token');
      if (!refreshToken) return false;

      const response = await fetch('/api/auth/refresh-directus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Refresh tokenu se nezdařil');
      }

      // Uložíme nové tokeny
      localStorage.setItem('directus_access_token', data.access_token);
      localStorage.setItem('directus_refresh_token', data.refresh_token);
      localStorage.setItem('directus_token_expires', data.expires);

      return true;
    } catch (error) {
      console.error('Refresh error:', error);
      // Pokud refresh selže, odhlásíme uživatele
      await logout();
      return false;
    }
  }, [logout]);

  // Kontrola tokenu při načtení
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') return;

      const accessToken = localStorage.getItem('directus_access_token');
      const expires = localStorage.getItem('directus_token_expires');
      const email = localStorage.getItem('user_email');

      if (accessToken && email) {
        // Kontrola expirace
        if (expires && new Date(expires) > new Date()) {
          setUser({
            id: 'temp',
            email,
            first_name: '',
            last_name: '',
            status: 'active'
          });
        } else {
          // Token vypršel, zkusíme refresh
          const refreshed = await refreshToken();
          if (!refreshed) {
            // Refresh selhal, vyčistíme localStorage
            localStorage.removeItem('directus_access_token');
            localStorage.removeItem('directus_refresh_token');
            localStorage.removeItem('directus_token_expires');
            localStorage.removeItem('user_email');
          }
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [refreshToken]);

  return {
    user,
    isLoading,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
    refreshToken,
  };
} 