import { Metadata } from 'next';
import Link from 'next/link';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale } from '../dictionaries';
import ContactForm from '@/components/ContactForm';
import { siWoocommerce, siShopify, siPrestashop } from 'simple-icons';
const translations = {
  pl: {
    title: 'Tworzenie Sklepów Internetowych i E-commerce | webwawa.pl',
    description: 'Projektujemy i wdrażamy ultra-szybkie sklepy internetowe (WooCommerce, Shopify, PrestaShop) w technologii Headless PWA. Zwiększ sprzedaż i pozycję w wyszukiwarkach.',
    breadcrumb: 'E-commerce & Sklepy',
    heroTitle: 'E-commerce & Sklepy',
    heroSubtitle: 'Projektujemy zaawansowane, szybkie platformy sprzedażowe oparte o Next.js, połączone z WooCommerce, Shopify lub PrestaShop.',
    enginesTitle: 'Nowoczesna architektura e-commerce',
    enginesSubtitle: 'Dzielimy warstwę prezentacji (szybki front w Next.js) od silnika sklepowego (panel admina). Wybierz rozwiązanie idealne dla swojego biznesu.',
    featuresTitle: 'Dlaczego nasze sklepy PWA sprzedają więcej?',
    feature1Title: 'Czas ładowania poniżej 0.5s',
    feature1Desc: 'Szybkość działania bezpośrednio przekłada się na współczynnik konwersji (CRO). Nasze sklepy ładują się w mgnieniu oka na urządzeniach mobilnych.',
    feature2Title: 'Bezpieczeństwo i stabilność',
    feature2Desc: 'Architektura Headless izoluje panel administracyjny. Sklep jest odporny na ataki i stabilny nawet podczas ogromnego ruchu.',
    feature3Title: 'Integracje i automatyzacja',
    feature3Desc: 'W pełni integrujemy sklep z systemami magazynowymi (ERP), kurierami, płatnościami (BLIK, Stripe, PayU) oraz narzędziami marketingowymi.',
    pricingTitle: 'Szacunkowe koszty wdrożenia e-commerce',
    pricingSubtitle: 'Budżet wdrożenia sklepu zależy od stopnia skomplikowania integracji i liczby produktów. Poniżej przedstawiamy orientacyjne pakiety.',
    priceLabel: 'od',
    currency: 'zł',
    ctaTitle: 'Chcesz wdrożyć nowoczesny sklep internetowy?',
    ctaSubtitle: 'Wypełnij formularz wyceny. Przeanalizujemy Twoje potrzeby i zaproponujemy optymalne rozwiązanie w ciągu 24 godzin.'
  },
  en: {
    title: 'E-commerce & Online Store Development | webwawa.pl',
    description: 'We design and build ultra-fast online stores (WooCommerce, Shopify, PrestaShop) using Headless PWA tech. Boost sales and search engine rankings.',
    breadcrumb: 'E-commerce',
    heroTitle: 'E-commerce Stores',
    heroSubtitle: 'We design advanced, high-performance shopping platforms powered by Next.js and integrated with WooCommerce, Shopify, or PrestaShop.',
    enginesTitle: 'Modern E-commerce Architecture',
    enginesSubtitle: 'We separate the presentation layer (fast Next.js front-end) from the core commerce engine. Choose the ideal solution for your business.',
    featuresTitle: 'Why Do Our PWA Stores Sell More?',
    feature1Title: 'Under 0.5s Loading Speed',
    feature1Desc: 'Loading speeds directly impact Conversion Rate Optimization (CRO). Our stores load instantly on mobile phones.',
    feature2Title: 'Security & High Stability',
    feature2Desc: 'Headless architecture isolates the admin panel. Your store is secure from attacks and stable during peak traffic spikes.',
    feature3Title: 'Integrations & Automation',
    feature3Desc: 'We fully synchronize inventory with ERP systems, couriers, payments (BLIK, Stripe, PayPal), and marketing suites.',
    pricingTitle: 'Estimated E-commerce Budgets',
    pricingSubtitle: 'Implementation budgets depend on integration complexity and product volume. Below are indicative pricing tiers.',
    priceLabel: 'from',
    currency: 'PLN',
    ctaTitle: 'Ready to build a modern online store?',
    ctaSubtitle: 'Fill out the quote form below. We will analyze your needs and suggest the best solution within 24 hours.'
  },
  de: {
    title: 'E-Commerce & Online-Shop Entwicklung | webwawa.pl',
    description: 'Wir entwickeln ultraschnelle Online-Shops (WooCommerce, Shopify, PrestaShop) in Headless PWA-Technologie. Steigern Sie Umsatz und Rankings.',
    breadcrumb: 'E-Commerce',
    heroTitle: 'E-Commerce Shops',
    heroSubtitle: 'Wir entwickeln fortschrittliche E-Commerce-Plattformen auf Next.js-Basis mit WooCommerce-, Shopify- oder PrestaShop-Anbindung.',
    enginesTitle: 'Moderne E-Commerce-Architektur',
    enginesSubtitle: 'Wir trennen das Frontend (schnelles Next.js) vom Backend-System. Wählen Sie die passende Lösung für Ihr E-Commerce.',
    featuresTitle: 'Warum verkaufen unsere PWA-Shops mehr?',
    feature1Title: 'Ladezeiten unter 0,5s',
    feature1Desc: 'Geschwindigkeit wirkt sich direkt auf die Conversion-Rate (CRO) aus. Unsere Shops laden sofort auf Mobilgeräten.',
    feature2Title: 'Sicherheit & Stabilität',
    feature2Desc: 'Die Headless-Architektur isoliert das Admin-Panel. Der Shop ist extrem sicher und bleibt auch bei Traffic-Spitzen stabil.',
    feature3Title: 'Schnittstellen & Automatisierung',
    feature3Desc: 'Vollständige Anbindung an Warenwirtschaftssysteme (ERP), Versanddienstleister, Zahlungsanbieter und Marketingtools.',
    pricingTitle: 'Geschätztes E-Commerce-Budget',
    pricingSubtitle: 'Die Kosten hängen von Schnittstellen und Sortiment ab. Unten finden Sie Richtwerte für verschiedene Pakete.',
    priceLabel: 'ab',
    currency: 'EUR',
    ctaTitle: 'Möchten Sie einen modernen Online-Shop starten?',
    ctaSubtitle: 'Füllen Sie das Formular aus. Wir analysieren Ihre Anforderungen und senden Ihnen innerhalb von 24 Stunden ein Angebot.'
  },
  uk: {
    title: 'Створення Інтернет-Магазинів | webwawa.pl',
    description: 'Ми проектуємо та впроваджуємо ультрашвидкі інтернет-магазини (WooCommerce, Shopify, PrestaShop) за технологією Headless PWA. Збільшуйте продажі.',
    breadcrumb: 'Інтернет-магазини / E-commerce',
    heroTitle: 'Інтернет-Магазини',
    heroSubtitle: 'Ми створюємо сучасні платформи для онлайн-торгівлі на базі Next.js, інтегровані з WooCommerce, Shopify або PrestaShop.',
    enginesTitle: 'Сучасна архітектура електронної комерції',
    enginesSubtitle: 'Ми відокремлюємо візуальну частину (швидкий Next.js фронтенд) від панелі управління. Оберіть рішення для вашого бізнесу.',
    featuresTitle: 'Чому наші PWA-магазини продають більше?',
    feature1Title: 'Завантаження до 0.5 секунди',
    feature1Desc: 'Швидкість безпосередньо впливає на показники конверсії (CRO). Наші магазини завантажуються миттєво на смартфонах.',
    feature2Title: 'Безпека та стійкість до навантажень',
    feature2Desc: 'Архітектура Headless ізолює адмін-панель. Магазин захищений від атак та витримує великі напливи покупців.',
    feature3Title: 'Інтеграції та автоматизація процесів',
    feature3Desc: 'Повна синхронізація залишків з ERP-системами, кур\'єрськими службами, платіжними системами (Stripe, PayPal) та CRM.',
    pricingTitle: 'Орієнтовний бюджет e-commerce рішень',
    pricingSubtitle: 'Вартість розробки залежить від складності інтеграцій та кількості товарів. Нижче наведено орієнтовні пакети.',
    priceLabel: 'від',
    currency: 'PLN',
    ctaTitle: 'Бажаєте створити сучасний інтернет-магазин?',
    ctaSubtitle: 'Заповніть форму оцінки вартості. Ми вивчимо ваші вимоги та запропонуємо рішення протягом 24 годин.'
  },
  ru: {
    title: 'Создание Интернет-Магазинов | webwawa.pl',
    description: 'Мы проектируем и создаем ультрабыстрые интернет-магазины (WooCommerce, Shopify, PrestaShop) по технологии Headless PWA. Увеличьте ваши продажи.',
    breadcrumb: 'Интернет-магазины / E-commerce',
    heroTitle: 'Интернет-Магазины',
    heroSubtitle: 'Мы разрабатываем современные e-commerce платформы на базе Next.js, интегрированные с WooCommerce, Shopify или PrestaShop.',
    enginesTitle: 'Современная архитектура электронной коммерции',
    enginesSubtitle: 'Мы разделяем визуальную часть (быстрый Next.js фронтенд) и ядро магазина. Выберите лучшее решение для вашего бизнеса.',
    featuresTitle: 'Почему наши PWA-магазины продают больше?',
    feature1Title: 'Загрузка менее 0.5 сек',
    feature1Desc: 'Скорость работы напрямую влияет на показатели конверсии (CRO). Наши магазины открываются мгновенно на мобильных.',
    feature2Title: 'Безопасность и устойчивость к нагрузкам',
    feature2Desc: 'Архитектура Headless изолирует панель управления. Магазин защищен от взломов и стабилен при пиковых нагрузках.',
    feature3Title: 'Интеграции и автоматизация процессов',
    feature3Desc: 'Полная синхронизация товаров с системами учета (ERP), службами доставки, эквайрингом (Stripe) и аналитикой.',
    pricingTitle: 'Ориентировочная стоимость e-commerce',
    pricingSubtitle: 'Бюджет разработки зависит от сложности интеграций и объема каталога. Ниже представлены базовые пакеты.',
    priceLabel: 'от',
    currency: 'PLN',
    ctaTitle: 'Хотите запустить современный интернет-магазин?',
    ctaSubtitle: 'Заполните форму ниже. Мы проанализируем ваш проект и предложим оптимальный вариант в течение 24 часов.'
  },
  zh: {
    title: '电子商务与在线商城开发开发 | webwawa.pl',
    description: '我们使用 Headless PWA 技术设计并开发超快速的在线商城（WooCommerce、Shopify、PrestaShop）。帮助提升销售额及搜索引擎排名。',
    breadcrumb: '电子商务商城',
    heroTitle: '电子商务商城',
    heroSubtitle: '我们使用 Next.js 开发高端、高并发的在线购物商城，与 WooCommerce、Shopify 或 PrestaShop 深度整合。',
    enginesTitle: '现代 Headless 架构设计',
    enginesSubtitle: '我们将内容展示前端（极速 Next.js）与后台商城管理系统分离，为您量身定制性能绝佳的零售体验。',
    featuresTitle: '为什么我们的 PWA 在线商城销量更佳？',
    feature1Title: '首屏加载小于 0.5 秒',
    feature1Desc: '加载速度直接决定流量转化率（CRO）。我们的商城在移动设备上实现秒开体验。',
    feature2Title: '极高的安全度与架构稳定性',
    feature2Desc: 'Headless 彻底隔离管理面板。网站无惧安全漏洞冲击，轻松承载海量促销流量。',
    feature3Title: 'ERP 同步与自动化流水线',
    feature3Desc: '支持与 ERP 仓储系统、物流快递、主流支付（BLIK, Stripe, PayPal）和营销自动化系统的无缝对接。',
    pricingTitle: '商城系统估算预算',
    pricingSubtitle: '商城的搭建成本取决于系统集成复杂度及商品sku规模。以下是预算分档。',
    priceLabel: '起价',
    currency: '元 (PLN)',
    ctaTitle: '准备搭建一套现代化的电商商城吗？',
    ctaSubtitle: '请填写下方报价申请。我们将在 24 小时内分析您的需求并提供最优性价比方案。'
  }
};

const pricingTiers = {
  pl: [
    { name: 'Headless WooCommerce (Next.js)', price: '5 900', desc: 'Optymalne połączenie przyjaznego WordPressa z niesamowicie szybkim frontem. Idealne dla małych i średnich sklepów.' },
    { name: 'Headless Shopify (Next.js)', price: '12 900', desc: 'Stabilna chmura Shopify połączona z autorskim frontendem w Next.js. Elastyczne pozycjonowanie URL i brak ograniczeń szablonów.' },
    { name: 'PrestaShop + PWA Frontend', price: '22 000', desc: 'Zaawansowany silnik e-commerce zintegrowany z systemami ERP i dedykowaną, błyskawiczną nakładką PWA.' }
  ],
  en: [
    { name: 'Headless WooCommerce (Next.js)', price: '1 500', desc: 'The optimal combination of user-friendly WordPress and a lightning-fast front-end. Ideal for small to medium shops.' },
    { name: 'Headless Shopify (Next.js)', price: '3 200', desc: 'Shopify cloud scalability merged with a custom Next.js front-end. Absolute URL SEO control with no theme limitations.' },
    { name: 'PrestaShop + PWA Frontend', price: '5 500', desc: 'Advanced e-commerce database engine fully synchronized with ERP inventory and a custom custom PWA.' }
  ],
  de: [
    { name: 'Headless WooCommerce (Next.js)', price: '1 500', desc: 'Optimale Kombination aus bekanntem WordPress-Admin und blitzschnellem Frontend. Perfekt für kleine bis mittlere Shops.' },
    { name: 'Headless Shopify (Next.js)', price: '3 200', desc: 'Shopify-Cloud-Power kombiniert mit maßgeschneidertem Next.js-Frontend. Absolute Kontrolle über URLs, SEO und Layouts.' },
    { name: 'PrestaShop + PWA-Frontend', price: '5 500', desc: 'Komplexer E-Commerce-Engine integriert in ERP-Warenwirtschaft mit superschneller PWA-Schnittstelle.' }
  ],
  uk: [
    { name: 'Headless WooCommerce (Next.js)', price: '5 900', desc: 'Поєднання зручної системи WordPress з неймовірно швидким фронтом. Ідеально для малих та середніх інтернет-магазинів.' },
    { name: 'Headless Shopify (Next.js)', price: '12 900', desc: 'Стабільна хмара Shopify з авторським Next.js фронтом. Повний контроль над структурами лінків для SEO.' },
    { name: 'PrestaShop + PWA Frontend', price: '22 000', desc: 'Потужний e-commerce двигун інтегрований з ERP-системами та індивідуальною швидкісною PWA оболонкою.' }
  ],
  ru: [
    { name: 'Headless WooCommerce (Next.js)', price: '5 900', desc: 'Сочетание привычной админки WordPress с невероятно быстрым фронтендом. Идеально для малых и средних магазинов.' },
    { name: 'Headless Shopify (Next.js)', price: '12 900', desc: 'Стабильность облака Shopify с авторским Next.js фронтендом. Полная свобода в настройке URL и SEO-структуры.' },
    { name: 'PrestaShop + PWA Frontend', price: '22 000', desc: 'Продвинутый e-commerce движок, интегрированный с ERP системами и снабженный реактивным PWA-интерфейсом.' }
  ],
  zh: [
    { name: 'Headless WooCommerce 商城', price: '5 900', desc: '将易操作的 WP 后台与高并发 Next.js 前端完美结合。中小商户性价比首选。' },
    { name: 'Headless Shopify 全球站', price: '12 900', desc: 'Shopify 稳定的交易闭环融合 Next.js 极速 frontend. 突破 Shopify 模版 SEO 架构限制。' },
    { name: 'PrestaShop 高级 ERP 二次开发', price: '22 000', desc: '大型 PrestaShop 系统深度对接企业内部 ERP，加装高并发定制 PWA 轻量前端。' }
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

export default async function EcommerceServicePage(props: { params: Promise<{ lang: string }> }) {
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

      {/* Engines Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 dark:border-primary/40 text-primary dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              {lang === 'pl' ? 'Wdrożenia Headless' : 'Headless Implementations'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-4">
              {t.enginesTitle}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            <p className="text-slate-550 dark:text-slate-400 mt-4 text-sm font-semibold">
              {t.enginesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card hover:-translate-y-1.5 transition-transform duration-300">
              <svg viewBox="0 0 24 24" className="w-10 h-10 mb-4 fill-current" style={{ color: '#' + siWoocommerce.hex }}>
                <path d={siWoocommerce.path} />
              </svg>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Headless WooCommerce</h3>
              <ul className="text-xs text-slate-550 dark:text-slate-400 space-y-2 mt-4 font-semibold">
                <li>✓ {lang === 'pl' ? 'Niski koszt utrzymania serwera' : 'Low hosting costs'}</li>
                <li>✓ {lang === 'pl' ? 'Wygodne zarządzanie treścią (CMS)' : 'Familiar CMS dashboards'}</li>
                <li>✓ {lang === 'pl' ? 'Nieograniczona modyfikacja kodu' : 'Unlimited customization freedom'}</li>
              </ul>
            </div>
            
            <div className="glass-card hover:-translate-y-1.5 transition-transform duration-300">
              <svg viewBox="0 0 24 24" className="w-10 h-10 mb-4 fill-current" style={{ color: '#' + siShopify.hex }}>
                <path d={siShopify.path} />
              </svg>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Headless Shopify</h3>
              <ul className="text-xs text-slate-550 dark:text-slate-400 space-y-2 mt-4 font-semibold">
                <li>✓ {lang === 'pl' ? 'Brak obaw o serwery bazodanowe' : 'No database scalability worries'}</li>
                <li>✓ {lang === 'pl' ? 'Stabilny system checkoutu' : 'Bulletproof transaction engine'}</li>
                <li>✓ {lang === 'pl' ? 'Zaawansowane API Storefront' : 'Storefront API flexibility'}</li>
              </ul>
            </div>

            <div className="glass-card hover:-translate-y-1.5 transition-transform duration-300">
              <svg viewBox="0 0 24 24" className="w-10 h-10 mb-4 fill-current" style={{ color: '#' + siPrestashop.hex }}>
                <path d={siPrestashop.path} />
              </svg>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Presta PWA</h3>
              <ul className="text-xs text-slate-550 dark:text-slate-400 space-y-2 mt-4 font-semibold">
                <li>✓ {lang === 'pl' ? 'Stworzone dla tysięcy produktów' : 'Engineered for large catalogs'}</li>
                <li>✓ {lang === 'pl' ? 'Integracja z magazynami ERP' : 'Native ERP system sync'}</li>
                <li>✓ {lang === 'pl' ? 'Błyskawiczna nakładka Next.js' : 'Ultra-fast Next.js storefront'}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Selling Advantages */}
      <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-b border-slate-200/60 dark:border-slate-900/60 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {t.featuresTitle}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{t.feature1Title}</h3>
              <p className="text-slate-550 dark:text-slate-400 text-sm font-semibold leading-relaxed">
                {t.feature1Desc}
              </p>
            </div>

            <div className="glass-card">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{t.feature2Title}</h3>
              <p className="text-slate-550 dark:text-slate-400 text-sm font-semibold leading-relaxed">
                {t.feature2Desc}
              </p>
            </div>

            <div className="glass-card">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{t.feature3Title}</h3>
              <p className="text-slate-550 dark:text-slate-400 text-sm font-semibold leading-relaxed">
                {t.feature3Desc}
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
              {lang === 'pl' ? 'Elastyczny Budżet' : 'Flexible Budget'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-4">
              {t.pricingTitle}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            <p className="text-slate-550 dark:text-slate-400 mt-4 text-sm font-semibold">
              {t.pricingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <div key={idx} className="glass-card hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
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
