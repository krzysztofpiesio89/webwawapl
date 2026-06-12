import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGlobalSettings } from '@/lib/settings';
import { getCityBySlug } from '@/lib/cities';
import { getDictionary, Locale, ogLocaleMap } from '../dictionaries';
import { resolveStaticSlug } from '../i18n-routes';
import { getIndustryIdBySlug } from '@/lib/industries-list';
import IndustryBrandPage, { generateMetadata as generateIndustryMetadata } from '../industries/[city]/[brand]/page';

interface PageProps {
  params: Promise<{ lang: string;
    city: string;
   }>;
  searchParams?: Promise<{ tech?: string; }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { lang, city: citySlug } = params;
  
  // Intercept Industry Parent Slugs (e.g., /strona-dla/architekt)
  const resolvedParent = resolveStaticSlug(lang);
  if (resolvedParent?.page === 'industries') {
    return generateIndustryMetadata({
      params: Promise.resolve({ lang: resolvedParent.lang, city: 'all', brand: citySlug }),
      searchParams: props.searchParams || Promise.resolve({})
    });
  }

  // Intercept City + Industry Slugs (e.g., /warszawa/architekt)
  const cityCheck = getCityBySlug(lang);
  if (cityCheck) {
    const industryCheck = getIndustryIdBySlug(citySlug);
    if (industryCheck) {
      return generateIndustryMetadata({
        params: Promise.resolve({ lang: 'pl', city: lang, brand: citySlug }),
        searchParams: props.searchParams || Promise.resolve({})
      });
    }
  }

  const city = getCityBySlug(citySlug);
  const dict = await getDictionary(lang as Locale);
  
  const cityName = city?.name || 'Warszawa';
  const description = `Agencja IT webwawa.pl w miejscowości ${cityName}. Tworzenie profesjonalnych stron WWW, pozycjonowanie SEO i systemy dedykowane.`;
  const title = `Agencja IT ${cityName} - webwawa.pl`;
  
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const canonicalUrl = `https://webwawa.pl${langPrefix}/${citySlug}`;

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
    }
  };
}

export default async function CityPage(props: PageProps) {
  const params = await props.params;
  const { lang, city: citySlug } = params;

  // Intercept Industry Parent Slugs (e.g., /strona-dla/architekt)
  const resolvedParent = resolveStaticSlug(lang);
  if (resolvedParent?.page === 'industries') {
    return IndustryBrandPage({ 
      params: Promise.resolve({ lang: resolvedParent.lang, city: 'all', brand: citySlug }),
      searchParams: props.searchParams || Promise.resolve({})
    });
  }

  // Intercept City + Industry Slugs (e.g., /warszawa/architekt)
  const cityCheck = getCityBySlug(lang);
  if (cityCheck) {
    const industryCheck = getIndustryIdBySlug(citySlug);
    if (industryCheck) {
      return IndustryBrandPage({ 
        params: Promise.resolve({ lang: 'pl', city: lang, brand: citySlug }),
        searchParams: props.searchParams || Promise.resolve({})
      });
    }
  }

  const settings = getGlobalSettings();
  const city = getCityBySlug(citySlug);
  
  if (!city) notFound();

  const isPl = lang === 'pl';

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
      <section className="bg-slate-100 dark:bg-slate-900 py-20 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Agencja IT <span className="gradient-text">{city.name}</span>
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
            {isPl 
              ? `Nowoczesne rozwiązania internetowe dla firm w miejscowości ${city.name} i okolicach.` 
              : `Modern web solutions for businesses in ${city.name} and surrounding areas.`}
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/50 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">{isPl ? "Chcesz stworzyć z nami projekt?" : "Want to build a project with us?"}</h2>
          <p className="text-slate-500 dark:text-slate-450 mb-8 max-w-xl mx-auto">
            {isPl 
              ? `Skontaktuj się z nami bezpośrednio, a nasz doradca w miejscowości ${city.name} przygotuje bezpłatną wycenę.` 
              : `Get in touch directly and our representative in ${city.name} will prepare a free quote.`}
          </p>
          <a href={`tel:${settings?.phone || '+48664946209'}`} className="btn-primary py-4 px-10 rounded-full text-xl shadow-lg shadow-primary/20 inline-block">
            {settings?.phone || '+48 664 946 209'}
          </a>
        </div>
      </section>
    </main>
  );
}
