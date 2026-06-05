import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getIndustryById } from '@/lib/industries';
import { getCityBySlug } from '@/lib/cities';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale, ogLocaleMap } from '../../../../../dictionaries';
import ContactForm from '@/components/ContactForm';
import { 
  industrySlugsMap, 
  professionSlugsMap, 
  serviceSlugsMap, 
  IndustryId, 
  ProfessionId,
  ServiceId,
  industryModelsMap
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
  const brands = ['doctor', 'lawyer', 'psychologist', 'accountant', 'architect', 'construction', 'beauty', 'automotive'] as const;
  const seriesList = Object.keys(serviceSlugsMap);
  
  const paramsList = [];
  for (const lang of langs) {
    for (const city of cities) {
      for (const brand of brands) {
        const models = industryModelsMap[brand];
        for (const model of models) {
          for (const series of seriesList) {
            paramsList.push({ lang, city, brand, model, series });
          }
        }
      }
    }
  }
  return paramsList;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, brand: brandId, model: modelId, series: seriesId } = await params;
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
  const seriesData = trans.series[seriesId as ServiceId];
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

  let title = isPl 
    ? `${localizedService} dla specjalności: ${localizedProfession} - ${cityName} | webwawa.pl`
    : `${localizedService} for ${localizedProfession} in ${cityName} | webwawa.pl`;

  if (carDetails) {
    title = isPl
      ? `${localizedService} dla ${localizedProfession} (${carDetails}) - ${cityName} | webwawa.pl`
      : `${localizedService} for ${localizedProfession} (${carDetails}) - ${cityName} | webwawa.pl`;
  }
    
  let description = isPl 
    ? `Dedykowane wdrożenia: ${localizedService} dla profesji ${localizedProfession} w lokalizacji ${cityName}. Zwiększ pozycję w wyszukiwarce Google i zoptymalizuj wyniki konwersji.`
    : `Custom ${localizedService} optimized for ${localizedProfession} in ${cityName}. Dominate Google searches and boost patient acquisition.`;

  if (carDetails) {
    description = isPl
      ? `Projektowanie i pozycjonowanie: ${localizedService} dla profesji ${localizedProfession} dedykowane dla aut ${carDetails} w lokalizacji ${cityName}.`
      : `${localizedService} solutions for ${localizedProfession} optimized for ${carDetails} vehicles in ${cityName}.`;
  }

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const parentSlug = lang === 'pl' ? 'strona-dla' : 
                     lang === 'en' ? 'website-for' : 
                     lang === 'de' ? 'webseite-fuer' : 
                     lang === 'uk' ? 'sayt-dlya' : 
                     lang === 'ru' ? 'sayt-dlya' : 'website-for';
  const canonicalUrl = citySlug === 'all'
    ? `https://webwawa.pl${langPrefix}/${parentSlug}/${industrySlugsMap[brandId as IndustryId][lang as Locale]}/${professionSlugsMap[modelId as ProfessionId][lang as Locale]}/${serviceSlugsMap[seriesId as ServiceId][lang as Locale]}`
    : `https://webwawa.pl${langPrefix}/${citySlug}/${industrySlugsMap[brandId as IndustryId][lang as Locale]}/${professionSlugsMap[modelId as ProfessionId][lang as Locale]}/${serviceSlugsMap[seriesId as ServiceId][lang as Locale]}`;

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

export default async function IndustrySeriesPage({ params, searchParams }: PageProps) {
  const { lang, city: citySlug, brand: brandId, model: modelId, series: seriesId } = await params;
  const searchParamsData = await searchParams;
  const carBrandSlug = typeof searchParamsData?.carBrand === 'string' ? searchParamsData.carBrand : null;
  const carModelSlug = typeof searchParamsData?.carModel === 'string' ? searchParamsData.carModel : null;
  const carSeriesSlug = typeof searchParamsData?.carSeries === 'string' ? searchParamsData.carSeries : null;

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
  const industry = getIndustryById(brandId as IndustryId);
  if (!industry) notFound();

  const city = citySlug === 'all' ? null : getCityBySlug(citySlug);
  if (citySlug !== 'all' && !city) notFound();

  const trans = industry.translations[lang as Locale];
  if (!trans) notFound();

  const modelData = trans.models[modelId as ProfessionId];
  const seriesData = trans.series[seriesId as ServiceId];
  if (!modelData || !seriesData) notFound();

  const settings = getGlobalSettings();
  const dict = await getDictionary(lang as Locale);
  const isPl = lang === 'pl';
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  const cityName = city ? city.name : (isPl ? 'Warszawa / cała Polska' : 'Warsaw');

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
    ru: 'Сайt для',
    zh: '网站适用'
  };
  const parentLabel = parentLabelMap[lang as Locale] || 'Website for';

  const serviceSlug = serviceSlugsMap[seriesId as ServiceId][lang as Locale];
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;

  const brandUrl = city 
    ? `${langPrefix}/${city.slug}/${brandSlug}`
    : `${langPrefix}/${parentSlug}/${brandSlug}`;

  let modelUrl = '';
  if (carBrandSlug) {
    modelUrl = `${langPrefix}/${parentSlug}/${brandSlug}/${modelSlug}/${citySlug}/${carBrandSlug}`;
    if (carModelSlug) {
      modelUrl += `/${carModelSlug}`;
      if (carSeriesSlug) {
        modelUrl += `/${carSeriesSlug}`;
      }
    }
  } else {
    modelUrl = city
      ? `${langPrefix}/${city.slug}/${brandSlug}/${modelSlug}`
      : `${langPrefix}/${parentSlug}/${brandSlug}/${modelSlug}`;
  }

  // Rich specifications checklist or keyword pool
  const keywordCloud = isPl 
    ? [
        `${seriesData.title.toLowerCase()} dla ${modelData.name.toLowerCase()}`,
        `strona www dla ${modelData.name.toLowerCase()} ${cityName}`,
        `seo ${modelData.name.toLowerCase()} ${cityName}`,
        `marketing dla gabinetu ${modelData.name.toLowerCase()}`,
        `jak wypozycjonowac ${modelData.name.toLowerCase()}`,
        `strony internetowe dla lekarzy ${cityName}`
      ]
    : [
        `${seriesData.title.toLowerCase()} for ${modelData.name.toLowerCase()}`,
        `website for ${modelData.name.toLowerCase()} ${cityName}`,
        `seo ${modelData.name.toLowerCase()} ${cityName}`,
        `marketing for ${modelData.name.toLowerCase()} clinic`,
        `how to rank ${modelData.name.toLowerCase()}`,
        `websites for doctors ${cityName}`
      ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${seriesData.title} - ${modelData.name}`,
    "description": seriesData.desc,
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
            },
            {
              "@type": "ListItem",
              "position": 5,
              "name": seriesData.title,
              "item": `https://webwawa.pl${langPrefix}/${city.slug}/${brandSlug}/${modelSlug}/${serviceSlug}`
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
            },
            {
              "@type": "ListItem",
              "position": 5,
              "name": seriesData.title,
              "item": `https://webwawa.pl${langPrefix}/${parentSlug}/${brandSlug}/${modelSlug}/${serviceSlug}`
            }
          ]
      )
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
      <script
        type="application/ld+json"
        id={`ldjson-series-${brandId}-${modelId}-${seriesId}`}
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
                {carDetails ? (
                  isPl
                    ? `Dedykowane wdrożenia w zakresie ${seriesData.title.toLowerCase()} dla firm oferujących usługi ${modelData.name.toLowerCase()} w odniesieniu do pojazdów ${carDetails} w regionie ${cityName}.`
                    : `Dedicated ${seriesData.title.toLowerCase()} implementations for companies offering ${modelData.name.toLowerCase()} services for ${carDetails} vehicles in the ${cityName} area.`
                ) : (
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

      {/* Detail Section */}
      <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-900/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-7 space-y-6">
              <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                Dlaczego my?
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Co ma największy wpływ na wyniki i pozycję specjalności {modelData.name}{carDetails ? ` (${carDetails})` : ''} w Google?
              </h2>
              <p className="text-slate-650 dark:text-slate-400 leading-relaxed">
                {carDetails ? (
                  isPl
                    ? `Skuteczność naszych wdrożeń opiera się na precyzyjnym dopasowaniu technologii do potrzeb Twoich klientów. Obsługa ${modelData.name.toLowerCase()} dla samochodów ${carDetails} wymaga nie tylko estetycznej strony, lecz przede wszystkim bezbłędnej optymalizacji czasu ładowania, responsywności (Mobile-First) oraz integracji z lokalnymi Mapami Google.`
                    : `Our implementations' success rests on precise technological adjustments to your customers' needs. Servicing ${modelData.name.toLowerCase()} for ${carDetails} vehicles demands not only an aesthetic layout, but above all flawless load speed, Mobile-First responsiveness, and Google Maps local SEO alignment.`
                ) : (
                  isPl
                    ? `Skuteczność naszych wdrożeń opiera się na precyzyjnym dopasowaniu technologii do potrzeb pacjentów. Specjalizacja ${modelData.name} wymaga nie tylko estetycznej strony, lecz przede wszystkim bezbłędnej optymalizacji czasu ładowania, responsywności (Mobile-First) oraz integracji z lokalnymi Mapami Google.`
                    : `Our implementations' success rests on precise technological adjustments to patient needs. Speciality ${modelData.name} demands not only an aesthetic layout, but above all flawless load speed, Mobile-First responsiveness, and Google Maps local SEO alignment.`
                )}
              </p>

              {wikiData?.wiki?.description && (
                <div className="bg-slate-50 dark:bg-slate-950/20 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 my-6 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 uppercase italic">
                    Kontekst pojazdu: {carDetails}
                  </h3>
                  <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                    {typeof wikiData.wiki.description === 'string' 
                      ? wikiData.wiki.description 
                      : (wikiData.wiki.description[lang] || wikiData.wiki.description.pl)}
                  </p>
                  <div className="mt-4 text-xs font-bold text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
                    {isPl
                      ? `*Powyższa specyfikacja modelu służy zasileniu parametrów semantycznych pod kątem pozycjonowania SEO oferty wdrożeniowej ${seriesData.title.toLowerCase()} dla aut ${carDetails}.`
                      : `*The above vehicle description serves to enrich the semantic context for SEO ranking of our ${seriesData.title.toLowerCase()} integrations dedicated for ${carDetails} cars.`}
                  </div>
                </div>
              )}
              
              <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  {isPl ? "Nasze działania zwiększające pozycję:" : "Our actions boosting your Google position:"}
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✔</span>
                    <span><strong>{isPl ? "Lokalny SEO & Schema markup" : "Local SEO & Schema markup"}:</strong> {isPl ? "Wdrożenie struktur danych JSON-LD typu MedicalBusiness / Service dla szybkiej indeksacji usług." : "Implementing JSON-LD schemas like MedicalBusiness / Service for rapid indexing."}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✔</span>
                    <span><strong>{isPl ? "Współczynnik konwersji (CRO)" : "Conversion Rate Optimization (CRO)"}:</strong> {isPl ? "Projektowanie ścieżek pacjenta ułatwiających rezerwację wizyty w mniej niż 3 kliknięcia." : "Designing patient user flows that facilitate booking in under 3 clicks."}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">✔</span>
                    <span><strong>{isPl ? "Szybkość i Wydajność (Core Web Vitals)" : "Core Web Vitals Speed"}:</strong> {isPl ? "Optymalizacja pod kątem wyniku 100/100 na urządzeniach mobilnych, co bezpośrednio podnosi pozycję w rankingu." : "Optimizing for 100/100 Mobile PageSpeed scores, which directly boosts rankings."}</span>
                  </li>
                </ul>
              </div>

              {/* Keywords Cloud */}
              <div className="pt-4">
                <h3 className="font-bold text-md mb-3 text-slate-500 dark:text-slate-450 uppercase tracking-widest text-xs">
                  {isPl ? "Frazy Kluczowe i SEO Targety" : "Keywords & SEO Targets"}
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
              <h3 className="font-black text-xl mb-4 uppercase tracking-tight italic text-slate-900 dark:text-white">
                {isPl ? (carDetails ? "Pozyskaj Więcej Klientów" : "Zdobądź Więcej Pacjentów") : (carDetails ? "Get More Customers" : "Get More Patients")}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-450 mb-6 leading-relaxed">
                {carDetails ? (
                  isPl
                    ? `Zamów dedykowane rozwiązanie ${seriesData.title} dla swojej firmy oferującej ${modelData.name.toLowerCase()} ${carDetails} w lokalizacji ${cityName}. Przygotujemy ofertę dopasowaną do Twojego budżetu.`
                    : `Order a custom ${seriesData.title} optimized for your business offering ${modelData.name.toLowerCase()} ${carDetails} in ${cityName}. We will prepare a personalized estimate.`
                ) : (
                  isPl
                    ? `Zamów dedykowane rozwiązanie ${seriesData.title} dla swojej specjalności ${modelData.name} w lokalizacji ${cityName}. Przygotujemy ofertę dopasowaną do Twojego budżetu.`
                    : `Order a custom ${seriesData.title} optimized for your specialization ${modelData.name} in ${cityName}. We will prepare a personalized estimate.`
                )}
              </p>
              <a href="#kontakt" className="btn-primary w-full block py-3 rounded-xl text-md font-bold uppercase tracking-wider shadow-md hover:shadow-lg">
                {isPl ? "Bezpłatna wycena" : "Get Free Quote"}
              </a>
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
