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
import { getBrandBySlug, getModelBySlug, getBrandLogo, getWikiData, getAllBrands } from '@/lib/brands';

// Popular car brands for SEO tag cloud internal links
const POPULAR_BRAND_SLUGS = [
  'bmw', 'mercedes-benz', 'audi', 'volkswagen', 'toyota', 'ford',
  'opel', 'skoda', 'renault', 'peugeot', 'honda', 'hyundai',
  'kia', 'volvo', 'seat', 'mazda', 'nissan', 'fiat',
  'porsche', 'lexus', 'subaru', 'mitsubishi'
];

// All automotive professions for cross-linking
const AUTOMOTIVE_PROFESSIONS = [
  { id: 'carRental', slugPl: 'wynajem-aut', emojiIcon: '🚗' },
  { id: 'leasing', slugPl: 'leasing-samochodowy', emojiIcon: '📋' },
  { id: 'carBuying', slugPl: 'skup-aut', emojiIcon: '💰' },
  { id: 'mechanic', slugPl: 'mechanik', emojiIcon: '🔧' },
  { id: 'carParts', slugPl: 'czesci-samochodowe', emojiIcon: '⚙️' },
] as const;

// Key Warsaw districts + nearby cities for regional SEO links (non-automotive)
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

// Related industries map for cross-linking (non-automotive)
const RELATED_INDUSTRIES: Record<IndustryId, IndustryId[]> = {
  doctor: ['psychologist', 'beauty'],
  lawyer: ['accountant'],
  psychologist: ['doctor', 'beauty'],
  accountant: ['lawyer'],
  architect: ['construction'],
  construction: ['architect'],
  beauty: ['psychologist'],
  automotive: [],
};

// Model-level UI translation strings for non-automotive
const MODEL_UI = {
  pl: {
    specHeading: (ind: string) => `Inne specjalizacje: ${ind}`,
    locationsHeading: (prof: string) => `${prof} – Warszawa i okolice`,
    relatedHeading: 'Podobne branże',
    disclaimer: (prof: string, ind: string) => `webwawa.pl – projektujemy strony WWW i systemy IT dla specjalizacji ${prof} (branża: ${ind}) w Warszawie i regionie mazowieckim.`,
  },
  en: {
    specHeading: (ind: string) => `Other ${ind} specializations`,
    locationsHeading: (prof: string) => `${prof} – Warsaw & surrounding area`,
    relatedHeading: 'Related industries',
    disclaimer: (prof: string, ind: string) => `webwawa.pl – we build websites & IT systems for ${prof} (${ind} sector) in Warsaw and the Masovian region.`,
  },
  de: {
    specHeading: (ind: string) => `Weitere ${ind}-Spezialisierungen`,
    locationsHeading: (prof: string) => `${prof} – Warschau & Umgebung`,
    relatedHeading: 'Verwandte Branchen',
    disclaimer: (prof: string, ind: string) => `webwawa.pl – Websites & IT-Systeme für ${prof} (${ind}) in Warschau und Umgebung.`,
  },
  uk: {
    specHeading: (ind: string) => `Інші спеціалізації: ${ind}`,
    locationsHeading: (prof: string) => `${prof} – Варшава та околиці`,
    relatedHeading: 'Похожі галузі',
    disclaimer: (prof: string, ind: string) => `webwawa.pl – розробляємо сайти для ${prof} (${ind}) у Варшаві та Мазовії.`,
  },
  ru: {
    specHeading: (ind: string) => `Другие специализации: ${ind}`,
    locationsHeading: (prof: string) => `${prof} – Варшава и окрестности`,
    relatedHeading: 'Похожие отрасли',
    disclaimer: (prof: string, ind: string) => `webwawa.pl – разрабатываем сайты для ${prof} (${ind}) в Варшаве и регионе.`,
  },
  zh: {
    specHeading: (ind: string) => `其他${ind}专业`,
    locationsHeading: (prof: string) => `${prof} – 华沙及周边地区`,
    relatedHeading: '相关行业',
    disclaimer: (prof: string, ind: string) => `webwawa.pl – 为华沙及马佐得天山地区${prof}(${ind})企业提供网站开发服务。`,
  },
} as const;

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
  const brands = ['doctor', 'lawyer', 'psychologist', 'accountant', 'architect', 'construction', 'beauty', 'automotive'] as const;
  
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

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, brand: brandId, model: modelId } = await params;
  const searchParamsData = await searchParams;
  const carBrandSlug = typeof searchParamsData?.carBrand === 'string' ? searchParamsData.carBrand : null;
  const carModelSlug = typeof searchParamsData?.carModel === 'string' ? searchParamsData.carModel : null;
  const carSeriesSlug = typeof searchParamsData?.carSeries === 'string' ? searchParamsData.carSeries : null;

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

  let title = isPl 
    ? `Systemy IT i strony WWW dla: ${localizedProfession} - ${cityName} | webwawa.pl`
    : `Websites & IT Solutions for ${localizedProfession} - ${cityName} | webwawa.pl`;

  if (carDetails) {
    title = isPl
      ? `${localizedProfession} (${carDetails}) - Strony WWW i IT ${cityName} | webwawa.pl`
      : `${localizedProfession} (${carDetails}) - Websites & IT ${cityName} | webwawa.pl`;
  }
    
  let description = isPl 
    ? `Projektowanie profesjonalnych stron WordPress, szybkich aplikacji PWA i lokalne pozycjonowanie SEO dla profesji: ${localizedProfession} w lokalizacji ${cityName}. Sprawdź ofertę.`
    : `Custom WordPress sites, PWA applications, and local map SEO rankings for ${localizedProfession} in ${cityName}. Attract patients today.`;

  if (carDetails) {
    description = isPl
      ? `Projektowanie stron i systemów IT dla: ${localizedProfession} dedykowanych dla samochodów ${carDetails} w lokalizacji ${cityName}.`
      : `Web design and IT systems for ${localizedProfession} customized for ${carDetails} vehicles in ${cityName}.`;
  }

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
  const { lang, city: citySlug, brand: brandId, model: modelId } = await params;
  const searchParamsData = await searchParams;
  const carBrandSlug = typeof searchParamsData?.carBrand === 'string' ? searchParamsData.carBrand : null;
  const carModelSlug = typeof searchParamsData?.carModel === 'string' ? searchParamsData.carModel : null;
  const carSeriesSlug = typeof searchParamsData?.carSeries === 'string' ? searchParamsData.carSeries : null;

  const industry = getIndustryById(brandId as IndustryId);
  if (!industry) notFound();

  const city = citySlug === 'all' ? null : getCityBySlug(citySlug);
  if (citySlug !== 'all' && !city) notFound();

  const trans = industry.translations[lang as Locale];
  if (!trans) notFound();

  const modelData = trans.models[modelId as ProfessionId];
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
      disclaimer: 'webwawa.pl – разрабатываем сайты и IT-системы для автомобильного бизнеса в Варшаве и регионе.',
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

  let imageRelativePath = `/images/industries/${brandId}/${modelId}.svg`;
  let imageFileSystemPath = path.join(process.cwd(), 'public', imageRelativePath);
  if (!fs.existsSync(imageFileSystemPath)) {
    imageRelativePath = `/images/industries/${brandId}/${modelId}.png`;
    imageFileSystemPath = path.join(process.cwd(), 'public', imageRelativePath);
  }
  
  let heroImageSrc = '/images/workspace_code.png';
  if (finalImageUrl) {
    heroImageSrc = finalImageUrl;
  } else if (fs.existsSync(imageFileSystemPath)) {
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

              <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-6 flex items-center gap-4 flex-wrap">
                {brandLogo && (
                  <img src={brandLogo} alt={`${carBrandSlug} Logo`} className="h-12 w-auto object-contain dark:invert" />
                )}
                <span>{t.h1Prefix} <span className="gradient-text">{modelData.name}</span>{carDetails ? <span className="text-primary"> {carDetails}</span> : ''} - {cityName}</span>
              </h1>
              <p className="text-xl opacity-80 leading-relaxed text-slate-650 dark:text-slate-350">
                {carDetails
                  ? t.heroSubWith(modelData.name, carDetails, cityName)
                  : t.heroSubWithout(modelData.name, cityName)}
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
                {t.profBadge}
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.profHeading(modelData.name)}
              </h2>
              <p className="text-slate-650 dark:text-slate-400 leading-relaxed">
                {modelData.about}
              </p>

              {wikiData?.wiki?.description && (
                <div className="bg-slate-50 dark:bg-slate-950/20 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 my-6 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 uppercase italic">
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
              <h3 className="font-black text-xl mb-6 uppercase tracking-tight italic text-slate-900 dark:text-white">
                {t.dedicatedServices}
              </h3>
              <div className="space-y-4">
                {Object.entries(trans.series).map(([seriesKey, val]) => {
                  const serviceSlug = serviceSlugsMap[seriesKey as keyof typeof serviceSlugsMap][lang as Locale];
                  let serviceUrl = '';
                  if (carBrandSlug) {
                    serviceUrl = `${langPrefix}/${parentSlug}/${brandSlug}/${modelSlug}/${citySlug}/${carBrandSlug}`;
                    if (carModelSlug) {
                      serviceUrl += `/${carModelSlug}`;
                      if (carSeriesSlug) {
                        serviceUrl += `/${carSeriesSlug}`;
                      }
                    }
                    serviceUrl += `/${serviceSlug}`;
                  } else {
                    serviceUrl = city 
                      ? `${langPrefix}/${city.slug}/${brandSlug}/${modelSlug}/${serviceSlug}`
                      : `${langPrefix}/${parentSlug}/${brandSlug}/${modelSlug}/${serviceSlug}`;
                  }

                  return (
                    <div key={seriesKey} className="border-b border-slate-200 dark:border-slate-800/80 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-md">{val.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">{val.desc}</p>
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

      {/* SEO Tag Cloud – Automotive */}
      {brandId === 'automotive' && (
        <section className="py-14 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900/50">
          <div className="container mx-auto px-4 max-w-5xl space-y-10">

            {/* Block 1: Same profession, other car brands */}
            {carBrandSlug && (() => {
              const allBrands = getAllBrands();
              const relatedBrands = POPULAR_BRAND_SLUGS
                .filter(s => s !== carBrandSlug)
                .map(s => {
                  const found = allBrands.find(b => b.slug === s || b.slug.includes(s) || s.includes(b.slug));
                  if (!found) return null;
                  return { name: found.name, slug: found.slug, logo: getBrandLogo(found.slug) };
                })
                .filter(Boolean) as { name: string; slug: string; logo: string | null }[];

              if (relatedBrands.length === 0) return null;
              return (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">🔗</span>
                    <h2 className="text-lg font-black uppercase italic tracking-tight text-slate-800 dark:text-white">
                      {t.brandsHeading(professionSlugsMap[modelId as ProfessionId]?.[lang as Locale] || modelData.name)}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {relatedBrands.map((rb) => (
                      <Link
                        key={rb.slug}
                        href={`${langPrefix}/${parentSlug}/${brandSlug}/${modelSlug}/${rb.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                        title={`${rb.name} – ${trans.models[modelId as ProfessionId]?.name || modelId}`}
                      >
                        {rb.logo && (
                          <img src={rb.logo} alt={rb.name} className="h-3.5 w-auto object-contain dark:invert" loading="lazy" />
                        )}
                        {rb.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Block 2: Other automotive professions for current brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">⚙️</span>
                <h2 className="text-lg font-black uppercase italic tracking-tight text-slate-800 dark:text-white">
                  {t.servicesHeading(carBrandSlug ? (carBrandSlug.charAt(0).toUpperCase() + carBrandSlug.slice(1).replace(/-/g, ' ')) : '')}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {AUTOMOTIVE_PROFESSIONS
                  .filter(p => p.id !== modelId)
                  .map(prof => {
                    const profSlug = professionSlugsMap[prof.id as ProfessionId]?.[lang as Locale] || prof.slugPl;
                    const href = carBrandSlug
                      ? `${langPrefix}/${parentSlug}/${brandSlug}/${profSlug}/${carBrandSlug}${carModelSlug ? '/' + carModelSlug : ''}`
                      : `${langPrefix}/${parentSlug}/${brandSlug}/${profSlug}`;
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
            {carBrandSlug && (() => {
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
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">📍</span>
                    <h2 className="text-lg font-black uppercase italic tracking-tight text-slate-800 dark:text-white">
                      {t.citiesHeading}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {keyCities.map(kc => (
                      <Link
                        key={kc.slug}
                        href={`${langPrefix}/${kc.slug}/${brandSlug}/${modelSlug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                      >
                        <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                        {kc.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Webwawa disclaimer */}
            <p className="text-xs text-slate-400 dark:text-slate-600 text-center pt-2 border-t border-slate-100 dark:border-slate-900">
              {t.disclaimer}
            </p>

          </div>
        </section>
      )}
      {/* SEO Internal Link Cloud – Non-Automotive Industries */}
      {brandId !== 'automotive' && (() => {
        const mt = MODEL_UI[lang as keyof typeof MODEL_UI] || MODEL_UI.en;
        const relatedIds = RELATED_INDUSTRIES[brandId as IndustryId] || [];
        // Other specializations within same industry
        const siblingModels = Object.entries(trans.models)
          .filter(([k]) => k !== modelId)
          .map(([k, v]) => ({
            id: k as ProfessionId,
            name: v.name,
            slug: professionSlugsMap[k as ProfessionId]?.[lang as Locale] || k,
          }));

        return (
          <section className="py-14 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900/50">
            <div className="container mx-auto px-4 max-w-5xl space-y-10">

              {/* Block 1: Other specializations in same industry */}
              {siblingModels.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">📑</span>
                    <h2 className="text-lg font-black uppercase italic tracking-tight text-slate-800 dark:text-white">
                      {mt.specHeading(trans.industryName)}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {siblingModels.map(sm => {
                      const href = city
                        ? `${langPrefix}/${city.slug}/${brandSlug}/${sm.slug}`
                        : `${langPrefix}/${parentSlug}/${brandSlug}/${sm.slug}`;
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
                  <h2 className="text-lg font-black uppercase italic tracking-tight text-slate-800 dark:text-white">
                    {mt.locationsHeading(modelData.name)}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {KEY_LOCATIONS.map(loc => (
                    <Link
                      key={loc.slug}
                      href={`${langPrefix}/${loc.slug}/${brandSlug}/${modelSlug}`}
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

              {/* Block 3: Related industries */}
              {relatedIds.length > 0 && (() => {
                const relatedItems = relatedIds
                  .map(rid => {
                    const relInd = getIndustryById(rid);
                    if (!relInd) return null;
                    const relTrans = relInd.translations[lang as Locale];
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
                      <h2 className="text-lg font-black uppercase italic tracking-tight text-slate-800 dark:text-white">
                        {mt.relatedHeading}
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
                {mt.disclaimer(modelData.name, trans.industryName)}
              </p>

            </div>
          </section>
        );
      })()}
    </main>
  );
}
