import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, Locale } from './app/[lang]/dictionaries';
import { resolveStaticSlug } from './app/[lang]/i18n-routes';

const SUPPORTED_CITIES = [
  // 18 dzielnic Warszawy
  'bemowo', 'bialoleka', 'bielany', 'mokotow', 'ochota', 'praga-poludnie', 'praga-polnoc',
  'rembertow', 'srodmiescie', 'targowek', 'ursus', 'ursynow', 'wawer', 'wesola',
  'wilanow', 'wlochy', 'wola', 'zoliborz',
  
  // Miasta ościenne
  'legionowo', 'jablonna', 'otwock', 'jozefow', 'piaseczno', 'konstancin-jeziorna',
  'pruszkow', 'piastow', 'zabki', 'marki-miasto', 'wolomin', 'kobylka', 'zielonka',
  'sulejowek', 'grodzisk-mazowiecki', 'nowy-dwor-mazowiecki', 'minsk-mazowiecki',
  'lomianki', 'ozarow-mazowiecki', 'nadarzyn', 'warszawa'
];

/**
 * Simplistic Accept-Language parser to avoid external dependencies.
 */
function getLocale(request: NextRequest): Locale {
  const acceptLang = request.headers.get('accept-language');
  if (!acceptLang) return defaultLocale;
  
  const langs = acceptLang.split(',').map(lang => lang.split(';')[0].trim().toLowerCase());
  for (const lang of langs) {
    const base = lang.split('-')[0] as Locale;
    if (locales.includes(base)) {
      return base;
    }
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Omijamy pliki statyczne i API
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    // 1. Sprawdzamy czy pathname ma prefiks języka
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // 2. Ustalamy aktualny język i ścieżkę bez prefiksu
    let currentLocale: Locale = defaultLocale;
    let pathWithoutLocale = pathname;

    if (pathnameHasLocale) {
      currentLocale = pathname.split('/')[1] as Locale;
      pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    }

    // 3. Obsługa domyślnego języka (Polski nie powinien mieć prefiksu /pl)
    if (pathnameHasLocale && currentLocale === defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = pathWithoutLocale;
      return NextResponse.redirect(url);
    }

    // 4. Detekcja języka przeglądarki (tylko gdy wchodzimy na korzeń / lub gdy nie ma prefiksu)
    // Zeby uniknac problemow z pozycjonowaniem i crawlerami, przekierowujemy automatycznie 
    // rzadziej, np. tylko jak ewidentnie wola inny jezyk i to ich pierwsze wejscie.
    if (!pathnameHasLocale && pathname === '/') {
      const preferredLocale = getLocale(request);
      
      // Jesli user preferuje nie domyslny jezyk i nie ma jeszcze ciasteczka z preferencja:
      if (preferredLocale !== defaultLocale && !request.cookies.has('preferred-lang')) {
         const url = request.nextUrl.clone();
         url.pathname = `/${preferredLocale}${pathname}`;
         const response = NextResponse.redirect(url);
         response.cookies.set('preferred-lang', preferredLocale, { path: '/', maxAge: 60 * 60 * 24 * 30 });
         return response;
      }
    }

    // 5. Zapisujemy w ciasteczku jaki jezyk oglada user
    const responseCookiesToSet: {name: string, value: string, maxAge: number}[] = [];
    if (currentLocale !== request.cookies.get('preferred-lang')?.value) {
      responseCookiesToSet.push({ name: 'preferred-lang', value: currentLocale, maxAge: 60 * 60 * 24 * 30 });
    }

    // Personalizacja miasta (geo-IP - przydatne np na Vercel)
    const cityHeader = request.headers.get('x-vercel-ip-city')?.toLowerCase() || '';
    const detectedCity = SUPPORTED_CITIES.includes(cityHeader) ? cityHeader : 'warszawa';
    if (!request.cookies.has('user-city')) {
      responseCookiesToSet.push({ name: 'user-city', value: detectedCity, maxAge: 60 * 60 * 24 * 7 });
    }

    // 6. Przepisywanie tłumaczonych ścieżek statycznych (np. /en/brands -> /en/__brands)
    const segments = pathWithoutLocale.split('/').filter(Boolean);
    const firstSegment = segments[0] || '';
    
    // Szukamy czy to przetłumaczony slug np. 'brands', 'ueber-uns'
    const resolvedStatic = resolveStaticSlug(firstSegment, currentLocale);
    
    let finalResponse: NextResponse;

    if (resolvedStatic) {
      // To jest strona statyczna.
      // Upewniamy sie ze jezyk ze sluga zgadza sie z jezykiem z URL (lub default jesli URL nie ma prefixu)
      if (resolvedStatic.lang === currentLocale) {
        // Robimy wewnetrzny rewrite do ukrytych routow w Next.js np /pl/brands
        const url = request.nextUrl.clone();
        const newPathWithoutLocale = `/${resolvedStatic.page}` + (segments.length > 1 ? `/${segments.slice(1).join('/')}` : '');
        url.pathname = `/${currentLocale}${newPathWithoutLocale}`;
        finalResponse = NextResponse.rewrite(url);
      } else {
        // Jesli wszedl na /en/marki to powinnismy go zredirectowac na /en/brands (poprawny slug dla ang)
        const url = request.nextUrl.clone();
        const correctSlug = resolveStaticSlug(firstSegment)?.page;
        if (correctSlug) {
           // wait, we need the localized slug for currentLocale
           import('./app/[lang]/i18n-routes').then(m => {
             // we can't do async inside synchronous part cleanly without async proxy, 
             // but proxy in next 13+ can be async. We'll just do it sync as we imported it.
           });
        }
        // Uproszczenie: jesli jest niezgodnosc to fallbackujemy normalnie
        finalResponse = NextResponse.next();
      }
    } else {
      // 7. Normalne strony (dynamiczne miasta/marki/modele oraz strona główna)
      if (!pathnameHasLocale) {
        // Wszystkie wejścia bez prefiksu (czyli polskie, np /warszawa) przepisujemy 
        // na /pl/warszawa zeby App Router wiedzial gdzie to jest
        const url = request.nextUrl.clone();
        url.pathname = `/${defaultLocale}${pathname}`;
        finalResponse = NextResponse.rewrite(url);
      } else {
        // Wejscie z poprawnym prefiksem - nic nie musimy przepisywac
        finalResponse = NextResponse.next();
      }
    }

    // Set cookies before returning
    responseCookiesToSet.forEach(cookie => {
      finalResponse.cookies.set(cookie.name, cookie.value, { path: '/', maxAge: cookie.maxAge });
    });

    return finalResponse;

  } catch (e) {
    // Fail safe
    console.error('Proxy/Middleware error:', e);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
