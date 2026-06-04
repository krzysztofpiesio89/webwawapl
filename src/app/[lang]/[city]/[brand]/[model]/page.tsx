import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/ContactForm';
import UCarsPromo from '@/components/UCarsPromo';
import Link from 'next/link';
import { getBrandBySlug, getModelBySlug, getWikiData, slugify } from '@/lib/brands';
import { getCityBySlug } from '@/lib/cities';
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
  const dict = await getDictionary(lang as Locale);
  
  const cityName = city?.name || 'Warszawa';
  const wikiData = getWikiData(brandSlug, modelName);
  
  const wikiDescRaw = wikiData?.wiki?.description;
  const wikiDesc = typeof wikiDescRaw === 'string' ? wikiDescRaw : (wikiDescRaw?.[lang] || wikiDescRaw?.pl);
  const baseDescription = dict.cityModelPage.metaDescription.replace(/{brand}/g, brandName).replace(/{model}/g, modelName).replace(/{city}/g, cityName);
  
  const description = wikiDesc 
    ? `${wikiDesc.substring(0, 100)}... ${baseDescription}`
    : baseDescription;

  const title = dict.cityModelPage.metaTitle.replace(/{brand}/g, brandName).replace(/{model}/g, modelName).replace(/{city}/g, cityName);

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const canonicalUrl = `https://skupautwawa.pl${langPrefix}/${citySlug}/${brandSlug}/${modelSlug}`;

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
          url: wikiData?.specs?.motofaktyImage || wikiData?.wiki?.imageUrl || 'https://skupautwawa.pl/images/skupautwawa.webp',
          width: 1200,
          height: 630,
          alt: `${brandName} ${modelName} - ${cityName}`,
        }
      ]
    }
  };
}

export default async function CityBrandModelPage({ params }: PageProps) {
  const { lang, city: citySlug, brand: brandSlug, model: modelSlug } = await params;
  
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const brand = getBrandBySlug(brandSlug);
  if (!brand) notFound();

  const model = getModelBySlug(brand, modelSlug);
  if (!model) notFound();

  const dict = await getDictionary(lang as Locale);
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;

  // Fetch wiki and specs from JSON
  const wikiData = getWikiData(brandSlug, model.name);
  const wikiDescRaw = wikiData?.wiki?.description;
  const wikiDesc = typeof wikiDescRaw === 'string' ? wikiDescRaw : (wikiDescRaw?.[lang] || wikiDescRaw?.pl);
  const finalImageUrl = wikiData?.specs?.motofaktyImage || wikiData?.wiki?.imageUrl;

  // Schema.org AutoDealer & Vehicle Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": `Skup i Kasacja ${brand.name} ${model.name} - ${city.name}`,
    "description": wikiDesc || dict.cityModelPage.metaDescription.replace(/{brand}/g, brand.name).replace(/{model}/g, model.name).replace(/{city}/g, city.name),
    "url": `https://skupautwawa.pl${langPrefix}/${citySlug}/${brandSlug}/${modelSlug}`,
    "telephone": "+48664946209",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city.name,
      "addressCountry": "PL"
    },
    "offer": {
      "@type": "Offer",
      "priceCurrency": "PLN",
      "availability": "https://schema.org/InStock",
      "itemOffered": {
        "@type": "Vehicle",
        "brand": brand.name,
        "model": model.name,
        "bodyType": wikiData?.specs?.bodyType || "Car",
        "vehicleEngine": wikiData?.specs?.engine || "Standard",
        "fuelType": wikiData?.specs?.fuel || "Gasoline",
        "driveWheelConfiguration": wikiData?.specs?.drive || "Front-wheel drive"
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <nav className="flex justify-center mb-8 text-sm opacity-60 font-medium">
            <Link href={homeUrl} className="hover:text-amber-400 transition-colors">{dict.breadcrumbs.home}</Link>
            <span className="mx-2">/</span>
            <Link href={`${langPrefix}/${citySlug}`} className="hover:text-amber-400 transition-colors">{city.name}</Link>
            <span className="mx-2">/</span>
            <Link href={`${langPrefix}/${citySlug}/${brandSlug}`} className="hover:text-amber-400 transition-colors">{brand.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-amber-400 font-semibold">{model.name}</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-6" dangerouslySetInnerHTML={{ __html: dict.cityModelPage.heroTitle.replace('{brand}', `<span class="gradient-text">${brand.name}</span>`).replace('{model}', `<span class="gradient-text">${model.name}</span>`).replace('{city}', city.name) }} />
          <p className="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
            {dict.cityModelPage.heroSubtitle.replace(/{brand}/g, brand.name).replace(/{model}/g, model.name).replace(/{city}/g, city.name)}
          </p>
        </div>
      </section>

      {/* Select Version Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tight">
              {dict.cityModelPage.versionsTitle.replace(/{brand}/g, brand.name).replace(/{model}/g, model.name)}
            </h2>
            <p className="text-slate-500 mt-4 font-medium">{dict.cityModelPage.versionsSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
            {/* Left: Car Image & Specs Preview Card */}
            {finalImageUrl && (
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 aspect-[16/10] relative group">
                  <img 
                    src={finalImageUrl} 
                    alt={`${brand.name} ${model.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                  {wikiData?.specs?.bodyType && (
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-black text-slate-800 uppercase tracking-wider">
                      🚗 {dict.citySeriesPage.values[wikiData.specs.bodyType.toLowerCase() as keyof typeof dict.citySeriesPage.values] || wikiData.specs.bodyType}
                    </div>
                  )}
                </div>
                {wikiDesc && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                    <p className="text-sm text-slate-600 font-semibold leading-relaxed">
                      {wikiDesc}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Right: Versions grid */}
            <div className={`${finalImageUrl ? 'lg:col-span-7' : 'lg:col-span-12'} grid grid-cols-1 sm:grid-cols-2 gap-6`}>
              {model.series.map((s: any) => (
                <Link
                  key={s.name}
                  href={`${langPrefix}/${citySlug}/${brandSlug}/${modelSlug}/${encodeURIComponent(s.name.toLowerCase().replace(/\s+/g, '-'))}`}
                  className="p-6 bg-white border border-slate-200/80 rounded-2xl flex justify-between items-center hover:border-amber-400 hover:shadow-xl transition-all duration-300 group"
                >
                  <div>
                    <div className="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">{s.name}</div>
                    <div className="text-sm text-slate-400 mt-1 font-semibold">{s.years}</div>
                  </div>
                  <div className="text-slate-300 group-hover:text-amber-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wiki & Specs Section */}
      {wikiData && (
        <section className="py-20 bg-white border-t border-b border-slate-200/60">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block py-1.5 px-4 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-700 text-xs font-bold mb-4 uppercase tracking-wider">
                📚 {dict.cityModelPage.wikiTitle}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tight" dangerouslySetInnerHTML={{ __html: dict.cityModelPage.wikiSubtitle.replace(/{brand}/g, `<span class="gradient-text">${brand.name}</span>`).replace(/{model}/g, `<span class="gradient-text">${model.name}</span>`) }} />
              <div className="w-24 h-1 bg-amber-400 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Description & Facts */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80">
                  <h3 className="text-xl font-black text-slate-900 mb-4 uppercase italic">{dict.cityModelPage.wikiDescTitle}</h3>
                  <p className="text-slate-600 leading-relaxed text-base font-medium">
                    {wikiDesc || dict.cityModelPage.wikiDescFallback.replace(/{brand}/g, brand.name).replace(/{model}/g, model.name)}
                  </p>
                </div>

                {/* Facts Block */}
                <div className="bg-amber-400/10 border border-amber-400/30 p-8 rounded-3xl">
                  <h3 className="text-lg font-black text-amber-800 mb-3 uppercase italic flex items-center gap-2">
                    💡 {dict.cityModelPage.wikiFactTitle}
                  </h3>
                  <p className="text-amber-900 font-bold text-sm leading-relaxed opacity-95">
                    {dict.cityModelPage.wikiFactDesc.replace(/{brand}/g, brand.name).replace(/{model}/g, model.name).replace(/{city}/g, city.name)}
                  </p>
                </div>
              </div>

              {/* Right Column: Technical Specs Card */}
              <div className="lg:col-span-5">
                <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden border border-slate-800">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <h3 className="text-lg font-black mb-6 uppercase tracking-tight italic flex items-center gap-2">
                    📊 {dict.cityModelPage.specsTitle.replace(/{model}/g, model.name)}
                  </h3>

                  <div className="space-y-4 text-sm font-medium">
                    {wikiData.specs?.bodyType && (
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">{dict.cityModelPage.specBody}</span>
                        <span className="text-white font-bold text-right">{dict.citySeriesPage.values[wikiData.specs.bodyType.toLowerCase() as keyof typeof dict.citySeriesPage.values] || wikiData.specs.bodyType}</span>
                      </div>
                    )}
                    {wikiData.specs?.engine && (
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">{dict.cityModelPage.specEngine}</span>
                        <span className="text-white font-bold text-right max-w-[200px] truncate">{wikiData.specs.engine}</span>
                      </div>
                    )}
                    {wikiData.specs?.fuel && (
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">{dict.cityModelPage.specFuel}</span>
                        <span className="text-white font-bold text-right">{dict.citySeriesPage.values[wikiData.specs.fuel.toLowerCase() as keyof typeof dict.citySeriesPage.values] || wikiData.specs.fuel}</span>
                      </div>
                    )}
                     {wikiData.specs?.drive && (
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">{dict.cityModelPage.specDrive}</span>
                        <span className="text-white font-bold text-right">{dict.citySeriesPage.values[wikiData.specs.drive.toLowerCase() as keyof typeof dict.citySeriesPage.values] || wikiData.specs.drive}</span>
                      </div>
                    )}
                    {wikiData.specs?.segment && (
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">{dict.cityModelPage.specSegment}</span>
                        <span className="text-white font-bold text-right">{wikiData.specs.segment}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3">
                      <span className="text-slate-400">{dict.cityModelPage.specOldtimer}</span>
                      <span className="text-amber-400 font-bold text-right">{wikiData.specs?.isOldtimer ? dict.citySeriesPage.yes : dict.citySeriesPage.no}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SEO & Conversion Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 prose prose-slate max-w-none">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase italic">{dict.cityModelPage.seoTitle.replace(/{brand}/g, brand.name).replace(/{model}/g, model.name)}</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-12">
              {dict.cityModelPage.seoDesc}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 not-prose">
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:border-amber-400 transition-all">
                <div className="text-3xl mb-4">✍️</div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{dict.cityModelPage.seoCard1Title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-semibold">{dict.cityModelPage.seoCard1Desc.replace(/{city}/g, city.name)}</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:border-amber-400 transition-all">
                <div className="text-3xl mb-4">💰</div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{dict.cityModelPage.seoCard2Title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-semibold">{dict.cityModelPage.seoCard2Desc.replace(/{brand}/g, brand.name).replace(/{model}/g, model.name)}</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:border-amber-400 transition-all">
                <div className="text-3xl mb-4">🚚</div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{dict.cityModelPage.seoCard3Title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-semibold">{dict.cityModelPage.seoCard3Desc.replace(/{model}/g, model.name).replace(/{city}/g, city.name)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-16 md:h-24"></div>

      {/* uCars.pl Premium Advertisement Carousel */}
      <UCarsPromo dict={dict.uCarsPromo} />
    </main>
  );
}
