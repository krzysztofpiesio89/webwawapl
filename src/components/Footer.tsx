import Link from 'next/link';
import { GlobalSettings } from '@/lib/settings';
import CarLogo from './CarLogo';
import { Locale } from '@/app/[lang]/dictionaries';
import { getLocalizedStaticPath } from '@/app/[lang]/i18n-routes';
import { getWarsawDistricts, getAllCities } from '@/lib/cities';
import CookiePreferencesButton from './CookiePreferencesButton';

export default function Footer({ 
  settings, 
  dict, 
  lang 
}: { 
  settings: GlobalSettings | null;
  dict: any;
  lang: Locale;
}) {
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  const privacyUrl = getLocalizedStaticPath('privacy', lang);
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  
  const isPl = lang === 'pl';
  const description = isPl 
    ? 'Profesjonalne usługi informatyczne, dedykowane aplikacje webowe oraz pozycjonowanie SEO dla biznesu.'
    : 'Professional IT services, dedicated web applications, and SEO optimization for your business.';

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 pt-20 pb-8 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="space-y-6">
            <Link href={homeUrl} className="flex items-center gap-3 group">
              <CarLogo className="h-12 w-auto transform group-hover:scale-105 transition-transform" />
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                  WEB<span className="text-primary">WAWA.PL</span>
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed">
              {description}
            </p>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-6">{isPl ? 'Usługi' : 'Services'}</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href={homeUrl} className="hover:text-primary transition-colors">{isPl ? 'Dedykowane Strony WWW' : 'Custom Websites'}</Link></li>
              <li><Link href={homeUrl} className="hover:text-primary transition-colors">{isPl ? 'E-commerce & Sklepy' : 'E-commerce'}</Link></li>
              <li><Link href={homeUrl} className="hover:text-primary transition-colors">{isPl ? 'Aplikacje Dedykowane' : 'Custom Software'}</Link></li>
              <li><Link href={homeUrl} className="hover:text-primary transition-colors">{isPl ? 'Pozycjonowanie SEO' : 'SEO Optimization'}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-6">{isPl ? 'Kontakt' : 'Contact'}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <span className="text-primary">📞</span> {settings?.phone || '+48 664 946 209'}
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">📧</span> {settings?.email || 'kontakt@webwawa.pl'}
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary shrink-0 mt-0.5">🏢</span>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">{isPl ? 'Biuro Warszawa' : 'Office Warsaw'}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">ul. Księżycowa 76/8, 01-934 Warszawa</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} webwawa.pl - {isPl ? 'Wszelkie prawa zastrzeżone.' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-6">
            <Link href={privacyUrl} className="hover:text-primary transition-colors">{dict.footer.privacyPolicy}</Link>
            <CookiePreferencesButton label={isPl ? 'Ustawienia cookies' : 'Cookie settings'} />
          </div>
        </div>
      </div>
    </footer>
  );
}
