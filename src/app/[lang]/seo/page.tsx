import { Metadata } from 'next';
import Link from 'next/link';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale } from '../dictionaries';
import ContactForm from '@/components/ContactForm';

const translations = {
  pl: {
    title: 'Pozycjonowanie SEO i GEO (AI Search Optimization) | webwawa.pl',
    description: 'Skuteczne pozycjonowanie w tradycyjnych wyszukiwarkach oraz optymalizacja pod AI Search (ChatGPT, Perplexity). Zwiększ widoczność w erze zero-click!',
    breadcrumb: 'Pozycjonowanie SEO & GEO',
    heroTitle: 'Pozycjonowanie SEO',
    heroSubtitle: 'Wkraczamy w erę wyszukiwarek AI. Oferujemy nowoczesne pozycjonowanie stron i e-commerce w Google, Perplexity, ChatGPT Search i Apple Intelligence.',
    badge: 'Pozycjonowanie nowej ery',
    techTitle: 'Strategia oparta na danych i AI',
    techSubtitle: 'W 2026 roku SEO to nie tylko słowa kluczowe. To Relevance Engineering – dostarczanie botom i modelom LLM ustrukturyzowanych danych i autorytatywnych treści.',
    advantagesTitle: 'Dlaczego SEO z webwawa.pl?',
    advantage1Title: 'Gotowość na AI Search (GEO)',
    advantage1Desc: 'Strukturyzujemy kod, wdrażamy pliki llms.txt oraz znaczniki Schema.org, aby Twoja marka pojawiała się w podsumowaniach AI Overviews.',
    advantage2Title: 'Lokalna dominacja (Google Maps)',
    advantage2Desc: 'Optymalizujemy profil firmy w Google (GMF) oraz lokalne frazy kluczowe, docierając bezpośrednio do klientów z Twojej okolicy.',
    advantage3Title: 'Zoptymalizowany pod zero-click',
    advantage3Desc: 'Dopasowujemy treści do intencji użytkowników, aby budować autorytet i generować leady nawet wtedy, gdy użytkownik nie klika w tradycyjne linki.',
    pricingTitle: 'Abonamenty pozycjonowania i optymalizacji',
    pricingSubtitle: 'SEO to proces długofalowy. Proponujemy elastyczne pakiety abonamentowe bez długich i skomplikowanych umów.',
    priceLabel: 'od',
    currency: 'zł/mies.',
    ctaTitle: 'Chcesz zdominować wyniki wyszukiwania?',
    ctaSubtitle: 'Wypełnij poniższy formularz. Nasi eksperci od SEO i GEO przeprowadzą bezpłatną analizę widoczności Twojej strony w ciągu 24h.'
  },
  en: {
    title: 'SEO & GEO (AI Search Optimization) Services | webwawa.pl',
    description: 'Effective search engine optimization and GEO (Generative Engine Optimization) for ChatGPT, Perplexity, and Google. Boost your brand visibility!',
    breadcrumb: 'SEO Optimization',
    heroTitle: 'SEO & GEO Optimization',
    heroSubtitle: 'Welcome to the AI Search era. We offer modern SEO/GEO services for Google, Perplexity, ChatGPT Search, and Apple Intelligence.',
    badge: 'Next-Gen SEO',
    techTitle: 'Data & AI-Driven Search Strategy',
    techSubtitle: 'In 2026, SEO is more than just keywords. It is Relevance Engineering — delivering structured data and authoritative content to LLMs.',
    advantagesTitle: 'Why Choose SEO by webwawa.pl?',
    advantage1Title: 'AI Search Ready (GEO)',
    advantage1Desc: 'We structure code, deploy llms.txt files, and implement Schema.org microdata to trigger AI Overview references.',
    advantage2Title: 'Local Search Dominance',
    advantage2Desc: 'We optimize Google Business Profiles and localized search terms to bring local customers straight to your business.',
    advantage3Title: 'Zero-Click Optimization',
    advantage3Desc: 'We structure content for semantic search, capturing user intent and securing brand mentions even without traditional clicks.',
    pricingTitle: 'SEO & GEO Optimization Packages',
    pricingSubtitle: 'SEO is a long-term process. We offer flexible subscription plans with no lock-in contract agreements.',
    priceLabel: 'from',
    currency: 'PLN/mo',
    ctaTitle: 'Ready to dominate search results?',
    ctaSubtitle: 'Fill out the form below. Our SEO & GEO experts will prepare a free website visibility audit within 24 hours.'
  },
  de: {
    title: 'SEO & GEO (KI-Suchmaschinenoptimierung) | webwawa.pl',
    description: 'Suchmaschinenoptimierung und GEO (Generative Engine Optimization) für Google, ChatGPT und Perplexity. Maximieren Sie Ihre KI-Sichtbarkeit!',
    breadcrumb: 'SEO-Optimierung',
    heroTitle: 'SEO & GEO Optimierung',
    heroSubtitle: 'Willkommen in der Ära der KI-Suche. Wir optimieren Ihre Website für Google, Perplexity, ChatGPT Search und Apple Intelligence.',
    badge: 'KI-Suchmaschinenoptimierung',
    techTitle: 'Daten- und KI-basierte Suchstrategie',
    techSubtitle: 'Im Jahr 2026 ist SEO mehr als Keywords. Es ist Relevance Engineering – die Bereitstellung strukturierter Daten für LLM-Modelle.',
    advantagesTitle: 'Warum SEO mit webwawa.pl?',
    advantage1Title: 'Bereit für KI-Suche (GEO)',
    advantage1Desc: 'Wir optimieren Ihren Code, implementieren llms.txt und Schema.org-Markup, damit KI-Modelle Ihre Marke zitieren.',
    advantage2Title: 'Lokale Sichtbarkeit',
    advantage2Desc: 'Optimierung Ihres Google Business Profiles und lokaler Suchbegriffe für maximale Anfragen aus Ihrer Region.',
    advantage3Title: 'Zero-Click-Optimierung',
    advantage3Desc: 'Ausrichtung der Inhalte auf semantische Suchen, um die Markenbekanntheit auch bei "Zero-Click"-Suchen zu sichern.',
    pricingTitle: 'SEO- & GEO-Optimierungspakete',
    pricingSubtitle: 'SEO ist ein kontinuierlicher Prozess. Wir bieten flexible monatliche Tarife ohne lange Vertragslaufzeiten.',
    priceLabel: 'ab',
    currency: 'EUR/Monat',
    ctaTitle: 'Möchten Sie die Suchergebnisse dominieren?',
    ctaSubtitle: 'Füllen Sie das Formular aus. Unsere Experten führen innerhalb von 24 Stunden eine kostenlose SEO/GEO-Analyse durch.'
  },
  uk: {
    title: 'SEO та GEO (Оптимізація під AI-Пошук) | webwawa.pl',
    description: 'Ефективна пошукова оптимізація та GEO (Generative Engine Optimization) для Google, ChatGPT та Perplexity. Будьте помітні в еру AI!',
    breadcrumb: 'SEO-оптимізація',
    heroTitle: 'SEO та GEO Оптимізація',
    heroSubtitle: 'Ми входимо в еру пошукових систем ШІ. Пропонуємо сучасне просування в Google, Perplexity, ChatGPT Search та Apple Intelligence.',
    badge: 'Пошукове просування нового покоління',
    techTitle: 'Стратегія пошуку на основі даних та AI',
    techSubtitle: 'У 2026 році SEO – це не просто ключові слова. Це Relevance Engineering – надання структурованих даних та авторитетного контенту для LLM.',
    advantagesTitle: 'Чому просування від webwawa.pl?',
    advantage1Title: 'Готовність до AI Search (GEO)',
    advantage1Desc: 'Ми структуруємо код, впроваджуємо файли llms.txt та мікророзмітку Schema.org для виведення бренду в AI Overviews.',
    advantage2Title: 'Локальне просування',
    advantage2Desc: 'Оптимізуємо профілі Google Business та локальні ключові запити для залучення клієнтів з вашого регіону.',
    advantage3Title: 'Оптимізація під Zero-Click',
    advantage3Desc: 'Адаптуємо контент під інтент користувача, забезпечуючи згадування бренду навіть без традиційного кліку.',
    pricingTitle: 'Тарифи на пошукову оптимізацію',
    pricingSubtitle: 'SEO – це тривалий процес. Ми пропонуємо гнучкі місячні тарифи без кабальних довгострокових контрактів.',
    priceLabel: 'від',
    currency: 'PLN/міс.',
    ctaTitle: 'Бажаєте домінувати в пошуковій видачі?',
    ctaSubtitle: 'Заповніть форму нижче. Наші спеціалісти з SEO та GEO проведуть безкоштовний аналіз видимості сайту протягом 24 годин.'
  },
  ru: {
    title: 'SEO и GEO (Оптимизация под AI-Поиск) | webwawa.pl',
    description: 'Эффективное поисковое продвижение и GEO (Generative Engine Optimization) для Google, ChatGPT и Perplexity. Будьте первыми в эру AI!',
    breadcrumb: 'SEO-оптимизация',
    heroTitle: 'SEO и GEO Оптимизация',
    heroSubtitle: 'Мы вступаем в эру поисковых систем ИИ. Предлагаем продвижение сайтов в Google, Perplexity, ChatGPT Search и Apple Intelligence.',
    badge: 'Поисковое продвижение нового поколения',
    techTitle: 'Стратегия поиска на основе данных и ИИ',
    techSubtitle: 'В 2026 году SEO – это больше чем просто ключевые слова. Это Relevance Engineering – предоставление структурированных данных и авторитетного контенту для LLM.',
    advantagesTitle: 'Почему продвижение от webwawa.pl?',
    advantage1Title: 'Готовность к AI Search (GEO)',
    advantage1Desc: 'Мы структурируем код, настраиваем файлы llms.txt и Schema.org разметку для отображения бренда в AI Overviews.',
    advantage2Title: 'Локальное продвижение',
    advantage2Desc: 'Оптимизируем профили Google Business и локальные запросы для привлечения клиентов из вашего города.',
    advantage3Title: 'Оптимизация под Zero-Click',
    advantage3Desc: 'Адаптируем контент под интенты пользователей для сохранения упоминаний бренда даже без переходов по ссылкам.',
    pricingTitle: 'Тарифы на продвижение и оптимизацию',
    pricingSubtitle: 'SEO – это долгосрочный процесс. Мы предлагаем гибкие ежемесячные тарифы без жестких обязательств.',
    priceLabel: 'от',
    currency: 'PLN/мес.',
    ctaTitle: 'Хотите доминировать в результатах поиска?',
    ctaSubtitle: 'Заполните форму ниже. Наши эксперты по SEO и GEO проведут бесплатный аудит видимости вашего сайта в течение 24 часов.'
  },
  zh: {
    title: 'SEO 搜索引擎优化与 GEO（AI 搜索优化）服务 | webwawa.pl',
    description: '针对传统搜索引擎与新型 AI 搜索（如 ChatGPT Search, Perplexity）的专业优化服务。助力品牌在 2026 零点击时代实现高频曝光。',
    breadcrumb: 'SEO搜索引擎优化',
    heroTitle: 'SEO & GEO 搜索优化',
    heroSubtitle: '迎来 AI 搜索的全新纪元。我们为您在 Google、Perplexity、ChatGPT Search 以及 Apple Intelligence 中提供专业的优化和引流方案。',
    badge: '全新一代搜索引擎优化',
    techTitle: '基于数据与人工智能的检索技术',
    techSubtitle: '在 2026 年，SEO 已超越单纯的关键词堆砌。其本质是相关性工程（Relevance Engineering）—— 向大语言模型（LLM）精准输出机器可读的结构化内容。',
    advantagesTitle: '为什么选择 webwawa.pl 的 SEO 服务？',
    advantage1Title: '适配 AI 智能搜索 (GEO)',
    advantage1Desc: '优化网页底层代码，内部部署 llms.txt 文件并标注 Schema.org 结构化微数据，优先触发 AI Overview 引用源。',
    advantage2Title: '本地搜索霸屏 (谷歌地图)',
    advantage2Desc: '深度优化谷歌商家资料 (GBP) 与本地化特定关键词，精准锁定周边高意向潜在消费人群。',
    advantage3Title: '零点击趋势优化 (Zero-Click)',
    advantage3Desc: '分析语义搜索意图，定制高权威度问答及定义，让您的品牌即便在没有点击的 AI 回答中也能获得高频展示。',
    pricingTitle: 'SEO & GEO 优化月度套餐',
    pricingSubtitle: 'SEO 是一项长期持久的系统性工程。我们提供灵活的月度托管服务，绝无任何霸王条款或长期捆绑合同。',
    priceLabel: '起价',
    currency: '元 (PLN)/月',
    ctaTitle: '准备好占据搜索引擎的黄金位置了吗？',
    ctaSubtitle: '请填写下方申请表。我们的 SEO & GEO 优化专家将在 24 小时内为您的网站进行免费的曝光度诊断与评估。'
  }
};

const pricingTiers = {
  pl: [
    { name: 'SEO Lokalne & Mapy Google', price: '1 500', desc: 'Pozycjonowanie w lokalnych wynikach wyszukiwania i mapach. Optymalizacja Profilu Firmy w Google (GMF), pozyskiwanie lokalnych linków i optymalizacja strony pod rynek lokalny.' },
    { name: 'SEO Ogólnopolskie', price: '3 500', desc: 'Kompleksowe pozycjonowanie na frazy ogólne i długi ogon (Long Tail). Audyt techniczny, link building, optymalizacja treści i regularny monitoring pozycji.' },
    { name: 'SEO E-commerce + AI Search (GEO)', price: '5 900', desc: 'Optymalizacja pod kątem wyszukiwarek AI (GEO/AEO) i sklepów internetowych. Wdrożenie Schema, llms.txt, optymalizacja semantyczna i optymalizacja współczynnika konwersji (CRO).' }
  ],
  en: [
    { name: 'Local SEO & Google Maps', price: '400', desc: 'Optimization for local search results and maps. Google Business Profile setup, local citation building, and localized on-page SEO targeting.' },
    { name: 'National SEO Strategy', price: '900', desc: 'Comprehensive national targeting for high-volume and long-tail keywords. Technical audit, custom link building, content updates, and ranking reports.' },
    { name: 'E-commerce & AI Search (GEO)', price: '1 500', desc: 'Tailored for online stores and AI search engines (GEO/AEO). Deploying Schema.org markup, llms.txt integration, semantic content structure, and conversion rate optimization (CRO).' }
  ],
  de: [
    { name: 'Lokales SEO & Google Maps', price: '400', desc: 'Optimierung für lokale Suchergebnisse und Google Maps. Google Business Profile Optimierung, lokaler Linkaufbau und On-Page SEO.' },
    { name: 'Bundesweites SEO', price: '900', desc: 'Umfassende Optimierung für nationale und Long-Tail-Suchbegriffe. Technisches Audit, Linkaufbau, Content-Optimierung und monatliches Reporting.' },
    { name: 'E-Commerce & KI-Suche (GEO)', price: '1 500', desc: 'Optimiert für Online-Shops und KI-Suchmaschinen (GEO/AEO). Implementierung von Schema, llms.txt, semantischer Inhaltsstruktur und Conversion-Optimierung (CRO).' }
  ],
  uk: [
    { name: 'Локальне SEO та Google Карти', price: '1 500', desc: 'Просування в локальних результатах пошуку та картах. Оптимізація профілю компанії в Google, локальний лінкбілдінг та адаптація під регіональний ринок.' },
    { name: 'Загальнонаціональне SEO', price: '3 500', desc: 'Комплексне просування по загальних та низькочастотних запитах (Long Tail). Технічний аудит, лінкбілдінг, оптимізація контенту та моніторинг позицій.' },
    { name: 'E-commerce & AI Search (GEO)', price: '5 900', desc: 'Оптимізація для інтернет-магазинів та штучного інтелекту (GEO/AEO). Впровадження Schema, llms.txt, семантична розмітка та оптимізація конверсії (CRO).' }
  ],
  ru: [
    { name: 'Локальное SEO и Google Карты', price: '1 500', desc: 'Продвижение в локальной выдаче и картах. Оптимизация профиля компании в Google, локальный линкбилдинг и адаптация сайта под местный рынок.' },
    { name: 'Общенациональное SEO', price: '3 500', desc: 'Комплексное продвижение по высокочастотным и низкочастотным запросам (Long Tail). Технический аудит, линкбилдинг, оптимизация контента и мониторинг позиций.' },
    { name: 'E-commerce & AI Search (GEO)', price: '5 900', desc: 'Оптимизация под интернет-магазины и поисковые системы ИИ (GEO/AEO). Внедрение Schema, llms.txt, семантическая разметка и оптимизация конверсии (CRO).' }
  ],
  zh: [
    { name: '本地 SEO 与谷歌地图霸屏', price: '1 500', desc: '针对本地搜索结果及地图的优化。谷歌商家资料 (GBP) 托管、本地化外链获取以及适配本地市场的页面调优。' },
    { name: '全国性 SEO 增长策略', price: '3 500', desc: '面向全国范围高流量及长尾关键词 (Long Tail) 的全面优化。包含技术诊断、定制外链建设、内容优化与月度排名报告。' },
    { name: '电商商城与智能 AI 检索 (GEO)', price: '5 900', desc: '专为电商及 AI 搜索引擎 (GEO/AEO) 深度定制。部署 Schema 结构化数据、llms.txt 关联、语义化内容重组以及转化率优化 (CRO)。' }
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

export default async function SeoServicePage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = params.lang as Locale;
  const settings = getGlobalSettings();
  const dict = await getDictionary(lang);

  const t = translations[lang] || translations.en;
  const tiers = pricingTiers[lang] || pricingTiers.en;
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;

  const seoFunnels = [
    { icon: '🔍', name: lang === 'pl' ? 'Audyt Techniczny' : 'Technical Audit', sub: 'Core Web Vitals & Indexing' },
    { icon: '🤖', name: lang === 'pl' ? 'Optymalizacja GEO' : 'GEO Optimization', sub: 'AI Search Ready & LLMs.txt' },
    { icon: '✍️', name: lang === 'pl' ? 'Content Marketing' : 'Content Marketing', sub: 'Semantic & Relevant Content' },
    { icon: '🔗', name: lang === 'pl' ? 'Link Building' : 'Link Building', sub: 'High Authority Backlinks' },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-[#020510] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50/20 to-white dark:from-slate-950/10 dark:to-transparent py-24 text-slate-900 dark:text-white relative overflow-hidden border-b border-slate-100 dark:border-slate-900/60">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <nav className="flex justify-center mb-8 text-sm opacity-60 font-semibold">
            <Link href={homeUrl} className="hover:text-primary transition-colors">{dict.breadcrumbs.home}</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{t.breadcrumb}</span>
          </nav>
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 dark:bg-blue-500/20 border border-primary/20 dark:border-blue-500/30 text-primary dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            {t.badge}
          </span>
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

      {/* Pillars Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 dark:border-primary/40 text-primary dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              {lang === 'pl' ? 'Nasze filary działania' : 'Our Pillars of Action'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-4">
              {t.techTitle}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            <p className="text-slate-550 dark:text-slate-400 mt-4 text-sm font-semibold">{t.techSubtitle}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {seoFunnels.map((funnel, idx) => (
              <div key={idx} className="glass-card hover:-translate-y-1.5 transition-transform duration-300 text-center">
                <div className="text-3xl mb-3">{funnel.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{funnel.name}</h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 font-semibold">{funnel.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-b border-slate-200/60 dark:border-slate-900/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {t.advantagesTitle}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{t.advantage1Title}</h3>
              <p className="text-slate-550 dark:text-slate-400 text-sm font-semibold leading-relaxed">{t.advantage1Desc}</p>
            </div>
            <div className="glass-card">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{t.advantage2Title}</h3>
              <p className="text-slate-550 dark:text-slate-400 text-sm font-semibold leading-relaxed">{t.advantage2Desc}</p>
            </div>
            <div className="glass-card">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{t.advantage3Title}</h3>
              <p className="text-slate-550 dark:text-slate-400 text-sm font-semibold leading-relaxed">{t.advantage3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 dark:border-primary/40 text-primary dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              {lang === 'pl' ? 'Abonament' : 'Subscription'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-4">
              {t.pricingTitle}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            <p className="text-slate-550 dark:text-slate-400 mt-4 text-sm font-semibold">{t.pricingSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <div key={idx} className="glass-card hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                {idx === 2 && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white font-black uppercase text-[10px] px-3 py-1 tracking-wider rounded-bl-xl">
                    AI Search Ready
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

      {/* Contact Form */}
      <section id="kontakt" className="py-20 bg-slate-100 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-900/60">
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
