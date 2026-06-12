import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGlobalSettings } from '@/lib/settings';
import { getBrandBySlug } from '@/lib/brands';
import { getCityBySlug } from '@/lib/cities';
import { getDictionary, Locale, ogLocaleMap } from '../../dictionaries';
import { industrySlugsMap, professionSlugsMap, getIndustryIdBySlug } from '@/lib/industries-list';
import { resolveStaticSlug } from '../../i18n-routes';
import IndustryModelPage, { generateMetadata as generateIndustryModelMetadata } from '../../industries/[city]/[brand]/[model]/page';

interface PageProps {
  params: Promise<{ lang: string;
    city: string;
    brand: string;
   }>;
  searchParams?: Promise<{ tech?: string; }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { lang, city: citySlug, brand: brandSlug } = params;

  // Intercept Industry Parent Slugs (e.g., /strona-dla/architekt/projektant-wnetrz)
  const resolvedParent = resolveStaticSlug(lang);
  if (resolvedParent?.page === 'industries') {
    return generateIndustryModelMetadata({
      params: Promise.resolve({ lang: resolvedParent.lang, city: 'all', brand: citySlug, model: brandSlug }),
      searchParams: props.searchParams || Promise.resolve({})
    });
  }

  // Intercept City + Industry Slugs (e.g., /warszawa/architekt/projektant-wnetrz)
  const cityCheck = getCityBySlug(lang);
  if (cityCheck) {
    const industryCheck = getIndustryIdBySlug(citySlug);
    if (industryCheck) {
      return generateIndustryModelMetadata({
        params: Promise.resolve({ lang: 'pl', city: lang, brand: citySlug, model: brandSlug }),
        searchParams: props.searchParams || Promise.resolve({})
      });
    }
  }

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
      images: [
        {
          url: 'https://webwawa.pl/images/workspace_code.png',
          width: 1200,
          height: 630,
          alt: title,
        }
      ]
    }
  };
}

export default async function CityBrandPage(props: PageProps) {
  const params = await props.params;
  const { lang, city: citySlug, brand: brandSlug } = params;

  // Intercept Industry Parent Slugs (e.g., /strona-dla/architekt/projektant-wnetrz)
  const resolvedParent = resolveStaticSlug(lang);
  if (resolvedParent?.page === 'industries') {
    return IndustryModelPage({ 
      params: Promise.resolve({ lang: resolvedParent.lang, city: 'all', brand: citySlug, model: brandSlug }),
      searchParams: props.searchParams || Promise.resolve({})
    });
  }

  // Intercept City + Industry Slugs (e.g., /warszawa/architekt/projektant-wnetrz)
  const cityCheck = getCityBySlug(lang);
  if (cityCheck) {
    const industryCheck = getIndustryIdBySlug(citySlug);
    if (industryCheck) {
      return IndustryModelPage({ 
        params: Promise.resolve({ lang: 'pl', city: lang, brand: citySlug, model: brandSlug }),
        searchParams: props.searchParams || Promise.resolve({})
      });
    }
  }

  const settings = await getGlobalSettings();
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const brand = getBrandBySlug(brandSlug);
  if (!brand) notFound();

  const isPl = lang === 'pl';
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const brandName = brand.name;

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
    return `${langPrefix}/${parentPath}/${indSlug}/${profSlug}/${citySlug}/${brandSlug}`;
  };

  const transMap = {
    pl: {
      title: "Systemy IT i Marketing dla Biznesu Motoryzacyjnego",
      subtitle: `Dedykowane oprogramowanie, aplikacje PWA oraz pozycjonowanie SEO dla firm powiązanych z marką ${brandName}.`,
      rentalTitle: "Strony dla Wypożyczalni",
      rentalDesc: `Systemy rezerwacji online i strony WWW dla wypożyczalni aut oferujących samochody ${brandName}.`,
      rentalLink: "Zobacz ofertę dla wynajmu",
      leasingTitle: "Kalkulatory Leasingowe",
      leasingDesc: `Dedykowane formularze wycen, integracje z leasingodawcami i kalkulatory rat dla brokerów samochodów ${brandName}.`,
      leasingLink: "Zobacz systemy finansowe",
      buyingTitle: "Strony dla Skupów Aut",
      buyingDesc: `Landing pages i kampanie marketingowe o wysokiej konwersji, pozyskujące klientów na skup pojazdów ${brandName}.`,
      buyingLink: "Zobacz ofertę dla skupów",
      mechanicTitle: "Oprogramowanie dla Serwisów",
      mechanicDesc: `Aplikacje do rezerwacji terminów i systemy CRM dla warsztatów specjalizujących się w naprawie aut marki ${brandName}.`,
      mechanicLink: "Zobacz systemy dla warsztatów",
      partsTitle: "Sklepy z Częściami",
      partsDesc: `Sklepy e-commerce z wyszukiwarką części po VIN i integracją z bazą zamienników dla modeli ${brandName}.`,
      partsLink: "Zobacz systemy e-commerce"
    },
    en: {
      title: "IT Solutions & Marketing for Automotive Business",
      subtitle: `Custom software, booking applications, and SEO campaigns for businesses related to ${brandName}.`,
      rentalTitle: "Websites for Car Rental",
      rentalDesc: `Online booking systems and responsive sites for car rentals offering ${brandName} vehicles.`,
      rentalLink: "See rental solutions",
      leasingTitle: "Leasing Calculators",
      leasingDesc: `Lease calculators, financing integrations, and quote builders for brokers of ${brandName} cars.`,
      leasingLink: "See financing systems",
      buyingTitle: "Junk Car Buying Landing Pages",
      buyingDesc: `High-converting landing pages and search ad campaigns for businesses buying used or scrap ${brandName} vehicles.`,
      buyingLink: "See buying solutions",
      mechanicTitle: "Software for Auto Repair",
      mechanicDesc: `Online scheduling apps and custom ERP/CRM tools for garages specialized in servicing ${brandName} cars.`,
      mechanicLink: "See repair shop systems",
      partsTitle: "Auto Parts E-commerce",
      partsDesc: `Custom online stores with VIN search engines and catalog integrations for ${brandName} spare parts.`,
      partsLink: "See e-commerce solutions"
    },
    de: {
      title: "IT-Systeme & Marketing für die Automobilbranche",
      subtitle: `Maßgeschneiderte Software, Buchungs-Apps und SEO-Kampagnen für Unternehmen rund um die Marke ${brandName}.`,
      rentalTitle: "Websites für Autovermietung",
      rentalDesc: `Online-Mietwagensysteme und Websites für Autovermietungen mit ${brandName}-Fahrzeugen.`,
      rentalLink: "Mietwagen-Lösungen ansehen",
      leasingTitle: "Leasing-Rechner",
      leasingDesc: `Leasingrechner und Finanzierungsintegrationen für Vermittler von ${brandName}-Fahrzeugen.`,
      leasingLink: "Finanzierungssysteme ansehen",
      buyingTitle: "Webseiten für Autoankauf",
      buyingDesc: `Optimierte Landingpages und Werbekampagnen für Ankäufer von gebrauchten oder defekten ${brandName}-Autos.`,
      buyingLink: "Ankauf-Lösungen ansehen",
      mechanicTitle: "Software für Kfz-Werkstätten",
      mechanicDesc: `Terminplanungs-Apps und CRM-Systeme für Werkstätten mit Spezialisierung auf ${brandName}-Service.`,
      mechanicLink: "Werkstatt-Systeme ansehen",
      partsTitle: "E-Commerce für Autoteile",
      partsDesc: `Online-Shops mit Fahrgestellnummer-Suche und Ersatzteilkatalogen für ${brandName}-Ersatzteile.`,
      partsLink: "E-Commerce-Lösungen ansehen"
    },
    uk: {
      title: "IT-рішення та маркетинг для автобізнесу",
      subtitle: `Спеціалізований софт, системи онлайн-запису та SEO-кампанії для компаній, пов'язаних з маркою ${brandName}.`,
      rentalTitle: "Сайти для прокату авто",
      rentalDesc: `Інтерактивні системи бронювання та адаптивні сайти для орендних компаній з автомобілями ${brandName}.`,
      rentalLink: "Дивитись рішення для прокату",
      leasingTitle: "Лізингові калькулятори",
      leasingDesc: `Лізингові форми, кредитні калькулятори та інтеграція фінансування для брокерів автомобілів ${brandName}.`,
      leasingLink: "Дивитись фінансові системи",
      buyingTitle: "Сайти для автовикупу",
      buyingDesc: `Лендінги з високою конверсією та рекламні кампанії в Google для викупу та розбірки машин ${brandName}.`,
      buyingLink: "Дивитись рішення для викупу",
      mechanicTitle: "Софт для автосервісів",
      mechanicDesc: `Додатки для планування візитів та CRM-інструменти для СТО, які спеціалізуються на обслуговуванні ${brandName}.`,
      mechanicLink: "Дивитись системи для СТО",
      partsTitle: "Магазини запчастин",
      partsDesc: `Інтернет-магазини з пошуком деталей за VIN-кодом та інтеграцією каталогів під моделі ${brandName}.`,
      partsLink: "Дивитись e-commerce рішення"
    },
    ru: {
      title: "IT-решения и маркетинг для автобизнеса",
      subtitle: `Специализированный софт, системы онлайн-записи и SEO-кампании для компаний, связанных с маркой ${brandName}.`,
      rentalTitle: "Сайты для проката авто",
      rentalDesc: `Интерактивные системы бронирования и адаптивные сайты для арендных компаний с автомобилями ${brandName}.`,
      rentalLink: "Смотреть решения для проката",
      leasingTitle: "Лизинговые калькуляторы",
      leasingDesc: `Лизинговые формы, кредитные калькуляторы и интеграция финансирования для брокеров автомобилей ${brandName}.`,
      leasingLink: "Смотреть финансовые системы",
      buyingTitle: "Сайты для автовыкупа",
      buyingDesc: `Лендинги с высокой конверсией и рекламные кампании в Google для выкупа и разборки машин ${brandName}.`,
      buyingLink: "Смотреть решения для выкупа",
      mechanicTitle: "Софт для автосервисов",
      mechanicDesc: `Приложения для планирования визитов и CRM-инструменты для СТО, специализирующихся на обслуживании ${brandName}.`,
      mechanicLink: "Смотреть системы для СТО",
      partsTitle: "Магазины автозапчастей",
      partsDesc: `Интернет-магазины с поиском деталей по VIN-коду и интеграцией каталогов под модели ${brandName}.`,
      partsLink: "Смотреть e-commerce решения"
    },
    zh: {
      title: "汽车出行行业 IT 解决方案与营销",
      subtitle: `针对与 ${brandName} 品牌相关企业的定制化软件、预约排班系统及 SEO 营销方案。`,
      rentalTitle: "汽车租赁租车网站",
      rentalDesc: `支持提供 ${brandName} 车型在线租车预约、车型库展示与自选日期的租车系统网站。`,
      rentalLink: "查看租车方案",
      leasingTitle: "融资租赁月供计算器",
      leasingDesc: `专为 ${brandName} 汽车金融 company 与中介定制的月供计算器及信贷方案表单。`,
      leasingLink: "查看金融计算系统",
      buyingTitle: "二手车收车/报废着陆页",
      buyingDesc: `高转化率的收车着陆页与广告投放引流方案，帮助高价收车公司获得 ${brandName} 车辆线索。`,
      buyingLink: "查看二手车收车方案",
      mechanicTitle: "汽修厂保养与排班软件",
      mechanicDesc: `针对专门维保 ${brandName} 车型的品牌汽修厂开发的在线工位排班与 CRM 会员管理工具。`,
      mechanicLink: "查看汽修厂系统",
      partsTitle: "汽配电商与车架号搜索",
      partsDesc: `具备 VIN 码极速反查、TecDoc 配件目录数据库集成的 ${brandName} 配件商城开发。`,
      partsLink: "查看汽配电商方案"
    }
  };

  const t = transMap[lang as keyof typeof transMap] || transMap.en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": t.title,
    "description": t.subtitle,
    "provider": {
      "@type": "LocalBusiness",
      "name": "webwawa.pl",
      "telephone": settings?.phone || "+48 664 946 209"
    },
    "areaServed": city ? {
      "@type": "City",
      "name": city.name
    } : {
      "@type": "Country",
      "name": "Poland"
    }
  };

  const breadcrumbListJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://webwawa.pl${langPrefix}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": city ? city.name : parentPath,
        "item": `https://webwawa.pl${langPrefix}/${city ? citySlug : parentPath}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": brand.name,
        "item": `https://webwawa.pl${langPrefix}/${city ? citySlug : parentPath}/${brandSlug}`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify([jsonLd, breadcrumbListJsonLd]) 
        }}
      />
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

      {/* B2B Automotive Showcase Block */}
      <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-800/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-14">
            <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              B2B Services & Software
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-4">
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
