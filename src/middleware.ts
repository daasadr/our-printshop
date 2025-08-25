import { NextRequest, NextResponse } from 'next/server';

const locales = ['cs', 'sk', 'en', 'de'];
const defaultLocale = 'cs';

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  
  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Admin panel protection - allow /admin routes without locale
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return NextResponse.next();
  }
  
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = defaultLocale;

    // e.g. incoming request is /products
    // The new URL is now /cs/products
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}; 