import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { readUsers } from '@/lib/directus';
import type { User } from '@/lib/directus';

type AuthConfig = {
  session: {
    strategy: "jwt";
  };
  pages: {
    signIn: string;
  };
  providers: any[];
  callbacks: {
    session: (params: { token: any; session: any }) => Promise<any>;
    jwt: (params: { token: any; user: any }) => Promise<any>;
  };
};

export const authConfig: AuthConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const users = await readUsers({
            filter: {
              email: {
                _eq: credentials.email
              }
            }
          }) as User[];
          const user = users?.[0] as User | undefined;
          if (!user) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    }
  }
};

// Backward compatibility for existing imports
export const authOptions = authConfig;