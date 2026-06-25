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
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
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
                    className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-none bg-slate-100 dark:bg-slate-900/60 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 transition-all duration-150 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_50%,calc(100%-12px)_100%,0_100%)]"
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
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
              <circle cx="12" cy="9" r="2.5"></circle>
            </svg>
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
              {mt.locationsHeading(modelData.name)}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {KEY_LOCATIONS.map((loc) => (
              <Link
                key={loc.slug}
                href={`${langPrefix}/${loc.slug}/${industrySlug}/${professionSlug}`}
                className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-none bg-slate-100 dark:bg-slate-900/60 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 transition-all duration-150 [clip-path:polygon(0_0,calc(100%-12px)_0,100%_50%,calc(100%-12px)_100%,0_100%)]"
              >
                <svg className="w-3 h-3 text-indigo-500 group-hover:text-white transition-colors flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="truncate max-w-[250px] sm:max-w-xs md:max-w-sm lg:max-w-md">
                  {(() => {
                    const phrases = {
                      pl: [
                        `projektowanie stron dla ${modelData.name.toLowerCase()} ${loc.name}`,
                        `aplikacje dedykowane dla ${modelData.name.toLowerCase()} ${loc.name}`,
                        `pozycjonowanie lokalne dla ${modelData.name.toLowerCase()} ${loc.name}`,
                        `sklepy internetowe dla ${modelData.name.toLowerCase()} ${loc.name}`,
                        `systemy rezerwacji dla ${modelData.name.toLowerCase()} ${loc.name}`,
                        `marketing internetowy dla ${modelData.name.toLowerCase()} ${loc.name}`,
                      ],
                      en: [
                        `website design for ${modelData.name.toLowerCase()} ${loc.name}`,
                        `custom apps for ${modelData.name.toLowerCase()} ${loc.name}`,
                        `local seo for ${modelData.name.toLowerCase()} ${loc.name}`,
                        `ecommerce for ${modelData.name.toLowerCase()} ${loc.name}`,
                        `booking systems for ${modelData.name.toLowerCase()} ${loc.name}`,
                        `digital marketing for ${modelData.name.toLowerCase()} ${loc.name}`,
                      ],
                      de: [
                        `Webdesign für ${modelData.name.toLowerCase()} ${loc.name}`,
                        `Apps für ${modelData.name.toLowerCase()} ${loc.name}`,
                        `lokales SEO für ${modelData.name.toLowerCase()} ${loc.name}`,
                      ],
                      uk: [
                        `створення сайтів для ${modelData.name.toLowerCase()} ${loc.name}`,
                        `додатки для ${modelData.name.toLowerCase()} ${loc.name}`,
                        `seo просування для ${modelData.name.toLowerCase()} ${loc.name}`,
                      ],
                      ru: [
                        `создание сайтов для ${modelData.name.toLowerCase()} ${loc.name}`,
                        `приложения для ${modelData.name.toLowerCase()} ${loc.name}`,
                        `seo продвижение для ${modelData.name.toLowerCase()} ${loc.name}`,
                      ],
                      zh: [
                        `${modelData.name.toLowerCase()} ${loc.name} 网站建设`,
                        `${modelData.name.toLowerCase()} ${loc.name} APP开发`,
                        `${modelData.name.toLowerCase()} ${loc.name} 本地SEO`,
                      ]
                    };
                    const list = phrases[lang as keyof typeof phrases] || phrases.en;
                    const idx = Array.from(loc.slug).reduce((acc, char) => acc + char.charCodeAt(0), 0) % list.length;
                    return list[idx];
                  })()}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Block 3: Related industries */}
        {relatedItems.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
                {mt.relatedHeading}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {relatedItems.map((ri) => (
                <Link
                  key={ri.id}
                  href={`${langPrefix}/${parentSlug}/${ri.slug}`}
                  className="group inline-flex items-center gap-2 px-5 py-2 rounded-none bg-slate-100 dark:bg-slate-900/60 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 transition-all duration-150 -skew-x-12"
                >
                  <span className="block skew-x-12">
                    {(() => {
                      const relatedPrefix = {
                        pl: 'projektowanie aplikacji dla ',
                        en: 'app development for ',
                        de: 'App-Entwicklung für ',
                        uk: 'розробка додатків для ',
                        ru: 'разработка приложений для ',
                        zh: '开发程序：'
                      };
                      const p = relatedPrefix[lang as keyof typeof relatedPrefix] || relatedPrefix.en;
                      return p + ri.name.toLowerCase();
                    })()} &rarr;
                  </span>
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
