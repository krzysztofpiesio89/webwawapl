import Link from 'next/link';
import { Locale } from '../../../../../dictionaries';
import { getIndustryById } from '@/lib/industries';
import {
  ProfessionId,
  professionSlugsMap,
  IndustryId,
  industrySlugsMap,
} from '@/lib/industries-list';
import { PROFESSION_UI, KEY_LOCATIONS, RELATED_INDUSTRIES } from '../constants';

interface NonAutomotiveSeoCloudProps {
  lang: string;
  industryId: string;
  professionId: string;
  modelData: {
    name: string;
  };
  trans: {
    industryName: string;
    models: Record<string, { name: string }>;
  };
  city: { slug: string; name: string } | null;
  industrySlug: string;
  professionSlug: string;
  parentSlug: string;
  langPrefix: string;
}

export default function NonAutomotiveSeoCloud({
  lang,
  industryId,
  professionId,
  modelData,
  trans,
  city,
  industrySlug,
  professionSlug,
  parentSlug,
  langPrefix,
}: NonAutomotiveSeoCloudProps) {
  const mt = PROFESSION_UI[lang as keyof typeof PROFESSION_UI] || PROFESSION_UI.en;
  const relatedIds = RELATED_INDUSTRIES[industryId as IndustryId] || [];

  // Other specializations within same industry
  const siblingModels = Object.entries(trans.models)
    .filter(([k]) => k !== professionId)
    .map(([k, v]) => ({
      id: k as ProfessionId,
      name: v.name,
      slug: professionSlugsMap[k as ProfessionId]?.[lang as Locale] || k,
    }));

  const relatedItems = relatedIds
    .map((rid) => {
      const relInd = getIndustryById(rid);
      if (!relInd) return null;
      const relTrans = relInd.translations[lang as Locale];
      if (!relTrans) return null;
      const relSlug = industrySlugsMap[rid][lang as Locale];
      return { name: relTrans.industryName, slug: relSlug, id: rid };
    })
    .filter(Boolean) as Array<{ name: string; slug: string; id: string }>;

  return (
    <section className="py-14 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900/50">
      <div className="container mx-auto px-4 max-w-5xl space-y-10">
        {/* Block 1: Other specializations in same industry */}
        {siblingModels.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">📑</span>
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
                {mt.specHeading(trans.industryName)}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {siblingModels.map((sm) => {
                const href = city
                  ? `${langPrefix}/${city.slug}/${industrySlug}/${sm.slug}`
                  : `${langPrefix}/${parentSlug}/${industrySlug}/${sm.slug}`;
                return (
                  <Link
                    key={sm.id}
                    href={href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                  >
                    {sm.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Block 2: Same profession across Warsaw districts */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">📍</span>
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
              {mt.locationsHeading(modelData.name)}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {KEY_LOCATIONS.map((loc) => (
              <Link
                key={loc.slug}
                href={`${langPrefix}/${loc.slug}/${industrySlug}/${professionSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
              >
                <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {loc.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Block 3: Related industries */}
        {relatedItems.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">🔗</span>
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
                {mt.relatedHeading}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {relatedItems.map((ri) => (
                <Link
                  key={ri.id}
                  href={`${langPrefix}/${parentSlug}/${ri.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                >
                  {ri.name} →
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-slate-400 dark:text-slate-600 text-center pt-2 border-t border-slate-100 dark:border-slate-900">
          {mt.disclaimer(modelData.name, trans.industryName)}
        </p>
      </div>
    </section>
  );
}
