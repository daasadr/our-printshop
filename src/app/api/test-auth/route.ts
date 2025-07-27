import { NextResponse } from "next/server";

export async function GET() {
  const envVars = {
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_DIRECTUS_URL: !!process.env.NEXT_PUBLIC_DIRECTUS_URL,
    DIRECTUS_TOKEN: !!process.env.DIRECTUS_TOKEN,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
  };

  const missingVars = Object.entries(envVars)
    .filter(([_, exists]) => !exists)
    .map(([name, _]) => name);

  console.log("Environment variables check:", envVars);
  console.log("Missing variables:", missingVars);

  // Kontrola Directus URL a tokenu
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const directusToken = process.env.DIRECTUS_TOKEN;
  
  console.log("Directus URL:", directusUrl);
  console.log("Directus Token length:", directusToken?.length || 0);
  console.log("Directus Token starts with:", directusToken?.substring(0, 10) + "...");

  return NextResponse.json({
    success: missingVars.length === 0,
    environment: envVars,
    missing: missingVars,
    directus: {
      url: directusUrl,
      tokenLength: directusToken?.length || 0,
      tokenPreview: directusToken ? directusToken.substring(0, 10) + "..." : "NOT_SET"
    }
  });
} 