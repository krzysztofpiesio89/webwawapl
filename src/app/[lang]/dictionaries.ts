

const dictionaries = {
  pl: () => import('./dictionaries/pl.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  uk: () => import('./dictionaries/uk.json').then((module) => module.default),
  ru: () => import('./dictionaries/ru.json').then((module) => module.default),
  de: () => import('./dictionaries/de.json').then((module) => module.default),
  zh: () => import('./dictionaries/zh.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries
export const locales: Locale[] = ['pl', 'en', 'uk', 'ru', 'de', 'zh']
export const defaultLocale: Locale = 'pl'

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale | string) => {
  const targetLocale = hasLocale(locale) ? locale : defaultLocale;
  return dictionaries[targetLocale]();
}

/** OpenGraph locale codes */
export const ogLocaleMap: Record<Locale, string> = {
  pl: 'pl_PL',
  en: 'en_US',
  uk: 'uk_UA',
  ru: 'ru_RU',
  de: 'de_DE',
  zh: 'zh_CN',
}

/** HTML lang attribute values */
export const htmlLangMap: Record<Locale, string> = {
  pl: 'pl',
  en: 'en',
  uk: 'uk',
  ru: 'ru',
  de: 'de',
  zh: 'zh',
}

/** Human-readable language names (in their own language) */
export const languageNames: Record<Locale, string> = {
  pl: 'Polski',
  en: 'English',
  uk: 'Українська',
  ru: 'Русский',
  de: 'Deutsch',
  zh: '中文',
}

/** Flag emojis for language switcher */
export const languageFlags: Record<Locale, string> = {
  pl: '🇵🇱',
  en: '🇬🇧',
  uk: '🇺🇦',
  ru: '🇷🇺',
  de: '🇩🇪',
  zh: '🇨🇳',
}

/**
 * Builds an external-facing URL path for a given locale.
 * Polish (default) has NO prefix: /warszawa/audi
 * Other locales have prefix: /en/warszawa/audi
 */
export function getLocalizedPath(lang: Locale, path: string): string {
  const prefix = lang === defaultLocale ? '' : `/${lang}`;
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // Avoid double slash for root
  if (normalizedPath === '/') return prefix || '/';
  return `${prefix}${normalizedPath}`;
}
