import fs from 'fs';
import path from 'path';
import Script from 'next/script';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getIndustryById } from '@/lib/industries';
import { getCityBySlug } from '@/lib/cities';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale, ogLocaleMap } from '../../../../dictionaries';
import ContactForm from '@/components/ContactForm';
import { 
  industrySlugsMap, 
  professionSlugsMap, 
  IndustryId, 
  ProfessionId,
  industryModelsMap
} from '@/lib/industries-list';
import { getBrandBySlug, getModelBySlug, getBrandLogo, getWikiData } from '@/lib/brands';
import { getTechnologyById } from '@/lib/technology';
import TechnologyCloud from '@/components/TechnologyCloud';

// Import components and constants
import { ECOMMERCE_UI } from './constants';
import HeroSection from './_components/HeroSection';
import SpecializationDetails from './_components/SpecializationDetails';
import EcommerceShowcase from './_components/EcommerceShowcase';
import AutomotiveSeoCloud from './_components/AutomotiveSeoCloud';
import NonAutomotiveSeoCloud from './_components/NonAutomotiveSeoCloud';

import { BlurReveal } from '@/components/ui/BlurReveal';

interface PageProps {
  params: Promise<{
    lang: string;
    city: string;
    brand: string;
    model: string;
  }>;
  searchParams: Promise<{
    carBrand?: string;
    carModel?: string;
    carSeries?: string;
    tech?: string;
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
  
  const paramsList = [];
  for (const lang of langs) {
    for (const city of cities) {
      for (const industry of industriesList) {
        const professions = industryModelsMap[industry];
        for (const profession of professions) {
          paramsList.push({ lang, city, brand: industry, model: profession });
        }
      }
    }
  }
  return paramsList;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, brand: industryId, model: professionId } = await params;
  const searchParamsData = await searchParams;
  const carBrandSlug = typeof searchParamsData?.carBrand === 'string' ? searchParamsData.carBrand : null;
  const carModelSlug = typeof searchParamsData?.carModel === 'string' ? searchParamsData.carModel : null;
  const carSeriesSlug = typeof searchParamsData?.carSeries === 'string' ? searchParamsData.carSeries : null;
  const tech = typeof searchParamsData?.tech === 'string' ? searchParamsData.tech : null;

  const techData = tech ? getTechnologyById(tech) : null;
  const techTrans = techData?.translations[lang as Locale];
  const techSuffix = techTrans ? ` (${techData.name})` : '';

  const industry = getIndustryById(industryId as IndustryId);
  if (!industry) return {};

  const city = citySlug === 'all' ? null : getCityBySlug(citySlug);
  const cityName = city ? city.name : 'Warszawa';
  const trans = industry.translations[lang as Locale];
  
  if (!trans) return {};

  const modelData = trans.models[professionId as ProfessionId];
  if (!modelData) return {};

  const localizedProfession = modelData.name;

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
      ? `${localizedProfession} (${carDetails})${techSuffix} - Strony WWW i IT ${cityName} | webwawa.pl`
      : `Systemy IT i strony WWW${techSuffix} dla: ${localizedProfession} - ${cityName} | webwawa.pl`,
    en: carDetails
      ? `${localizedProfession} (${carDetails})${techSuffix} - Websites & IT ${cityName} | webwawa.pl`
      : `Websites & IT Solutions${techSuffix} for ${localizedProfession} - ${cityName} | webwawa.pl`,
    de: carDetails
      ? `${localizedProfession} (${carDetails})${techSuffix} - Webseiten & IT ${cityName} | webwawa.pl`
      : `IT-Systeme und Webseiten${techSuffix} für: ${localizedProfession} - ${cityName} | webwawa.pl`,
    uk: carDetails
      ? `${localizedProfession} (${carDetails})${techSuffix} - Сайти та IT-послуги ${cityName} | webwawa.pl`
      : `IT-системи та сайти${techSuffix} для: ${localizedProfession} - ${cityName} | webwawa.pl`,
    ru: carDetails
      ? `${localizedProfession} (${carDetails})${techSuffix} - Сайты и IT-услуги ${cityName} | webwawa.pl`
      : `IT-системы и сайты${techSuffix} для: ${localizedProfession} - ${cityName} | webwawa.pl`,
    zh: carDetails
      ? `${localizedProfession} (${carDetails})${techSuffix} - 网站与 IT 服务 ${cityName} | webwawa.pl`
      : `${localizedProfession}专属 IT 系统与 网站建设${techSuffix} - ${cityName} | webwawa.pl`
  };

  const metaDescriptions = {
    pl: carDetails
      ? `Projektowanie stron i systemów IT dla: ${localizedProfession} dedykowanych dla samochodów ${carDetails} w lokalizacji ${cityName}.`
      : `Projektowanie profesjonalnych stron WordPress, szybkich aplikacji PWA i lokalne pozycjonowanie SEO dla profesji: ${localizedProfession} w lokalizacji ${cityName}. Sprawdź ofertę.`,
    en: carDetails
      ? `Web design and IT systems for ${localizedProfession} customized for ${carDetails} vehicles in ${cityName}.`
      : `Custom WordPress sites, PWA applications, and local map SEO rankings for ${localizedProfession} in ${cityName}. Attract clients today.`,
    de: carDetails
      ? `Webdesign und IT-Systeme für: ${localizedProfession}, angepasst für ${carDetails}-Fahrzeuge in ${cityName}.`
      : `Professionelles WordPress-Webdesign, schnelle PWA-Anwendungen und lokales SEO für die Spezialisierung: ${localizedProfession} in ${cityName}. Angebot ansehen.`,
    uk: carDetails
      ? `Розробка сайтів та IT-систем для: ${localizedProfession}, адаптованих під автомобілі ${carDetails} у ${cityName}.`
      : `Розробка професійних сайтів WordPress, швидких додатків PWA та локальне просування SEO для спеціалізації: ${localizedProfession} у ${cityName}. Переглянути пропозицію.`,
    ru: carDetails
      ? `Разработка сайтов и IT-систем для: ${localizedProfession}, адаптированных под автомобили ${carDetails} в ${cityName}.`
      : `Разработка профессиональных сайтов WordPress, быстрых приложений PWA и локальное продвижение SEO для специализации: ${localizedProfession} в ${cityName}. Посмотреть предложение.`,
    zh: carDetails
      ? `在 ${cityName} 专为 ${localizedProfession} 设计并针对 ${carDetails} 车辆优化的网站与 IT 系统。`
      : `为在 ${cityName} 的 ${localizedProfession} 行业提供专业的 WordPress 网站设计、极速 PWA 应用开发和本地地图 SEO 排名优化。查看报价。`
  };

  const title = metaTitles[lang as Locale] || metaTitles.en;
  let description = metaDescriptions[lang as Locale] || metaDescriptions.en;

  if (techTrans) {
    description = `${techTrans.description} ${description}`;
  }

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const parentSlug = lang === 'pl' ? 'strona-dla' : 
                     lang === 'en' ? 'website-for' : 
                     lang === 'de' ? 'webseite-fuer' : 
                     lang === 'uk' ? 'sayt-dlya' : 
                     lang === 'ru' ? 'sayt-dlya' : 'website-for';
  const techSuffixUrl = tech ? `/${tech}` : '';
  const canonicalUrl = citySlug === 'all'
    ? `https://webwawa.pl${langPrefix}/${parentSlug}/${industrySlugsMap[industryId as IndustryId][lang as Locale]}/${professionSlugsMap[professionId as ProfessionId][lang as Locale]}${techSuffixUrl}`
    : `https://webwawa.pl${langPrefix}/${citySlug}/${industrySlugsMap[industryId as IndustryId][lang as Locale]}/${professionSlugsMap[professionId as ProfessionId][lang as Locale]}${techSuffixUrl}`;

  let imageUrl = `https://webwawa.pl/images/industries/${industryId}/${professionId}.png`;
  const modelSvgPath = path.join(process.cwd(), 'public', 'images', 'industries', industryId, `${professionId}.svg`);
  if (fs.existsSync(modelSvgPath)) {
    imageUrl = `https://webwawa.pl/images/industries/${industryId}/${professionId}.svg`;
  } else {
    const modelPngPath = path.join(process.cwd(), 'public', 'images', 'industries', industryId, `${professionId}.png`);
    if (!fs.existsSync(modelPngPath)) {
      const mainSvgPath = path.join(process.cwd(), 'public', 'images', 'industries', industryId, 'main.svg');
      if (fs.existsSync(mainSvgPath)) {
        imageUrl = `https://webwawa.pl/images/industries/${industryId}/main.svg`;
      } else {
        imageUrl = `https://webwawa.pl/images/industries/${industryId}/main.png`;
      }
    }
  }

  const brandLogo = carBrandSlug ? getBrandLogo(carBrandSlug) : null;
  const wikiData = carBrandSlug && carModelSlug ? getWikiData(carBrandSlug, carModelSlug) : null;
  const finalImageUrl = wikiData?.specs?.motofaktyImage || wikiData?.wiki?.imageUrl;

  const brandLogoUrl = brandLogo ? (brandLogo.startsWith('http') ? brandLogo : `https://webwawa.pl${brandLogo}`) : null;
  const ogImages = [];
  if (finalImageUrl) {
    ogImages.push({
      url: finalImageUrl,
      width: 1200,
      height: 630,
      alt: title,
    });
  }
  if (brandLogoUrl) {
    ogImages.push({
      url: brandLogoUrl,
      width: 400,
      height: 400,
      alt: `${carBrandSlug} Logo`,
    });
  }
  if (ogImages.length === 0) {
    ogImages.push({
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: title,
    });
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
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map(img => img.url),
    }
  };
}

export default async function IndustryModelPage({ params, searchParams }: PageProps) {
  const { lang, city: citySlug, brand: industryId, model: professionId } = await params;
  const searchParamsData = await searchParams;
  const carBrandSlug = typeof searchParamsData?.carBrand === 'string' ? searchParamsData.carBrand : null;
  const carModelSlug = typeof searchParamsData?.carModel === 'string' ? searchParamsData.carModel : null;
  const carSeriesSlug = typeof searchParamsData?.carSeries === 'string' ? searchParamsData.carSeries : null;
  const tech = typeof searchParamsData?.tech === 'string' ? searchParamsData.tech : null;

  const techData = tech ? getTechnologyById(tech) : null;
  const techTrans = techData?.translations[lang as Locale];
  const techSuffix = techTrans ? ` + ${techData.name}` : '';

  const industry = getIndustryById(industryId as IndustryId);
  if (!industry) notFound();

  const city = citySlug === 'all' ? null : getCityBySlug(citySlug);
  if (citySlug !== 'all' && !city) notFound();

  const trans = industry.translations[lang as Locale];
  if (!trans) notFound();

  const modelData = trans.models[professionId as ProfessionId];
  if (!modelData) notFound();

  const settings = await getGlobalSettings();
  const dict = await getDictionary(lang as Locale);
  const isPl = lang === 'pl';
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  const cityName = city ? city.name : (isPl ? 'Warszawa / cała Polska' : 'Warsaw');

  // Full multilingual UI strings
  const uiStrings = {
    pl: {
      h1Prefix: 'Projektowanie i SEO dla:',
      heroSubWith: (name: string, car: string, city: string) => `Tworzenie dedykowanych rozwiązań internetowych oraz pozycjonowanie specjalizacji ${name} dla pojazdów ${car} w regionie ${city}.`,
      heroSubWithout: (name: string, city: string) => `Tworzenie dedykowanych rozwiązań internetowych oraz pozycjonowanie specjalizacji ${name} w regionie ${city}.`,
      profBadge: 'Specyfika profesji',
      profHeading: (name: string) => `Jak rozwinąć specjalizację ${name}?`,
      vehicleContext: 'Kontekst pojazdu:',
      vehicleDisclaimer: (car: string) => `*Powyższa specyfikacja modelu służy zasileniu parametrów semantycznych pod kątem pozycjonowania SEO oferty dedykowanej dla aut ${car}.`,
      googleRankHeading: 'Co wpływa najbardziej na pozycję w Google?',
      implementationHeading: 'Wymagania i standardy wdrożenia:',
      dedicatedServices: 'Dedykowane Usługi',
      seeDetails: 'Zobacz szczegóły oferty',
      brandsHeading: (prof: string) => `${prof} – inne marki samochodowe`,
      servicesHeading: (brand: string) => `Inne usługi IT dla branży motoryzacyjnej${brand ? ` (${brand})` : ''}`,
      citiesHeading: 'Ta sama usługa w innych dzielnicach i miastach',
      disclaimer: 'webwawa.pl – projektujemy strony WWW i systemy IT dla branży motoryzacyjnej w Warszawie i okolicach. Powyższe linki prowadzą do dedykowanych ofert dla poszczególnych marek, specjalizacji i lokalizacji.',
    },
    en: {
      h1Prefix: 'Web Design & SEO for:',
      heroSubWith: (name: string, car: string, city: string) => `Designing custom digital products and high-ranking local SEO for ${name} specialized for ${car} vehicles in ${city}.`,
      heroSubWithout: (name: string, city: string) => `Designing custom digital products and high-ranking local SEO for ${name} in ${city}.`,
      profBadge: 'Profession overview',
      profHeading: (name: string) => `How to grow your ${name} business?`,
      vehicleContext: 'Vehicle context:',
      vehicleDisclaimer: (car: string) => `*The above vehicle description enriches the semantic context for SEO ranking of our solutions dedicated for ${car} vehicles.`,
      googleRankHeading: 'Key factors affecting Google rankings:',
      implementationHeading: 'Implementation standards & requirements:',
      dedicatedServices: 'Dedicated Services',
      seeDetails: 'See service details',
      brandsHeading: (prof: string) => `${prof} – other car brands`,
      servicesHeading: (brand: string) => `Other IT services for automotive${brand ? ` (${brand})` : ''}`,
      citiesHeading: 'Same service in other districts & cities',
      disclaimer: 'webwawa.pl – we build websites & IT systems for the automotive industry in Warsaw and surrounding area.',
    },
    de: {
      h1Prefix: 'Webdesign & SEO für:',
      heroSubWith: (name: string, car: string, city: string) => `Wir entwickeln maßgeschneiderte digitale Lösungen und lokales SEO für ${name} spezialisiert auf ${car}-Fahrzeuge in ${city}.`,
      heroSubWithout: (name: string, city: string) => `Maßgeschneiderte Webentwicklung und lokales SEO für ${name} in ${city}.`,
      profBadge: 'Berufsübersicht',
      profHeading: (name: string) => `Wie wächst Ihr ${name}-Unternehmen?`,
      vehicleContext: 'Fahrzeugkontext:',
      vehicleDisclaimer: (car: string) => `*Die obige Fahrzeugbeschreibung dient der semantischen Anreicherung für das SEO-Ranking unserer Lösungen für ${car}-Fahrzeuge.`,
      googleRankHeading: 'Wichtige Google-Rankingfaktoren:',
      implementationHeading: 'Implementierungsstandards & Anforderungen:',
      dedicatedServices: 'Dedizierte Dienste',
      seeDetails: 'Details anzeigen',
      brandsHeading: (prof: string) => `${prof} – andere Automarken`,
      servicesHeading: (brand: string) => `Weitere IT-Dienste für die Automobilbranche${brand ? ` (${brand})` : ''}`,
      citiesHeading: 'Gleicher Service in anderen Bezirken & Städten',
      disclaimer: 'webwawa.pl – wir entwickeln Websites & IT-Systeme für die Automobilbranche in Warschau und Umgebung.',
    },
    uk: {
      h1Prefix: 'Веб-дизайн та SEO для:',
      heroSubWith: (name: string, car: string, city: string) => `Розробка індивідуальних цифрових рішень та локальне SEO для ${name} з орієнтацією на автомобілі ${car} у ${city}.`,
      heroSubWithout: (name: string, city: string) => `Розробка індивідуальних веб-рішень та локальне SEO для ${name} у ${city}.`,
      profBadge: 'Огляд спеціалізації',
      profHeading: (name: string) => `Як розвивати бізнес у сфері ${name}?`,
      vehicleContext: 'Контекст автомобіля:',
      vehicleDisclaimer: (car: string) => `*Наведений опис автомобіля збагачує семантичний контекст для SEO-ранжування наших рішень, присвячених ${car}.`,
      googleRankHeading: 'Ключові фактори ранжування у Google:',
      implementationHeading: 'Стандарти та вимоги впровадження:',
      dedicatedServices: 'Спеціалізовані послуги',
      seeDetails: 'Дивитися деталі',
      brandsHeading: (prof: string) => `${prof} – інші автомобільні марки`,
      servicesHeading: (brand: string) => `Інші IT-послуги для автомобільної галузі${brand ? ` (${brand})` : ''}`,
      citiesHeading: 'Та сама послуга в інших районах і містах',
      disclaimer: 'webwawa.pl – розробляємо сайти та IT-системи для автомобільного бізнесу у Варшаві та регіоні.',
    },
    ru: {
      h1Prefix: 'Веб-дизайн и SEO для:',
      heroSubWith: (name: string, car: string, city: string) => `Разработка индивидуальных цифровых решений и локальное SEO для ${name} с ориентацией на автомобили ${car} в ${city}.`,
      heroSubWithout: (name: string, city: string) => `Разработка индивидуальных веб-решений и локальное SEO для ${name} в ${city}.`,
      profBadge: 'Обзор специализации',
      profHeading: (name: string) => `Как развивать бизнес в сфере ${name}?`,
      vehicleContext: 'Контекст автомобиля:',
      vehicleDisclaimer: (car: string) => `*Описание автомобиля обогащает семантический контекст для SEO-ранжирования наших решений, посвящённых ${car}.`,
      googleRankHeading: 'Ключевые факторы ранжирования в Google:',
      implementationHeading: 'Стандарты и требования внедрения:',
      dedicatedServices: 'Специализированные услуги',
      seeDetails: 'Смотреть детали',
      brandsHeading: (prof: string) => `${prof} – другие автомобильные марки`,
      servicesHeading: (brand: string) => `Другие IT-услуги для автомобильной отрасли${brand ? ` (${brand})` : ''}`,
      citiesHeading: 'Та же услуга в других районах и городах',
      disclaimer: 'webwawa.pl – разрабатываем сайты и IT-системы для автомобильного бизнеса в Врашаве и регионе.',
    },
    zh: {
      h1Prefix: '网页设计与SEO：',
      heroSubWith: (name: string, car: string, city: string) => `为${city}专注${car}车型的${name}企业提供定制数字解决方案及本地SEO优化服务。`,
      heroSubWithout: (name: string, city: string) => `为${city}的${name}企业提供定制网站开发与本地SEO排名服务。`,
      profBadge: '专业概览',
      profHeading: (name: string) => `如何发展您的${name}业务？`,
      vehicleContext: '车辆背景：',
      vehicleDisclaimer: (car: string) => `*以上车辆描述用于丰富我们面向${car}车型解决方案的语义SEO优化背景。`,
      googleRankHeading: 'Google排名关键因素：',
      implementationHeading: '实施标准与要求：',
      dedicatedServices: '专属服务',
      seeDetails: '查看服务详情',
      brandsHeading: (prof: string) => `${prof} – 其他汽车品牌`,
      servicesHeading: (brand: string) => `其他汽车行业IT服务${brand ? `（${brand}）` : ''}`,
      citiesHeading: '同一服务覆盖其他区域与城市',
      disclaimer: 'webwawa.pl – 为华沙及周边地区汽车行业提供网站开发与IT系统服务。',
    },
  };
  const t = uiStrings[lang as keyof typeof uiStrings] || uiStrings.en;

  // Resolve car details for contextual B2B customizations
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

  const wikiData = carBrandSlug && carModelSlug ? getWikiData(carBrandSlug, carModelSlug) : null;
  const finalImageUrl = wikiData?.specs?.motofaktyImage || wikiData?.wiki?.imageUrl;
  const brandLogo = carBrandSlug ? getBrandLogo(carBrandSlug) : null;

  let imageRelativePath = `/images/industries/${industryId}/${professionId}.svg`;
  let imageFileSystemPath = path.join(process.cwd(), 'public', imageRelativePath);
  if (!fs.existsSync(imageFileSystemPath)) {
    imageRelativePath = `/images/industries/${industryId}/${professionId}.png`;
    imageFileSystemPath = path.join(process.cwd(), 'public', imageRelativePath);
  }
  
  let heroImageSrc = '/images/workspace_code.png';
  if (finalImageUrl) {
    heroImageSrc = finalImageUrl;
  } else if (fs.existsSync(imageFileSystemPath)) {
    heroImageSrc = imageRelativePath;
  } else {
    const mainSvgPath = `/images/industries/${industryId}/main.svg`;
    if (fs.existsSync(path.join(process.cwd(), 'public', mainSvgPath))) {
      heroImageSrc = mainSvgPath;
    } else {
      const mainPngPath = `/images/industries/${industryId}/main.png`;
      if (fs.existsSync(path.join(process.cwd(), 'public', mainPngPath))) {
        heroImageSrc = mainPngPath;
      }
    }
  }

  const industrySlug = industrySlugsMap[industryId as IndustryId][lang as Locale];
  const professionSlug = professionSlugsMap[professionId as ProfessionId][lang as Locale];

  const parentSlug = lang === 'pl' ? 'strona-dla' : 
                     lang === 'en' ? 'website-for' : 
                     lang === 'de' ? 'webseite-fuer' : 
                     lang === 'uk' ? 'sayt-dlya' : 
                     lang === 'ru' ? 'sayt-dlya' : 'website-for';

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${modelData.name} - Usługi IT & Marketing`,
    "description": modelData.about,
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
            }
          ]
      )
    ]
  };

  const ecomUi = ECOMMERCE_UI[lang as keyof typeof ECOMMERCE_UI] || ECOMMERCE_UI.pl;

  const faqJsonLd = professionId === 'carParts' ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": ecomUi.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
      <Script
        id={`ldjson-model-${industryId}-${professionId}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify([jsonLd, breadcrumbListJsonLd, faqJsonLd].filter(Boolean)) 
        }}
      />

      <BlurReveal delay={100}>
        <HeroSection
          lang={lang}
          homeUrl={homeUrl}
          city={city}
          brandUrl={brandUrl}
          industryName={trans.industryName}
          modelName={modelData.name}
          brandLogo={brandLogo}
          carBrandSlug={carBrandSlug}
          t={t}
          carDetails={carDetails}
          techSuffix={techSuffix}
          cityName={cityName}
          heroImageSrc={heroImageSrc}
        />
      </BlurReveal>

      <BlurReveal delay={200}>
        <SpecializationDetails
          lang={lang}
          cityName={cityName}
          carDetails={carDetails}
          t={t}
          modelData={modelData}
          techTrans={techTrans}
          wikiData={wikiData}
          trans={trans}
          carBrandSlug={carBrandSlug}
          carModelSlug={carModelSlug}
          carSeriesSlug={carSeriesSlug}
          langPrefix={langPrefix}
          parentSlug={parentSlug}
          industrySlug={industrySlug}
          professionSlug={professionSlug}
          citySlug={citySlug}
          city={city}
        />
      </BlurReveal>

      {professionId === 'carParts' && (
        <BlurReveal delay={300}>
          <EcommerceShowcase lang={lang} ecomUi={ecomUi} />
        </BlurReveal>
      )}

      {/* FAQ dla technologii */}
      {techTrans?.faq && techTrans.faq.length > 0 && (
        <BlurReveal delay={400}>
          <section className="py-20 bg-slate-100/50 dark:bg-slate-900/10 border-t border-slate-200 dark:border-slate-900/40">
            <div className="container mx-auto px-4 max-w-3xl">
            <h3 className="text-2xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white mb-8 text-center">
              FAQ – {techData?.name} w specjalizacji {modelData.name}
            </h3>
            <div className="space-y-4">
              {techTrans.faq.map((item, fIdx) => (
                <div key={fIdx} className="p-6 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-2">
                    {item.q}
                  </h4>
                  <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
            </div>
          </section>
        </BlurReveal>
      )}

      {/* Chmura tagów technologii pod SEO */}
      <BlurReveal delay={500}>
        <section className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900/40">
          <div className="container mx-auto px-4 max-w-5xl">
          <TechnologyCloud
            lang={lang as Locale}
            city={citySlug}
            industryId={industryId as IndustryId}
            professionId={professionId as ProfessionId}
            activeTech={tech || undefined}
          />
          </div>
        </section>
      </BlurReveal>

      {/* Formularz Kontaktowy */}
      <BlurReveal delay={600}>
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

      <BlurReveal delay={700}>
        {industryId === 'automotive' ? (
          <AutomotiveSeoCloud
            lang={lang}
            carBrandSlug={carBrandSlug}
            carModelSlug={carModelSlug}
            professionId={professionId}
            modelName={modelData.name}
            industrySlug={industrySlug}
            professionSlug={professionSlug}
            parentSlug={parentSlug}
            langPrefix={langPrefix}
            t={t}
            trans={trans}
          />
        ) : (
          <NonAutomotiveSeoCloud
            lang={lang}
            industryId={industryId}
            professionId={professionId}
            modelData={modelData}
            trans={trans}
            city={city}
            industrySlug={industrySlug}
            professionSlug={professionSlug}
            parentSlug={parentSlug}
            langPrefix={langPrefix}
          />
        )}
      </BlurReveal>
    </main>
  );
}
