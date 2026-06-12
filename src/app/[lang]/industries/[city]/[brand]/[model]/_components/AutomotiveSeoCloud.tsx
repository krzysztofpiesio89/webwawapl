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
              <span className="text-2xl">🔗</span>
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
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
            <span className="text-2xl">⚙️</span>
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                >
                  <span>{prof.emojiIcon}</span>
                  <span>{profName}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Block 3: Same profession + brand across key cities */}
        {carBrandSlug && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">📍</span>
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
                {t.citiesHeading}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {keyCities.map((kc) => (
                <Link
                  key={kc.slug}
                  href={`${langPrefix}/${kc.slug}/${industrySlug}/${professionSlug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                >
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
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
