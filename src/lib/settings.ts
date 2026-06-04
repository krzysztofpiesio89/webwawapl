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
  addressWarsaw: string;
  phone: string;
  email: string;
}

const SETTINGS: GlobalSettings = {
  id: 'settings',
  companyName: 'Yuliya Taurel',
  nip: '9662148516',
  krs: '',
  regon: '388469259',
  address: 'ul. Józefa Piłsudskiego 20, 07-130 Kamionna',
  addressWarsaw: 'ul. Księżycowa 76/8, 01-934 Warszawa',
  phone: '+48 664 946 209',
  email: 'kontakt@skupautwawa.pl',
};

export function getGlobalSettings(): GlobalSettings {
  return SETTINGS;
}
