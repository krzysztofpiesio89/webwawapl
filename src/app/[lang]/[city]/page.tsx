import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGlobalSettings } from '@/lib/settings';
import { getAllBrands } from '@/lib/brands';
import { getCityBySlug } from '@/lib/cities';
import UCarsPromo from '@/components/UCarsPromo';
import { getDictionary, Locale, ogLocaleMap } from '../dictionaries';

interface PageProps {
  params: Promise<{ lang: string;
    city: string;
   }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  const dict = await getDictionary(lang as Locale);
  
  const cityName = city?.name || 'Warszawa';
  const description = dict.cityPage.metaDescription.replace('{city}', cityName);
  const title = dict.cityPage.metaTitle.replace('{city}', cityName);
  
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const canonicalUrl = `https://skupautwawa.pl${langPrefix}/${citySlug}`;

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
      siteName: 'skupautwawa.pl',
      locale: ogLocaleMap[lang as Locale],
      type: 'website',
    }
  };
}

export default async function CityPage({ params }: PageProps) {
  const settings = getGlobalSettings();
  const { lang, city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  
  if (!city) notFound();

  const dict = await getDictionary(lang as Locale);
  const brands = getAllBrands();
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;

  return (
    <main className="min-h-screen">
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: dict.cityPage.heroTitle.replace('{city}', `<span class="gradient-text">${city.name}</span>`) }} />
          <p className="text-xl opacity-80 max-w-2xl mx-auto">
            {dict.cityPage.heroSubtitle.replace('{city}', city.name)}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-12">{dict.cityPage.brandsTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`${langPrefix}/${citySlug}/${brand.slug}`}
                className="glass-card p-4 flex flex-col items-center justify-center gap-4 text-center hover:bg-amber-400 text-slate-800 hover:text-slate-900 transition-all font-bold group"
              >
                {brand.logoUrl ? (
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img 
                      src={brand.logoUrl} 
                      alt={`Skup ${brand.name}`} 
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl text-slate-400 group-hover:bg-amber-300 group-hover:text-slate-800 transition-colors">
                    {brand.name.charAt(0)}
                  </div>
                )}
                <span className="text-sm md:text-base leading-tight">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* uCars.pl Premium Advertisement */}
      <UCarsPromo dict={dict.uCarsPromo} />

      {/* SEO Content */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 prose dark:prose-invert max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3>{dict.cityPage.seoTitle1.replace('{city}', city.name)}</h3>
              <p>
                {dict.cityPage.seoP1.replace(/{city}/g, city.name)}
              </p>
              <h3>{dict.cityPage.seoTitle2.replace('{city}', city.name)}</h3>
              <p>
                {dict.cityPage.seoP2.replace(/{city}/g, city.name)}
              </p>
            </div>
            <div className="glass-card text-slate-800 dark:text-slate-100 p-8 rounded-3xl not-prose shadow-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{dict.cityPage.quickContactTitle.replace('{city}', city.name)}</h3>
              <p className="mb-6 text-slate-600 dark:text-slate-300 opacity-80 italic text-sm">{dict.cityPage.quickContactDesc.replace('{city}', city.name)}</p>
              <div className="space-y-4">
                <a href={`tel:${settings?.phone || '+48664946209'}`} className="btn-primary w-full text-center block text-2xl py-6">
                  {settings?.phone || '+48 664 946 209'}
                </a>
                <p className="text-center text-xs opacity-50 text-slate-500 dark:text-slate-400">{dict.cityPage.hoursNotice}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
