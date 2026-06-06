import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getIndustryById } from '@/lib/industries';
import { getCityBySlug } from '@/lib/cities';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale, ogLocaleMap } from '../../../dictionaries';
import ContactForm from '@/components/ContactForm';
import { 
  industrySlugsMap, 
  professionSlugsMap, 
  IndustryId, 
  ProfessionId,
  industryModelsMap,
  industryTerminology
} from '@/lib/industries-list';

// Key Warsaw districts + nearby cities for regional SEO links
const KEY_LOCATIONS = [
  { slug: 'mokotow', name: 'Mokotów' },
  { slug: 'wola', name: 'Wola' },
  { slug: 'srodmiescie', name: 'Śródmieście' },
  { slug: 'ursynow', name: 'Ursynów' },
  { slug: 'bialoleka', name: 'Białołęka' },
  { slug: 'bemowo', name: 'Bemowo' },
  { slug: 'ochota', name: 'Ochota' },
  { slug: 'wilanow', name: 'Wilanow' },
  { slug: 'zoliborz', name: 'Żoliborz' },
  { slug: 'bielany', name: 'Bielany' },
  { slug: 'legionowo', name: 'Legionowo' },
  { slug: 'pruszkow', name: 'Pruszków' },
  { slug: 'piaseczno', name: 'Piaseczno' },
  { slug: 'otwock', name: 'Otwock' },
  { slug: 'konstancin-jeziorna', name: 'Konstancin' },
  { slug: 'lomianki', name: 'Łomianki' },
  { slug: 'wolomin', name: 'Wołomin' },
  { slug: 'marki-miasto', name: 'Marki' },
];

// Related industries map for cross-linking
const RELATED_INDUSTRIES: Record<IndustryId, IndustryId[]> = {
  doctor: ['psychologist', 'beauty'],
  lawyer: ['accountant'],
  psychologist: ['doctor', 'beauty'],
  accountant: ['lawyer'],
  architect: ['construction'],
  construction: ['architect', 'transport'],
  beauty: ['psychologist'],
  automotive: ['transport'],
  gastronomy: [],
  transport: ['automotive', 'construction'],
  ecommerce: ['accountant', 'transport'],
  education: ['psychologist'],
};

// Brand-level UI translation strings
const BRAND_UI = {
  pl: {
    locationsHeading: (ind: string) => `${ind} – usługi w Warszawie i okolicach`,
    relatedHeading: 'Podobne branże i usługi IT',
    disclaimer: (ind: string) => `webwawa.pl – projektujemy strony WWW i systemy IT dla branży: ${ind} w Warszawie i regionie mazowieckim. Powyższe linki prowadzą do dedykowanych ofert lokalnych.`,
    aboutHeading: "O specyfice branży",
    selectModel: "Wybierz specjalizację (model profesji):",
    solutionsHeading: "Stosowane rozwiązania"
  },
  en: {
    locationsHeading: (ind: string) => `${ind} – services in Warsaw & surrounding area`,
    relatedHeading: 'Related industries & IT services',
    disclaimer: (ind: string) => `webwawa.pl – we build websites & IT systems for ${ind} businesses in Warsaw and the Masovian region.`,
    aboutHeading: "About the industry specifics",
    selectModel: "Select profession model:",
    solutionsHeading: "Applied solutions"
  },
  de: {
    locationsHeading: (ind: string) => `${ind} – Dienste in Warschau & Umgebung`,
    relatedHeading: 'Verwandte Branchen & IT-Dienste',
    disclaimer: (ind: string) => `webwawa.pl – Websites & IT-Systeme für ${ind} in Warschau und der Masowischen Region.`,
    aboutHeading: "Über die Branchenspezifika",
    selectModel: "Wählen Sie das Berufsmodell:",
    solutionsHeading: "Angewandte Lösungen"
  },
  uk: {
    locationsHeading: (ind: string) => `${ind} – послуги у Варшаві та околицях`,
    relatedHeading: 'Схожі галузі та IT-послуги',
    disclaimer: (ind: string) => `webwawa.pl – розробляємо сайти та IT-системи для галузі ${ind} у Варшаві та Мазовії.`,
    aboutHeading: "Про специфіку галузі",
    selectModel: "Виберіть спеціалізацію (модель професії):",
    solutionsHeading: "Застосовувані рішення"
  },
  ru: {
    locationsHeading: (ind: string) => `${ind} – услуги в Варшаве и окрестностях`,
    relatedHeading: 'Похожие отрасли и IT-услуги',
    disclaimer: (ind: string) => `webwawa.pl – разрабатываем сайты и IT-системы для сферы ${ind} в Варшаве и Мазовецком регионе.`,
    aboutHeading: "О специфике отрасли",
    selectModel: "Выберите специализацию (модель профессии):",
    solutionsHeading: "Применяемые решения"
  },
  zh: {
    locationsHeading: (ind: string) => `${ind} – 华沙及周边地区服务`,
    relatedHeading: '相关行业与IT服务',
    disclaimer: (ind: string) => `webwawa.pl – 为华沙及马佐得天山地区${ind}企业提供网站开发与IT系统服务。`,
    aboutHeading: "关于行业特色",
    selectModel: "选择专业方向（职业模型）：",
    solutionsHeading: "应用解决方案"
  },
} as const;

interface PageProps {
  params: Promise<{
    lang: string;
    city: string;
    brand: string;
  }>;
}

export async function generateStaticParams() {
  // We can pre-generate pages for the doctor brand, in all supported languages and cities (including 'all')
  const langs = ['pl', 'en', 'de', 'uk', 'ru', 'zh'];
  const cities = [
    'all',
    'bemowo', 'bialoleka', 'bielany', 'mokotow', 'ochota', 'praga-poludnie', 'praga-polnoc',
    'rembertow', 'srodmiescie', 'targowek', 'ursus', 'ursynow', 'wawer', 'wesola',
    'wilanow', 'wlochy', 'wola', 'zoliborz',
    'legionowo', 'jablonna', 'otwock', 'jozefow', 'piaseczno', 'konstancin-jeziorna',
    'pruszkow', 'piastow', 'zabki', 'marki-miasto', 'wolomin', 'kobylka', 'zielonka',
    'sulejowek', 'grodzisk-mazowiecki', 'nowy-dwor-mazowiecki', 'minsk-mazowiecki',
    'lomianki', 'ozarow-mazowiecki', 'nadarzyn', 'warszawa'
  ];
  const brands = ['doctor', 'lawyer', 'psychologist', 'accountant', 'architect', 'construction', 'beauty', 'automotive', 'gastronomy', 'transport', 'ecommerce', 'education'];
  
  const paramsList = [];
  for (const lang of langs) {
    for (const city of cities) {
      for (const brand of brands) {
        paramsList.push({ lang, city, brand });
      }
    }
  }
  return paramsList;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, brand: brandId } = await params;
  const industry = getIndustryById(brandId as IndustryId);
  if (!industry) return {};

  const city = citySlug === 'all' ? null : getCityBySlug(citySlug);
  const cityName = city ? city.name : 'Warszawa';
  const trans = industry.translations[lang as Locale];
  
  if (!trans) return {};

  const localizedBrandName = trans.industryName;

  const terms = industryTerminology[brandId as IndustryId]?.[lang] || industryTerminology[brandId as IndustryId]?.en || {
    target: lang === 'pl' ? 'klientów' : 'clients',
    targetAccusative: lang === 'pl' ? 'Klientów' : 'Clients'
  };

  const metaTitles = {
    pl: `Dedykowane strony i systemy IT dla sektora: ${localizedBrandName} - ${cityName} | webwawa.pl`,
    en: `Custom Websites & IT for ${localizedBrandName} - ${cityName} | webwawa.pl`,
    de: `Dedizierte Webseiten und IT-Systeme für den Sektor: ${localizedBrandName} - ${cityName} | webwawa.pl`,
    uk: `Індивідуальні сайти та IT-системи для сектору: ${localizedBrandName} - ${cityName} | webwawa.pl`,
    ru: `Индивидуальные сайты и IT-системы для сектора: ${localizedBrandName} - ${cityName} | webwawa.pl`,
    zh: `为${localizedBrandName}领域定制网站与 IT 系统 - ${cityName} | webwawa.pl`
  };

  const metaDescriptions = {
    pl: `Tworzenie nowoczesnych stron internetowych, aplikacji PWA i pozycjonowanie SEO dla branży: ${localizedBrandName} w lokalizacji ${cityName}. Zwiększ konwersję ${terms.target}.`,
    en: `Designing modern websites, PWA apps, and local SEO positioning for ${localizedBrandName} in ${cityName}. Build trust and acquire more ${terms.target}.`,
    de: `Erstellung moderner Webseiten, PWA-Apps und lokale SEO-Positionierung für die Branche: ${localizedBrandName} in ${cityName}. Steigern Sie die Konversion der ${terms.target}.`,
    uk: `Створення сучасних веб-сайтів, додатків PWA та локальне просування SEO для галузі: ${localizedBrandName} у ${cityName}. Збільшуйте конверсію для ${terms.target}.`,
    ru: `Создание современных веб-сайтов, приложений PWA и локальное продвижение SEO для отрасли: ${localizedBrandName} в ${cityName}. Увеличивайте конверсию для ${terms.target}.`,
    zh: `为在 ${cityName} 的 ${localizedBrandName} 行业提供现代网站建设、PWA 应用设计和本地 SEO 排名优化。提升${terms.target}转化率。`
  };

  const title = metaTitles[lang as Locale] || metaTitles.en;
  const description = metaDescriptions[lang as Locale] || metaDescriptions.en;

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const parentSlug = lang === 'pl' ? 'strona-dla' : 
                     lang === 'en' ? 'website-for' : 
                     lang === 'de' ? 'webseite-fuer' : 
                     lang === 'uk' ? 'sayt-dlya' : 
                     lang === 'ru' ? 'sayt-dlya' : 'website-for';
  const canonicalUrl = citySlug === 'all'
    ? `https://webwawa.pl${langPrefix}/${parentSlug}/${industrySlugsMap[brandId as IndustryId][lang as Locale]}`
    : `https://webwawa.pl${langPrefix}/${citySlug}/${industrySlugsMap[brandId as IndustryId][lang as Locale]}`;

  let imageUrl = `https://webwawa.pl/images/industries/${brandId}/main.png`;
  const svgPath = path.join(process.cwd(), 'public', 'images', 'industries', brandId, 'main.svg');
  if (fs.existsSync(svgPath)) {
    imageUrl = `https://webwawa.pl/images/industries/${brandId}/main.svg`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'webwawa.pl',
      locale: ogLocaleMap[lang as Locale],
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    }
  };
}

export default async function IndustryBrandPage({ params }: PageProps) {
  const { lang, city: citySlug, brand: brandId } = await params;
  const industry = getIndustryById(brandId as IndustryId);
  if (!industry) notFound();

  const city = citySlug === 'all' ? null : getCityBySlug(citySlug);
  if (citySlug !== 'all' && !city) notFound();

  const trans = industry.translations[lang as Locale];
  if (!trans) notFound();

  const settings = getGlobalSettings();
  const dict = await getDictionary(lang as Locale);
  const isPl = lang === 'pl';
  const bt = BRAND_UI[lang as keyof typeof BRAND_UI] || BRAND_UI.en;
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  const cityName = city ? city.name : (isPl ? 'Warszawa / cała Polska' : 'Warsaw');

  let imageRelativePath = `/images/industries/${brandId}/main.svg`;
  let imageFileSystemPath = path.join(process.cwd(), 'public', imageRelativePath);
  if (!fs.existsSync(imageFileSystemPath)) {
    imageRelativePath = `/images/industries/${brandId}/main.png`;
    imageFileSystemPath = path.join(process.cwd(), 'public', imageRelativePath);
  }
  const hasImage = fs.existsSync(imageFileSystemPath);
  const heroImageSrc = hasImage ? imageRelativePath : '/images/workspace_code.png';

  // Breadcrumbs parent translation
  const parentLabelMap = {
    pl: 'Strona dla',
    en: 'Website for',
    de: 'Webseite für',
    uk: 'Сайт для',
    ru: 'Сайт для',
    zh: '网站适用'
  };
  const parentLabel = parentLabelMap[lang as Locale] || 'Website for';
  const parentSlug = lang === 'pl' ? 'strona-dla' : 
                     lang === 'en' ? 'website-for' : 
                     lang === 'de' ? 'webseite-fuer' : 
                     lang === 'uk' ? 'sayt-dlya' : 
                     lang === 'ru' ? 'sayt-dlya' : 'website-for';
  const brandSlug = industrySlugsMap[brandId as IndustryId][lang as Locale];

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": trans.title,
    "description": trans.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "webwawa.pl",
      "telephone": settings?.phone || "+48 664 946 209",
      "email": settings?.email || "kontakt@webwawa.pl"
    },
    "areaServed": city ? {
      "@type": "City",
      "name": city.name
    } : {
      "@type": "Country",
      "name": "Poland"
    }
  };

  const breadcrumbListJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://webwawa.pl${langPrefix}/`
      },
      ...(city 
        ? [
            {
              "@type": "ListItem",
              "position": 2,
              "name": city.name,
              "item": `https://webwawa.pl${langPrefix}/${city.slug}`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": trans.industryName,
              "item": `https://webwawa.pl${langPrefix}/${city.slug}/${brandSlug}`
            }
          ]
        : [
            {
              "@type": "ListItem",
              "position": 2,
              "name": parentLabel,
              "item": `https://webwawa.pl${langPrefix}/${parentSlug}`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": trans.industryName,
              "item": `https://webwawa.pl${langPrefix}/${parentSlug}/${brandSlug}`
            }
          ]
      )
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
      <script
        type="application/ld+json"
        id={`ldjson-brand-${brandId}`}
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbListJsonLd]) }}
      />

      {/* Hero Section with Aurora */}
      <section className="bg-slate-100 dark:bg-slate-900 py-20 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-left">
              {/* Breadcrumbs */}
              <nav className="flex mb-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <Link href={homeUrl} className="hover:text-primary transition-colors">Home</Link>
                <span className="mx-2">/</span>
                {city ? (
                  <>
                    <Link href={`${lang === 'pl' ? '' : '/' + lang}/${city.slug}`} className="hover:text-primary transition-colors">{city.name}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-primary font-semibold">{trans.industryName}</span>
                  </>
                ) : (
                  <>
                    <span className="text-slate-400">{parentLabel}</span>
                    <span className="mx-2">/</span>
                    <span className="text-primary font-semibold">{trans.industryName}</span>
                  </>
                )}
              </nav>

              <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-6">
                Dedykowane IT dla branży: <span className="gradient-text">{trans.industryName}</span> - {cityName}
              </h1>
              <p className="text-xl opacity-80 leading-relaxed text-slate-650 dark:text-slate-350">
                {trans.heroSubtitle}
              </p>
            </div>
            <div className="lg:col-span-5 relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/40">
              <img 
                src={heroImageSrc} 
                alt={trans.industryName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Industry Info */}
      <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-900/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-7 space-y-6">
              <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                {bt.aboutHeading}
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {trans.title}
              </h2>
              <p className="text-slate-650 dark:text-slate-400 leading-relaxed text-md">
                {trans.about}
              </p>
              
              {/* Specializations Quick Navigation */}
              <div className="pt-6">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
                  {bt.selectModel}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(trans.models).map(([modelKey, modelVal]) => {
                    const modelSlug = professionSlugsMap[modelKey as ProfessionId][lang as Locale];
                    const url = city 
                      ? `${langPrefix}/${city.slug}/${brandSlug}/${modelSlug}`
                      : `${langPrefix}/${parentSlug}/${brandSlug}/${modelSlug}`;
                    return (
                      <Link 
                        key={modelKey}
                        href={url}
                        className="py-3 px-6 bg-slate-100 hover:bg-primary hover:text-white dark:bg-slate-900 dark:hover:bg-primary font-bold rounded-xl transition-all shadow-sm"
                      >
                        {modelVal.name} &rarr;
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Tech Stack Box */}
            <div className="md:col-span-5 glass-card relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
              <h3 className="font-black text-xl mb-6 uppercase tracking-tight text-slate-900 dark:text-white">
                {bt.solutionsHeading}
              </h3>
              <ul className="space-y-4">
                {Object.entries(trans.series).map(([key, val]) => (
                  <li key={key} className="flex gap-3">
                    <span className="text-primary text-xl">✔</span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{val.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-450 mt-0.5">{val.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Formularz Kontaktowy */}
      <section id="kontakt" className="py-20 bg-slate-100 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <ContactForm 
            lang={lang} 
            defaultCity={city ? city.name : 'Warszawa'} 
            settings={settings} 
            dict={dict.form} 
          />
        </div>
      </section>

      {/* SEO Internal Link Cloud */}
      {brandId !== 'automotive' && (() => {
        const bt = BRAND_UI[lang as keyof typeof BRAND_UI] || BRAND_UI.en;
        const relatedIds = RELATED_INDUSTRIES[brandId as IndustryId] || [];

        return (
          <section className="py-14 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900/50">
            <div className="container mx-auto px-4 max-w-5xl space-y-10">

              {/* Block 1: Locations – same industry across districts */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">📍</span>
                  <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
                    {bt.locationsHeading(trans.industryName)}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {KEY_LOCATIONS.map(loc => (
                    <Link
                      key={loc.slug}
                      href={`${langPrefix}/${parentSlug}/${brandSlug}/${loc.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                    >
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {loc.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Block 2: Related industries */}
              {relatedIds.length > 0 && (() => {
                const relatedItems = relatedIds
                  .map(rid => {
                    const relIndustry = getIndustryById(rid);
                    if (!relIndustry) return null;
                    const relTrans = relIndustry.translations[lang as Locale];
                    if (!relTrans) return null;
                    const relSlug = industrySlugsMap[rid][lang as Locale];
                    return { name: relTrans.industryName, slug: relSlug, id: rid };
                  })
                  .filter(Boolean) as { name: string; slug: string; id: string }[];

                if (relatedItems.length === 0) return null;
                return (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-2xl">🔗</span>
                      <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
                        {bt.relatedHeading}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {relatedItems.map(ri => (
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
                );
              })()}

              {/* Disclaimer */}
              <p className="text-xs text-slate-400 dark:text-slate-600 text-center pt-2 border-t border-slate-100 dark:border-slate-900">
                {bt.disclaimer(trans.industryName)}
              </p>

            </div>
          </section>
        );
      })()}
    </main>
  );
}
