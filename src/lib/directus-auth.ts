import { directus } from './directus';
import { login, logout, refresh, readMe } from '@directus/sdk';

export interface DirectusUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: {
    id: string;
    name: string;
  };
  status: string;
}

export class DirectusAuth {
  private static instance: DirectusAuth;
  private currentUser: DirectusUser | null = null;

  static getInstance(): DirectusAuth {
    if (!DirectusAuth.instance) {
      DirectusAuth.instance = new DirectusAuth();
    }
    return DirectusAuth.instance;
  }

  async login(email: string, password: string): Promise<{ user: DirectusUser; access_token: string }> {
    try {
      const response = await directus.request(login(email, password));
      
      // Uložíme token do localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('directus_token', response.access_token);
        localStorage.setItem('directus_refresh_token', response.refresh_token);
      }
      
      // Získáme informace o uživateli
      const user = await directus.request(readMe());
      this.currentUser = user as DirectusUser;
      
      return { user: this.currentUser, access_token: response.access_token };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Přihlášení se nezdařilo');
    }
  }

  async logout(): Promise<void> {
    try {
      await directus.request(logout());
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Vyčistíme localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('directus_token');
        localStorage.removeItem('directus_refresh_token');
      }
      this.currentUser = null;
    }
  }

  async getCurrentUser(): Promise<DirectusUser | null> {
    try {
      if (!this.currentUser) {
        const user = await directus.request(readMe());
        this.currentUser = user as DirectusUser;
      }
      return this.currentUser;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      if (typeof window === 'undefined') return null;
      
      const refreshToken = localStorage.getItem('directus_refresh_token');
      if (!refreshToken) return null;

      const response = await directus.request(refresh('json', refreshToken));
      
      localStorage.setItem('directus_token', response.access_token);
      localStorage.setItem('directus_refresh_token', response.refresh_token);
      
      return response.access_token;
    } catch (error) {
      console.error('Refresh token error:', error);
      this.logout();
      return null;
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('directus_token');
  }
}

export const directusAuth = DirectusAuth.getInstance(); 