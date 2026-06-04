import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGlobalSettings } from '@/lib/settings';
import { getBrandBySlug, getWikiData, slugify } from '@/lib/brands';
import { getCityBySlug } from '@/lib/cities';
import UCarsPromo from '@/components/UCarsPromo';
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
  const description = dict.cityBrandPage.metaDescription.replace(/{brand}/g, brandName).replace(/{city}/g, cityName);
  const title = dict.cityBrandPage.metaTitle.replace(/{brand}/g, brandName).replace(/{city}/g, cityName);

  let ogImageUrl = 'https://skupautwawa.pl/images/skupautwawa.webp';
  if (brand && brand.models && brand.models.length > 0) {
    const firstModel = brand.models[0];
    const wikiData = getWikiData(brandSlug, firstModel.name);
    if (wikiData?.specs?.motofaktyImage || wikiData?.wiki?.imageUrl) {
      ogImageUrl = wikiData?.specs?.motofaktyImage || wikiData?.wiki?.imageUrl;
    }
  }

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const canonicalUrl = `https://skupautwawa.pl${langPrefix}/${citySlug}/${brandSlug}`;

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
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${brandName} ${cityName}`,
        }
      ]
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

  const dict = await getDictionary(lang as Locale);
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;

  return (
    <main className="min-h-screen">
      <section className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <nav className="flex justify-center mb-8 text-sm opacity-60">
            <Link href={homeUrl} className="hover:text-amber-400 transition-colors">{dict.breadcrumbs.home}</Link>
            <span className="mx-2">/</span>
            <Link href={`${langPrefix}/${citySlug}`} className="hover:text-amber-400 transition-colors">{city.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-amber-400 font-semibold">{brand.name}</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: dict.cityBrandPage.heroTitle.replace('{brand}', `<span class="gradient-text">${brand.name}</span>`).replace('{city}', city.name) }} />
          <p className="text-xl opacity-80 max-w-2xl mx-auto">
            {dict.cityBrandPage.heroSubtitle.replace(/{brand}/g, brand.name).replace(/{city}/g, city.name)}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-12">{dict.cityBrandPage.modelsTitle.replace('{brand}', brand.name)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brand.models.map((model) => {
              const wikiData = getWikiData(brandSlug, model.name);
              const imageUrl = wikiData?.specs?.motofaktyImage || wikiData?.wiki?.imageUrl;

              return (
                <Link
                  key={model.slug}
                  href={`${langPrefix}/${citySlug}/${slugify(brand.name)}/${model.slug}`}
                  className="glass-card overflow-hidden hover:shadow-2xl hover:border-amber-400 group transition-all duration-300 flex flex-col bg-white border border-slate-200/80 rounded-2xl"
                >
                  <div className="aspect-[16/10] w-full bg-slate-100 overflow-hidden relative border-b border-slate-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={`${brand.name} ${model.name}`}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/5 to-amber-500/5 flex items-center justify-center font-black text-slate-300 text-3xl italic tracking-tighter">
                        {brand.name[0]}{model.name}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-slate-800 group-hover:text-amber-600 transition-colors uppercase tracking-tight italic text-lg">
                        {model.name}
                      </span>
                      <span className="text-slate-300 group-hover:text-amber-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                    {wikiData?.specs && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {wikiData.specs.bodyType && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {wikiData.specs.bodyType.split('/')[0]}
                          </span>
                        )}
                        {wikiData.specs.fuel && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/10 text-amber-700 px-2 py-0.5 rounded">
                            {wikiData.specs.fuel.split('/')[0]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 prose dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold">{dict.cityBrandPage.seoTitle.replace(/{brand}/g, brand.name).replace(/{city}/g, city.name)}</h2>
          <p>
            {dict.cityBrandPage.seoP1.replace(/{brand}/g, brand.name).replace(/{city}/g, city.name)}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 not-prose">
            <div className="glass-card p-8 border-l-4 border-amber-400">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">{dict.cityBrandPage.card1Title.replace(/{brand}/g, brand.name).replace(/{city}/g, city.name)}</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6 font-medium">{dict.cityBrandPage.card1Desc.replace(/{brand}/g, brand.name).replace(/{city}/g, city.name)}</p>
              <Link href={`${langPrefix}/#wycena`} className="text-amber-600 dark:text-amber-400 font-bold hover:underline">{dict.cityBrandPage.card1Link}</Link>
            </div>
            <div className="glass-card p-8 border-l-4 border-amber-400">
              <h3 className="font-bold text-xl mb-4 text-slate-900 dark:text-white">{dict.cityBrandPage.card2Title.replace(/{brand}/g, brand.name).replace(/{city}/g, city.name)}</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6 font-medium">{dict.cityBrandPage.card2Desc.replace(/{brand}/g, brand.name).replace(/{city}/g, city.name)}</p>
              <a href={`tel:${settings?.phone || '+48664946209'}`} className="text-amber-600 dark:text-amber-400 font-bold hover:underline">{dict.cityBrandPage.card2Link}</a>
            </div>
          </div>
        </div>
      </section>

      <div className="h-16 md:h-24 bg-slate-50 dark:bg-slate-800/50"></div>

      {/* uCars.pl Premium Advertisement Carousel */}
      <UCarsPromo dict={dict.uCarsPromo} />
    </main>
  );
}
