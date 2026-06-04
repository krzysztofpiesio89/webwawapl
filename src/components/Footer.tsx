import Link from 'next/link';
import { GlobalSettings } from '@/lib/settings';
import CarLogo from './CarLogo';
import { Locale } from '@/app/[lang]/dictionaries';
import { getLocalizedStaticPath } from '@/app/[lang]/i18n-routes';
import { getWarsawDistricts, getAllCities } from '@/lib/cities';

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
  
  // Show top 4 districts from Warsaw for the popular cities column
  const topLocations = getWarsawDistricts().slice(0, 4);
  // All cities for SEO section
  const allLocations = getAllCities();

  return (
    <footer className="bg-slate-50 text-slate-700 pt-20 pb-8 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href={homeUrl} className="flex items-center gap-3 group">
              <CarLogo className="h-12 w-auto transform group-hover:scale-105 transition-transform" />
              <div className="flex flex-col leading-none">
                <span className="hidden md:block text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
                  SKUP<span className="text-amber-700">AUTWAWA.PL</span>
                </span>
                <span className="md:hidden text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
                  S<span className="text-amber-700">A</span>
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed">
              {dict.footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-slate-900 font-bold mb-6">{dict.footer.servicesTitle}</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href={homeUrl} className="hover:text-amber-600 transition-colors">{dict.footer.service1}</Link></li>
              <li><Link href={homeUrl} className="hover:text-amber-600 transition-colors">{dict.footer.service2}</Link></li>
              <li><Link href={homeUrl} className="hover:text-amber-600 transition-colors">{dict.footer.service3}</Link></li>
              <li><Link href={homeUrl} className="hover:text-amber-600 transition-colors">{dict.footer.service4}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 font-bold mb-6">{dict.footer.citiesTitle}</h3>
            <ul className="space-y-4 text-sm">
              {topLocations.map(city => (
                <li key={city.slug}>
                  <Link href={`${langPrefix}/${city.slug}`} className="hover:text-amber-600 transition-colors">{city.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 font-bold mb-6">{dict.footer.contactTitle}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <span className="text-amber-700">📞</span> {settings?.phone || '+48 664 946 209'}
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-700">📧</span> {settings?.email || 'kontakt@skupautwawa.pl'}
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-700 shrink-0 mt-0.5">🏢</span>
                <div>
                  <span className="font-bold text-slate-800 block text-xs">{dict.footer.officeLabel}</span>
                  <span className="text-xs text-slate-600 block">ul. Księżycowa 76/8, 01-934 Warszawa</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-700 shrink-0 mt-0.5">📍</span> 
                <div>
                  <span className="font-bold text-slate-800 block text-xs">{dict.footer.registryLabel}</span>
                  <span className="text-xs text-slate-600 block">{settings?.address || 'ul. Józefa Piłsudskiego 20, 07-130 Kamionna'}</span>
                </div>
              </li>
              <li className="flex items-center gap-3 pt-2 border-t border-slate-200">
                <span className="text-amber-700">⭐</span>
                <a 
                  href="https://share.google/z1cf91AM5md8vvva2" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-amber-600 font-bold hover:underline flex items-center gap-1.5"
                >
                  {lang === 'pl' ? 'Nasz Profil w Google Maps' : 'Our Google Maps Profile'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Locations Cloud */}
        <div className="pt-10 pb-10 border-t border-slate-200">
          <h3 className="text-slate-600 font-bold mb-6 text-sm uppercase tracking-widest text-center">
            {dict.footer.citiesTitle}
          </h3>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 text-sm">
            {allLocations.map((city, index) => (
              <div key={city.slug} className="flex items-center">
                <Link 
                  href={`${langPrefix}/${city.slug}`} 
                  className="text-slate-500 hover:text-amber-600 hover:underline transition-colors whitespace-nowrap"
                >
                  {city.name}
                </Link>
                {index < allLocations.length - 1 && (
                  <span className="text-slate-300 ml-4 hidden md:inline">•</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>{dict.footer.copyright}</p>
          <div className="flex gap-6">
            <Link href={privacyUrl} className="hover:text-amber-600 transition-colors">{dict.footer.privacyPolicy}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
