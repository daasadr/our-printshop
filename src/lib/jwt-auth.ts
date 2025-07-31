import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import argon2 from 'argon2';
import { directus } from './directus';
import { directusPublic } from './directus-public';
import { readItems, createItem, updateItem } from '@directus/sdk';

export interface JWTUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  status: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export class JWTAuth {
  private static instance: JWTAuth;
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string = '24h';
  private readonly REFRESH_TOKEN_EXPIRES_IN: string = '7d';

  private constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
  }

  static getInstance(): JWTAuth {
    if (!JWTAuth.instance) {
      JWTAuth.instance = new JWTAuth();
    }
    return JWTAuth.instance;
  }

  // Validace emailu
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validace hesla
  private validatePassword(password: string): boolean {
    return password.length >= 6;
  }

  // Generování JWT access tokenu
  generateAccessToken(user: JWTUser): string {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      role: user.role || 'App_user'
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    });
  }

  // Generování refresh tokenu
  generateRefreshToken(user: JWTUser): string {
    const payload = {
      userId: user.id,
      email: user.email,
      type: 'refresh'
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_IN
    });
  }

  // Ověření JWT tokenu
  verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as JWTPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  // Registrace uživatele s Directus nativním hashováním
  async registerUser(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    gdpr_consent: boolean;
  }): Promise<{ user: JWTUser; accessToken: string; refreshToken: string }> {
    try {
      console.log("JWT Auth registration started");

      // Vylepšená validace
      if (!userData.email || !userData.password || !userData.first_name) {
        throw new Error("Email, heslo a jméno jsou povinné");
      }

      if (!this.validateEmail(userData.email)) {
        throw new Error("Neplatný formát emailu");
      }

      if (!this.validatePassword(userData.password)) {
        throw new Error("Heslo musí mít alespoň 6 znaků");
      }

      // Kontrola existence uživatele
      console.log("Checking if user exists...");
      const existingUsers = await directusPublic.request(readItems('app_users', {
        filter: { email: { _eq: userData.email } },
        limit: 1
      }));

      if (existingUsers.length > 0) {
        throw new Error("Uživatel s tímto emailem již existuje");
      }

      // Vytvoření uživatele pomocí Public role - Directus automaticky zahashuje heslo
      console.log("Creating user with Directus native hashing...");
      const newUser = await directusPublic.request(createItem('app_users', {
        email: userData.email,
        password: userData.password, // Directus automaticky zahashuje na argon2id
        first_name: userData.first_name,
        last_name: userData.last_name || '',
        is_active: true,
        role: 'public',
        gdpr_consent: userData.gdpr_consent,
        gdpr_consent_date: new Date().toISOString(),
        registration_source: 'web_app',
        email_verified: false
      }));

      // Po úspěšném vytvoření změníme roli na App_user pomocí admin tokenu
      try {
        console.log("Updating user role to App_user...");
        await directus.request(updateItem('app_users', newUser.id, {
          role: 'App_user'
        }));
        console.log('User role updated to App_user');
      } catch (updateError) {
        console.warn('Failed to update user role to App_user:', updateError);
        // Pokračujeme i když se nepodaří změnit roli
      }

      const user: JWTUser = {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: 'App_user',
        status: 'active'
      };

      // Generujeme tokeny
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      console.log("Registration completed successfully");
      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Přihlášení uživatele s Directus nativním ověřením
  async loginUser(email: string, password: string): Promise<{ user: JWTUser; accessToken: string; refreshToken: string }> {
    try {
      console.log("JWT Auth login started");

      // Validace vstupu
      if (!email || !password) {
        throw new Error("Email a heslo jsou povinné");
      }

      if (!this.validateEmail(email)) {
        throw new Error("Neplatný formát emailu");
      }

      // Najdeme uživatele pomocí Public role
      console.log("Finding user...");
      const users = await directusPublic.request(readItems('app_users', {
        filter: {
          email: { _eq: email },
          is_active: { _eq: true }
        },
        limit: 1
      }));

      if (users.length === 0) {
        throw new Error('Neplatný email nebo heslo');
      }

      const user = users[0];
      console.log("User found:", user.id);

      // Ověříme heslo pomocí Directus nativního ověření
      console.log("Verifying password with Directus native verification...");
      console.log("Input password length:", password.length);
      console.log("Stored password hash starts with:", user.password.substring(0, 10) + "...");
      
      // Použijeme bcrypt.compare pro argon2id hash (Directus používá argon2id)
      const isPasswordValid = await argon2.verify(user.password, password);
      console.log("Password comparison result:", isPasswordValid);
      
      if (!isPasswordValid) {
        throw new Error('Neplatný email nebo heslo');
      }

      // Kontrola ověření emailu
      if (!user.email_verified) {
        console.warn("User email not verified:", user.id);
        // Prozatím povolíme přihlášení i bez ověření emailu
      }

      const jwtUser: JWTUser = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role || 'App_user',
        status: 'active'
      };

      // Generujeme tokeny
      const accessToken = this.generateAccessToken(jwtUser);
      const refreshToken = this.generateRefreshToken(jwtUser);

      console.log("Login completed successfully");
      return { user: jwtUser, accessToken, refreshToken };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Obnovení tokenu pomocí App_user role
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const payload = jwt.verify(refreshToken, this.JWT_SECRET) as any;
      
      if (payload.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }

      // Najdeme uživatele pomocí Public role
      const users = await directusPublic.request(readItems('app_users', {
        filter: {
          id: { _eq: payload.userId },
          is_active: { _eq: true }
        },
        limit: 1
      }));

      if (users.length === 0) {
        throw new Error('User not found');
      }

      const user = users[0];
      const jwtUser: JWTUser = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        status: 'active'
      };

      // Generujeme nové tokeny
      const newAccessToken = this.generateAccessToken(jwtUser);
      const newRefreshToken = this.generateRefreshToken(jwtUser);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  // Získání uživatele z tokenu pomocí App_user role
  async getUserFromToken(token: string): Promise<JWTUser | null> {
    try {
      const payload = this.verifyToken(token);
      if (!payload) return null;

      const users = await directusPublic.request(readItems('app_users', {
        filter: {
          id: { _eq: payload.userId },
          is_active: { _eq: true }
        },
        limit: 1
      }));

      if (users.length === 0) return null;

      const user = users[0];
      return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        status: 'active'
      };
    } catch (error) {
      console.error('Get user from token error:', error);
      return null;
    }
  }
}

export const jwtAuth = JWTAuth.getInstance(); 