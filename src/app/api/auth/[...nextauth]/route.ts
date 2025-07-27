import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Najít uživatele podle emailu
          const users = await directus.request(
            readItems("users", {
              filter: {
                email: { _eq: credentials.email },
                is_active: { _eq: true }
              },
              limit: 1
            })
          );

          if (users.length === 0) {
            return null;
          }

          const user = users[0];

          // Ověřit heslo
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Ověřit, že je email ověřený
          if (!user.email_verified) {
            throw new Error("Email není ověřený");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            emailVerified: user.email_verified
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 dní
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.emailVerified = token.emailVerified as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: "/cs/prihlaseni", // Přihlašovací stránka
    signUp: "/cs/registrace", // Registrační stránka
    error: "/cs/chyba", // Stránka s chybou
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 