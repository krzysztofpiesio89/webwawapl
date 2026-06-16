import fs from 'fs';
import path from 'path';
import Script from 'next/script';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getIndustryById } from '@/lib/industries';
import { getCityBySlug } from '@/lib/cities';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale, ogLocaleMap } from '../../../../../dictionaries';
import ContactForm from '@/components/ContactForm';
import { BlurReveal } from '@/components/ui/BlurReveal';
import { 
  industrySlugsMap, 
  professionSlugsMap, 
  serviceSlugsMap, 
  IndustryId, 
  ProfessionId, 
  ServiceId, 
  industryModelsMap,
  industryTerminology
} from '@/lib/industries-list';
import { getBrandBySlug, getModelBySlug, getBrandLogo, getWikiData } from '@/lib/brands';

interface PageProps {
  params: Promise<{
    lang: string;
    city: string;
    brand: string;
    model: string;
    series: string;
  }>;
  searchParams: Promise<{
    carBrand?: string;
    carModel?: string;
    carSeries?: string;
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
  const industriesList = ['doctor', 'lawyer', 'psychologist', 'accountant', 'architect', 'construction', 'beauty', 'automotive', 'gastronomy', 'transport', 'ecommerce', 'education'] as const;
  const serviceList = Object.keys(serviceSlugsMap);
  
  const paramsList = [];
  for (const lang of langs) {
    for (const city of cities) {
      for (const industry of industriesList) {
        const professions = industryModelsMap[industry];
        for (const profession of professions) {
          for (const service of serviceList) {
            paramsList.push({ lang, city, brand: industry, model: profession, series: service });
          }
        }
      }
    }
  }
  return paramsList;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, brand: industryId, model: professionId, series: serviceId } = await params;
  const searchParamsData = await searchParams;
  const carBrandSlug = typeof searchParamsData?.carBrand === 'string' ? searchParamsData.carBrand : null;
  const carModelSlug = typeof searchParamsData?.carModel === 'string' ? searchParamsData.carModel : null;
  const carSeriesSlug = typeof searchParamsData?.carSeries === 'string' ? searchParamsData.carSeries : null;

  const industry = getIndustryById(industryId as IndustryId);
  if (!industry) return {};

  const city = citySlug === 'all' ? null : getCityBySlug(citySlug);
  const cityName = city ? city.name : 'Warszawa';
  const trans = industry.translations[lang as Locale];
  
  if (!trans) return {};

  const modelData = trans.models[professionId as ProfessionId];
  const seriesData = trans.series[serviceId as ServiceId];
  if (!modelData || !seriesData) return {};

  const isPl = lang === 'pl';
  const localizedProfession = modelData.name;
  const localizedService = seriesData.title;

  // Resolve car details for contextual B2B metadata
  let carDetails = '';
  if (carBrandSlug) {
    const carBrand = getBrandBySlug(carBrandSlug);
    const carBrandName = carBrand ? carBrand.name : (carBrandSlug.charAt(0).toUpperCase() + carBrandSlug.slice(1));
    carDetails = carBrandName;
    if (carModelSlug) {
      const carModel = carBrand ? getModelBySlug(carBrand, carModelSlug) : null;
      const carModelName = carModel ? carModel.name : carModelSlug.toUpperCase();
      carDetails += ` ${carModelName}`;
      if (carSeriesSlug) {
        const decodedSeries = decodeURIComponent(carSeriesSlug);
        let seriesDisplayName = decodedSeries;
        const modelClean = carModelName.toLowerCase();
        if (seriesDisplayName.toLowerCase().startsWith(modelClean)) {
          seriesDisplayName = seriesDisplayName.slice(modelClean.length).trim();
        }
        carDetails += ` ${seriesDisplayName}`;
      }
    }
  }

  const metaTitles = {
    pl: carDetails 
      ? `${localizedService} dla ${localizedProfession} (${carDetails}) - ${cityName} | webwawa.pl`
      : `${localizedService} dla specjalności: ${localizedProfession} - ${cityName} | webwawa.pl`,
    en: carDetails
      ? `${localizedService} for ${localizedProfession} (${carDetails}) - ${cityName} | webwawa.pl`
      : `${localizedService} for ${localizedProfession} in ${cityName} | webwawa.pl`,
    de: carDetails
      ? `${localizedService} für ${localizedProfession} (${carDetails}) - ${cityName} | webwawa.pl`
      : `${localizedService} für die Spezialisierung: ${localizedProfession} - ${cityName} | webwawa.pl`,
    uk: carDetails
      ? `${localizedService} для ${localizedProfession} (${carDetails}) - ${cityName} | webwawa.pl`
      : `${localizedService} для спеціалізації: ${localizedProfession} - ${cityName} | webwawa.pl`,
    ru: carDetails
      ? `${localizedService} для ${localizedProfession} (${carDetails}) - ${cityName} | webwawa.pl`
      : `${localizedService} для специализации: ${localizedProfession} - ${cityName} | webwawa.pl`,
    zh: carDetails
      ? `适合${localizedProfession} (${carDetails}) 的${localizedService} - ${cityName} | webwawa.pl`
      : `适合${localizedProfession}的${localizedService} - ${cityName} | webwawa.pl`
  };

  const metaDescriptions = {
    pl: carDetails
      ? `Projektowanie i pozycjonowanie: ${localizedService} dla profesji ${localizedProfession} dedykowane dla aut ${carDetails} w lokalizacji ${cityName}.`
      : `Dedykowane wdrożenia: ${localizedService} dla profesji ${localizedProfession} w lokalizacji ${cityName}. Zwiększ pozycję w wyszukiwarce Google i zoptymalizuj wyniki konwersji.`,
    en: carDetails
      ? `${localizedService} solutions for ${localizedProfession} optimized for ${carDetails} vehicles in ${cityName}.`
      : `Custom ${localizedService} optimized for ${localizedProfession} in ${cityName}. Dominate Google searches and boost customer acquisition.`,
    de: carDetails
      ? `${localizedService}-Lösungen für ${localizedProfession}, optimiert für ${carDetails}-Fahrzeuge in ${cityName}.`
      : `Maßgeschneiderte Lösungen: ${localizedService} für die Spezialisierung ${localizedProfession} in ${cityName}. Steigern Sie Ihre Google-Rankings und optimieren Sie Ihre Konversionsraten.`,
    uk: carDetails
      ? `Рішення ${localizedService} для ${localizedProfession}, оптимізовані для автомобілів ${carDetails} у ${cityName}.`
      : `Індивідуальні рішення: ${localizedService} для спеціалізації ${localizedProfession} у ${cityName}. Підвищуйте позиції в пошуковій системі Google та оптимізуйте показники конверсії.`,
    ru: carDetails
      ? `Решения ${localizedService} для ${localizedProfession}, оптимизированные для автомобилей ${carDetails} в ${cityName}.`
      : `Индивидуальные решения: ${localizedService} для специализации ${localizedProfession} в ${cityName}. Повышайте позиции в поисковой системе Google и оптимизируйте показатели конверсии.`,
    zh: carDetails
      ? `专为 ${cityName} 的 ${localizedProfession} 打造的 ${localizedService} 方案，并针对 ${carDetails} 车辆进行优化。`
      : `定制解决方案：专为 ${cityName} 的 ${localizedProfession} 开发的 ${localizedService}。提升您在谷歌搜索中的排名并优化转化率。`
};

  const title = metaTitles[lang as Locale] || metaTitles.en;
  const description = metaDescriptions[lang as Locale] || metaDescriptions.en;

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const parentSlug = lang === 'pl' ? 'strona-dla' : 
                     lang === 'en' ? 'website-for' : 
                     lang === 'de' ? 'webseite-fuer' : 
                     lang === 'uk' ? 'sayt-dlya' : 
                     lang === 'ru' ? 'sayt-dlya' : 'website-for';
  const industrySlug = industrySlugsMap[industryId as IndustryId][lang as Locale];
  const professionSlug = professionSlugsMap[professionId as ProfessionId][lang as Locale];
  const serviceSlug = serviceSlugsMap[serviceId as ServiceId][lang as Locale];

  return {
    title,
    description,
    alternates: {
      canonical: citySlug === 'all' 
        ? `https://webwawa.pl${langPrefix}/${parentSlug}/${industrySlug}/${professionSlug}/${serviceSlug}`
        : `https://webwawa.pl${langPrefix}/${citySlug}/${industrySlug}/${professionSlug}/${serviceSlug}`,
    },
    openGraph: {
      title,
      description,
      url: citySlug === 'all' 
        ? `https://webwawa.pl${langPrefix}/${parentSlug}/${industrySlug}/${professionSlug}/${serviceSlug}`
        : `https://webwawa.pl${langPrefix}/${citySlug}/${industrySlug}/${professionSlug}/${serviceSlug}`,
      siteName: 'webwawa.pl',
      locale: ogLocaleMap[lang as Locale],
      type: 'website',
      images: [{
        url: `https://webwawa.pl/images/industries/${industryId}/${professionId}.png`,
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
  };
}

export default async function IndustryServicePage({ params, searchParams }: PageProps) {
  const { lang, city: citySlug, brand: industryId, model: professionId, series: serviceId } = await params;
  const searchParamsData = await searchParams;
  const carBrandSlug = typeof searchParamsData?.carBrand === 'string' ? searchParamsData.carBrand : null;
  const carModelSlug = typeof searchParamsData?.carModel === 'string' ? searchParamsData.carModel : null;
  const carSeriesSlug = typeof searchParamsData?.carSeries === 'string' ? searchParamsData.carSeries : null;

  const industry = getIndustryById(industryId as IndustryId);
  if (!industry) notFound();

  const city = citySlug === 'all' ? null : getCityBySlug(citySlug);
  if (citySlug !== 'all' && !city) notFound();

  const trans = industry.translations[lang as Locale];
  if (!trans) notFound();

  const modelData = trans.models[professionId as ProfessionId];
  const seriesData = trans.series[serviceId as ServiceId];
  if (!modelData || !seriesData) notFound();

  const settings = await getGlobalSettings();
  const dict = await getDictionary(lang as Locale);
  const isPl = lang === 'pl';
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  const cityName = city ? city.name : (isPl ? 'Warszawa / cała Polska' : 'Warsaw');

  let carDetails = '';
  let heroImageSrc = '/images/workspace_code.png';
  let brandLogo: string | null = null;
  let wikiData: any = null;

  if (carBrandSlug) {
    const carBrand = getBrandBySlug(carBrandSlug);
    const carBrandName = carBrand ? carBrand.name : (carBrandSlug.charAt(0).toUpperCase() + carBrandSlug.slice(1));
    carDetails = carBrandName;
    if (carModelSlug) {
      const carModel = carBrand ? getModelBySlug(carBrand, carModelSlug) : null;
      const carModelName = carModel ? carModel.name : carModelSlug.toUpperCase();
      carDetails += ` ${carModelName}`;
      if (carSeriesSlug) {
        const decodedSeries = decodeURIComponent(carSeriesSlug);
        let seriesDisplayName = decodedSeries;
        const modelClean = carModelName.toLowerCase();
        if (seriesDisplayName.toLowerCase().startsWith(modelClean)) {
          seriesDisplayName = seriesDisplayName.slice(modelClean.length).trim();
        }
        carDetails += ` ${seriesDisplayName}`;
      }
    }
    wikiData = carBrandSlug && carModelSlug ? getWikiData(carBrandSlug, carModelSlug) : null;
    const finalImageUrl = wikiData?.specs?.motofaktyImage || wikiData?.wiki?.imageUrl;
    brandLogo = carBrandSlug ? getBrandLogo(carBrandSlug) : null;
    if (finalImageUrl) {
      heroImageSrc = finalImageUrl;
    }
  }

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const industrySlug = industrySlugsMap[industryId as IndustryId][lang as Locale];
  const professionSlug = professionSlugsMap[professionId as ProfessionId][lang as Locale];
  const serviceSlug = serviceSlugsMap[serviceId as ServiceId][lang as Locale];

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
    ? `${langPrefix}/${city.slug}/${industrySlug}`
    : `${langPrefix}/${parentSlug}/${industrySlug}`;

  let modelUrl = '';
  if (carBrandSlug) {
    modelUrl = `${langPrefix}/${parentSlug}/${industrySlug}/${professionSlug}/${citySlug}/${carBrandSlug}`;
    if (carModelSlug) {
      modelUrl += `/${carModelSlug}`;
      if (carSeriesSlug) {
        modelUrl += `/${carSeriesSlug}`;
      }
    }
  } else {
    modelUrl = city
      ? `${langPrefix}/${city.slug}/${industrySlug}/${professionSlug}`
      : `${langPrefix}/${parentSlug}/${industrySlug}/${professionSlug}`;
  }

  const terms = industryTerminology[industryId as IndustryId]?.[lang] || industryTerminology[industryId as IndustryId]?.en || {
    target: isPl ? 'klientów' : 'clients',
    targetAccusative: isPl ? 'Klientów' : 'Clients',
    schemaType: 'LocalBusiness / Service',
    pathway: isPl ? 'ścieżek klienta' : 'client user flows',
    action: isPl ? 'kontakt i zapytanie' : 'sending an inquiry',
    spec: isPl ? 'specjalizacji' : 'specialization',
    scope: isPl ? 'firmy' : 'company',
    scopes: isPl ? 'firm' : 'companies'
  };

  const localizedStrings = {
    pl: {
      heading: `Co ma największy wpływ na wyniki i pozycję ${terms.spec} ${modelData.name}${carDetails ? ` (${carDetails})` : ''} w Google?`,
      actionsTitle: "Nasze działania zwiększające pozycję:",
      keywordsTitle: "Frazy Kluczowe i SEO Targety",
      freeValuation: "Bezpłatna wycena"
    },
    en: {
      heading: `What has the greatest impact on the Google ranking and visibility of the ${modelData.name}${carDetails ? ` (${carDetails})` : ''} ${terms.spec}?`,
      actionsTitle: "Our actions boosting your Google position:",
      keywordsTitle: "Keywords & SEO Targets",
      freeValuation: "Get Free Quote"
    },
    de: {
      heading: `Was hat den größten Einfluss auf das Google-Ranking und die Sichtbarkeit der ${modelData.name}${carDetails ? ` (${carDetails})` : ''} ${terms.spec}?`,
      actionsTitle: "Unsere Maßnahmen zur Steigerung Ihres Google-Rankings:",
      keywordsTitle: "Keywords & SEO-Ziele",
      freeValuation: "Kostenloses Angebot"
    },
    uk: {
      heading: `Що найбільше впливає на результати та позицію в Google для ${terms.spec === 'branży' ? 'галузі' : 'спеціалізації'} ${modelData.name}${carDetails ? ` (${carDetails})` : ''}?`,
      actionsTitle: "Наші дії для підвищення позицій у Google:",
      keywordsTitle: "Ключові фрази та SEO-цілі",
      freeValuation: "Безкоштовна оцінка"
    },
    ru: {
      heading: `Что больше всего влияет на результаты и позицию в Google для ${terms.spec === 'branży' ? 'отрасли' : 'специализации'} ${modelData.name}${carDetails ? ` (${carDetails})` : ''}?`,
      actionsTitle: "Наши действия по повышению позиций в Google:",
      keywordsTitle: "Ключевые фразы и SEO-цели",
      freeValuation: "Бесплатная оценка"
    },
    zh: {
      heading: `什么对 ${modelData.name}${carDetails ? ` (${carDetails})` : ''} ${terms.spec} 在谷歌搜索中的排名影响最大？`,
      actionsTitle: "我们提升谷歌排名的核心举措：",
      keywordsTitle: "关键词与 SEO 优化目标",
      freeValuation: "获取免费估价"
    }
  };

  const ui = localizedStrings[lang as keyof typeof localizedStrings] || localizedStrings.en;

  // Rich specifications checklist or keyword pool
  const keywordClouds = {
    pl: [
      `${seriesData.title} dla ${modelData.name}`,
      `strona www dla ${modelData.name} ${cityName}`,
      `seo ${modelData.name} ${cityName}`,
      `marketing dla ${terms.scope} ${modelData.name}`,
      `jak wypozycjonowac ${modelData.name}`,
      `strony internetowe dla ${terms.scopes} ${cityName}`
    ],
    en: [
      `${seriesData.title} for ${modelData.name}`,
      `website for ${modelData.name} ${cityName}`,
      `seo ${modelData.name} ${cityName}`,
      `marketing for ${modelData.name} ${terms.scope}`,
      `how to rank ${modelData.name}`,
      `websites for ${terms.scopes} ${cityName}`
    ],
    de: [
      `${seriesData.title} für ${modelData.name}`,
      `website für ${modelData.name} ${cityName}`,
      `seo ${modelData.name} ${cityName}`,
      `marketing für ${modelData.name} ${terms.scope}`,
      `wie man ${modelData.name} rankt`,
      `websites für ${terms.scopes} ${cityName}`
    ],
    uk: [
      `${seriesData.title} для ${modelData.name}`,
      `сайт для ${modelData.name} ${cityName}`,
      `seo ${modelData.name} ${cityName}`,
      `маркетинг для ${terms.scope} ${modelData.name}`,
      `як просунути ${modelData.name}`,
      `сайти для ${terms.scopes} ${cityName}`
    ],
    ru: [
      `${seriesData.title} для ${modelData.name}`,
      `сайт для ${modelData.name} ${cityName}`,
      `seo ${modelData.name} ${cityName}`,
      `маркетинг для ${terms.scope} ${modelData.name}`,
      `как продвинуть ${modelData.name}`,
      `сайты для ${terms.scopes} ${cityName}`
    ],
    zh: [
      `适合 ${modelData.name} 的 ${seriesData.title}`,
      `${cityName} ${modelData.name} 网站建设`,
      `${cityName} ${modelData.name} seo 优化`,
      `${modelData.name} ${terms.scope} 营销推广`,
      `如何提升 ${modelData.name} 排名`,
      `${cityName} ${terms.scopes} 网页制作`
    ]
  };

  const keywordCloud = keywordClouds[lang as Locale] || keywordClouds.en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${seriesData.title} - ${modelData.name}`,
    "description": seriesData.desc,
    "image": `https://webwawa.pl/images/industries/${industryId}/${professionId}.png`,
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
              "item": `https://webwawa.pl${langPrefix}/${city.slug}/${industrySlug}`
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": modelData.name,
              "item": `https://webwawa.pl${langPrefix}/${city.slug}/${industrySlug}/${professionSlug}`
            },
            {
              "@type": "ListItem",
              "position": 5,
              "name": seriesData.title,
              "item": `https://webwawa.pl${langPrefix}/${city.slug}/${industrySlug}/${professionSlug}/${serviceSlug}`
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
              "item": `https://webwawa.pl${langPrefix}/${parentSlug}/${industrySlug}`
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": modelData.name,
              "item": `https://webwawa.pl${langPrefix}/${parentSlug}/${industrySlug}/${professionSlug}`
            },
            {
              "@type": "ListItem",
              "position": 5,
              "name": seriesData.title,
              "item": `https://webwawa.pl${langPrefix}/${parentSlug}/${industrySlug}/${professionSlug}/${serviceSlug}`
            }
          ]
      )
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
<Script
          id={`ldjson-series-${industryId}-${professionId}-${serviceId}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbListJsonLd]) }}
        />

      {/* Hero Section */}
      <BlurReveal delay={100}>
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
                <Link href={modelUrl} className="hover:text-primary transition-colors">{modelData.name}</Link>
                <span className="mx-2">/</span>
                <span className="text-primary font-semibold">{seriesData.title}</span>
              </nav>

              <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-6 flex items-center gap-4 flex-wrap">
                {brandLogo && (
                  <img src={brandLogo} alt={`${carBrandSlug} Logo`} className="h-12 w-auto object-contain dark:invert" />
                )}
                <span><span className="gradient-text">{seriesData.title}</span> dla {modelData.name}{carDetails ? <span className="text-primary"> ({carDetails})</span> : ''} - {cityName}</span>
              </h1>
              <p className="text-xl opacity-80 leading-relaxed text-slate-650 dark:text-slate-350">
                {carDetails ? (() => {
                  const detailsDesc = {
                    pl: `Dedykowane wdrożenia w zakresie ${seriesData.title} dla firm oferujących usługi ${modelData.name} w odniesieniu do pojazdów ${carDetails} w regionie ${cityName}.`,
                    en: `Dedicated ${seriesData.title} implementations for companies offering ${modelData.name} services for ${carDetails} vehicles in the ${cityName} area.`,
                    de: `Maßgeschneiderte Implementierungen von ${seriesData.title} für Unternehmen, die ${modelData.name}-Dienstleistungen für ${carDetails}-Fahrzeuge in der Region ${cityName} anbieten.`,
                    uk: `Індивідуальні рішення з розробки ${seriesData.title} для компаній, що пропонують послуги ${modelData.name} для автомобілів ${carDetails} у регіоні ${cityName}.`,
                    ru: `Индивидуальные решения по разработке ${seriesData.title} для компаний, предлагающих услуги ${modelData.name} для автомобилей ${carDetails} в регионе ${cityName}.`,
                    zh: `针对在 ${cityName} 地区为 ${carDetails} 车辆提供 ${modelData.name} 服务的企业而定制的 ${seriesData.title} 方案。`
                  };
                  return detailsDesc[lang as Locale] || detailsDesc.en;
                })() : (
                  seriesData.desc
                )}
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
      </BlurReveal>

      {/* Detail Section */}
      <BlurReveal delay={200}>
        <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-900/40">
          <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-7 space-y-6">
              <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                {dict.cityPage?.benefitsTitle || (() => {
                  const whyUsMap = {
                    pl: 'Dlaczego my?',
                    en: 'Why us?',
                    de: 'Warum wir?',
                    uk: 'Чому ми?',
                    ru: 'Почему мы?',
                    zh: '为什么选择我们？'
                  };
                  return whyUsMap[lang as Locale] || whyUsMap.en;
                })()}
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {ui.heading}
              </h2>
              <p className="text-slate-650 dark:text-slate-400 leading-relaxed">
                {(() => {
                  if (carDetails) {
                    const carDescMap = {
                      pl: `Skuteczność naszych wdrożeń opiera się na precyzyjnym dopasowaniu technologii do potrzeb Twoich klientów. Obsługa ${modelData.name} dla samochodów ${carDetails} wymaga nie tylko estetycznej strony, lecz przede wszystkim bezbłędnej optymalizacji czasu ładowania, responsywności (Mobile-First) oraz integracji z lokalnymi Mapami Google.`,
                      en: `Our implementations' success rests on precise technological adjustments to your customers' needs. Servicing ${modelData.name} for ${carDetails} vehicles demands not only an aesthetic layout, but above all flawless load speed, Mobile-First responsiveness, and Google Maps local SEO alignment.`,
                      de: `Der Erfolg unserer Implementierungen basiert auf der präzisen technologischen Anpassung an die Bedürfnisse Ihrer Kunden. Die Betreuung von ${modelData.name} für ${carDetails}-Fahrzeuge erfordert nicht nur ein ästhetisches Layout, sondern vor allem eine fehlerfreie Ladegeschwindigkeit, Mobile-First-Responsivität und die Ausrichtung auf lokales Google Maps SEO.`,
                      uk: `Успіх наших впроваджень ґрунтується на точному технологічному налаштуванні под потреби ваших клієнтів. Обслуговування ${modelData.name} для автомобілів ${carDetails} вимагає не лише естетичного макету, але, перш за все, бездоганної швидкості завантаження, адаптивності Mobile-First та оптимізації для локального SEO в Google Maps.`,
                      ru: `Успех наших внедрений основан на точном технологическом соответствии потребностям ваших клиентов. Обслуживание ${modelData.name} для автомобилей ${carDetails} требует не только эстетичного макета, но и, прежде всего, безупречной скорости загрузки, адаптивности Mobile-First и оптимизации для локального SEO в Google Maps.`,
                      zh: `我们交付项目的成功建立在对您客户需求的精准技术调整之上。为 ${carDetails} 车辆提供 ${modelData.name} 服务的网站，不仅需要美观的布局，更需要极速的加载速度、移动优先（Mobile-First）响应式设计以及谷歌地图本地 SEO 的精准优化。`
                    };
                    return carDescMap[lang as Locale] || carDescMap.en;
                  } else {
                    const normalDescMap = {
                      pl: `Skuteczność naszych wdrożeń opiera się na precyzyjnym dopasowaniu technologii do potrzeb ${terms.target}. ${terms.spec.charAt(0).toUpperCase() + terms.spec.slice(1)} ${modelData.name} wymaga nie tylko estetycznej strony, lecz przede wszystkim bezbłędnej optymalizacji czasu ładowania, responsywności (Mobile-First) oraz integracji z lokalnymi Mapami Google.`,
                      en: `Our implementations' success rests on precise technological adjustments to the needs of your ${terms.target}. The ${terms.spec} ${modelData.name} demands not only an aesthetic layout, but above all flawless load speed, Mobile-First responsiveness, and Google Maps local SEO alignment.`,
                      de: `Der Erfolg unserer Implementierungen basiert auf der präzisen technologischen Anpassung an die Bedürfnisse Ihrer ${terms.target}. ${(terms.spec.charAt(0).toUpperCase() + terms.spec.slice(1))} ${modelData.name} erfordert nicht nur ein ästhetisches Layout, sondern vor allem eine fehlerfreie Ladegeschwindigkeit, Mobile-First-Responsivität und die Ausrichtung auf lokales Google Maps SEO.`,
                      uk: `Успіх наших впроваджень ґрунтується на точному технологічному налаштуванні під потреби ваших ${terms.target}. Для ${terms.spec} ${modelData.name} потрібен не лише естетичний макет, але, перш за все, бездоганна швидкість завантаження, адаптивність Mobile-First та оптимізації для локального SEO в Google Maps.`,
                      ru: `Успех наших внедрений основан на точном технологическом соответствии потребностям ваших ${terms.target}. Для ${terms.spec} ${modelData.name} требуется не только эстетичный макет, но и, прежде всего, безупречная скорость загрузки, адаптивность Mobile-First и оптимизация для локального SEO в Google Maps.`,
                      zh: `我们交付项目的成功建立在对您 ${terms.target} 需求的精准技术调整之上。${modelData.name}${terms.spec}不仅需要美观的布局，更需要极速的加载速度、移动优先（Mobile-First）响应式设计以及谷歌地图本地 SEO 的精准优化。`
                    };
                    return normalDescMap[lang as Locale] || normalDescMap.en;
                  }
                })()}
              </p>

              {wikiData?.wiki?.description && (
                <div className="bg-slate-50 dark:bg-slate-950/20 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 my-6 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 uppercase">
                    Kontekst pojazdu: {carDetails}
                  </h3>
                  <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                    {typeof wikiData.wiki.description === 'string' 
                      ? wikiData.wiki.description 
                      : (wikiData.wiki.description[lang] || wikiData.wiki.description.pl)}
                  </p>
                  <div className="mt-4 text-xs font-bold text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
                    {(() => {
                      const disclaimerMap = {
                        pl: `*Powyższa specyfikacja modelu służy zasileniu parametrów semantycznych pod kątem pozycjonowania SEO oferty wdrożeniowej ${seriesData.title} dla aut ${carDetails}.`,
                        en: `*The above vehicle description serves to enrich the semantic context for SEO ranking of our ${seriesData.title} integrations dedicated for ${carDetails} cars.`,
                        de: `*Die obige Fahrzeugbeschreibung dient dazu, den semantischen Kontext für das SEO-Ranking unserer für ${carDetails}-Fahrzeuge optimierten ${seriesData.title}-Integrationen zu bereichern.`,
                        uk: `*Наведена вище специфікація моделі служить для збагачення семантичного контексту для SEO-просування пропозиції з розробки ${seriesData.title} для автомобілів ${carDetails}.`,
                        ru: `*Приведенная выше спецификация модели служит для обогащения семантического контекста для SEO-продвижения предложения по разработке ${seriesData.title} для автомобилей ${carDetails}.`,
                        zh: `*以上车型描述旨在丰富针对 ${carDetails} 汽车的 ${seriesData.title} 集成开发服务在 SEO 排名中的语义上下文。`
                      };
                      return disclaimerMap[lang as Locale] || disclaimerMap.en;
                    })()}
                  </div>
                </div>
              )}
              
              <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  {ui.actionsTitle}
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✔</span>
                    <span>
                      {(() => {
                        const item1Map = {
                          pl: { title: "Lokalny SEO & Schema markup", text: `Wdrożenie struktur danych JSON-LD typu ${terms.schemaType} dla szybkiej indeksacji usług.` },
                          en: { title: "Local SEO & Schema markup", text: `Implementing JSON-LD schemas like ${terms.schemaType} for rapid indexing.` },
                          de: { title: "Lokales SEO & Schema-Markup", text: `Implementierung von JSON-LD-Schemas wie ${terms.schemaType} für eine schnelle Indexierung.` },
                          uk: { title: "Локальне SEO та розмітка Schema", text: `Впровадження схем JSON-LD типу ${terms.schemaType} для швидкої індексації.` },
                          ru: { title: "Локальное SEO и разметка Schema", text: `Внедрение схем JSON-LD типа ${terms.schemaType} для быстрой индексации.` },
                          zh: { title: "本地 SEO 与 Schema 结构化数据", text: `部署像 ${terms.schemaType} 这样的 JSON-LD 结构化数据，以实现快速索引。` }
                        };
                        const item = item1Map[lang as Locale] || item1Map.en;
                        return <><strong>{item.title}:</strong> {item.text}</>;
                      })()}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✔</span>
                    <span>
                      {(() => {
                        const item2Map = {
                          pl: { title: "Współczynnik konwersji (CRO)", text: `Projektowanie ${terms.pathway} ułatwiających ${terms.action} w mniej niż 3 kliknięcia.` },
                          en: { title: "Conversion Rate Optimization (CRO)", text: `Designing ${terms.pathway} that facilitate ${terms.action} in under 3 clicks.` },
                          de: { title: "Conversion-Rate-Optimierung (CRO)", text: `Gestaltung von ${terms.pathway}, die ${terms.action} in weniger als 3 Klicks ermöglichen.` },
                          uk: { title: "Оптимізація конверсії (CRO)", text: `Проектування ${terms.pathway}, які спрощують ${terms.action} менш ніж за 3 кліки.` },
                          ru: { title: "Оптимизация конверсии (CRO)", text: `Проектирование ${terms.pathway}, облегчающих ${terms.action} менее чем за 3 клика.` },
                          zh: { title: "转化率优化 (CRO)", text: `设计能够让用户在 3 次点击内${terms.action}的${terms.pathway}。` }
                        };
                        const item = item2Map[lang as Locale] || item2Map.en;
                        return <><strong>{item.title}:</strong> {item.text}</>;
                      })()}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✔</span>
                    <span>
                      {(() => {
                        const item3Map = {
                          pl: { title: "Szybkość i Wydajność (Core Web Vitals)", text: "Optymalizacja pod kątem wyniku 100/100 na urządzeniach mobilnych, co bezpośrednio podnosi pozycję w rankingu." },
                          en: { title: "Core Web Vitals Speed", text: "Optimizing for 100/100 Mobile PageSpeed scores, which directly boosts rankings." },
                          de: { title: "Core Web Vitals Geschwindigkeit", text: "Optimierung für ein 100/100 Mobile PageSpeed Score, was die Rankings direkt steigert." },
                          uk: { title: "Швидкість Core Web Vitals", text: "Оптимізація для оцінки 100/100 Mobile PageSpeed, що безпосередньо підвищує позиції в рейтингу." },
                          ru: { title: "Скорость Core Web Vitals", text: "Оптимизация для оценки 100/100 Mobile PageSpeed, что напрямую повышает позиции в рейтинге." },
                          zh: { title: "核心网页指标速度 (Core Web Vitals)", text: "优化移动端 PageSpeed 分数达到 100/100，直接提升搜索排名。" }
                        };
                        const item = item3Map[lang as Locale] || item3Map.en;
                        return <><strong>{item.title}:</strong> {item.text}</>;
                      })()}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Keywords Cloud */}
              <div className="pt-4">
                <h3 className="font-bold text-md mb-3 text-slate-500 dark:text-slate-450 uppercase tracking-widest text-xs">
                  {ui.keywordsTitle}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {keywordCloud.map((keyword, i) => (
                    <span key={i} className="py-1 px-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Call to Action */}
            <div className="md:col-span-5 glass-card relative overflow-hidden text-center p-8">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="font-black text-xl mb-4 uppercase tracking-tight text-slate-900 dark:text-white">
                {(() => {
                  const getMoreHeading = {
                    pl: `Zdobądź Więcej ${terms.targetAccusative}`,
                    en: `Get More ${terms.targetAccusative}`,
                    de: `Gewinnen Sie mehr ${terms.targetAccusative}`,
                    uk: `Залучайте більше ${terms.targetAccusative}`,
                    ru: `Привлекайте больше ${terms.targetAccusative}`,
                    zh: `获取更多${terms.targetAccusative}`
                  };
                  return getMoreHeading[lang as Locale] || getMoreHeading.en;
                })()}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-450 mb-6 leading-relaxed">
                {(() => {
                  if (carDetails) {
                    const carCtaMap = {
                      pl: `Zamów dedykowane rozwiązanie ${seriesData.title} dla swojej firmy oferującej ${modelData.name} ${carDetails} w lokalizacji ${cityName}. Przygotujemy ofertę dopasowaną do Twojego budżetu.`,
                      en: `Order a custom ${seriesData.title} optimized for your business offering ${modelData.name} ${carDetails} in ${cityName}. We will prepare a personalized estimate.`,
                      de: `Bestellen Sie eine maßgeschneiderte ${seriesData.title}-Lösung für Ihr Unternehmen, das ${modelData.name} ${carDetails} in ${cityName} anbietet. Wir erstellen ein auf Ihr Budget zugeschnittenes Angebot.`,
                      uk: `Замовте індивідуальне рішення ${seriesData.title} для вашої компанії, що пропонує ${modelData.name} ${carDetails} у ${cityName}. Ми підготуємо персоналізовану пропозицію.`,
                      ru: `Закажите индивидуальное решение ${seriesData.title} для вашей компании, предлагающей ${modelData.name} ${carDetails} в ${cityName}. Мы подготовим индивидуальное предложение.`,
                      zh: `为您在 ${cityName} 提供 ${modelData.name} ${carDetails} 服务的业务订制专属的 ${seriesData.title} 方案。我们将为您准备个性化的报价。`
                    };
                    return carCtaMap[lang as Locale] || carCtaMap.en;
                  } else {
                    const normalCtaMap = {
                      pl: `Zamów dedykowane rozwiązanie ${seriesData.title} zoptymalizowane pod kątem ${terms.spec} ${modelData.name} w lokalizacji ${cityName}. Przygotujemy ofertę dopasowaną do Twojego budżetu.`,
                      en: `Order a custom ${seriesData.title} optimized for your ${terms.spec} ${modelData.name} in ${cityName}. We will prepare a personalized estimate.`,
                      de: `Bestellen Sie eine maßgeschneiderte ${seriesData.title}-Lösung, die für Ihre ${terms.spec} ${modelData.name} in ${cityName} optimiert ist. Wir erstellen ein auf Ihr Budget zugeschnittenes Angebot.`,
                      uk: `Замовте індивідуальне рішення ${seriesData.title}, оптимізоване для вашої ${terms.spec} ${modelData.name} у ${cityName}. Ми підготуємо персоналізовану пропозицію.`,
                      ru: `Закажите индивидуальное решение ${seriesData.title}, оптимизированное для вашей ${terms.spec} ${modelData.name} в ${cityName}. Мы подготовим индивидуальное предложение.`,
                      zh: `订制专为 ${cityName} 的 ${modelData.name}${terms.spec} 优化的 ${seriesData.title} 方案。我们将根据您的预算制作专属报价。`
                    };
                    return normalCtaMap[lang as Locale] || normalCtaMap.en;
                  }
                })()}
              </p>
              <a href="#kontakt" className="btn-primary w-full block py-3 rounded-xl text-md font-bold uppercase tracking-wider shadow-md hover:shadow-lg">
                {ui.freeValuation}
              </a>
            </div>
          </div>
        </div>
      </section>
    </BlurReveal>

      {/* Formularz Kontaktowy */}
      <BlurReveal delay={300}>
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
        </BlurReveal>
      </main>
  );
}
