import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getIndustryById } from '@/lib/industries';
import { getCityBySlug } from '@/lib/cities';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale, ogLocaleMap } from '../../../../dictionaries';
import ContactForm from '@/components/ContactForm';
import { 
  industrySlugsMap, 
  professionSlugsMap, 
  serviceSlugsMap, 
  IndustryId, 
  ProfessionId,
  industryModelsMap
} from '@/lib/industries-list';

interface PageProps {
  params: Promise<{
    lang: string;
    city: string;
    brand: string;
    model: string;
  }>;
}

export async function generateStaticParams() {
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
  const brands = ['doctor', 'lawyer', 'psychologist', 'accountant', 'architect', 'construction', 'beauty'] as const;
  
  const paramsList = [];
  for (const lang of langs) {
    for (const city of cities) {
      for (const brand of brands) {
        const models = industryModelsMap[brand];
        for (const model of models) {
          paramsList.push({ lang, city, brand, model });
        }
      }
    }
  }
  return paramsList;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, brand: brandId, model: modelId } = await params;
  const industry = getIndustryById(brandId as IndustryId);
  if (!industry) return {};

  const city = citySlug === 'all' ? null : getCityBySlug(citySlug);
  const cityName = city ? city.name : 'Warszawa';
  const trans = industry.translations[lang as Locale];
  
  if (!trans) return {};

  const modelData = trans.models[modelId as ProfessionId];
  if (!modelData) return {};

  const isPl = lang === 'pl';
  const localizedProfession = modelData.name;

  const title = isPl 
    ? `Systemy IT i strony WWW dla: ${localizedProfession} - ${cityName} | webwawa.pl`
    : `Websites & IT Solutions for ${localizedProfession} - ${cityName} | webwawa.pl`;
    
  const description = isPl 
    ? `Projektowanie profesjonalnych stron WordPress, szybkich aplikacji PWA i lokalne pozycjonowanie SEO dla profesji: ${localizedProfession} w lokalizacji ${cityName}. Sprawdź ofertę.`
    : `Custom WordPress sites, PWA applications, and local map SEO rankings for ${localizedProfession} in ${cityName}. Attract patients today.`;

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const parentSlug = lang === 'pl' ? 'strona-dla' : 
                     lang === 'en' ? 'website-for' : 
                     lang === 'de' ? 'webseite-fuer' : 
                     lang === 'uk' ? 'sayt-dlya' : 
                     lang === 'ru' ? 'sayt-dlya' : 'website-for';
  const canonicalUrl = citySlug === 'all'
    ? `https://webwawa.pl${langPrefix}/${parentSlug}/${industrySlugsMap[brandId as IndustryId][lang as Locale]}/${professionSlugsMap[modelId as ProfessionId][lang as Locale]}`
    : `https://webwawa.pl${langPrefix}/${citySlug}/${industrySlugsMap[brandId as IndustryId][lang as Locale]}/${professionSlugsMap[modelId as ProfessionId][lang as Locale]}`;

  let imageUrl = `https://webwawa.pl/images/industries/${brandId}/${modelId}.png`;
  const modelSvgPath = path.join(process.cwd(), 'public', 'images', 'industries', brandId, `${modelId}.svg`);
  if (fs.existsSync(modelSvgPath)) {
    imageUrl = `https://webwawa.pl/images/industries/${brandId}/${modelId}.svg`;
  } else {
    const modelPngPath = path.join(process.cwd(), 'public', 'images', 'industries', brandId, `${modelId}.png`);
    if (!fs.existsSync(modelPngPath)) {
      const mainSvgPath = path.join(process.cwd(), 'public', 'images', 'industries', brandId, 'main.svg');
      if (fs.existsSync(mainSvgPath)) {
        imageUrl = `https://webwawa.pl/images/industries/${brandId}/main.svg`;
      } else {
        imageUrl = `https://webwawa.pl/images/industries/${brandId}/main.png`;
      }
    }
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

export default async function IndustryModelPage({ params }: PageProps) {
  const { lang, city: citySlug, brand: brandId, model: modelId } = await params;
  const industry = getIndustryById(brandId as IndustryId);
  if (!industry) notFound();

  const city = citySlug === 'all' ? null : getCityBySlug(citySlug);
  if (citySlug !== 'all' && !city) notFound();

  const trans = industry.translations[lang as Locale];
  if (!trans) notFound();

  const modelData = trans.models[modelId as ProfessionId];
  if (!modelData) notFound();

  const settings = getGlobalSettings();
  const dict = await getDictionary(lang as Locale);
  const isPl = lang === 'pl';
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  const cityName = city ? city.name : (isPl ? 'Warszawa / cała Polska' : 'Warsaw');

  let imageRelativePath = `/images/industries/${brandId}/${modelId}.svg`;
  let imageFileSystemPath = path.join(process.cwd(), 'public', imageRelativePath);
  if (!fs.existsSync(imageFileSystemPath)) {
    imageRelativePath = `/images/industries/${brandId}/${modelId}.png`;
    imageFileSystemPath = path.join(process.cwd(), 'public', imageRelativePath);
  }
  
  let heroImageSrc = '/images/workspace_code.png';
  if (fs.existsSync(imageFileSystemPath)) {
    heroImageSrc = imageRelativePath;
  } else {
    const mainSvgPath = `/images/industries/${brandId}/main.svg`;
    if (fs.existsSync(path.join(process.cwd(), 'public', mainSvgPath))) {
      heroImageSrc = mainSvgPath;
    } else {
      const mainPngPath = `/images/industries/${brandId}/main.png`;
      if (fs.existsSync(path.join(process.cwd(), 'public', mainPngPath))) {
        heroImageSrc = mainPngPath;
      }
    }
  }

  const brandSlug = industrySlugsMap[brandId as IndustryId][lang as Locale];
  const modelSlug = professionSlugsMap[modelId as ProfessionId][lang as Locale];

  const parentSlug = lang === 'pl' ? 'strona-dla' : 
                     lang === 'en' ? 'website-for' : 
                     lang === 'de' ? 'webseite-fuer' : 
                     lang === 'uk' ? 'sayt-dlya' : 
                     lang === 'ru' ? 'sayt-dlya' : 'website-for';

  const parentLabelMap = {
    pl: 'Strona dla',
    en: 'Website for',
    de: 'Webseite für',
    uk: 'Сайт для',
    ru: 'Сайт для',
    zh: '网站适用'
  };
  const parentLabel = parentLabelMap[lang as Locale] || 'Website for';

  const brandUrl = city 
    ? `${lang === 'pl' ? '' : '/' + lang}/${city.slug}/${brandSlug}`
    : `${lang === 'pl' ? '' : '/' + lang}/${parentSlug}/${brandSlug}`;

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${modelData.name} - Usługi IT & Marketing`,
    "description": modelData.about,
    "image": `https://webwawa.pl/images/industries/${brandId}/${modelId}.png`,
    "provider": {
      "@type": "LocalBusiness",
      "name": "webwawa.pl",
      "telephone": settings?.phone || "+48 664 946 209"
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
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": modelData.name,
              "item": `https://webwawa.pl${langPrefix}/${city.slug}/${brandSlug}/${modelSlug}`
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
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": modelData.name,
              "item": `https://webwawa.pl${langPrefix}/${parentSlug}/${brandSlug}/${modelSlug}`
            }
          ]
      )
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
      <script
        type="application/ld+json"
        id={`ldjson-model-${brandId}-${modelId}`}
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbListJsonLd]) }}
      />

      {/* Hero Section */}
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
                  </>
                ) : null}
                <Link href={brandUrl} className="hover:text-primary transition-colors">{trans.industryName}</Link>
                <span className="mx-2">/</span>
                <span className="text-primary font-semibold">{modelData.name}</span>
              </nav>

              <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-6">
                Projektowanie i SEO dla: <span className="gradient-text">{modelData.name}</span> - {cityName}
              </h1>
              <p className="text-xl opacity-80 leading-relaxed text-slate-650 dark:text-slate-350">
                {isPl
                  ? `Tworzenie dedykowanych rozwiązań internetowych oraz pozycjonowanie specjalizacji ${modelData.name} w regionie ${cityName}.`
                  : `Designing custom digital products and high-ranking local SEO for ${modelData.name} in ${cityName}.`}
              </p>
            </div>
            <div className="lg:col-span-5 relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/40">
              <img 
                src={heroImageSrc} 
                alt={modelData.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Specialization Details */}
      <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-900/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-7 space-y-6">
              <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                Specyfika profesji
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Jak rozwinąć gabinet specjalizacji {modelData.name}?
              </h2>
              <p className="text-slate-650 dark:text-slate-400 leading-relaxed">
                {modelData.about}
              </p>
              
              <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  {isPl ? "Co wpływa najbardziej na pozycję w Google?" : "Key factors affecting Google rankings:"}
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
                  {isPl ? "Wymagania i standardy wdrożenia:" : "Implementation standards & requirements:"}
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
              <h3 className="font-black text-xl mb-6 uppercase tracking-tight italic text-slate-900 dark:text-white">
                Dedykowane Usługi
              </h3>
              <div className="space-y-4">
                {Object.entries(trans.series).map(([seriesKey, val]) => {
                  const serviceSlug = serviceSlugsMap[seriesKey as keyof typeof serviceSlugsMap][lang as Locale];
                  const serviceUrl = city 
                    ? `${lang === 'pl' ? '' : '/' + lang}/${city.slug}/${brandSlug}/${modelSlug}/${serviceSlug}`
                    : `${lang === 'pl' ? '' : '/' + lang}/${parentSlug}/${brandSlug}/${modelSlug}/${serviceSlug}`;

                  return (
                    <div key={seriesKey} className="border-b border-slate-200 dark:border-slate-800/80 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-md">{val.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">{val.desc}</p>
                      <Link 
                        href={serviceUrl} 
                        className="text-primary text-xs font-bold hover:underline inline-flex items-center gap-1 mt-2.5"
                      >
                        {isPl ? "Zobacz szczegóły oferty" : "See service details"} &rarr;
                      </Link>
                    </div>
                  );
                })}
              </div>
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
    </main>
  );
}
