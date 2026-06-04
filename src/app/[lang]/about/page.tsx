import { Metadata } from 'next';
import Link from 'next/link';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale } from '../dictionaries';

export async function generateMetadata(props: { params: Promise<{ lang: string  }> }): Promise<Metadata> {
  const params = await props.params;
  const dict = await getDictionary(params.lang as Locale);
  return {
    title: dict.about.metaTitle,
    description: dict.about.metaDescription,
  };
}

export default async function AboutUsPage(props: { params: Promise<{ lang: string  }> }) {
  const params = await props.params;
  const settings = await getGlobalSettings();
  const dict = await getDictionary(params.lang as Locale);
  
  const companyName = settings?.companyName || 'Yuliya Taurel';
  const address = settings?.address || 'ul. Józefa Piłsudskiego 20, 07-130 Kamionna';
  const phone = settings?.phone || '+48664946209';

  const homeUrl = params.lang === 'pl' ? '/' : `/${params.lang}`;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <nav className="flex justify-center mb-8 text-sm opacity-60 font-semibold">
            <Link href={homeUrl} className="hover:text-amber-400 transition-colors">{dict.breadcrumbs.home}</Link>
            <span className="mx-2">/</span>
            <span className="text-amber-400">{dict.about.breadcrumb}</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-6">
            {dict.about.heroTitle} <span className="gradient-text">skupautwawa.pl</span>
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed font-semibold">
            {dict.about.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Main Narrative & Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block py-1.5 px-4 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-700 text-xs font-bold uppercase tracking-wider">
                {dict.about.storyBadge}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tight">
                {dict.about.storyTitle}
              </h2>
              <div className="w-20 h-1 bg-amber-400 rounded-full"></div>
              
              <p className="text-slate-600 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: dict.about.storyP1.replace('skupautwawa.pl', '<strong>skupautwawa.pl</strong>') }} />
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[16/10]">
                <img 
                  src="/images/office.png" 
                  alt="Biuro obsługi klienta skupautwawa.pl" 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              <p className="text-slate-600 font-medium leading-relaxed pt-4">
                {dict.about.storyP2}
              </p>
            </div>

            {/* Stats Card */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-lg font-black mb-6 uppercase tracking-tight italic flex items-center gap-2">
                  {dict.about.statsTitle}
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-black text-amber-400">{dict.about.stat1Value}</div>
                    <div>
                      <div className="font-bold text-white">{dict.about.stat1Label}</div>
                      <div className="text-xs text-slate-400 font-semibold">{dict.about.stat1Desc}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 py-6 border-t border-b border-slate-800">
                    <div className="text-4xl font-black text-amber-400">{dict.about.stat2Value}</div>
                    <div>
                      <div className="font-bold text-white">{dict.about.stat2Label}</div>
                      <div className="text-xs text-slate-400 font-semibold">{dict.about.stat2Desc}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-black text-amber-400">{dict.about.stat3Value}</div>
                    <div>
                      <div className="font-bold text-white">{dict.about.stat3Label}</div>
                      <div className="text-xs text-slate-400 font-semibold">{dict.about.stat3Desc}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[16/10]">
                <img 
                  src="/images/inspection.png" 
                  alt="Profesjonalna diagnostyka i wycena samochodu" 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-20 bg-white border-t border-b border-slate-200/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-700 text-xs font-bold mb-4 uppercase tracking-wider">
              {dict.about.pillarsBadge}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tight">
              {dict.about.pillarsTitle}
            </h2>
            <div className="w-24 h-1 bg-amber-400 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 border border-slate-200 bg-slate-50 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-bold text-xl text-slate-900 mb-3">{dict.about.pillar1Title}</h3>
              <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                {dict.about.pillar1Desc}
              </p>
            </div>

            <div className="glass-card p-8 border border-slate-200 bg-slate-50 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">📜</div>
              <h3 className="font-bold text-xl text-slate-900 mb-3">{dict.about.pillar2Title}</h3>
              <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                {dict.about.pillar2Desc}
              </p>
            </div>

            <div className="glass-card p-8 border border-slate-200 bg-slate-50 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-bold text-xl text-slate-900 mb-3">{dict.about.pillar3Title}</h3>
              <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                {dict.about.pillar3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold mb-4 uppercase tracking-wider">
              {dict.about.galleryBadge}
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight">
              {dict.about.galleryTitle}
            </h2>
            <div className="w-24 h-1 bg-amber-400 mx-auto mt-4 rounded-full"></div>
            <p className="text-slate-400 mt-6 font-medium max-w-xl mx-auto leading-relaxed">
              {dict.about.galleryDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-[16/10] group">
              <img 
                src="/images/tow-truck.png" 
                alt="Nowoczesna autolaweta" 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">{dict.about.galleryImg1Badge}</span>
                <h3 className="text-xl font-black uppercase italic">{dict.about.galleryImg1Title}</h3>
                <p className="text-slate-300 text-xs font-semibold mt-2 opacity-80">{dict.about.galleryImg1Desc}</p>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-[16/10] group">
              <img 
                src="/images/transaction.png" 
                alt="Zadowolony klient i szybka wypłata gotówki" 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-8">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">{dict.about.galleryImg2Badge}</span>
                <h3 className="text-xl font-black uppercase italic">{dict.about.galleryImg2Title}</h3>
                <p className="text-slate-300 text-xs font-semibold mt-2 opacity-80">{dict.about.galleryImg2Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Siedziba i Mapa Google */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side: Address card */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-block py-1.5 px-4 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-700 text-xs font-bold uppercase tracking-wider">
                {dict.about.locationBadge}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tight">
                {dict.about.locationTitle}
              </h2>
              <div className="w-20 h-1 bg-amber-400 rounded-full"></div>
              
              <p className="text-slate-600 font-medium leading-relaxed">
                {dict.about.locationDesc}
              </p>
              
              <div className="glass-card p-6 border border-slate-200 bg-white shadow-sm space-y-4">
                <div className="flex gap-3">
                  <span className="text-amber-500 text-xl shrink-0">🏢</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{dict.about.locationMainOffice}</h4>
                    <p className="text-slate-500 text-xs font-semibold mt-1">ul. Księżycowa 76/8, 01-934 Warszawa</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <span className="text-amber-500 text-xl shrink-0">📍</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{dict.about.locationRegistry}</h4>
                    <p className="text-slate-500 text-xs font-semibold mt-1">ul. Józefa Piłsudskiego 20, 07-130 Kamionna</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Interactive Google Maps Iframe */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[16/10] bg-slate-100 min-h-[350px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2440.8523098583437!2d20.916812877395047!3d52.28243685355627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecbe4523e42ad%3A0xc4eb09db20bfab5a!2sKsi%C4%99%C5%BCycowa%2076%2F8%2C%2001-934%20Warszawa!5e0!3m2!1spl!2spl!4v1716230000000!5m2!1spl!2spl"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="glass-card p-12 shadow-2xl relative overflow-hidden border border-slate-200 bg-white">
            <div className="absolute top-0 left-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tight mb-4">
              {dict.about.ctaTitle}
            </h2>
            <p className="text-slate-500 font-semibold mb-8 max-w-xl mx-auto leading-relaxed">
              {dict.about.ctaDesc}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a href={`tel:${phone}`} className="btn-primary inline-flex items-center gap-2 text-lg font-black uppercase tracking-wide w-full sm:w-auto">
                {dict.about.ctaCall} {phone}
              </a>
              <Link href={`${homeUrl}#wycena`} className="btn-secondary text-lg font-black uppercase tracking-wide w-full sm:w-auto text-center">
                {dict.about.ctaOnline}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Info Footnote */}
      <section className="py-8 bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl text-center text-xs text-slate-400 font-semibold space-y-2">
          <p>Właścicielem serwisu skupautwawa.pl oraz firmą skupującą pojazdy jest Yuliya Taurel z siedzibą pod adresem: ul. Józefa Piłsudskiego 20, 07-130 Kamionna | NIP: 9662148516 | REGON: 388469259.</p>
          <p>Legalna kasacja i złomowanie pojazdów są realizowane dzięki współpracy z partnerem: Ama spółka z ograniczoną odpowiedzialnością z siedzibą pod adresem: ul. REMBRANDTA 4A/39, 03-531 WARSZAWA | NIP: 5242756715 | KRS: 0000424546 | REGON: 146177110.</p>
          <p>Administratorem danych osobowych jest właściciel serwisu skupautwawa.pl.</p>
        </div>
      </section>
    </main>
  );
}
