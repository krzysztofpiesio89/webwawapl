import type { Locale } from './dictionaries'

/**
 * Translated slugs for static pages.
 * Dynamic pages (cities, brands, models) use proper nouns and don't need translation.
 */
export const localizedRoutes = {
  brands: {
    pl: 'marki',
    en: 'brands',
    uk: 'marky',
    ru: 'marki',
    de: 'marken',
    zh: 'brands',
  },
  about: {
    pl: 'o-nas',
    en: 'about-us',
    uk: 'pro-nas',
    ru: 'o-nas',
    de: 'ueber-uns',
    zh: 'about-us',
  },
  privacy: {
    pl: 'polityka-prywatnosci',
    en: 'privacy-policy',
    uk: 'polityka-konfidentsiynosti',
    ru: 'politika-konfidentsialnosti',
    de: 'datenschutz',
    zh: 'privacy-policy',
  },
} as const;

export type StaticPage = keyof typeof localizedRoutes;

/**
 * Get the localized slug for a static page.
 */
export function getLocalizedSlug(page: StaticPage, lang: Locale): string {
  return localizedRoutes[page][lang];
}

/**
 * Get the full external path for a localized static page.
 * Polish (default) has no prefix: /marki
 * Other locales have prefix: /en/brands
 */
export function getLocalizedStaticPath(page: StaticPage, lang: Locale): string {
  const slug = localizedRoutes[page][lang];
  const prefix = lang === 'pl' ? '' : `/${lang}`;
  return `${prefix}/${slug}`;
}

/**
 * Reverse lookup: given a slug, find which static page and locale it belongs to.
 * Returns null if the slug doesn't match any known static page.
 */
export function resolveStaticSlug(slug: string, currentLocale?: string): { page: keyof typeof localizedRoutes; lang: Locale } | null {
  // First, check if the slug matches the provided locale to avoid conflicts (e.g. 'about-us' in both EN and ZH)
  if (currentLocale) {
    for (const [pageKey, translations] of Object.entries(localizedRoutes)) {
      if ((translations as any)[currentLocale] === slug) {
        return { page: pageKey as keyof typeof localizedRoutes, lang: currentLocale as Locale };
      }
    }
  }

  // Fallback
  for (const [pageKey, translations] of Object.entries(localizedRoutes)) {
    for (const [lang, translatedSlug] of Object.entries(translations)) {
      if (translatedSlug === slug) {
        return { page: pageKey as keyof typeof localizedRoutes, lang: lang as Locale };
      }
    }
  }
  return null;
}

/**
 * Get all possible slugs for static pages (for middleware matching).
 */
export function getAllStaticSlugs(): string[] {
  const slugs: string[] = [];
  for (const slugMap of Object.values(localizedRoutes)) {
    for (const slug of Object.values(slugMap)) {
      if (!slugs.includes(slug)) {
        slugs.push(slug);
      }
    }
  }
  return slugs;
}

/**
 * Get the canonical (Polish) slug for a static page identified by any localized slug.
 */
export function getCanonicalSlug(slug: string): string | null {
  const resolved = resolveStaticSlug(slug);
  if (!resolved) return null;
  return localizedRoutes[resolved.page].pl;
}
