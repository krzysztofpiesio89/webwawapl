import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';
import { getGlobalSettings } from '@/lib/settings';
import { getBrandBySlug, getModelBySlug, slugify, getBrandLogo, getAllBrands } from '@/lib/brands';
import { getCityBySlug } from '@/lib/cities';
import { getDictionary, Locale, ogLocaleMap } from '../../../../dictionaries';
import { industrySlugsMap, professionSlugsMap } from '@/lib/industries-list';

// Popular brands for "Zobacz również" section
const POPULAR_BRAND_SLUGS = [
  'bmw', 'mercedes-benz', 'audi', 'volkswagen', 'toyota', 'ford',
  'opel', 'skoda', 'renault', 'peugeot', 'honda', 'hyundai',
  'kia', 'volvo', 'seat', 'mazda', 'nissan', 'fiat'
];

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
  const series = model?.series.find((s: any) => {
    const sSlug = slugify(s.name);
    const targetSlug = slugify(decodedSlug);
    const modelSlug = model ? slugify(model.name) : '';
    return (
      sSlug === targetSlug ||
      s.name.toLowerCase() === decodedSlug.toLowerCase() ||
      (modelSlug && sSlug.replace(modelSlug + '-', '') === targetSlug)
    );
  });
  const seriesName = series ? series.name : decodedSlug;
  
  const cityName = city?.name || 'Warszawa';
  const wikiDescRaw = series?.wiki?.description;
  const wikiDesc = typeof wikiDescRaw === 'string' ? wikiDescRaw : (wikiDescRaw?.[lang] || wikiDescRaw?.pl);
  const finalImageUrl = series?.specs?.motofaktyImage || series?.wiki?.imageUrl;
  const brandLogo = getBrandLogo(brandSlug);

  const title = `Integracja i Wdrożenia ${brandName} ${modelName} (${seriesName}) - ${cityName} | webwawa.pl`;
  const baseDescription = `Wsparcie techniczne i integracje oprogramowania dla marki ${brandName} ${modelName} (wersja ${seriesName}) w miejscowości ${cityName}.`;
  const description = wikiDesc
    ? `${wikiDesc.substring(0, 150)}... ${baseDescription}`
    : baseDescription;

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const canonicalUrl = `https://webwawa.pl${langPrefix}/${citySlug}/${brandSlug}/${modelSlug}/${seriesSlug}`;

  const brandLogoUrl = brandLogo ? (brandLogo.startsWith('http') ? brandLogo : `https://webwawa.pl${brandLogo}`) : null;
  const ogImages = [];
  if (finalImageUrl) {
    ogImages.push({
      url: finalImageUrl,
      width: 1200,
      height: 630,
      alt: `${brandName} ${modelName} ${seriesName} - ${cityName}`,
    });
  }
  if (brandLogoUrl) {
    ogImages.push({
      url: brandLogoUrl,
      width: 400,
      height: 400,
      alt: `${brandName} Logo`,
    });
  }

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
      images: ogImages.length > 0 ? ogImages : undefined,
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
  const series = model.series.find((s: any) => {
    const sSlug = slugify(s.name);
    const targetSlug = slugify(decodedSlug);
    const modelSlug = slugify(model.name);
    return (
      sSlug === targetSlug ||
      s.name.toLowerCase() === decodedSlug.toLowerCase() ||
      sSlug.replace(modelSlug + '-', '') === targetSlug
    );
  });
  if (!series) notFound();

  const settings = await getGlobalSettings();
  const dict = await getDictionary(lang as Locale);
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  
  const wikiDescRaw = series?.wiki?.description;
  const wikiDesc = typeof wikiDescRaw === 'string' ? wikiDescRaw : (wikiDescRaw?.[lang] || wikiDescRaw?.pl);
  const finalImageUrl = series?.specs?.motofaktyImage || series?.wiki?.imageUrl;
  const brandLogo = getBrandLogo(brandSlug);
  
  const cityName = city.name;
  const brandName = brand.name;
  const modelName = model.name;
  const seriesName = series.name;
  const isPl = lang === 'pl';

  // Build "Zobacz również" related brands list
  const allBrands = getAllBrands();
  const relatedBrands = POPULAR_BRAND_SLUGS
    .filter(slug => slug !== brandSlug && slug !== slugify(brandName))
    .map(slug => {
      const found = allBrands.find(b => b.slug === slug || b.slug.includes(slug) || slug.includes(b.slug));
      if (!found) return null;
      const logo = getBrandLogo(found.slug);
      return { name: found.name, slug: found.slug, logo };
    })
    .filter(Boolean)
    .slice(0, 12) as { name: string; slug: string; logo: string | null }[];

  const parentPathMap = {
    pl: 'strona-dla',
    en: 'website-for',
    de: 'webseite-fuer',
    uk: 'sayt-dlya',
    ru: 'sayt-dlya',
    zh: 'website-for'
  };
  const parentPath = parentPathMap[lang as keyof typeof parentPathMap] || 'website-for';
  const indSlug = industrySlugsMap.automotive[lang as Locale] || 'automotive';

  const getUrl = (profKey: 'carRental' | 'leasing' | 'carBuying' | 'mechanic' | 'carParts') => {
    const profSlug = professionSlugsMap[profKey][lang as Locale] || profKey;
    return `${langPrefix}/${parentPath}/${indSlug}/${profSlug}/${citySlug}/${brandSlug}/${modelSlug}/${seriesSlug}`;
  };

  const transMap = {
    pl: {
      title: "Systemy IT i Marketing dla Biznesu Motoryzacyjnego",
      subtitle: `Dedykowane oprogramowanie, aplikacje PWA oraz pozycjonowanie SEO dla firm powiązanych z marką ${brandName} ${modelName} (${seriesName}).`,
      rentalTitle: "Strony dla Wypożyczalni",
      rentalDesc: `Systemy rezerwacji online i strony WWW dla wypożyczalni aut oferujących samochody ${brandName} ${modelName} ${seriesName}.`,
      rentalLink: "Zobacz ofertę dla wynajmu",
      leasingTitle: "Kalkulatory Leasingowe",
      leasingDesc: `Dedykowane formularze wycen, integracje z leasingodawcami i kalkulatory rat dla brokerów samochodów ${brandName} ${modelName} ${seriesName}.`,
      leasingLink: "Zobacz systemy finansowe",
      buyingTitle: "Strony dla Skupów Aut",
      buyingDesc: `Landing pages i kampanie marketingowe o wysokiej konwersji, pozyskujące klientów na skup pojazdów ${brandName} ${modelName} ${seriesName}.`,
      buyingLink: "Zobacz ofertę dla skupów",
      mechanicTitle: "Oprogramowanie dla Serwisów",
      mechanicDesc: `Aplikacje do rezerwacji terminów i systemy CRM dla warsztatów specjalizujących się w naprawie aut marki ${brandName} ${modelName} ${seriesName}.`,
      mechanicLink: "Zobacz systemy dla warsztatów",
      partsTitle: "Sklepy z Częściami",
      partsDesc: `Sklepy e-commerce z wyszukiwarką części po VIN i integracją z bazą zamienników dla modeli ${brandName} ${modelName} ${seriesName}.`,
      partsLink: "Zobacz systemy e-commerce"
    },
    en: {
      title: "IT Solutions & Marketing for Automotive Business",
      subtitle: `Custom software, booking applications, and SEO campaigns for businesses related to ${brandName} ${modelName} (${seriesName}).`,
      rentalTitle: "Websites for Car Rental",
      rentalDesc: `Online booking systems and responsive sites for car rentals offering ${brandName} ${modelName} (${seriesName}) vehicles.`,
      rentalLink: "See rental solutions",
      leasingTitle: "Leasing Calculators",
      leasingDesc: `Lease calculators, financing integrations, and quote builders for brokers of ${brandName} ${modelName} (${seriesName}) cars.`,
      leasingLink: "See financing systems",
      buyingTitle: "Junk Car Buying Landing Pages",
      buyingDesc: `High-converting landing pages and search ad campaigns for businesses buying used or scrap ${brandName} ${modelName} (${seriesName}) vehicles.`,
      buyingLink: "See buying solutions",
      mechanicTitle: "Software for Auto Repair",
      mechanicDesc: `Online scheduling apps and custom ERP/CRM tools for garages specialized in servicing ${brandName} ${modelName} (${seriesName}) cars.`,
      mechanicLink: "See repair shop systems",
      partsTitle: "Auto Parts E-commerce",
      partsDesc: `Custom online stores with VIN search engines and catalog integrations for ${brandName} ${modelName} (${seriesName}) spare parts.`,
      partsLink: "See e-commerce solutions"
    },
    de: {
      title: "IT-Systeme & Marketing für die Automobilbranche",
      subtitle: `Maßgeschneiderte Software, Buchungs-Apps und SEO-Kampagnen für Unternehmen rund um die Marke ${brandName} ${modelName} (${seriesName}).`,
      rentalTitle: "Websites für Autovermietung",
      rentalDesc: `Online-Mietwagensysteme und Websites für Autovermietungen mit ${brandName} ${modelName} (${seriesName})-Fahrzeugen.`,
      rentalLink: "Mietwagen-Lösungen ansehen",
      leasingTitle: "Leasing-Rechner",
      leasingDesc: `Leasingrechner und Finanzierungsintegrationen für Vermittler von ${brandName} ${modelName} (${seriesName})-Fahrzeugen.`,
      leasingLink: "Finanzierungssysteme ansehen",
      buyingTitle: "Webseiten für Autoankauf",
      buyingDesc: `Optimierte Landingpages und Werbekampagnen für Ankäufer von gebrauchten oder defekten ${brandName} ${modelName} (${seriesName})-Autos.`,
      buyingLink: "Ankauf-Lösungen ansehen",
      mechanicTitle: "Software für Kfz-Werkstätten",
      mechanicDesc: `Terminplanungs-Apps und CRM-Systeme für Werkstätten mit Spezialisierung auf ${brandName} ${modelName} (${seriesName})-Service.`,
      mechanicLink: "Werkstatt-Systeme ansehen",
      partsTitle: "E-Commerce für Autoteile",
      partsDesc: `Online-Shops with Fahrgestellnummer-Suche und Ersatzteilkatalogen für ${brandName} ${modelName} (${seriesName})-Ersatzteile.`,
      partsLink: "E-Commerce-Lösungen ansehen"
    },
    uk: {
      title: "IT-рішення та маркетинг для автобізнесу",
      subtitle: `Спеціалізований софт, системи онлайн-запису та SEO-кампанії для компаній, пов'язаних з маркою ${brandName} ${modelName} (${seriesName}).`,
      rentalTitle: "Сайти для прокату авто",
      rentalDesc: `Інтерактивні системи бронювання та адаптивні сайти для орендних компаній з автомобілями ${brandName} ${modelName} (${seriesName}).`,
      rentalLink: "Дивитись рішення для прокату",
      leasingTitle: "Лізингові калькулятори",
      leasingDesc: `Лізингові форми, кредитні калькулятори та інтеграція фінансування для брокерів автомобілів ${brandName} ${modelName} (${seriesName}).`,
      leasingLink: "Дивитись фінансові системи",
      buyingTitle: "Сайти для автовикупу",
      buyingDesc: `Лендінги з високою конверсією та рекламні кампанії в Google для викупу та розбірки машин ${brandName} ${modelName} (${seriesName}).`,
      buyingLink: "Дивитись рішення для викупу",
      mechanicTitle: "Софт для автосервісів",
      mechanicDesc: `Додатки для планування візитів та CRM-інструменти для СТО, які спеціалізуються на обслуговуванні ${brandName} ${modelName} (${seriesName}).`,
      mechanicLink: "Дивитись системи для СТО",
      partsTitle: "Магазини запчастин",
      partsDesc: `Інтернет-магазини з пошуком деталей за VIN-кодом та інтеграцією каталогів під моделі ${brandName} ${modelName} (${seriesName}).`,
      partsLink: "Дивитись e-commerce рішення"
    },
    ru: {
      title: "IT-решения и маркетинг для автобизнеса",
      subtitle: `Специализированный софт, системы онлайн-записи и SEO-кампании для компаний, связанных с маркой ${brandName} ${modelName} (${seriesName}).`,
      rentalTitle: "Сайты для проката авто",
      rentalDesc: `Интерактивные системы бронирования и адаптивные сайты для арендных компаний с автомобилями ${brandName} ${modelName} (${seriesName}).`,
      rentalLink: "Смотреть решения для проката",
      leasingTitle: "Лизинговые калькуляторы",
      leasingDesc: `Лизинговые формы, кредитные калькуляторы и интеграция финансирования для брокеров автомобилей ${brandName} ${modelName} (${seriesName}).`,
      leasingLink: "Смотреть финансовые системы",
      buyingTitle: "Сайты для автовыкупа",
      buyingDesc: `Лендинги с высокой конверсией и рекламные кампании в Google для выкупа и разборки машин ${brandName} ${modelName} (${seriesName}).`,
      buyingLink: "Смотреть решения для выкупа",
      mechanicTitle: "Софт для автосервисов",
      mechanicDesc: `Приложения для планирования визитов и CRM-инструменты для СТО, специализирующихся на обслуживании ${brandName} ${modelName} (${seriesName}).`,
      mechanicLink: "Смотреть системы для СТО",
      partsTitle: "Магазины автозапчастей",
      partsDesc: `Интернет-магазины с поиском деталей по VIN-коду и интеграцией каталогов под модели ${brandName} ${modelName} (${seriesName}).`,
      partsLink: "Смотреть e-commerce решения"
    },
    zh: {
      title: "汽车出行行业 IT 解决方案与营销",
      subtitle: `针对与 ${brandName} ${modelName} (${seriesName}) 品牌、车型及版本相关企业的定制化软件、预约排班系统及 SEO 营销方案。`,
      rentalTitle: "汽车租赁租车网站",
      rentalDesc: `支持提供 ${brandName} ${modelName} (${seriesName}) 车型在线租车预约、车型库展示与自选日期的租车系统网站。`,
      rentalLink: "查看租车方案",
      leasingTitle: "融资租赁月供计算器",
      leasingDesc: `专为 ${brandName} ${modelName} (${seriesName}) 汽车金融 company 与中介定制的月供计算器及信贷方案表单。`,
      leasingLink: "查看金融计算系统",
      buyingTitle: "二手车收车/报废着陆页",
      buyingDesc: `高转化率 of 收车着陆页与广告投放引流方案，帮助高价收车 company 获得 ${brandName} ${modelName} (${seriesName}) 车辆线索。`,
      buyingLink: "查看二手车收车方案",
      mechanicTitle: "汽修厂保养 with 排班软件",
      mechanicDesc: `针对专门维保 ${brandName} ${modelName} (${seriesName}) 车型的品牌汽修厂开发的在线工位排班与 CRM 会员管理工具。`,
      mechanicLink: "查看汽修厂系统",
      partsTitle: "汽配电商与车架号搜索",
      partsDesc: `具备 VIN 码极速反查、TecDoc 配件目录数据库集成的 ${brandName} ${modelName} (${seriesName}) 配件商城开发。`,
      partsLink: "查看汽配电商方案"
    }
  };

  const t = transMap[lang as keyof typeof transMap] || transMap.en;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <Link href={homeUrl} className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`${langPrefix}/${citySlug}`} className="hover:text-primary transition-colors">{cityName}</Link>
          <span className="mx-2">/</span>
          <Link href={`${langPrefix}/${citySlug}/${brandSlug}`} className="hover:text-primary transition-colors">{brandName}</Link>
          <span className="mx-2">/</span>
          <Link href={`${langPrefix}/${citySlug}/${brandSlug}/${modelSlug}`} className="hover:text-primary transition-colors">{modelName}</Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-semibold">{series.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-6 flex items-center gap-4 flex-wrap">
              {brandLogo && (
                <img src={brandLogo} alt={`${brandName} Logo`} className="h-12 w-auto object-contain dark:invert" />
              )}
              <span>Rozwiązania dedykowane: <span className="gradient-text">{brandName}</span> <span className="gradient-text">{modelName}</span> <span className="text-primary dark:text-primary">{series.name}</span></span>
            </h1>
            <p className="text-xl opacity-80 mb-8 leading-relaxed font-medium text-slate-650 dark:text-slate-450">
              {isPl
                ? `Optymalizacja procesów technologicznych i integracja API dla sektora ${brandName} ${modelName} (seria ${series.name}) w lokalizacji ${cityName}.`
                : `Technology process optimization and API integration for the ${brandName} ${modelName} (${series.name}) sector in ${cityName}.`}
            </p>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3">
                <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-full">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-350">{isPl ? "Dedykowana architektura systemów" : "Custom systems architecture"}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-full">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-350">{isPl ? "Pełne wsparcie integracyjne" : "Full integration support"}</span>
              </li>
            </ul>

            <a href={`tel:${settings?.phone || '+48664946209'}`} className="btn-primary inline-flex items-center gap-3 text-xl font-bold">
              {isPl ? "Zadzwoń do nas" : "Call us"}
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
        </div>

        {/* Zobacz również – Popular Brands Grid */}
        {relatedBrands.length > 0 && (
          <section className="py-14 container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-10">
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-3 uppercase tracking-wider">
                🔗 {isPl ? 'Powiązane marki' : 'Related brands'}
              </span>
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
                {isPl ? 'Zobacz również' : 'See also'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
                {isPl
                  ? `Tworzymy strony i systemy IT dla firm ze wszystkich marek samochodowych w ${cityName} i okolicach.`
                  : `We build websites and IT systems for automotive businesses of all brands in ${cityName}.`}
              </p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
              {relatedBrands.map((rb) => (
                <Link
                  key={rb.slug}
                  href={`${langPrefix}/${citySlug}/${rb.slug}`}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                  title={`${rb.name} – ${cityName}`}
                >
                  {rb.logo ? (
                    <img
                      src={rb.logo}
                      alt={`${rb.name} logo`}
                      className="h-10 w-auto object-contain dark:invert opacity-80 group-hover:opacity-100 transition-opacity"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {rb.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors text-center leading-tight">
                    {rb.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Wiki & Specifications Panel */}
        {wikiDesc && (
          <section className="py-16 bg-white dark:bg-slate-900/30 border-t border-b border-slate-200 dark:border-slate-800/40 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:rounded-3xl mb-20 mt-12">
            <div className="max-w-5xl mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-3 uppercase tracking-wider">
                  📚 Specyfikacja i Opis Modelu
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">
                  Kontekst technologiczny: {brandName} {modelName} {series.name}
                </h2>
                <div className="w-20 h-1 bg-primary mx-auto mt-3 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Description */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-950/20 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 uppercase italic">Opis Pojazdu</h3>
                    <p className="text-slate-650 dark:text-slate-350 leading-relaxed text-base font-medium">
                      {wikiDesc}
                    </p>
                  </div>

                  <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-6 rounded-2xl">
                    <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                      <span>💡</span> Cel biznesowy i wdrożeniowy
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold opacity-95">
                      {isPl
                        ? `Projektujemy i wdrażamy dedykowane systemy rezerwacji online, aplikacje mobilne PWA oraz kampanie pozycjonowania (SEO) dla podmiotów powiązanych z obsługą modelu ${brandName} ${modelName}. Powyższa specyfikacja techniczna ułatwia robotom wyszukiwarek budowanie głębokiego kontekstu semantycznego wokół naszych usług programistycznych.`
                        : `We design and implement dedicated online booking engines, mobile PWA applications, and search visibility (SEO) setups for entities related to the ${brandName} ${modelName} series. The above technical spec aids indexation bots in building deep semantic relevance.`}
                    </p>
                  </div>
                </div>

                {/* Technical specifications panel */}
                <div className="lg:col-span-5 space-y-6">
                  {finalImageUrl && (
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                      <img src={finalImageUrl} alt={`${brandName} ${modelName} ${series.name}`} className="w-full h-auto object-cover" />
                    </div>
                  )}
                  
                  <div className="bg-slate-905 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-black mb-4 uppercase tracking-tight italic flex items-center gap-2 text-slate-900 dark:text-white">
                      📊 Parametry Techniczne
                    </h3>

                    <div className="space-y-3 text-sm font-semibold">
                      <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400">{isPl ? "Lata produkcji" : "Years"}:</span>
                        <span className="font-bold">{series.years}</span>
                      </div>
                      {series.specs?.bodyType && (
                        <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">{isPl ? "Nadwozie" : "Body"}:</span>
                          <span className="font-bold">{series.specs.bodyType}</span>
                        </div>
                      )}
                      {series.specs?.engine && (
                        <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">{isPl ? "Silnik" : "Engine"}:</span>
                          <span className="font-bold max-w-[180px] truncate text-right">{series.specs.engine}</span>
                        </div>
                      )}
                      {series.specs?.fuel && (
                        <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">{isPl ? "Paliwo" : "Fuel"}:</span>
                          <span className="font-bold">{series.specs.fuel}</span>
                        </div>
                      )}
                      {series.specs?.drive && (
                        <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
                          <span className="text-slate-500 dark:text-slate-400">{isPl ? "Napęd" : "Drive"}:</span>
                          <span className="font-bold">{series.specs.drive}</span>
                        </div>
                      )}
                      {series.wiki?.infobox && Object.entries(series.wiki.infobox).slice(0, 4).map(([key, value]) => {
                        const valStr = typeof value === 'string' ? value : ((value as any)?.[lang] || (value as any)?.pl);
                        return (
                          <div key={key} className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800 capitalize">
                            <span className="text-slate-500 dark:text-slate-400">{key}:</span>
                            <span className="font-bold text-right max-w-[200px] truncate">{String(valStr)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}


      {/* B2B Automotive Showcase Block */}
      <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-800/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              B2B Services & Software
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white mb-4">
              {t.title}
            </h2>
            <p className="text-slate-650 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
              {t.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Car Rental */}
            <div className="glass-card relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{t.rentalTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed mb-6">{t.rentalDesc}</p>
              </div>
              <Link 
                href={getUrl('carRental')} 
                className="text-primary text-xs font-bold hover:underline inline-flex items-center gap-1 mt-auto"
              >
                {t.rentalLink} &rarr;
              </Link>
            </div>

            {/* Card 2: Leasing */}
            <div className="glass-card relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{t.leasingTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-455 leading-relaxed mb-6">{t.leasingDesc}</p>
              </div>
              <Link 
                href={getUrl('leasing')} 
                className="text-primary text-xs font-bold hover:underline inline-flex items-center gap-1 mt-auto"
              >
                {t.leasingLink} &rarr;
              </Link>
            </div>

            {/* Card 3: Car Buying */}
            <div className="glass-card relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-red-500"></div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{t.buyingTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-455 leading-relaxed mb-6">{t.buyingDesc}</p>
              </div>
              <Link 
                href={getUrl('carBuying')} 
                className="text-primary text-xs font-bold hover:underline inline-flex items-center gap-1 mt-auto"
              >
                {t.buyingLink} &rarr;
              </Link>
            </div>

            {/* Card 4: Mechanic */}
            <div className="glass-card relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{t.mechanicTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-455 leading-relaxed mb-6">{t.mechanicDesc}</p>
              </div>
              <Link 
                href={getUrl('mechanic')} 
                className="text-primary text-xs font-bold hover:underline inline-flex items-center gap-1 mt-auto"
              >
                {t.mechanicLink} &rarr;
              </Link>
            </div>

            {/* Card 5: Car Parts */}
            <div className="glass-card relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between md:col-span-2 lg:col-span-1">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-500"></div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{t.partsTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-455 leading-relaxed mb-6">{t.partsDesc}</p>
              </div>
              <Link 
                href={getUrl('carParts')} 
                className="text-primary text-xs font-bold hover:underline inline-flex items-center gap-1 mt-auto"
              >
                {t.partsLink} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
