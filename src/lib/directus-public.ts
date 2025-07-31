import { createDirectus, rest, readItems, createItem } from '@directus/sdk';

if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL is not defined in environment variables');
}

// Připojení ke klientovi pro Public role (bez tokenu)
export const directusPublic = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL!)
  .with(rest());

// Funkce pro registraci pomocí Public role
export const createUserPublic = (data: any) => directusPublic.request(createItem('app_users', data));
export const readUsersPublic = (params?: any) => directusPublic.request(readItems('app_users', params)); 