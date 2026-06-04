import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from '@/components/ContactForm';
import UCarsPromo from '@/components/UCarsPromo';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import { getGlobalSettings } from '@/lib/settings';
import { getCityBySlug } from '@/lib/cities';
import { getDictionary, Locale } from './dictionaries';
import { getLocalizedStaticPath } from './i18n-routes';
import { getBrandLogo } from '@/lib/brands';

export default async function Home(props: { params: Promise<{ lang: string  }> }) {
  const params = await props.params;
  const settings = getGlobalSettings();
  const cookieStore = await cookies();
  const userCitySlug = cookieStore.get('user-city')?.value || 'warszawa';
  
  const city = getCityBySlug(userCitySlug);
  const cityName = city?.name || 'Warszawa';
  const dict = await getDictionary(params.lang as Locale);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-36 overflow-hidden flex items-center min-h-[80vh] bg-slate-950">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/skupautwawa.webp" 
            alt="Profesjonalny skup aut na tle Warszawy"
            className="w-full h-full object-cover object-center"
            fill
            priority
            sizes="100vw"
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-slate-950/30 sm:hidden" /> {/* Extra darkening for mobile where gradient might not cover enough */}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl text-left space-y-8">
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-400 text-sm font-bold animate-fade-in uppercase tracking-wider backdrop-blur-sm">
              {dict.hero.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight leading-none uppercase italic">
              {dict.hero.title} <br /> 
              <span className="text-amber-400 block mt-2 drop-shadow-md">{dict.hero.titleHighlight}</span>
            </h1>
            <p 
              className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl font-medium drop-shadow"
              dangerouslySetInnerHTML={{ __html: dict.hero.description.replace('{city}', `<span class="text-white font-bold underline decoration-amber-400 decoration-4">${cityName}</span>`) }}
            />
            
            <div className="flex flex-col sm:flex-row gap-6 items-stretch sm:items-center">
              <a href="#wycena" className="btn-primary text-xl px-10 py-5 text-center shadow-lg shadow-amber-500/20">
                {dict.hero.ctaPrimary}
              </a>
              <div className="flex flex-col items-center sm:items-start gap-1">
                <a href={`tel:${settings?.phone || '+48664946209'}`} className="text-2xl md:text-3xl font-black text-white hover:text-amber-400 transition-colors flex items-center gap-2 drop-shadow-md">
                  {settings?.phone || '+48 664 946 209'}
                </a>
                <span className="text-slate-300 text-sm font-medium">{dict.hero.emailLabel} {settings?.email || 'kontakt@skupautwawa.pl'}</span>
              </div>
            </div>

            {/* Trust signals */}
            <div className="pt-8 border-t border-slate-700/60 flex flex-wrap gap-6 items-center text-slate-300 text-sm">
              <span className="flex items-center gap-2 font-medium">{dict.hero.trustLegal}</span>
              <span className="flex items-center gap-2 font-medium">{dict.hero.trustFreePickup}</span>
              <span className="flex items-center gap-2 font-medium">{dict.hero.trustInstantPay}</span>
            </div>
          </div>
        </div>

        {/* Floating badge inside image (moved to bottom right of the hero section) */}
        <div className="absolute bottom-8 right-8 hidden lg:flex bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl shadow-2xl items-center gap-4 border border-white/10">
          <div className="bg-amber-400 p-3 rounded-xl text-slate-950 font-black text-xl">
            {dict.hero.floatingBadge24h}
          </div>
          <div className="text-left">
            <div className="font-bold text-white text-sm">{dict.hero.floatingBadgeTitle}</div>
            <p className="text-slate-300 text-xs">{dict.hero.floatingBadgeDesc.replace('{city}', cityName)}</p>
          </div>
        </div>
      </section>

      {/* Trust & Process Bar */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { ...dict.features.freeValuation, icon: '💰' },
              { ...dict.features.freePickup, icon: '🚚' },
              { ...dict.features.bestPrices, icon: '📈' },
              { ...dict.features.instantCash, icon: '⚡' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-4xl">{item.icon}</div>
                <div>
                  <h2 className="font-black text-slate-900 uppercase tracking-tighter text-lg">{item.title}</h2>
                  <p className="text-slate-500 text-sm leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-8">
                {dict.content.mainTitle} <br />
                <span className="text-amber-700 underline decoration-slate-900 underline-offset-8">{dict.content.mainTitleHighlight}</span>
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                {dict.content.mainP1}
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                {dict.content.mainP2}
              </p>

              <div className="mt-12 space-y-6 not-prose">
                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">
                  {dict.content.categoriesTitle}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dict.content.categories.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-amber-400 hover:shadow-md transition-all duration-300">
                      <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-black">
                        ✓
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-slate-900 text-base mb-1">{item.title}</h4>
                        <p className="text-slate-500 text-xs leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="text-3xl font-black text-slate-900 mt-16 mb-6">{dict.content.clientsTitle}</h3>
              <p className="text-slate-600 mb-8">{dict.content.clientsDesc}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose text-center">
                {dict.content.clientTypes.map(tag => (
                  <div key={tag} className="bg-white p-4 rounded-xl border border-slate-200 text-slate-800 font-bold text-sm shadow-sm">
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            <div id="wycena" className="sticky top-28">
              <ContactForm lang={params.lang} defaultCity={cityName} settings={settings} dict={dict.form} />
              <div className="mt-8 p-8 bg-amber-400 rounded-3xl shadow-xl">
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase italic">{dict.content.quickContactTitle}</h3>
                <p className="text-slate-900 font-medium mb-6 opacity-80">{dict.content.quickContactDesc}</p>
                <a href={`tel:${settings?.phone || '+48664946209'}`} className="flex items-center justify-center gap-4 bg-slate-900 text-white p-5 rounded-2xl text-2xl font-black hover:scale-105 transition-transform">
                  <span>📞</span> {settings?.phone || '+48 664 946 209'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kasacja Pojazdów Section */}
      <section className="py-24 bg-slate-50 text-slate-900 relative overflow-hidden border-t border-b border-slate-100">
        {/* Background decorative gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block py-1 px-4 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-700 text-sm font-bold mb-4 uppercase tracking-widest">
              {dict.kasacja.badge}
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-slate-900">
              {dict.kasacja.title}
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              {dict.kasacja.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300">
              <div className="text-4xl mb-6">📄</div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 uppercase tracking-tight">{dict.kasacja.card1Title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: dict.kasacja.card1Desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300">
              <div className="text-4xl mb-6">🚚</div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 uppercase tracking-tight">{dict.kasacja.card2Title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: dict.kasacja.card2Desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300">
              <div className="text-4xl mb-6">💰</div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 uppercase tracking-tight">{dict.kasacja.card3Title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: dict.kasacja.card3Desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl max-w-2xl mx-auto shadow-sm">
              <span className="text-amber-700 font-bold">{dict.kasacja.legalBadge}</span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="text-slate-600 text-sm">{dict.kasacja.legalDesc}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Sections */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tighter">{dict.process.title}</h2>
            <p className="text-xl text-slate-500">{dict.process.subtitle}</p>
          </div>

          <div className="space-y-16">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true" className="select-none text-slate-100 flex-shrink-0">
                <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="96" fontWeight="900" fill="currentColor">01</text>
              </svg>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase">{dict.process.step1Title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {dict.process.step1Desc}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true" className="select-none text-slate-100 flex-shrink-0">
                <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="96" fontWeight="900" fill="currentColor">02</text>
              </svg>
              <div className="text-right">
                <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase">{dict.process.step2Title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {dict.process.step2Desc}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true" className="select-none text-slate-100 flex-shrink-0">
                <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="96" fontWeight="900" fill="currentColor">03</text>
              </svg>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase">{dict.process.step3Title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: dict.process.step3Desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* uCars.pl Premium Advertisement */}
      <UCarsPromo dict={dict.uCarsPromo} />

      {/* Dynamic Gallery */}
      <Gallery dict={dict.recentBuys} />

      {/* Google-like Reviews */}
      <Reviews dict={dict.reviews} />

      {/* Brands Preview (SEO) */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 text-slate-900">{dict.brandsSection.title.replace('{city}', cityName)}</h2>
            <p className="text-slate-500">{dict.brandsSection.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {['Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Toyota', 'Ford', 'Opel', 'Renault', 'Skoda', 'Mazda', 'Honda', 'Volvo'].map((brand) => {
              const brandSlug = brand.toLowerCase();
              const logoUrl = getBrandLogo(brandSlug);
              return (
              <Link 
                key={brand}
                href={`/${params.lang === 'pl' ? '' : params.lang + '/'}${userCitySlug}/${brandSlug}`}
                className="p-4 md:p-6 bg-slate-50 hover:bg-white rounded-2xl flex flex-col items-center justify-center gap-4 text-center border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all group"
              >
                {logoUrl ? (
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img 
                      src={logoUrl} 
                      alt={brand} 
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-2xl text-slate-400 group-hover:bg-amber-300 group-hover:text-slate-800 transition-colors">
                    {brand.charAt(0)}
                  </div>
                )}
                <div className="font-bold text-sm md:text-lg text-slate-800 group-hover:text-amber-600 transition-colors truncate">
                  {brand}
                </div>
              </Link>
            )})}
          </div>
          <div className="text-center mt-12">
            <Link href={getLocalizedStaticPath('brands', params.lang as Locale)} className="text-amber-700 hover:text-amber-800 font-bold hover:underline">
              {dict.brandsSection.seoLink.replace('{city}', cityName)}
            </Link>
          </div>
        </div>
      </section>

      {/* Legal Footer Info */}
      <section className="py-12 bg-slate-100 text-center">
        <div className="container mx-auto px-4">
          <p className="text-xs text-slate-600 mb-2 uppercase font-bold tracking-widest">
            {dict.legal.companyInfo.replace('{companyName}', settings?.companyName || 'Skup Aut').replace('{nip}', settings?.nip || '-').replace('{krs}', settings?.krs || '-').replace('{regon}', settings?.regon || '-')}
          </p>
          <p className="text-[10px] text-slate-600">
            {dict.legal.addressInfo.replace('{address}', settings?.address || '-')}
          </p>
        </div>
      </section>
    </main>
  );
}
