import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBrandBySlug, getModelBySlug } from '@/lib/brands';
import { getCityBySlug } from '@/lib/cities';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale, ogLocaleMap } from '../../../dictionaries';

interface PageProps {
  params: Promise<{ lang: string;
    city: string;
    brand: string;
    model: string;
   }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, brand: brandSlug, model: modelSlug } = await params;
  const city = getCityBySlug(citySlug);
  const brand = getBrandBySlug(brandSlug);
  const brandName = brand ? brand.name : (brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1));
  const model = brand ? getModelBySlug(brand, modelSlug) : null;
  const modelName = model ? model.name : modelSlug.toUpperCase();
  
  const cityName = city?.name || 'Warszawa';
  const title = `Projektowanie systemów dla ${brandName} ${modelName} - ${cityName} | webwawa.pl`;
  const description = `Wdrażanie dedykowanych rozwiązań IT powiązanych z modelami ${brandName} ${modelName} w mieście ${cityName}. Zapraszamy do kontaktu.`;

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const canonicalUrl = `https://webwawa.pl${langPrefix}/${citySlug}/${brandSlug}/${modelSlug}`;

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

export default async function CityBrandModelPage({ params }: PageProps) {
  const { lang, city: citySlug, brand: brandSlug, model: modelSlug } = await params;
  const settings = getGlobalSettings();
  
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const brand = getBrandBySlug(brandSlug);
  if (!brand) notFound();

  const model = getModelBySlug(brand, modelSlug);
  if (!model) notFound();

  const isPl = lang === 'pl';
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-slate-100 dark:bg-slate-900 py-20 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <nav className="flex justify-center mb-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Link href={homeUrl} className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`${langPrefix}/${citySlug}`} className="hover:text-primary transition-colors">{city.name}</Link>
            <span className="mx-2">/</span>
            <Link href={`${langPrefix}/${citySlug}/${brandSlug}`} className="hover:text-primary transition-colors">{brand.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-primary font-semibold">{model.name}</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-6">
            Dedykowane wdrożenia IT: <span className="gradient-text">{brand.name}</span> <span className="gradient-text">{model.name}</span> - {city.name}
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed text-slate-650 dark:text-slate-300">
            {isPl
              ? `Optymalizacja procesów technologicznych i integracje systemowe dla sektora ${brand.name} ${model.name} w regionie ${city.name}.`
              : `Technology process optimization and systems integration for ${brand.name} ${model.name} in ${city.name}.`}
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/50 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">{isPl ? "Skonsultuj z nami swój pomysł" : "Consult your idea with us"}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto">
            {isPl 
              ? `Przygotujemy dedykowane rozwiązanie dostosowane do Twoich potrzeb w mieście ${city.name}.`
              : `We will prepare a dedicated solution customized to your needs in ${city.name}.`}
          </p>
          <a href={`tel:${settings?.phone || '+48664946209'}`} className="btn-primary py-4 px-10 rounded-full text-xl shadow-lg shadow-primary/20 inline-block">
            {settings?.phone || '+48 664 946 209'}
          </a>
        </div>
      </section>
    </main>
  );
}
