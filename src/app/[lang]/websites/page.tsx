import { Metadata } from 'next';
import Link from 'next/link';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale } from '../dictionaries';
import ContactForm from '@/components/ContactForm';
import { getLocalizedSlug } from '../i18n-routes';
import { industrySlugsMap } from '@/lib/industries-list';

const translations = {
  pl: {
    title: 'Projektowanie i Tworzenie Stron WWW | webwawa.pl',
    description: 'Projektujemy i kodujemy ultra-szybkie, nowoczesne strony internetowe oparte o Next.js, React oraz WordPress. Zwiększ widoczność w wyszukiwarkach AI!',
    breadcrumb: 'Dedykowane Strony WWW',
    heroTitle: 'Dedykowane Strony',
    heroSubtitle: 'Projektujemy ultra-szybkie witryny internetowe w technologii Next.js oraz WordPress, zoptymalizowane pod kątem konwersji i pozycjonowania AI.',
    techTitle: 'Technologie oparte na wydajności',
    techSubtitle: 'Wybór odpowiedniego stacku technologicznego to fundament sukcesu w sieci. Pracujemy na najnowszych rozwiązaniach gwarantujących stabilność i szybkość.',
    advantagesTitle: 'Dlaczego nasze strony sprzedają lepiej?',
    advantage1Title: 'Błyskawiczne ładowanie',
    advantage1Desc: 'Zoptymalizowane pod kątem wskaźników Core Web Vitals (PSI 100/100). Szybka strona to niższy współczynnik odrzuceń.',
    advantage2Title: 'Gotowość na AI i GEO',
    advantage2Desc: 'Strukturyzujemy treść i kod tak, aby wyszukiwarki AI (np. Perplexity, ChatGPT Search) precyzyjnie rozumiały i polecały Twoją ofertę.',
    advantage3Title: 'Pełny Mobile-First',
    advantage3Desc: 'Ponad 70% ruchu pochodzi z urządzeń mobilnych. Nasze projekty wyglądają i działają bezbłędnie na każdym smartfonie.',
    pricingTitle: 'Szacunkowe koszty wdrożenia',
    pricingSubtitle: 'Każdy projekt wyceniamy indywidualnie na podstawie specyfikacji technicznej. Poniżej przedstawiamy orientacyjne pakiety.',
    priceLabel: 'od',
    currency: 'zł',
    ctaTitle: 'Chcesz zwiększyć liczbę klientów z sieci?',
    ctaSubtitle: 'Wypełnij poniższy formularz. Przygotujemy dla Ciebie darmową, niezobowiązującą wycenę dedykowanej strony internetowej w ciągu 24h.'
  },
  en: {
    title: 'Custom Website Design & Development | webwawa.pl',
    description: 'We design and code ultra-fast, modern websites using Next.js, React, and WordPress. Boost your visibility in AI-driven search engines!',
    breadcrumb: 'Custom Websites',
    heroTitle: 'Custom Web',
    heroSubtitle: 'We design and develop ultra-fast websites using Next.js and WordPress, optimized for conversions and AI search engines.',
    techTitle: 'Performance-Driven Technologies',
    techSubtitle: 'Choosing the right technology stack is the foundation of online success. We work with cutting-edge solutions for stability and speed.',
    advantagesTitle: 'Why Do Our Websites Convert Better?',
    advantage1Title: 'Instant Loading Speed',
    advantage1Desc: 'Fully optimized for Core Web Vitals (PSI 100/100). A fast page means lower bounce rates.',
    advantage2Title: 'AI and GEO Prepared',
    advantage2Desc: 'We structure the code and content to ensure AI search engines (Perplexity, ChatGPT) accurately fetch and cite your services.',
    advantage3Title: 'Mobile-First Layouts',
    advantage3Desc: 'Over 70% of web traffic is mobile. Our designs look and run flawlessly on any smartphone.',
    pricingTitle: 'Estimated Project Budget',
    pricingSubtitle: 'Every project is priced individually based on technical specifications. Below are indicative pricing tiers.',
    priceLabel: 'from',
    currency: 'PLN',
    ctaTitle: 'Ready to attract more online clients?',
    ctaSubtitle: 'Fill out the form below. We will prepare a free, no-obligation quote for your custom website within 24 hours.'
  },
  de: {
    title: 'Webdesign & Webentwicklung | webwawa.pl',
    description: 'Wir entwerfen und programmieren ultraschnelle, moderne Websites mit Next.js, React und WordPress. Steigern Sie Ihre Sichtbarkeit in KI-Suchmaschinen!',
    breadcrumb: 'Dedizierte Webseiten',
    heroTitle: 'Dedizierte Webseiten',
    heroSubtitle: 'Wir entwickeln ultraschnelle Websites auf Next.js- und WordPress-Basis, optimiert für Conversions und KI-Suchmaschinen.',
    techTitle: 'Leistungsstarke Technologien',
    techSubtitle: 'Die Wahl des richtigen Technologiestacks ist das Fundament des Online-Erfolgs. Wir setzen auf modernste Lösungen für Stabilität und Speed.',
    advantagesTitle: 'Warum konvertieren unsere Websites besser?',
    advantage1Title: 'Ultraschnelle Ladezeiten',
    advantage1Desc: 'Optimiert nach Core Web Vitals (PSI 100/100). Schnelle Seiten reduzieren die Absprungrate drastisch.',
    advantage2Title: 'Bereit für KI-Suche (GEO)',
    advantage2Desc: 'Wir strukturieren Inhalte und Code so, dass KI-Suchmaschinen (Perplexity, ChatGPT) Ihr Angebot präzise erfassen und zitieren.',
    advantage3Title: 'Konsequentes Mobile-First',
    advantage3Desc: 'Mehr als 70% des Datenverkehrs erfolgt über Mobilgeräte. Unsere Designs laufen perfekt auf jedem Smartphone.',
    pricingTitle: 'Geschätztes Projektbudget',
    pricingSubtitle: 'Jedes Projekt wird individuell nach Aufwand kalkuliert. Unten finden Sie Richtwerte für verschiedene Pakete.',
    priceLabel: 'ab',
    currency: 'EUR',
    ctaTitle: 'Möchten Sie mehr Kunden über das Internet gewinnen?',
    ctaSubtitle: 'Füllen Sie das Formular aus. Wir erstellen Ihnen innerhalb von 24 Stunden ein kostenloses, unverbindliches Angebot.'
  },
  uk: {
    title: 'Розробка та Створення Сайтів | webwawa.pl',
    description: 'Ми проектуємо та розробляємо ультрашвидкі, сучасні веб-сайти на базі Next.js, React та WordPress. Збільшуйте видимість в AI пошукових системах!',
    breadcrumb: 'Спеціалізовані веб-сайти',
    heroTitle: 'Спеціалізовані Сайти',
    heroSubtitle: 'Ми створюємо ультрашвидкі сайти на технологіях Next.js та WordPress, оптимізовані для конверсії та AI-пошуку.',
    techTitle: 'Технології, орієнтовані на продуктивність',
    techSubtitle: 'Вибір правильного технологічного стеку - це основа успіху в мережі. Ми працюємо з найсучаснішими рішеннями для швидкості.',
    advantagesTitle: 'Чому наші сайти конвертують краще?',
    advantage1Title: 'Миттєве завантаження',
    advantage1Desc: 'Повністю оптимізовано під вимоги Core Web Vitals (PSI 100/100). Швидкий сайт знижує відсоток відмов.',
    advantage2Title: 'Готовність до ШІ та GEO',
    advantage2Desc: 'Ми структуруємо код і вміст так, щоб пошукові системи штучного інтелекту (Perplexity, ChatGPT) точно цитували ваші послуги.',
    advantage3Title: 'Абсолютний Mobile-First',
    advantage3Desc: 'Понад 70% інтернет-трафіку припадає на смартфони. Наші рішення виглядають та працюють бездоганно на будь-якому екрані.',
    pricingTitle: 'Орієнтовний бюджет проектів',
    pricingSubtitle: 'Кожен проект оцінюється індивідуально на основі технічного завдання. Нижче наведено орієнтовні пакети.',
    priceLabel: 'від',
    currency: 'PLN',
    ctaTitle: 'Бажаєте залучити більше клієнтів з інтернету?',
    ctaSubtitle: 'Заповніть форму нижче. Ми підготуємо для вас безкоштовний розрахунок вартості створення сайту протягом 24 годин.'
  },
  ru: {
    title: 'Разработка и Создание Сайтов | webwawa.pl',
    description: 'Мы проектируем и разрабатываем ультрабыстрые, современные веб-сайты на базе Next.js, React и WordPress. Увеличьте видимость в поисковых системах AI!',
    breadcrumb: 'Специализированные веб-сайты',
    heroTitle: 'Специализированные Сайты',
    heroSubtitle: 'Мы разрабатываем ультрабыстрые сайты на технологиях Next.js и WordPress, оптимизированные для конверсий и поисковиков AI.',
    techTitle: 'Технологии, ориентированные на производительность',
    techSubtitle: 'Выбор правильного технологического стека - фундамент успеха в сети. Мы используем передовые решения для максимальной скорости.',
    advantagesTitle: 'Почему наши сайты продают лучше?',
    advantage1Title: 'Мгновенная загрузка',
    advantage1Desc: 'Оптимизировано под требования Core Web Vitals (PSI 100/100). Быстрый сайт снижает показатель отказов.',
    advantage2Title: 'Готовность к ИИ и GEO',
    advantage2Desc: 'Мы структурируем контент и код так, чтобы поисковые системы ИИ (Perplexity, ChatGPT Search) точно считывали ваши данные.',
    advantage3Title: 'Абсолютный Mobile-First',
    advantage3Desc: 'Более 70% трафика идет со смартфонов. Наши интерфейсы работают идеально на любых мобильных устройствах.',
    pricingTitle: 'Ориентировочная стоимость разработки',
    pricingSubtitle: 'Каждый проект рассчитывается индивидуально под требования. Ниже представлены базовые ценовые категории.',
    priceLabel: 'от',
    currency: 'PLN',
    ctaTitle: 'Хотите привлечь больше клиентов из интернета?',
    ctaSubtitle: 'Заполните форму ниже. Мы подготовим для вас бесплатный расчет стоимости создания сайта в течение 24 часов.'
  },
  zh: {
    title: '专业定制网站建设与开发 | webwawa.pl',
    description: '我们使用 Next.js、React 和 WordPress 设计并开发超快速、现代化的网站。提升您在 AI 搜索引擎中的可见度！',
    breadcrumb: '定制网站',
    heroTitle: '定制网站建设',
    heroSubtitle: '我们使用 Next.js 和 WordPress 开发超快速的网站，针对转化率和 AI 搜索引擎进行了全面优化。',
    techTitle: '以性能为核心的技术栈',
    techSubtitle: '选择合适的技术栈是线上成功的基石。我们采用最新前沿技术方案，确保网站稳定且高速运行。',
    advantagesTitle: '为什么我们的网站转化率更高？',
    advantage1Title: '极速加载体验',
    advantage1Desc: '针对 Core Web Vitals 进行全面优化（PSI 分数达 100/100）。网页加载越快，跳出率越低。',
    advantage2Title: '支持 AI 搜索与 GEO 优化',
    advantage2Desc: '结构化内容与代码，使 AI 搜索引擎（如 Perplexity、ChatGPT Search）能够精准获取并引用您的服务。',
    advantage3Title: '移动端优先布局',
    advantage3Desc: '超过 70% 的访问量来自移动端。我们的设计在各类智能手机上均能呈现完美效果。',
    pricingTitle: '估算项目预算',
    pricingSubtitle: '所有项目将根据具体技术需求单独报价。以下是可供参考的预算区间。',
    priceLabel: '起价',
    currency: '元 (PLN)',
    ctaTitle: '想要通过互联网吸引更多客户？',
    ctaSubtitle: '请填写下方表单。我们将在 24 小时内为您提供免费且无约束的定制网站估价方案。'
  }
};

const pricingTiers = {
  pl: [
    { name: 'Landing Page / Wizytówka', price: '3 900', desc: 'Jednostronicowa, wysoce zoptymalizowana witryna idealna do kampanii Google Ads / AI Ads. Projekt UX/UI, copywriting SEO i wdrożenie w cenie.' },
    { name: 'Biznesowa Strona WordPress', price: '6 900', desc: 'Wielostronicowy serwis z panelem CMS, dedykowanym projektem graficznym, blogiem, certyfikatem SSL i pakietem podstawowego SEO.' },
    { name: 'Dedykowana Aplikacja PWA (Next.js)', price: '14 900', desc: 'Autorskie rozwiązanie Headless z wynikiem PSI 100/100. Pełna własność kodu, architektura przyszłościowa, gotowość na AI Search.' }
  ],
  en: [
    { name: 'Landing Page / Business Card', price: '1 000', desc: 'Single-page, highly optimized site. Includes UX/UI design, SEO copywriting, and full deployment.' },
    { name: 'Corporate WordPress Website', price: '1 800', desc: 'Multi-page website with custom design, CMS panel, blog, SSL certificate, and basic SEO package.' },
    { name: 'Custom PWA App (Next.js)', price: '3 900', desc: 'Bespoke Headless solution, PSI 100/100, full code ownership, AI Search-ready architecture.' }
  ],
  de: [
    { name: 'Landing Page / Visitenkarte', price: '1 000', desc: 'Einseitige, optimierte Website inkl. UX/UI-Design, SEO-Texten und vollständiger Bereitstellung.' },
    { name: 'Corporate WordPress-Website', price: '1 800', desc: 'Mehrseitige Website mit individuellem Design, CMS-Dashboard, Blog, SSL und Basis-SEO-Paket.' },
    { name: 'Maßgeschneiderte PWA (Next.js)', price: '3 900', desc: 'Individuelle Headless-Lösung, PSI 100/100, volle Code-Eigentumsrechte, KI-suchoptimiert.' }
  ],
  uk: [
    { name: 'Landing Page / Візитка', price: '3 900', desc: 'Односторінковий, оптимізований сайт. Включає UX/UI дизайн, SEO-копірайтинг та повне розгортання.' },
    { name: 'Бізнес-сайт на WordPress', price: '6 900', desc: 'Багатосторінковий ресурс із кастомним дизайном, CMS, блогом, SSL і базовим SEO-пакетом.' },
    { name: 'Спеціалізований PWA додаток (Next.js)', price: '14 900', desc: 'Headless рішення з PSI 100/100, повне право власності на код, готовність до AI Search.' }
  ],
  ru: [
    { name: 'Landing Page / Визитка', price: '3 900', desc: 'Одностраничный, оптимизированный сайт. Включает UX/UI дизайн, SEO-копирайтинг и полное развертывание.' },
    { name: 'Бизнес-сайт на WordPress', price: '6 900', desc: 'Многостраничный сайт с кастомным дизайном, CMS, блогом, SSL и базовым SEO-пакетом.' },
    { name: 'Кастомное PWA приложение (Next.js)', price: '14 900', desc: 'Headless решение, PSI 100/100, полное право собственности на код, готовность к AI Search.' }
  ],
  zh: [
    { name: '着陆页 / 单页微官网', price: '3 900', desc: '单页面高度优化网站，含UX/UI设计、SEO文案撰写及完整部署服务。' },
    { name: '企业官网 (WordPress CMS)', price: '6 900', desc: '多页面网站，含定制设计、CMS后台、博客、SSL证书和基础SEO套餐。' },
    { name: '定制 PWA 应用 (Next.js 前端)', price: '14 900', desc: 'Headless架构，PSI 100/100，完整代码所有权，支持AI搜索的未来架构。' }
  ]
};

import { getTechnologyById } from '@/lib/technology';

export async function generateMetadata(props: { params: Promise<{ lang: string }>, searchParams: Promise<{ tech?: string }> }): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const t = translations[params.lang as Locale] || translations.en;
  let title = t.title;
  let description = t.description;

  if (searchParams?.tech) {
    const techSlug = searchParams.tech;
    const formattedTech = techSlug.charAt(0).toUpperCase() + techSlug.slice(1).replace('-', ' ');
    title = `${t.heroTitle} ${formattedTech} | webwawa.pl`;
    description = `Tworzymy ${t.heroTitle.toLowerCase()} w oparciu o ${formattedTech}. ` + description;
  }

  return {
    title,
    description,
  };
}

export default async function WebsitesServicePage(props: { params: Promise<{ lang: string }>, searchParams: Promise<{ tech?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const lang = params.lang as Locale;
  const techSlug = searchParams?.tech;
  const techData = techSlug ? await getTechnologyById(techSlug, lang) : null;
  const settings = getGlobalSettings();
  const dict = await getDictionary(lang);
  
  const t = translations[lang] || translations.en;
  const tiers = pricingTiers[lang] || pricingTiers.en;
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  const websitesSlug = getLocalizedSlug('websites', lang);

  const heroTitle = techData ? `${t.heroTitle} ${techData.name}` : t.heroTitle;
  const heroSubtitle = techData && techData.description ? techData.description : t.heroSubtitle;

  return (
    <main className="min-h-screen bg-white dark:bg-[#020510] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50/20 to-white dark:from-slate-950/10 dark:to-transparent py-24 text-slate-900 dark:text-white relative overflow-hidden border-b border-slate-100 dark:border-slate-900/60">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <nav className="flex justify-center mb-8 text-sm opacity-60 font-semibold">
            <Link href={homeUrl} className="hover:text-primary transition-colors">{dict.breadcrumbs.home}</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{t.breadcrumb}</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6 leading-relaxed md:leading-normal">
            <span className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-2 rounded-2xl inline-block mr-2 shadow-lg shadow-slate-950/10 dark:shadow-white/5">
              {heroTitle}
            </span>{" "}
            <span className="normal-case">webwawa<span className="text-amber-700 dark:text-amber-400">.pl</span></span>
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed font-semibold">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 dark:border-primary/40 text-primary dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              {lang === 'pl' ? 'Nasze technologie' : 'Our Technologies'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-4">
              {t.techTitle}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm font-semibold">
              {t.techSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link href={`/${lang}/${websitesSlug}/nextjs`} className="glass-card hover:-translate-y-1.5 transition-transform duration-300 block">
              <svg viewBox="0 0 24 24" className="w-10 h-10 mb-4 text-slate-900 dark:text-white fill-current"><path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" /></svg>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Next.js — Framework No. 1</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {lang === 'pl' 
                  ? 'Renderowanie Server-Side (SSR) oraz statyczne (SSG) gwarantujące czas LCP poniżej 0.5s.' 
                  : 'Server-Side Rendering (SSR) and static site generation (SSG) for sub-0.5s LCP speeds.'}
              </p>
            </Link>
            
            <Link href={`/${lang}/${websitesSlug}/react`} className="glass-card hover:-translate-y-1.5 transition-transform duration-300 block">
              <svg viewBox="0 0 24 24" className="w-10 h-10 mb-4 text-[#61DAFB] fill-current"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" /></svg>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">React — UI Components</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {lang === 'pl' 
                  ? 'Interaktywne elementy, wysoka elastyczność i skalowalność kodu.' 
                  : 'Interactive components, great flexibility, and code maintainability.'}
              </p>
            </Link>

            <Link href={`/${lang}/${websitesSlug}/tailwind-css`} className="glass-card hover:-translate-y-1.5 transition-transform duration-300 block">
              <svg viewBox="0 0 24 24" className="w-10 h-10 mb-4 text-[#06B6D4] fill-current"><path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" /></svg>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Tailwind — Utility CSS</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {lang === 'pl' 
                  ? 'Brak nadmiarowego kodu CSS, szybkie dopasowanie do urządzeń mobilnych.' 
                  : 'Zero bloated CSS styles, rapid development of custom mobile-first layouts.'}
              </p>
            </Link>

            <Link href={`/${lang}/${websitesSlug}/wordpress`} className="glass-card hover:-translate-y-1.5 transition-transform duration-300 block">
              <svg viewBox="0 0 24 24" className="w-10 h-10 mb-4 text-[#21759B] fill-current"><path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0" /></svg>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">WordPress — Dynamic CMS</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {lang === 'pl' 
                  ? 'Przyjazny i znany system edycji treści dla stron informacyjnych i blogowych.' 
                  : 'Friendly and well-known content editor for corporate blogs and informational sites.'}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Selling Advantages */}
      <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-b border-slate-200/60 dark:border-slate-900/60 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {t.advantagesTitle}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{t.advantage1Title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold leading-relaxed">
                {t.advantage1Desc}
              </p>
            </div>

            <div className="glass-card">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{t.advantage2Title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold leading-relaxed">
                {t.advantage2Desc}
              </p>
            </div>

            <div className="glass-card">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{t.advantage3Title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold leading-relaxed">
                {t.advantage3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Estimate */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 dark:border-primary/40 text-primary dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              {lang === 'pl' ? 'Przejrzysty Cennik' : 'Transparent Pricing'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-4">
              {t.pricingTitle}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm font-semibold">
              {t.pricingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <div key={idx} className="glass-card hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                {idx === 2 && (
                  <div className="absolute top-0 right-0 bg-primary text-white font-black uppercase text-[10px] px-3 py-1 tracking-wider rounded-bl-xl">
                    Next-Gen
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">{tier.name}</h3>
                  <p className="text-slate-550 dark:text-slate-400 text-xs font-semibold leading-relaxed mb-6">{tier.desc}</p>
                </div>
                <div className="pt-6 border-t border-slate-200/50 dark:border-slate-800/40">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase block">{t.priceLabel}</span>
                  <span className="text-3xl font-black text-primary tracking-tight">{tier.price} {t.currency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formularz Kontaktowy */}
      <section id="kontakt" className="py-20 bg-slate-100 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-900/60 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {t.ctaTitle}
            </h2>
            <p className="text-slate-550 dark:text-slate-400 font-semibold mt-4 max-w-xl mx-auto leading-relaxed">
              {t.ctaSubtitle}
            </p>
          </div>
          <ContactForm lang={lang} defaultCity="Warszawa" settings={settings} dict={dict.form} />
        </div>
      </section>
    </main>
  );
}
