import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale, ogLocaleMap } from '../../dictionaries';
import { getLocalizedStaticPath } from '../../i18n-routes';
import ContactForm from '@/components/ContactForm';
import { getAllCities, getSurroundingCities } from '@/lib/cities';
import { industrySlugsMap, professionSlugsMap, industryModelsMap } from '@/lib/industries-list';

interface PageProps {
  params: Promise<{
    lang: string;
    tech: string;
  }>;
}

// Helper to read technology data
function getTechData(techSlug: string) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'technology', `${techSlug}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return null;
  }
}

export async function generateStaticParams() {
  const locales: Locale[] = ['pl', 'en', 'de', 'uk', 'ru', 'zh'];
  const techDir = path.join(process.cwd(), 'data', 'technology');
  
  if (!fs.existsSync(techDir)) return [];
  
  const files = fs.readdirSync(techDir);
  const techSlugs = files
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));

  const params: { lang: string; tech: string }[] = [];
  
  for (const lang of locales) {
    for (const tech of techSlugs) {
      params.push({ lang, tech });
    }
  }
  
  return params;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { lang, tech } = params;
  
  const techDataRaw = getTechData(tech);
  if (!techDataRaw) return {};

  const techData = techDataRaw[lang] || techDataRaw['en'] || techDataRaw['pl'];
  if (!techData) return {};

  const title = `${techData.title} | webwawa.pl`;
  const description = techData.description;

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const softwarePath = getLocalizedStaticPath('software', lang as Locale);
  const canonicalUrl = `https://webwawa.pl${langPrefix}${softwarePath}/${tech}`;

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
      type: 'article',
    }
  };
}

export default async function TechPage(props: PageProps) {
  const params = await props.params;
  const { lang, tech } = params;
  
  const techDataRaw = getTechData(tech);
  if (!techDataRaw) notFound();

  const techData = techDataRaw[lang] || techDataRaw['en'] || techDataRaw['pl'];
  if (!techData) notFound();

  const settings = getGlobalSettings();
  const dict = await getDictionary(lang as Locale);
  const isPl = lang === 'pl';
  
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  const softwarePath = getLocalizedStaticPath('software', lang as Locale);

  // Generate Tag Cloud (limit to some combinations to avoid massive DOM)
  const cities = getSurroundingCities().slice(0, 8); // e.g. Piaseczno, Pruszków, etc.
  
  const tagCloud = [];
  for (const [profId, prof] of Object.entries(professionSlugsMap).slice(0, 10)) {
    for (const city of cities) {
      const profName = (prof as any)[lang] || prof.en;
      let label = '';
      if (isPl) {
        label = `Aplikacje dla ${profName} ${city.name}`;
      } else if (lang === 'en') {
        label = `Apps for ${profName} in ${city.name}`;
      } else {
        label = `${tech} ${profName} ${city.name}`;
      }

      // Find associated industryId
      let industryId = 'doctor';
      for (const [indId, models] of Object.entries(industryModelsMap)) {
        if ((models as readonly string[]).includes(profId)) {
          industryId = indId;
          break;
        }
      }

      const citySlug = city.slug;
      let href = '';
      
      if (isPl) {
        const industrySlug = (industrySlugsMap as any)[industryId as keyof typeof industrySlugsMap]?.pl || industryId;
        const profSlug = (prof as any).pl || profId;
        href = `/${citySlug}/${industrySlug}/${profSlug}?tech=${tech}`;
      } else {
        href = `/${lang}/industries/${citySlug}/${industryId}/${profId}?tech=${tech}`;
      }

      tagCloud.push({ label, href });
    }
  }

  // Shuffle and pick 15 tags
  const shuffledTags = tagCloud.sort(() => 0.5 - Math.random()).slice(0, 15);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": techData.title,
    "operatingSystem": "All",
    "applicationCategory": "DeveloperApplication",
    "description": techData.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "webwawa.pl",
      "url": "https://webwawa.pl"
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="bg-slate-100 dark:bg-slate-900 py-20 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <nav className="flex justify-center mb-8 text-sm opacity-60 font-semibold">
            <Link href={homeUrl} className="hover:text-primary transition-colors">{dict.breadcrumbs.home}</Link>
            <span className="mx-2">/</span>
            <Link href={softwarePath} className="hover:text-primary transition-colors">
              {isPl ? 'Dedykowane Aplikacje' : 'Custom Software'}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary capitalize">{tech.replace('-', ' ')}</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tight">
             <span className="gradient-text">{techData.title}</span>
          </h1>
          <p className="text-xl opacity-80 max-w-3xl mx-auto text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {techData.description}
          </p>
        </div>
      </section>

      {/* Advantages */}
      {techData.advantages && techData.advantages.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-wider">{isPl ? 'Główne zalety' : 'Key Advantages'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techData.advantages.map((adv: string, idx: number) => (
                <div key={idx} className="glass-card p-6 border-l-4 border-primary">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{adv}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {techData.faq && techData.faq.length > 0 && (
        <section className="py-16 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-wider">FAQ</h2>
            <div className="space-y-6">
              {techData.faq.map((item: { q: string, a: string }, idx: number) => (
                <div key={idx} className="glass-card p-6">
                  <h3 className="font-bold text-lg mb-2 text-primary">{item.q}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-4">
              {isPl ? 'Porozmawiajmy o Twoim projekcie' : 'Let\'s talk about your project'}
            </h2>
          </div>
          <ContactForm lang={lang as Locale} defaultCity="Warszawa" settings={settings} dict={dict.form} />
        </div>
      </section>

      {/* SEO Tag Cloud */}
      <section className="py-12 bg-white dark:bg-black border-t border-slate-200 dark:border-slate-900">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-600 mb-6 uppercase tracking-widest">
            {isPl ? 'Popularne wyszukiwania' : 'Popular Searches'}
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {shuffledTags.map((tag, idx) => (
              <Link href={tag.href} key={idx} className="text-xs font-semibold px-3 py-1.5 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-800 hover:text-primary hover:border-primary transition-colors cursor-pointer block">
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
