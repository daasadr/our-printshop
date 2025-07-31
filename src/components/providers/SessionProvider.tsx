'use client';

// import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"; // ODSTRANĚNO
import { ReactNode } from "react";

interface SessionProviderProps {
  children: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  return (
    // <NextAuthSessionProvider> // ODSTRANĚNO
      {children}
    // </NextAuthSessionProvider> // ODSTRANĚNO
  );
} 