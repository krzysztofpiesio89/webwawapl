import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/ContactForm';
import UCarsPromo from '@/components/UCarsPromo';
import Link from 'next/link';
import { getGlobalSettings } from '@/lib/settings';
import { getBrandBySlug, getModelBySlug, getWikiData, slugify } from '@/lib/brands';
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
  const wikiData = getWikiData(brandSlug, modelName);
  const wikiDescRaw = wikiData?.wiki?.description;
  const wikiDesc = typeof wikiDescRaw === 'string' ? wikiDescRaw : (wikiDescRaw?.[lang] || wikiDescRaw?.pl);
  const dict = await getDictionary(lang as Locale);

  const title = dict.citySeriesPage.metaTitle.replace(/{brand}/g, brandName).replace(/{model}/g, modelName).replace(/{series}/g, seriesName).replace(/{city}/g, cityName);
  
  const baseDescription = dict.citySeriesPage.metaDescription.replace(/{brand}/g, brandName).replace(/{model}/g, modelName).replace(/{series}/g, seriesName).replace(/{city}/g, cityName);
  const description = wikiDesc 
    ? `${wikiDesc.substring(0, 100)}... ${baseDescription}`
    : baseDescription;

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const canonicalUrl = `https://skupautwawa.pl${langPrefix}/${citySlug}/${brandSlug}/${modelSlug}/${seriesSlug}`;

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
          alt: `${brandName} ${modelName} ${seriesName} - ${cityName}`,
        }
      ]
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

  // Fetch wiki and specs from JSON
  const wikiData = getWikiData(brandSlug, modelName);
  const wikiDescRaw = wikiData?.wiki?.description;
  const wikiDesc = typeof wikiDescRaw === 'string' ? wikiDescRaw : (wikiDescRaw?.[lang] || wikiDescRaw?.pl);
  const finalImageUrl = wikiData?.specs?.motofaktyImage || wikiData?.wiki?.imageUrl;

  // Schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": `Skup i Kasacja ${cityName} - ${brandName} ${modelName} ${series.name}`,
    "description": wikiDesc || dict.citySeriesPage.metaDescription.replace(/{brand}/g, brandName).replace(/{model}/g, modelName).replace(/{series}/g, series.name).replace(/{city}/g, cityName),
    "url": `https://skupautwawa.pl${langPrefix}/${citySlug}/${brandSlug}/${modelSlug}/${seriesSlug}`,
    "telephone": "+48664946209",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressCountry": "PL"
    },
    "offer": {
      "@type": "Offer",
      "priceCurrency": "PLN",
      "availability": "https://schema.org/InStock",
      "itemOffered": {
        "@type": "Vehicle",
        "brand": brandName,
        "model": modelName,
        "description": series.years,
        "bodyType": wikiData?.specs?.bodyType || "Car",
        "vehicleEngine": wikiData?.specs?.engine || "Standard",
        "fuelType": wikiData?.specs?.fuel || "Gasoline",
        "driveWheelConfiguration": wikiData?.specs?.drive || "Front-wheel drive"
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Breadcrumbs */}
      <nav className="flex mb-8 text-sm text-slate-500 font-semibold">
        <Link href={homeUrl} className="hover:text-amber-600 transition-colors">{dict.breadcrumbs.home}</Link>
        <span className="mx-2">/</span>
        <Link href={`${langPrefix}/${citySlug}`} className="hover:text-amber-600 transition-colors">{cityName}</Link>
        <span className="mx-2">/</span>
        <Link href={`${langPrefix}/${citySlug}/${brandSlug}`} className="hover:text-amber-600 transition-colors">{brandName}</Link>
        <span className="mx-2">/</span>
        <Link href={`${langPrefix}/${citySlug}/${brandSlug}/${modelSlug}`} className="hover:text-amber-600 transition-colors">{modelName}</Link>
        <span className="mx-2">/</span>
        <span className="text-amber-600">{series.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div className="animate-fade-in">
          {/* Car Image and Specs Preview Card */}
          {finalImageUrl && (
            <div className="mb-8 space-y-4">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 aspect-[16/9] relative group">
                <img 
                  src={finalImageUrl} 
                  alt={`${brandName} ${modelName} ${series.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                {wikiData.specs?.bodyType && (
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-black text-slate-800 uppercase tracking-wider">
                    🚗 {dict.citySeriesPage.values[wikiData.specs.bodyType.toLowerCase() as keyof typeof dict.citySeriesPage.values] || wikiData.specs.bodyType}
                  </div>
                )}
                {series.years && (
                  <div className="absolute bottom-4 right-4 bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg">
                    📅 {series.years}
                  </div>
                )}
              </div>
              
              {/* Mini gallery thumbnails */}
              {wikiData.wiki.images && wikiData.wiki.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {wikiData.wiki.images.slice(0, 4).map((imgUrl: string, idx: number) => (
                    <div 
                      key={idx}
                      className="aspect-[16/10] rounded-xl overflow-hidden border-2 border-white shadow-sm hover:border-amber-400 hover:scale-105 transition-all bg-slate-100"
                    >
                      <img src={imgUrl} className="w-full h-full object-cover" alt={`${brandName} ${modelName} - rzut oka ${idx + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-6" dangerouslySetInnerHTML={{ __html: dict.citySeriesPage.heroTitle.replace(/{brand}/g, `<span class="gradient-text">${brandName}</span>`).replace(/{model}/g, `<span class="gradient-text">${modelName}</span>`).replace(/{city}/g, `<span class="text-amber-700">${cityName}</span>`) }} />
          <p className="text-xl opacity-80 mb-8 leading-relaxed font-medium text-slate-600" dangerouslySetInnerHTML={{ __html: dict.citySeriesPage.heroSubtitle.replace(/{brand}/g, `<strong>${brandName}</strong>`).replace(/{model}/g, `<strong>${modelName}</strong>`).replace(/{series}/g, `<strong>${series.name}</strong>`).replace(/{years}/g, series.years).replace(/{city}/g, cityName) }} />
          
          <ul className="space-y-4 mb-10">
            {[dict.citySeriesPage.benefit1, dict.citySeriesPage.benefit2, dict.citySeriesPage.benefit3, dict.citySeriesPage.benefit4].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="bg-amber-400 p-1 rounded-full">
                  <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-bold text-slate-800">{item}</span>
              </li>
            ))}
          </ul>

          <a href={`tel:${settings?.phone || '+48664946209'}`} className="btn-primary inline-flex items-center gap-3 text-xl font-bold">
            {dict.citySeriesPage.callBtn}
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

      {/* Wiki & Specs Card section */}
      {wikiData && (
        <section className="py-16 border-t border-b border-slate-200/60 bg-slate-50 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:rounded-3xl mb-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block py-1.5 px-4 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-700 text-xs font-bold mb-3 uppercase tracking-wider">
                📚 {dict.citySeriesPage.wikiTitle}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tight">
                {dict.citySeriesPage.wikiSubtitle.replace(/{brand}/g, brandName).replace(/{model}/g, modelName).replace(/{series}/g, series.name)}
              </h2>
              <div className="w-20 h-1 bg-amber-400 mx-auto mt-3 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Description */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
                  <h3 className="text-xl font-black text-slate-900 mb-4 uppercase italic">{dict.citySeriesPage.wikiDescTitle}</h3>
                  <p className="text-slate-600 leading-relaxed text-base font-semibold">
                    {wikiDesc || dict.citySeriesPage.wikiDescFallback.replace(/{series}/g, series.name).replace(/{years}/g, series.years)}
                  </p>
                </div>

                <div className="bg-amber-400/10 border border-amber-400/30 p-6 rounded-2xl">
                  <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-2">
                    <span>💡</span> {dict.citySeriesPage.wikiFactTitle.replace(/{series}/g, series.name)}
                  </h4>
                  <p className="text-sm text-amber-900 font-semibold opacity-95">
                    {dict.citySeriesPage.wikiFactDesc.replace(/{brand}/g, brandName).replace(/{model}/g, modelName).replace(/{series}/g, series.name).replace(/{years}/g, series.years).replace(/{city}/g, cityName)}
                  </p>
                </div>
              </div>

              {/* Technical specifications panel */}
              <div className="lg:col-span-5">
                <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
                  <h3 className="text-lg font-black mb-4 uppercase tracking-tight italic flex items-center gap-2">
                    📊 {dict.citySeriesPage.specsTitle}
                  </h3>

                  <div className="space-y-3.5 text-sm font-semibold">
                    <div className="flex justify-between py-2.5 border-b border-slate-800">
                      <span className="text-slate-400">{dict.citySeriesPage.specYears}:</span>
                      <span className="text-white font-bold">{series.years}</span>
                    </div>
                    {wikiData.specs?.bodyType && (
                      <div className="flex justify-between py-2.5 border-b border-slate-800">
                        <span className="text-slate-400">{dict.citySeriesPage.specBody}:</span>
                        <span className="text-white font-bold">{dict.citySeriesPage.values[wikiData.specs.bodyType.toLowerCase() as keyof typeof dict.citySeriesPage.values] || wikiData.specs.bodyType}</span>
                      </div>
                    )}
                    {wikiData.specs?.engine && (
                      <div className="flex justify-between py-2.5 border-b border-slate-800">
                        <span className="text-slate-400">{dict.citySeriesPage.specEngine}:</span>
                        <span className="text-white font-bold max-w-[180px] truncate">{wikiData.specs.engine}</span>
                      </div>
                    )}
                    {wikiData.specs?.fuel && (
                      <div className="flex justify-between py-2.5 border-b border-slate-800">
                        <span className="text-slate-400">{dict.citySeriesPage.specFuel}:</span>
                        <span className="text-white font-bold">{dict.citySeriesPage.values[wikiData.specs.fuel.toLowerCase() as keyof typeof dict.citySeriesPage.values] || wikiData.specs.fuel}</span>
                      </div>
                    )}
                    {wikiData.specs?.drive && (
                      <div className="flex justify-between py-2.5 border-b border-slate-800">
                        <span className="text-slate-400">{dict.citySeriesPage.specDrive}:</span>
                        <span className="text-white font-bold">{dict.citySeriesPage.values[wikiData.specs.drive.toLowerCase() as keyof typeof dict.citySeriesPage.values] || wikiData.specs.drive}</span>
                      </div>
                    )}
                    {wikiData.wiki?.infobox && Object.entries(wikiData.wiki.infobox).map(([key, value]) => {
                      const valStr = typeof value === 'string' ? value : ((value as any)?.[lang] || (value as any)?.pl);
                      const translatedKey = dict.citySeriesPage.keys[key.toLowerCase() as keyof typeof dict.citySeriesPage.keys] || key;
                      return (
                        <div key={key} className="flex justify-between py-2.5 border-b border-slate-800 capitalize">
                          <span className="text-slate-400">{translatedKey}:</span>
                          <span className="text-white font-bold text-right">{String(valStr)}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between py-2.5">
                      <span className="text-slate-400">{dict.citySeriesPage.specOldtimer}:</span>
                      <span className="text-amber-400 font-bold">{wikiData.specs?.isOldtimer ? dict.citySeriesPage.yes : dict.citySeriesPage.no}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Content Section for SEO */}
      <section className="mt-12 prose prose-slate max-w-none">
        <h2 className="text-3xl font-black text-slate-900 uppercase italic mb-6">{dict.citySeriesPage.seoTitle.replace(/{city}/g, cityName)}</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          {dict.citySeriesPage.seoDesc.replace(/{city}/g, cityName).replace(/{brand}/g, brandName).replace(/{model}/g, modelName).replace(/{series}/g, series.name)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 not-prose">
          <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl">
            <h3 className="font-bold text-xl text-slate-900 mb-3">{dict.citySeriesPage.seoCard1Title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-semibold">{dict.citySeriesPage.seoCard1Desc}</p>
          </div>
          <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl">
            <h3 className="font-bold text-xl text-slate-900 mb-3">{dict.citySeriesPage.seoCard2Title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-semibold">{dict.citySeriesPage.seoCard2Desc}</p>
          </div>
          <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl">
            <h3 className="font-bold text-xl text-slate-900 mb-3">{dict.citySeriesPage.seoCard3Title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-semibold">{dict.citySeriesPage.seoCard3Desc}</p>
          </div>
        </div>
      </section>

      <div className="h-16 md:h-24"></div>

      {/* uCars.pl Premium Advertisement Carousel */}
      <UCarsPromo dict={dict.uCarsPromo} />
    </div>
  );
}
