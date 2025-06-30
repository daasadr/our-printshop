import NextAuth from "next-auth/next";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 