import { Metadata } from 'next';
import Link from 'next/link';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale } from '../dictionaries';
import ContactForm from '@/components/ContactForm';

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

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = translations[params.lang as Locale] || translations.en;
  return {
    title: t.title,
    description: t.description,
  };
}

export default async function WebsitesServicePage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = params.lang as Locale;
  const settings = getGlobalSettings();
  const dict = await getDictionary(lang);
  
  const t = translations[lang] || translations.en;
  const tiers = pricingTiers[lang] || pricingTiers.en;
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;

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
              {t.heroTitle}
            </span>{" "}
            <span className="gradient-text">webwawa.pl</span>
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed font-semibold">
            {t.heroSubtitle}
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
            <div className="glass-card hover:-translate-y-1.5 transition-transform duration-300">
              <div className="text-primary text-3xl font-black mb-3">▲ Next.js</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Framework No. 1</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {lang === 'pl' 
                  ? 'Renderowanie Server-Side (SSR) oraz statyczne (SSG) gwarantujące czas LCP poniżej 0.5s.' 
                  : 'Server-Side Rendering (SSR) and static site generation (SSG) for sub-0.5s LCP speeds.'}
              </p>
            </div>
            
            <div className="glass-card hover:-translate-y-1.5 transition-transform duration-300">
              <div className="text-primary text-3xl font-black mb-3">⚛ React</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Modern UI Components</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {lang === 'pl' 
                  ? 'Interaktywne elementy, wysoka elastyczność i skalowalność kodu.' 
                  : 'Interactive components, great flexibility, and code maintainability.'}
              </p>
            </div>

            <div className="glass-card hover:-translate-y-1.5 transition-transform duration-300">
              <div className="text-primary text-3xl font-black mb-3">💨 Tailwind</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Utility-First CSS</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {lang === 'pl' 
                  ? 'Brak nadmiarowego kodu CSS, szybkie dopasowanie do urządzeń mobilnych.' 
                  : 'Zero bloated CSS styles, rapid development of custom mobile-first layouts.'}
              </p>
            </div>

            <div className="glass-card hover:-translate-y-1.5 transition-transform duration-300">
              <div className="text-primary text-3xl font-black mb-3">📝 WordPress</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Dynamic CMS</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {lang === 'pl' 
                  ? 'Przyjazny i znany system edycji treści dla stron informacyjnych i blogowych.' 
                  : 'Friendly and well-known content editor for corporate blogs and informational sites.'}
              </p>
            </div>
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
