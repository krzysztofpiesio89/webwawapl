import Link from 'next/link';
import { Locale } from '../../../../../dictionaries';
import { ProfessionId, professionSlugsMap } from '@/lib/industries-list';
import { getAllBrands, getBrandLogo } from '@/lib/brands';
import { POPULAR_BRAND_SLUGS, AUTOMOTIVE_PROFESSIONS } from '../constants';

interface AutomotiveSeoCloudProps {
  lang: string;
  carBrandSlug: string | null;
  carModelSlug: string | null;
  professionId: string;
  modelName: string;
  industrySlug: string;
  professionSlug: string;
  parentSlug: string;
  langPrefix: string;
  t: {
    brandsHeading: (prof: string) => string;
    servicesHeading: (brand: string) => string;
    citiesHeading: string;
    disclaimer: string;
  };
  trans: {
    models: Record<string, { name: string }>;
  };
}

export default function AutomotiveSeoCloud({
  lang,
  carBrandSlug,
  carModelSlug,
  professionId,
  modelName,
  industrySlug,
  professionSlug,
  parentSlug,
  langPrefix,
  t,
  trans,
}: AutomotiveSeoCloudProps) {
  const allBrands = getAllBrands();

  // Block 1: Same profession, other car brands
  const relatedBrands = carBrandSlug
    ? POPULAR_BRAND_SLUGS.filter((s) => s !== carBrandSlug)
        .map((s) => {
          const found = allBrands.find(
            (b) => b.slug === s || b.slug.includes(s) || s.includes(b.slug)
          );
          if (!found) return null;
          return { name: found.name, slug: found.slug, logo: getBrandLogo(found.slug) };
        })
        .filter(Boolean) as Array<{ name: string; slug: string; logo: string | null }>
    : [];

  const keyCities = [
    { slug: 'warszawa', name: 'Warszawa' },
    { slug: 'mokotow', name: 'Mokotów' },
    { slug: 'wola', name: 'Wola' },
    { slug: 'srodmiescie', name: 'Śródmieście' },
    { slug: 'ursynow', name: 'Ursynów' },
    { slug: 'bialoleka', name: 'Białołęka' },
    { slug: 'legionowo', name: 'Legionowo' },
    { slug: 'pruszkow', name: 'Pruszków' },
    { slug: 'piaseczno', name: 'Piaseczno' },
    { slug: 'otwock', name: 'Otwock' },
  ];

  return (
    <section className="py-14 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900/50">
      <div className="container mx-auto px-4 max-w-5xl space-y-10">
        {/* Block 1: Same profession, other car brands */}
        {carBrandSlug && relatedBrands.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
                {t.brandsHeading(
                  professionSlugsMap[professionId as ProfessionId]?.[lang as Locale] || modelName
                )}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {relatedBrands.map((rb) => (
                <Link
                  key={rb.slug}
                  href={`${langPrefix}/${parentSlug}/${industrySlug}/${professionSlug}/${rb.slug}`}
                  className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-none bg-slate-100 dark:bg-slate-900/60 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 transition-all duration-150 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_50%,calc(100%-12px)_100%,0_100%)]"
                  title={`${rb.name} – ${trans.models[professionId as ProfessionId]?.name || professionId}`}
                >
                  {rb.logo && (
                    <img
                      src={rb.logo}
                      alt={rb.name}
                      className="h-3.5 w-auto object-contain dark:invert"
                      loading="lazy"
                    />
                  )}
                  {rb.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Block 2: Other automotive professions for current brand */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
              <circle cx="12" cy="9" r="2.5"></circle>
            </svg>
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
              {t.servicesHeading(
                carBrandSlug
                  ? carBrandSlug.charAt(0).toUpperCase() + carBrandSlug.slice(1).replace(/-/g, ' ')
                  : ''
              )}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {AUTOMOTIVE_PROFESSIONS.filter((p) => p.id !== professionId).map((prof) => {
              const profSlug =
                professionSlugsMap[prof.id as ProfessionId]?.[lang as Locale] || prof.slugPl;
              const href = carBrandSlug
                ? `${langPrefix}/${parentSlug}/${industrySlug}/${profSlug}/${carBrandSlug}${
                    carModelSlug ? '/' + carModelSlug : ''
                  }`
                : `${langPrefix}/${parentSlug}/${industrySlug}/${profSlug}`;
              const profName = trans.models[prof.id as ProfessionId]?.name || profSlug;
              return (
                <Link
                  key={prof.id}
                  href={href}
                  className="group inline-flex items-center gap-2 px-5 py-2 rounded-none bg-slate-100 dark:bg-slate-900/60 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 transition-all duration-150 -skew-x-12"
                >
                  <span className="flex items-center gap-2 skew-x-12">
                    <span>{prof.emojiIcon}</span>
                    <span>{profName}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Block 3: Same profession + brand across key cities */}
        {carBrandSlug && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
                {t.citiesHeading}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {keyCities.map((kc) => (
                <Link
                  key={kc.slug}
                  href={`${langPrefix}/${kc.slug}/${industrySlug}/${professionSlug}`}
                  className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-none bg-slate-100 dark:bg-slate-900/60 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 transition-all duration-150 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_50%,calc(100%-12px)_100%,0_100%)]"
                >
                  <svg className="w-3 h-3 text-indigo-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {kc.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Webwawa disclaimer */}
        <p className="text-xs text-slate-400 dark:text-slate-600 text-center pt-2 border-t border-slate-100 dark:border-slate-900">
          {t.disclaimer}
        </p>
      </div>
    </section>
  );
}
