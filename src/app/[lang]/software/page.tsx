import { Metadata } from 'next';
import Link from 'next/link';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale } from '../dictionaries';
import ContactForm from '@/components/ContactForm';

const translations = {
  pl: {
    title: 'Dedykowane Aplikacje i Systemy Webowe | webwawa.pl',
    description: 'Tworzymy dedykowane aplikacje webowe, systemy CRM/ERP, integracje API i platformy SaaS. Autorskie oprogramowanie szyte na miarę potrzeb Twojego biznesu.',
    breadcrumb: 'Dedykowane Aplikacje',
    heroTitle: 'Oprogramowanie',
    heroSubtitle: 'Tworzymy autorskie systemy, aplikacje SaaS, platformy rezerwacyjne i integracje API dostosowane do unikalnych procesów Twojej firmy.',
    badge: 'Software na zamówienie',
    techTitle: 'Nasze obszary kompetencji',
    techSubtitle: 'Budujemy rozwiązania skrojone pod procesy biznesowe – od prostych automatyzacji po złożone platformy SaaS.',
    advantagesTitle: 'Dlaczego aplikacja dedykowana vs gotowe SaaS?',
    advantage1Title: 'Zero limitów licencyjnych',
    advantage1Desc: 'Płacisz raz, jesteś właścicielem kodu. Brak comiesięcznych abonamentów i zależności od dostawcy.',
    advantage2Title: 'Integracja z każdym systemem',
    advantage2Desc: 'Łączymy się z ERP, CRM, systemami płatności, zewnętrznymi API i urządzeniami IoT. Twój ekosystem pracuje jako jeden organizm.',
    advantage3Title: 'Skalowalność i bezpieczeństwo',
    advantage3Desc: 'Architektura cloud-native gotowa na wzrost. Wdrożenia CI/CD, monitoring i pełna ochrona danych osobowych (RODO).',
    aiTitle: 'AI & Automatyzacje w 2026',
    aiSubtitle: 'W erze dominacji AI wbudowujemy inteligentne funkcje bezpośrednio w Twoje oprogramowanie – nie jako dodatek, ale jako rdzeń systemu.',
    ai1Title: 'LLM integrations',
    ai1Desc: 'Wbudowujemy modele językowe (GPT-4, Claude, Gemini) do chatbotów, asystentów obsługi klienta i systemów wycen.',
    ai2Title: 'RAG & Knowledge Base',
    ai2Desc: 'Systemy wyszukiwania semantycznego i bazy wiedzy oparte na wektorach dla branży prawniczej, medycznej i e-commerce.',
    ai3Title: 'Automatyzacja procesów (RPA)',
    ai3Desc: 'Eliminujemy powtarzalne zadania. Automatyczne faktury, raporty, powiadomienia i synchronizacje między systemami.',
    ai4Title: 'LLMs.txt & AI Search',
    ai4Desc: 'Implementujemy pliki llms.txt i strukturyzujemy dane tak, aby AI Overview i modele językowe cytowały Twoją markę.',
    pricingTitle: 'Szacunkowy budżet projektu',
    pricingSubtitle: 'Każdy projekt jest wyceniany indywidualnie. Poniżej prezentujemy typowe widełki cenowe dla różnych typów rozwiązań.',
    priceLabel: 'od',
    currency: 'zł',
    ctaTitle: 'Masz pomysł na system lub aplikację?',
    ctaSubtitle: 'Wypełnij formularz. Nasz architekt software przygotuje bezpłatną analizę techniczną i wstępną wycenę w ciągu 24h.'
  },
  en: {
    title: 'Custom Software & Web Applications | webwawa.pl',
    description: 'We build custom web applications, CRM/ERP systems, API integrations, and SaaS platforms tailored to your unique business processes.',
    breadcrumb: 'Custom Software',
    heroTitle: 'Custom Software',
    heroSubtitle: 'We build bespoke systems, SaaS platforms, booking engines, and API integrations perfectly tailored to your unique business workflows.',
    badge: 'Bespoke software development',
    techTitle: 'Our Competency Areas',
    techSubtitle: 'We build solutions tailored to business processes — from simple automations to complex SaaS platforms.',
    advantagesTitle: 'Why custom software vs off-the-shelf SaaS?',
    advantage1Title: 'Zero licensing limits',
    advantage1Desc: 'Pay once, own the code forever. No recurring subscriptions or vendor lock-in dependencies.',
    advantage2Title: 'Integration with any system',
    advantage2Desc: 'We connect to ERPs, CRMs, payment systems, external APIs, and IoT devices. Your ecosystem runs as a single organism.',
    advantage3Title: 'Scalability & security',
    advantage3Desc: 'Cloud-native architecture ready for growth. CI/CD pipelines, monitoring, and full GDPR/data protection compliance.',
    aiTitle: 'AI & Automation in 2026',
    aiSubtitle: 'In the age of AI dominance, we embed intelligent features directly into your software — not as an add-on, but as the core of the system.',
    ai1Title: 'LLM Integrations',
    ai1Desc: 'We embed language models (GPT-4, Claude, Gemini) into chatbots, customer service assistants, and quoting systems.',
    ai2Title: 'RAG & Knowledge Base',
    ai2Desc: 'Semantic search systems and vector-based knowledge bases for legal, medical, and e-commerce industries.',
    ai3Title: 'Process Automation (RPA)',
    ai3Desc: 'We eliminate repetitive tasks. Automatic invoices, reports, notifications, and synchronization between systems.',
    ai4Title: 'LLMs.txt & AI Search',
    ai4Desc: 'We implement llms.txt files and structure data so that AI Overviews and language models cite your brand.',
    pricingTitle: 'Estimated Project Budget',
    pricingSubtitle: 'Every project is quoted individually. Below are typical pricing ranges for different types of solutions.',
    priceLabel: 'from',
    currency: 'PLN',
    ctaTitle: 'Have an idea for a system or app?',
    ctaSubtitle: 'Fill out the form. Our software architect will prepare a free technical analysis and initial quote within 24 hours.'
  },
  de: {
    title: 'Individuelle Software & Webanwendungen | webwawa.pl',
    description: 'Wir entwickeln maßgeschneiderte Webanwendungen, CRM/ERP-Systeme, API-Integrationen und SaaS-Plattformen für Ihre spezifischen Geschäftsprozesse.',
    breadcrumb: 'Individuelle Software',
    heroTitle: 'Individuelle Software',
    heroSubtitle: 'Wir entwickeln maßgeschneiderte Systeme, SaaS-Plattformen, Buchungsmaschinen und API-Integrationen, perfekt auf Ihre Geschäftsprozesse zugeschnitten.',
    badge: 'Maßgeschneiderte Softwareentwicklung',
    techTitle: 'Unsere Kompetenzbereiche',
    techSubtitle: 'Wir bauen Lösungen, die auf Geschäftsprozesse zugeschnitten sind – von einfachen Automatisierungen bis hin zu komplexen SaaS-Plattformen.',
    advantagesTitle: 'Warum individuelle Software vs. Standard-SaaS?',
    advantage1Title: 'Keine Lizenzlimits',
    advantage1Desc: 'Einmalig bezahlen, Code für immer besitzen. Keine laufenden Abonnements oder Anbieterabhängigkeiten.',
    advantage2Title: 'Integration mit jedem System',
    advantage2Desc: 'Wir verbinden uns mit ERP, CRM, Zahlungssystemen, externen APIs und IoT-Geräten.',
    advantage3Title: 'Skalierbarkeit & Sicherheit',
    advantage3Desc: 'Cloud-native Architektur für Wachstum. CI/CD-Pipelines, Monitoring und vollständige DSGVO-Konformität.',
    aiTitle: 'KI & Automatisierung 2026',
    aiSubtitle: 'Im Zeitalter der KI-Dominanz integrieren wir intelligente Funktionen direkt in Ihre Software.',
    ai1Title: 'LLM-Integrationen',
    ai1Desc: 'Wir integrieren Sprachmodelle (GPT-4, Claude, Gemini) in Chatbots und Kundendienst-Assistenten.',
    ai2Title: 'RAG & Wissensdatenbank',
    ai2Desc: 'Semantische Suchsysteme und vektorbasierte Wissensdatenbanken für Rechts-, Medizin- und E-Commerce-Branchen.',
    ai3Title: 'Prozessautomatisierung (RPA)',
    ai3Desc: 'Wir eliminieren repetitive Aufgaben: automatische Rechnungen, Berichte und Systemsynchronisierungen.',
    ai4Title: 'LLMs.txt & KI-Suche',
    ai4Desc: 'Wir implementieren llms.txt-Dateien, damit KI-Modelle und AI Overviews Ihre Marke zitieren.',
    pricingTitle: 'Geschätztes Projektbudget',
    pricingSubtitle: 'Jedes Projekt wird individuell kalkuliert. Unten finden Sie typische Preisrahmen.',
    priceLabel: 'ab',
    currency: 'EUR',
    ctaTitle: 'Haben Sie eine Idee für ein System oder eine App?',
    ctaSubtitle: 'Füllen Sie das Formular aus. Unser Software-Architekt erstellt innerhalb von 24 Stunden eine kostenlose Analyse.'
  },
  uk: {
    title: 'Розробка Спеціалізованого ПЗ та Веб-Додатків | webwawa.pl',
    description: 'Розробляємо спеціалізовані веб-додатки, системи CRM/ERP, API-інтеграції та SaaS-платформи, адаптовані до бізнес-процесів.',
    breadcrumb: 'Спеціалізоване ПЗ',
    heroTitle: 'Розробка ПЗ',
    heroSubtitle: 'Створюємо авторські системи, SaaS-платформи, системи бронювання та API-інтеграції, ідеально адаптовані до унікальних процесів вашого бізнесу.',
    badge: 'Розробка на замовлення',
    techTitle: 'Наші сфери компетентності',
    techSubtitle: 'Будуємо рішення, адаптовані до бізнес-процесів — від простих автоматизацій до складних SaaS-платформ.',
    advantagesTitle: 'Чому спеціалізоване ПЗ vs готові SaaS?',
    advantage1Title: 'Без ліцензійних обмежень',
    advantage1Desc: 'Платите один раз, код належить вам. Без щомісячних підписок та залежності від постачальника.',
    advantage2Title: 'Інтеграція з будь-якою системою',
    advantage2Desc: 'Підключаємось до ERP, CRM, платіжних систем, зовнішніх API та IoT-пристроїв.',
    advantage3Title: 'Масштабованість і безпека',
    advantage3Desc: 'Cloud-native архітектура готова до зростання. CI/CD, моніторинг і повний захист даних (GDPR).',
    aiTitle: 'AI та Автоматизація у 2026',
    aiSubtitle: 'В еру домінування AI ми вбудовуємо інтелектуальні функції безпосередньо у ваше програмне забезпечення.',
    ai1Title: 'Інтеграції LLM',
    ai1Desc: 'Вбудовуємо мовні моделі (GPT-4, Claude, Gemini) у чат-боти, асистентів і системи оцінки.',
    ai2Title: 'RAG і база знань',
    ai2Desc: 'Системи семантичного пошуку та векторні бази знань для юридичної, медичної та e-commerce галузей.',
    ai3Title: 'Автоматизація процесів (RPA)',
    ai3Desc: 'Усуваємо повторювальні завдання: автоматичні рахунки, звіти та синхронізація між системами.',
    ai4Title: 'LLMs.txt і AI пошук',
    ai4Desc: 'Впроваджуємо файли llms.txt та структуруємо дані так, щоб AI-моделі цитували вашу марку.',
    pricingTitle: 'Орієнтовний бюджет проекту',
    pricingSubtitle: 'Кожен проект оцінюється індивідуально. Нижче наведено типові цінові діапазони.',
    priceLabel: 'від',
    currency: 'PLN',
    ctaTitle: 'Маєте ідею для системи або додатку?',
    ctaSubtitle: 'Заповніть форму. Наш архітектор ПЗ підготує безкоштовний технічний аналіз протягом 24 годин.'
  },
  ru: {
    title: 'Разработка Специализированного ПО и Веб-Приложений | webwawa.pl',
    description: 'Разрабатываем специализированные веб-приложения, системы CRM/ERP, API-интеграции и SaaS-платформы под бизнес-процессы.',
    breadcrumb: 'Специализированное ПО',
    heroTitle: 'Разработка ПО',
    heroSubtitle: 'Создаём авторские системы, SaaS-платформы, системы бронирования и API-интеграции, идеально адаптированные под процессы вашего бизнеса.',
    badge: 'Разработка на заказ',
    techTitle: 'Наши области компетенции',
    techSubtitle: 'Разрабатываем решения под бизнес-процессы — от простых автоматизаций до сложных SaaS-платформ.',
    advantagesTitle: 'Почему специализированное ПО vs готовые SaaS?',
    advantage1Title: 'Без лицензионных ограничений',
    advantage1Desc: 'Платите один раз, код принадлежит вам. Без ежемесячных подписок и привязки к вендору.',
    advantage2Title: 'Интеграция с любой системой',
    advantage2Desc: 'Подключаемся к ERP, CRM, платёжным системам, внешним API и IoT-устройствам.',
    advantage3Title: 'Масштабируемость и безопасность',
    advantage3Desc: 'Cloud-native архитектура для роста. CI/CD, мониторинг и полная защита данных (GDPR).',
    aiTitle: 'AI и Автоматизации в 2026',
    aiSubtitle: 'В эпоху доминирования AI встраиваем интеллектуальные функции напрямую в ваше ПО.',
    ai1Title: 'Интеграции LLM',
    ai1Desc: 'Встраиваем языковые модели (GPT-4, Claude, Gemini) в чат-боты, ассистентов и системы оценки.',
    ai2Title: 'RAG и база знаний',
    ai2Desc: 'Системы семантического поиска и векторные базы знаний для юридической, медицинской и e-commerce отраслей.',
    ai3Title: 'Автоматизация процессов (RPA)',
    ai3Desc: 'Устраняем повторяющиеся задачи: автоматические счета, отчеты и синхронизации между системами.',
    ai4Title: 'LLMs.txt и AI поиск',
    ai4Desc: 'Внедряем файлы llms.txt и структурируем данные так, чтобы AI-модели цитировали вашу марку.',
    pricingTitle: 'Ориентировочный бюджет проекта',
    pricingSubtitle: 'Каждый проект рассчитывается индивидуально. Ниже типичные ценовые диапазоны.',
    priceLabel: 'от',
    currency: 'PLN',
    ctaTitle: 'Есть идея для системы или приложения?',
    ctaSubtitle: 'Заполните форму. Наш архитектор ПО подготовит бесплатный технический анализ в течение 24 часов.'
  },
  zh: {
    title: '定制软件与Web应用开发 | webwawa.pl',
    description: '我们开发定制Web应用、CRM/ERP系统、API集成和SaaS平台，完全契合您的独特业务流程。',
    breadcrumb: '定制软件',
    heroTitle: '定制软件开发',
    heroSubtitle: '我们构建专属系统、SaaS平台、预订引擎和API集成，完美贴合您独特的业务工作流。',
    badge: '按需软件开发',
    techTitle: '我们的核心能力领域',
    techSubtitle: '从简单自动化到复杂SaaS平台，我们构建完全契合业务流程的解决方案。',
    advantagesTitle: '为何选择定制软件而非现成SaaS？',
    advantage1Title: '无许可证限制',
    advantage1Desc: '一次付款，永久拥有代码。无需每月订阅，无供应商锁定。',
    advantage2Title: '与任何系统集成',
    advantage2Desc: '与ERP、CRM、支付系统、外部API和IoT设备无缝连接。',
    advantage3Title: '可扩展性与安全性',
    advantage3Desc: '云原生架构助力业务增长。CI/CD流水线、监控和完整数据保护合规。',
    aiTitle: '2026年AI与自动化',
    aiSubtitle: '在AI主导的时代，我们将智能功能直接内嵌至您的软件核心，而非简单附加。',
    ai1Title: 'LLM集成',
    ai1Desc: '将语言模型（GPT-4、Claude、Gemini）嵌入聊天机器人、客服助手和报价系统。',
    ai2Title: 'RAG与知识库',
    ai2Desc: '为法律、医疗和电商行业构建语义搜索系统和向量知识库。',
    ai3Title: '流程自动化（RPA）',
    ai3Desc: '消除重复任务：自动发票、报告、通知及系统间同步。',
    ai4Title: 'LLMs.txt与AI搜索',
    ai4Desc: '实施llms.txt文件并结构化数据，让AI概述和语言模型引用您的品牌。',
    pricingTitle: '估算项目预算',
    pricingSubtitle: '所有项目将单独报价。以下是不同类型解决方案的典型价格区间。',
    priceLabel: '起价',
    currency: '元 (PLN)',
    ctaTitle: '有系统或应用程序的想法？',
    ctaSubtitle: '填写表单。我们的软件架构师将在24小时内提供免费技术分析和初步报价。'
  }
};

const pricingTiers = {
  pl: [
    { name: 'Automatyzacja i integracja API', price: '7 900', desc: 'Połączenie istniejących systemów (ERP, CRM, płatności), automatyczne powiadomienia, raporty i synchronizacja danych.' },
    { name: 'Platforma rezerwacyjna / CRM', price: 'Wycena indywidualna (od 25 000 zł)', desc: 'Dedykowany system do zarządzania klientami, harmonogramem, płatnościami i komunikacją. Wdrożenie z panelem admina.', custom: true },
    { name: 'Platforma SaaS / Aplikacja Enterprise', price: 'Wycena indywidualna (od 50 000 zł)', desc: 'Wielomodułowy system skalowalny na tysiące użytkowników. Architektura microservices, CI/CD, monitoring 24/7.', custom: true }
  ],
  en: [
    { name: 'API Integration & Automation', price: '2 000', desc: 'Connecting existing systems (ERP, CRM, payments), automatic notifications, reports, and data synchronization.' },
    { name: 'Booking Platform / CRM System', price: 'Custom quote (from 25 000 PLN)', desc: 'Dedicated system for managing clients, schedules, payments, and communication with admin panel.', custom: true },
    { name: 'SaaS Platform / Enterprise App', price: 'Custom quote (from 50 000 PLN)', desc: 'Multi-module system scalable to thousands of users. Microservices architecture, CI/CD, 24/7 monitoring.', custom: true }
  ],
  de: [
    { name: 'API-Integration & Automatisierung', price: '2 000', desc: 'Verbindung bestehender Systeme (ERP, CRM, Zahlungen), automatische Benachrichtigungen und Datensynchronisierung.' },
    { name: 'Buchungsplattform / CRM-System', price: 'Individuelles Angebot (ab 6.000 EUR)', desc: 'Dediziertes System für Kunden-, Terminverwaltung, Zahlungen und Kommunikation mit Admin-Dashboard.', custom: true },
    { name: 'SaaS-Plattform / Enterprise-App', price: 'Individuelles Angebot (ab 12.000 EUR)', desc: 'Mehrmoduliges System für Tausende von Nutzern. Microservices, CI/CD, 24/7-Monitoring.', custom: true }
  ],
  uk: [
    { name: 'API-інтеграція та автоматизація', price: '7 900', desc: 'Підключення існуючих систем (ERP, CRM, платежі), автоматичні сповіщення та синхронізація даних.' },
    { name: 'Платформа бронювання / CRM', price: 'Індивідуальний розрахунок (від 25 000 PLN)', desc: 'Спеціалізована система для управління клієнтами, розкладами та платежами з панеллю адміна.', custom: true },
    { name: 'SaaS-платформа / Enterprise додаток', price: 'Індивідуальний розрахунок (від 50 000 PLN)', desc: 'Багатомодульна система для тисяч користувачів. Мікросервіси, CI/CD, моніторинг 24/7.', custom: true }
  ],
  ru: [
    { name: 'API-интеграция и автоматизация', price: '7 900', desc: 'Подключение существующих систем (ERP, CRM, платежи), автоматические уведомления и синхронизация данных.' },
    { name: 'Платформа бронирования / CRM', price: 'Индивидуальный расчет (от 25 000 PLN)', desc: 'Специализированная система для управления клиентами, расписаниями и платежами с панелью администратора.', custom: true },
    { name: 'SaaS-платформа / Enterprise приложение', price: 'Индивидуальный расчет (от 50 000 PLN)', desc: 'Многомодульная система для тысяч пользователей. Микросервисы, CI/CD, мониторинг 24/7.', custom: true }
  ],
  zh: [
    { name: 'API集成与自动化', price: '7 900', desc: '连接现有系统（ERP、CRM、支付），自动通知、报告和数据同步。' },
    { name: '预订平台 / CRM系统', price: '定制报价 (25 000 PLN 起)', desc: '专用客户、日程、支付和沟通管理系统，含管理员面板。', custom: true },
    { name: 'SaaS平台 / 企业应用', price: '定制报价 (50 000 PLN 起)', desc: '可扩展到数千用户的多模块系统。微服务架构、CI/CD、7×24小时监控。', custom: true }
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

export default async function SoftwareServicePage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = params.lang as Locale;
  const settings = getGlobalSettings();
  const dict = await getDictionary(lang);

  const t = translations[lang] || translations.en;
  const tiers = pricingTiers[lang] || pricingTiers.en;
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;

  const techStack = [
    { icon: '🐘', name: 'Laravel / PHP', sub: 'Backend API & Business Logic' },
    { icon: '🟩', name: 'Node.js / NestJS', sub: 'Scalable Microservices' },
    { icon: '🐍', name: 'Python / FastAPI', sub: 'AI & Data Processing' },
    { icon: '🐘', name: 'PostgreSQL / Redis', sub: 'Relational & Cache DB' },
    { icon: '☁️', name: 'AWS / Vercel', sub: 'Cloud Deployment' },
    { icon: '🐳', name: 'Docker / CI/CD', sub: 'DevOps & Automation' },
    { icon: '🤖', name: 'OpenAI / Gemini', sub: 'LLM Integrations' },
    { icon: '🔗', name: 'REST / GraphQL', sub: 'API Architecture' },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-[#020510] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50/20 to-white dark:from-slate-950/10 dark:to-transparent py-24 text-slate-900 dark:text-white relative overflow-hidden border-b border-slate-100 dark:border-slate-900/60">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <nav className="flex justify-center mb-8 text-sm opacity-60 font-semibold">
            <Link href={homeUrl} className="hover:text-primary transition-colors">{dict.breadcrumbs.home}</Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{t.breadcrumb}</span>
          </nav>
          <span className="inline-block py-1.5 px-4 rounded-full bg-violet-600/10 dark:bg-violet-500/20 border border-violet-600/20 dark:border-violet-500/30 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider mb-6">
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

      {/* Tech Stack Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 dark:border-primary/40 text-primary dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              Tech Stack
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-4">
              {t.techTitle}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm font-semibold">{t.techSubtitle}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {techStack.map((tech, idx) => (
              <div key={idx} className="glass-card hover:-translate-y-1.5 transition-transform duration-300 text-center">
                <div className="text-3xl mb-3">{tech.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{tech.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{tech.sub}</p>
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
              <div className="text-4xl mb-4">🔓</div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{t.advantage1Title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold leading-relaxed">{t.advantage1Desc}</p>
            </div>
            <div className="glass-card">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{t.advantage2Title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold leading-relaxed">{t.advantage2Desc}</p>
            </div>
            <div className="glass-card">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{t.advantage3Title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold leading-relaxed">{t.advantage3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider">
              AI-First Development
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-4">
              {t.aiTitle}
            </h2>
            <div className="w-20 h-1 bg-violet-500 mx-auto mt-4 rounded-full"></div>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm font-semibold">{t.aiSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: t.ai1Title, desc: t.ai1Desc, icon: '🤖', color: 'bg-violet-500/10 border-violet-500/20' },
              { title: t.ai2Title, desc: t.ai2Desc, icon: '🧠', color: 'bg-blue-500/10 border-blue-500/20' },
              { title: t.ai3Title, desc: t.ai3Desc, icon: '⚙️', color: 'bg-emerald-500/10 border-emerald-500/20' },
              { title: t.ai4Title, desc: t.ai4Desc, icon: '📄', color: 'bg-amber-500/10 border-amber-500/20' },
            ].map((item, idx) => (
              <div key={idx} className={`glass-card border ${item.color} hover:-translate-y-1 transition-transform duration-300`}>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-b border-slate-200/60 dark:border-slate-900/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 dark:border-primary/40 text-primary dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              {lang === 'pl' ? 'Transparentny Cennik' : 'Transparent Pricing'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-4">
              {t.pricingTitle}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm font-semibold">{t.pricingSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <div key={idx} className="glass-card hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                {idx === 2 && (
                  <div className="absolute top-0 right-0 bg-violet-500 text-white font-black uppercase text-[10px] px-3 py-1 tracking-wider rounded-bl-xl">
                    Enterprise
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">{tier.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold leading-relaxed mb-6">{tier.desc}</p>
                </div>
                <div className="pt-6 border-t border-slate-200/50 dark:border-slate-800/40">
                  {(tier as any).custom ? (
                    <span className="text-lg md:text-xl font-black text-primary tracking-tight block mt-2">{(tier as any).price}</span>
                  ) : (
                    <>
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase block">{t.priceLabel}</span>
                      <span className="text-3xl font-black text-primary tracking-tight">{(tier as any).price} {t.currency}</span>
                    </>
                  )}
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
            <p className="text-slate-500 dark:text-slate-400 font-semibold mt-4 max-w-xl mx-auto leading-relaxed">
              {t.ctaSubtitle}
            </p>
          </div>
          <ContactForm lang={lang} defaultCity="Warszawa" settings={settings} dict={dict.form} />
        </div>
      </section>
    </main>
  );
}
