/**
 * Static cities/districts list — Warsaw Agglomeration.
 * Based on NUTS 2 "Region warszawski stołeczny" delimitation.
 * No database needed — this is a fixed set of supported locations.
 */

export interface CityInfo {
  id: number;
  name: string;
  slug: string;
  /** Whether this is a Warsaw district (dzielnica) */
  isDistrict?: boolean;
}

const CITIES: CityInfo[] = [
  // ─── Warszawa (miasto) ─────────────────────────────────────────────
  { id: 1, name: 'Warszawa', slug: 'warszawa' },

  // ─── 18 dzielnic Warszawy ─────────────────────────────────────────
  { id: 10, name: 'Bemowo', slug: 'bemowo', isDistrict: true },
  { id: 11, name: 'Białołęka', slug: 'bialoleka', isDistrict: true },
  { id: 12, name: 'Bielany', slug: 'bielany', isDistrict: true },
  { id: 13, name: 'Mokotów', slug: 'mokotow', isDistrict: true },
  { id: 14, name: 'Ochota', slug: 'ochota', isDistrict: true },
  { id: 15, name: 'Praga-Południe', slug: 'praga-poludnie', isDistrict: true },
  { id: 16, name: 'Praga-Północ', slug: 'praga-polnoc', isDistrict: true },
  { id: 17, name: 'Rembertów', slug: 'rembertow', isDistrict: true },
  { id: 18, name: 'Śródmieście', slug: 'srodmiescie', isDistrict: true },
  { id: 19, name: 'Targówek', slug: 'targowek', isDistrict: true },
  { id: 20, name: 'Ursus', slug: 'ursus', isDistrict: true },
  { id: 21, name: 'Ursynów', slug: 'ursynow', isDistrict: true },
  { id: 22, name: 'Wawer', slug: 'wawer', isDistrict: true },
  { id: 23, name: 'Wesoła', slug: 'wesola', isDistrict: true },
  { id: 24, name: 'Wilanów', slug: 'wilanow', isDistrict: true },
  { id: 25, name: 'Włochy', slug: 'wlochy', isDistrict: true },
  { id: 26, name: 'Wola', slug: 'wola', isDistrict: true },
  { id: 27, name: 'Żoliborz', slug: 'zoliborz', isDistrict: true },

  // ─── Powiat legionowski ────────────────────────────────────────────
  { id: 30, name: 'Legionowo', slug: 'legionowo' },
  { id: 31, name: 'Jabłonna', slug: 'jablonna' },

  // ─── Powiat otwocki ────────────────────────────────────────────────
  { id: 32, name: 'Otwock', slug: 'otwock' },
  { id: 33, name: 'Józefów', slug: 'jozefow' },

  // ─── Powiat piaseczyński ───────────────────────────────────────────
  { id: 34, name: 'Piaseczno', slug: 'piaseczno' },
  { id: 35, name: 'Konstancin-Jeziorna', slug: 'konstancin-jeziorna' },

  // ─── Powiat pruszkowski ────────────────────────────────────────────
  { id: 36, name: 'Pruszków', slug: 'pruszkow' },
  { id: 37, name: 'Piastów', slug: 'piastow' },

  // ─── Powiat wołomiński ─────────────────────────────────────────────
  { id: 38, name: 'Ząbki', slug: 'zabki' },
  { id: 39, name: 'Marki', slug: 'marki-miasto' }, // slug "marki-miasto" to avoid collision with /marki (brands page)
  { id: 40, name: 'Wołomin', slug: 'wolomin' },
  { id: 41, name: 'Kobyłka', slug: 'kobylka' },
  { id: 42, name: 'Zielonka', slug: 'zielonka' },
  { id: 43, name: 'Sulejówek', slug: 'sulejowek' },

  // ─── Powiat grodziski ──────────────────────────────────────────────
  { id: 44, name: 'Grodzisk Mazowiecki', slug: 'grodzisk-mazowiecki' },

  // ─── Powiat nowodworski ────────────────────────────────────────────
  { id: 45, name: 'Nowy Dwór Mazowiecki', slug: 'nowy-dwor-mazowiecki' },

  // ─── Powiat miński ─────────────────────────────────────────────────
  { id: 46, name: 'Mińsk Mazowiecki', slug: 'minsk-mazowiecki' },

  // ─── Powiat warszawski zachodni ────────────────────────────────────
  { id: 47, name: 'Łomianki', slug: 'lomianki' },
  { id: 48, name: 'Ożarów Mazowiecki', slug: 'ozarow-mazowiecki' },
  { id: 49, name: 'Nadarzyn', slug: 'nadarzyn' },
];

export function getAllCities(): CityInfo[] {
  return CITIES;
}

export function getCityBySlug(slug: string): CityInfo | null {
  return CITIES.find(c => c.slug === slug) || null;
}

/** Returns only the 18 Warsaw districts */
export function getWarsawDistricts(): CityInfo[] {
  return CITIES.filter(c => c.isDistrict);
}

/** Returns surrounding municipalities (not Warsaw itself, not districts) */
export function getSurroundingCities(): CityInfo[] {
  return CITIES.filter(c => !c.isDistrict && c.slug !== 'warszawa');
}
