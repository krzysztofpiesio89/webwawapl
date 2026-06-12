import Link from 'next/link';

interface HeroSectionProps {
  lang: string;
  homeUrl: string;
  city: { slug: string; name: string } | null;
  brandUrl: string;
  industryName: string;
  modelName: string;
  brandLogo: string | null;
  carBrandSlug: string | null;
  t: {
    h1Prefix: string;
    heroSubWith: (name: string, car: string, city: string) => string;
    heroSubWithout: (name: string, city: string) => string;
  };
  carDetails: string;
  techSuffix: string;
  cityName: string;
  heroImageSrc: string;
}

export default function HeroSection({
  lang,
  homeUrl,
  city,
  brandUrl,
  industryName,
  modelName,
  brandLogo,
  carBrandSlug,
  t,
  carDetails,
  techSuffix,
  cityName,
  heroImageSrc,
}: HeroSectionProps) {
  return (
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
              <Link href={brandUrl} className="hover:text-primary transition-colors">{industryName}</Link>
              <span className="mx-2">/</span>
              <span className="text-primary font-semibold">{modelName}</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-6 flex items-center gap-4 flex-wrap">
              {brandLogo && (
                <img src={brandLogo} alt={`${carBrandSlug} Logo`} className="h-12 w-auto object-contain dark:invert" />
              )}
              <span>{t.h1Prefix} <span className="gradient-text">{modelName}</span>{carDetails ? <span className="text-primary"> {carDetails}</span> : ''}{techSuffix} - {cityName}</span>
            </h1>
            <p className="text-xl opacity-80 leading-relaxed text-slate-650 dark:text-slate-350">
              {carDetails
                ? t.heroSubWith(modelName, carDetails, cityName)
                : t.heroSubWithout(modelName, cityName)}
            </p>
          </div>
          <div className="lg:col-span-5 relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/40">
            <img 
              src={heroImageSrc} 
              alt={modelName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
