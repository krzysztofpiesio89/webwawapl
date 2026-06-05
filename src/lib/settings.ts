/**
 * Global business settings.
 * These are static company details — no database needed.
 */

export interface GlobalSettings {
  id: string;
  companyName: string;
  nip: string;
  krs: string;
  regon: string;
  address: string;
  addressRegistered: string;
  addressWarsaw: string;
  phone: string;
  email: string;
}

const SETTINGS: GlobalSettings = {
  id: 'settings',
  companyName: 'Krzysztof Piesio WIKOL',
  nip: '8262147079',
  krs: '',
  regon: '381131959',
  address: 'ul. Brzozowa 16, 05-462 Kąck',
  addressRegistered: 'ul. Nadrzeczna 9, 08-400 Górki',
  addressWarsaw: 'ul. Księżycowa 76/8, 01-934 Warszawa',
  phone: '+48 664 946 209',
  email: 'kontakt@webwawa.pl',
};

export function getGlobalSettings(): GlobalSettings {
  return SETTINGS;
}
