import { createDirectus, rest, readItems, createItem } from '@directus/sdk';

if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL is not defined in environment variables');
}

// Připojení ke klientovi pro App_user role (bez tokenu, ale s oprávněními pro přihlášené uživatele)
export const directusUser = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL!)
  .with(rest());

// Funkce pro registraci a přihlášení pomocí App_user role
export const createUserUser = (data: any) => directusUser.request(createItem('app_users', data));
export const readUsersUser = (params?: any) => directusUser.request(readItems('app_users', params)); 