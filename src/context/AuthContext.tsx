'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useDirectusAuth } from '@/hooks/useDirectusAuth';

interface DirectusUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status: string;
}

interface AuthContextType {
  user: DirectusUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useDirectusAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 