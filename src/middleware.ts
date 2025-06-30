import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['cs', 'sk', 'en', 'de'];
const defaultLocale = 'cs';

function detectLocale(request: NextRequest): string {
  // Skús z cookies
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;
  // Skús z hlavičky
  const acceptLang = request.headers.get('accept-language');
  if (acceptLang) {
    const found = locales.find(l => acceptLang.includes(l));
    if (found) return found;
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ak už cesta začína platným prefixom alebo je presne /cs, /sk, /en, /de, nič nerob
  const isLocaleRoot = locales.some(locale => pathname === `/${locale}`);
  const hasLocalePrefix = locales.some(locale => pathname.startsWith(`/${locale}/`));
  if (isLocaleRoot || hasLocalePrefix) {
    return;
  }

  // Presmerovanie pre presne /cart alebo /wishlist
  if (pathname === '/cart' || pathname === '/wishlist') {
    const locale = detectLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Ostatné cesty bez prefixu presmeruj na default jazyk
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next|static|image|images|favicon.ico|test).*)',
  ],
}; 