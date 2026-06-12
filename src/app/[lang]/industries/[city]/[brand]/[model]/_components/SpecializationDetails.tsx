import Link from 'next/link';
import { Locale } from '../../../../../dictionaries';
import { serviceSlugsMap } from '@/lib/industries-list';

interface SpecializationDetailsProps {
  lang: string;
  cityName: string;
  carDetails: string;
  t: {
    profBadge: string;
    profHeading: (name: string) => string;
    vehicleContext: string;
    vehicleDisclaimer: (car: string) => string;
    googleRankHeading: string;
    implementationHeading: string;
    dedicatedServices: string;
    seeDetails: string;
  };
  modelData: {
    name: string;
    about: string;
    focus: string;
    specifications: string[];
  };
  techTrans?: {
    title: string;
    description: string;
    advantages: string[];
  } | null;
  wikiData?: any;
  trans: {
    series: Record<string, { title: string; desc: string }>;
  };
  carBrandSlug: string | null;
  carModelSlug: string | null;
  carSeriesSlug: string | null;
  langPrefix: string;
  parentSlug: string;
  industrySlug: string;
  professionSlug: string;
  citySlug: string;
  city: { slug: string; name: string } | null;
}

export default function SpecializationDetails({
  lang,
  cityName,
  carDetails,
  t,
  modelData,
  techTrans,
  wikiData,
  trans,
  carBrandSlug,
  carModelSlug,
  carSeriesSlug,
  langPrefix,
  parentSlug,
  industrySlug,
  professionSlug,
  citySlug,
  city,
}: SpecializationDetailsProps) {
  return (
    <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-900/40">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-7 space-y-6">
            <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
              {t.profBadge}
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.profHeading(modelData.name)}
            </h2>
            <p className="text-slate-650 dark:text-slate-400 leading-relaxed">
              {modelData.about}
            </p>

            {techTrans && (
              <div className="my-8 p-6 bg-indigo-50/80 dark:bg-slate-900/40 rounded-2xl border border-indigo-200 dark:border-indigo-500/20 backdrop-blur-sm transition-colors duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🚀</span>
                  <h3 className="font-bold text-lg text-indigo-800 dark:text-indigo-400">
                    {techTrans.title}
                  </h3>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
                  {techTrans.description}
                </p>
                <ul className="space-y-2">
                  {techTrans.advantages.map((adv, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-400">
                      <span className="text-indigo-600 dark:text-indigo-500 font-bold">✦</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {wikiData?.wiki?.description && (
              <div className="bg-slate-50 dark:bg-slate-950/20 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 my-6 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 uppercase">
                  {t.vehicleContext} {carDetails}
                </h3>
                <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                  {typeof wikiData.wiki.description === 'string' 
                    ? wikiData.wiki.description 
                    : (wikiData.wiki.description[lang] || wikiData.wiki.description.pl)}
                </p>
                <div className="mt-4 text-xs font-bold text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
                  {t.vehicleDisclaimer(carDetails)}
                </div>
              </div>
            )}
            
            <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl">
              <h3 className="font-bold text-lg mb-2 text-primary">
                {t.googleRankHeading}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-455 leading-relaxed">
                {modelData.focus}
              </p>
            </div>

            {/* Specifications checklist */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-900/60 mt-8">
              <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {t.implementationHeading}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modelData.specifications.map((spec, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 items-start hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                    <span className="text-primary mt-0.5 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Services navigation */}
          <div className="md:col-span-5 glass-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
            <h3 className="font-black text-xl mb-6 uppercase tracking-tight text-slate-900 dark:text-white">
              {t.dedicatedServices}
            </h3>
            <div className="space-y-4">
              {Object.entries(trans.series).map(([seriesKey, val]) => {
                const serviceSlug = serviceSlugsMap[seriesKey as keyof typeof serviceSlugsMap][lang as Locale];
                let serviceUrl = '';
                if (carBrandSlug) {
                  serviceUrl = `${langPrefix}/${parentSlug}/${industrySlug}/${professionSlug}/${citySlug}/${carBrandSlug}`;
                  if (carModelSlug) {
                    serviceUrl += `/${carModelSlug}`;
                    if (carSeriesSlug) {
                      serviceUrl += `/${carSeriesSlug}`;
                    }
                  }
                  serviceUrl += `/${serviceSlug}`;
                } else {
                  serviceUrl = city 
                    ? `${langPrefix}/${city.slug}/${industrySlug}/${professionSlug}/${serviceSlug}`
                    : `${langPrefix}/${parentSlug}/${industrySlug}/${professionSlug}/${serviceSlug}`;
                }

                return (
                  <div key={seriesKey} className="border-b border-slate-200 dark:border-slate-800/80 pb-4 last:border-0 last:pb-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-md">{val.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-455 mt-1 leading-relaxed">{val.desc}</p>
                    <Link 
                      href={serviceUrl} 
                      className="text-primary text-xs font-bold hover:underline inline-flex items-center gap-1 mt-2.5"
                    >
                      {t.seeDetails} &rarr;
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
