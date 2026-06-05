import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGlobalSettings } from '@/lib/settings';
import { getBrandBySlug } from '@/lib/brands';
import { getCityBySlug } from '@/lib/cities';
import { getDictionary, Locale, ogLocaleMap } from '../../dictionaries';

interface PageProps {
  params: Promise<{ lang: string;
    city: string;
    brand: string;
   }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, brand: brandSlug } = await params;
  const city = getCityBySlug(citySlug);
  const brand = getBrandBySlug(brandSlug);
  const brandName = brand ? brand.name : (brandSlug.charAt(0).toUpperCase() + brandSlug.slice(1));
  const dict = await getDictionary(lang as Locale);
  
  const cityName = city?.name || 'Warszawa';
  const title = `Usługi IT - ${brandName} w mieście ${cityName} | webwawa.pl`;
  const description = `Rozwiązania programistyczne dla firm powiązanych z marką ${brandName} w mieście ${cityName}. Skontaktuj się z nami po bezpłatną wycenę.`;

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const canonicalUrl = `https://webwawa.pl${langPrefix}/${citySlug}/${brandSlug}`;

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

export default async function CityBrandPage({ params }: PageProps) {
  const settings = await getGlobalSettings();
  const { lang, city: citySlug, brand: brandSlug } = await params;
  
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const brand = getBrandBySlug(brandSlug);
  if (!brand) notFound();

  const isPl = lang === 'pl';
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
      <section className="bg-slate-100 dark:bg-slate-900 py-20 text-slate-900 dark:text-white transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <nav className="flex justify-center mb-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Link href={homeUrl} className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`${langPrefix}/${citySlug}`} className="hover:text-primary transition-colors">{city.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-primary font-semibold">{brand.name}</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-6">
            Dedykowane Usługi IT dla branży <span className="gradient-text">{brand.name}</span> w mieście {city.name}
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
            {isPl 
              ? `Tworzymy systemy informatyczne i dedykowane oprogramowanie dostosowane do specyfiki sektora ${brand.name} w regionie ${city.name}.`
              : `We build software systems custom tailored for the ${brand.name} industry in ${city.name}.`}
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800/50 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">{isPl ? "Chcesz stworzyć z nami dedykowany projekt?" : "Want to create a custom project with us?"}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto">
            {isPl 
              ? `Porozmawiajmy o potrzebach technologicznych Twojej firmy w mieście ${city.name}.` 
              : `Let's talk about your company's technology needs in ${city.name}.`}
          </p>
          <a href={`tel:${settings?.phone || '+48664946209'}`} className="btn-primary py-4 px-10 rounded-full text-xl shadow-lg shadow-primary/20 inline-block">
            {settings?.phone || '+48 664 946 209'}
          </a>
        </div>
      </section>
    </main>
  );
}
