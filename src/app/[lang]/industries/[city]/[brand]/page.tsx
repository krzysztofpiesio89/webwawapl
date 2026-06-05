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
  ProfessionId 
} from '@/lib/industries-list';

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
  const brands = ['doctor', 'lawyer', 'psychologist', 'accountant', 'architect', 'construction', 'beauty'];
  
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

  const isPl = lang === 'pl';
  const localizedBrandName = trans.industryName;

  const title = isPl 
    ? `Dedykowane strony i systemy IT dla sektora: ${localizedBrandName} - ${cityName} | webwawa.pl`
    : `Custom Websites & IT for ${localizedBrandName} - ${cityName} | webwawa.pl`;
    
  const description = isPl 
    ? `Tworzenie nowoczesnych stron internetowych, aplikacji PWA i pozycjonowanie SEO dla branży: ${localizedBrandName} w lokalizacji ${cityName}. Zwiększ konwersję pacjentów.`
    : `Designing modern websites, PWA apps, and local SEO positioning for ${localizedBrandName} in ${cityName}. Build trust and acquire more patients.`;

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
                O specyfice branży
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {trans.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-md">
                {trans.about}
              </p>
              
              {/* Specializations Quick Navigation */}
              <div className="pt-6">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
                  {isPl ? "Wybierz specjalizację (model profesji):" : "Select profession model:"}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(trans.models).map(([modelKey, modelVal]) => {
                    const modelSlug = professionSlugsMap[modelKey as ProfessionId][lang as Locale];
                    const url = city 
                      ? `${lang === 'pl' ? '' : '/' + lang}/${city.slug}/${brandSlug}/${modelSlug}`
                      : `${lang === 'pl' ? '' : '/' + lang}/${parentSlug}/${brandSlug}/${modelSlug}`;
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
              <h3 className="font-black text-xl mb-6 uppercase tracking-tight italic text-slate-900 dark:text-white">
                Stosowane rozwiązania
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
    </main>
  );
}
