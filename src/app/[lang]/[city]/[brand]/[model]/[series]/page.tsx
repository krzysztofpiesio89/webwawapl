import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';
import { getGlobalSettings } from '@/lib/settings';
import { getBrandBySlug, getModelBySlug, slugify } from '@/lib/brands';
import { getCityBySlug } from '@/lib/cities';
import { getDictionary, Locale, ogLocaleMap } from '../../../../dictionaries';

interface PageProps {
  params: Promise<{ lang: string;
    city: string;
    brand: string;
    model: string;
    series: string;
   }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, brand: brandSlug, model: modelSlug, series: seriesSlug } = await params;

  const city = getCityBySlug(citySlug);
  const brand = getBrandBySlug(brandSlug);
  const brandName = brand ? brand.name : (brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1));
  const model = brand ? getModelBySlug(brand, modelSlug) : null;
  const modelName = model ? model.name : modelSlug.toUpperCase();

  const decodedSlug = decodeURIComponent(seriesSlug);
  const series = model?.series.find((s: any) => 
    slugify(s.name) === slugify(decodedSlug) || 
    s.name.toLowerCase() === decodedSlug.toLowerCase()
  );
  const seriesName = series ? series.name : decodedSlug;
  
  const cityName = city?.name || 'Warszawa';
  const title = `Integracja i Wdrożenia ${brandName} ${modelName} (${seriesName}) - ${cityName} | webwawa.pl`;
  const description = `Wsparcie techniczne i integracje oprogramowania dla marki ${brandName} ${modelName} (wersja ${seriesName}) w miejscowości ${cityName}.`;

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const canonicalUrl = `https://webwawa.pl${langPrefix}/${citySlug}/${brandSlug}/${modelSlug}/${seriesSlug}`;

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

export default async function CarPage({ params }: PageProps) {
  const { lang, city: citySlug, brand: brandSlug, model: modelSlug, series: seriesSlug } = await params;

  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const brand = getBrandBySlug(brandSlug);
  if (!brand) notFound();

  const model = getModelBySlug(brand, modelSlug);
  if (!model) notFound();

  const decodedSlug = decodeURIComponent(seriesSlug);
  const series = model.series.find((s: any) => 
    slugify(s.name) === slugify(decodedSlug) || 
    s.name.toLowerCase() === decodedSlug.toLowerCase()
  );
  if (!series) notFound();

  const settings = await getGlobalSettings();
  const dict = await getDictionary(lang as Locale);
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  
  const cityName = city.name;
  const brandName = brand.name;
  const modelName = model.name;
  const isPl = lang === 'pl';

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <Link href={homeUrl} className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`${langPrefix}/${citySlug}`} className="hover:text-primary transition-colors">{cityName}</Link>
          <span className="mx-2">/</span>
          <Link href={`${langPrefix}/${citySlug}/${brandSlug}`} className="hover:text-primary transition-colors">{brandName}</Link>
          <span className="mx-2">/</span>
          <Link href={`${langPrefix}/${citySlug}/${brandSlug}/${modelSlug}`} className="hover:text-primary transition-colors">{modelName}</Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-semibold">{series.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-6">
              Rozwiązania dedykowane: <span className="gradient-text">{brandName}</span> <span className="gradient-text">{modelName}</span> <span className="text-primary dark:text-primary">{series.name}</span>
            </h1>
            <p className="text-xl opacity-80 mb-8 leading-relaxed font-medium text-slate-600 dark:text-slate-400">
              {isPl
                ? `Optymalizacja procesów technologicznych i integracja API dla sektora ${brandName} ${modelName} (seria ${series.name}) w lokalizacji ${cityName}.`
                : `Technology process optimization and API integration for the ${brandName} ${modelName} (${series.name}) sector in ${cityName}.`}
            </p>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3">
                <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-full">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-350">{isPl ? "Dedykowana architektura systemów" : "Custom systems architecture"}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-full">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-350">{isPl ? "Pełne wsparcie integracyjne" : "Full integration support"}</span>
              </li>
            </ul>

            <a href={`tel:${settings?.phone || '+48664946209'}`} className="btn-primary inline-flex items-center gap-3 text-xl font-bold">
              {isPl ? "Zadzwoń do nas" : "Call us"}
            </a>
          </div>

          <div className="w-full">
            <ContactForm 
              lang={lang} 
              defaultCity={cityName} 
              settings={settings} 
              dict={dict.form} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}
