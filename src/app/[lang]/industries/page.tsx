import { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { getDictionary, Locale, locales, ogLocaleMap } from '../dictionaries';
import { getLocalizedStaticPath } from '../i18n-routes';
import { getGlobalSettings } from '@/lib/settings';
import { getAllIndustries } from '@/lib/industries';
import { industrySlugsMap, professionSlugsMap, ProfessionId } from '@/lib/industries-list';

const sectorThemeMap: Record<string, { gradient: string; border: string; bg: string; text: string; glow: string }> = {
  doctor: {
    gradient: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
    border: 'hover:border-blue-500/30 dark:hover:border-blue-500/30',
    bg: 'bg-blue-500/5',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-blue-500/10 dark:shadow-blue-500/5',
  },
  lawyer: {
    gradient: 'from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20',
    border: 'hover:border-indigo-500/30 dark:hover:border-indigo-500/30',
    bg: 'bg-indigo-500/5',
    text: 'text-indigo-600 dark:text-indigo-400',
    glow: 'shadow-indigo-500/10 dark:shadow-indigo-500/5',
  },
  psychologist: {
    gradient: 'from-teal-500/10 to-emerald-500/10 dark:from-teal-500/20 dark:to-emerald-500/20',
    border: 'hover:border-teal-500/30 dark:hover:border-teal-500/30',
    bg: 'bg-teal-500/5',
    text: 'text-teal-600 dark:text-teal-400',
    glow: 'shadow-teal-500/10 dark:shadow-teal-500/5',
  },
  accountant: {
    gradient: 'from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20',
    border: 'hover:border-emerald-500/30 dark:hover:border-emerald-500/30',
    bg: 'bg-emerald-500/5',
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'shadow-emerald-500/10 dark:shadow-emerald-500/5',
  },
  architect: {
    gradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
    border: 'hover:border-amber-500/30 dark:hover:border-amber-500/30',
    bg: 'bg-amber-500/5',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-amber-500/10 dark:shadow-amber-500/5',
  },
  beauty: {
    gradient: 'from-rose-500/10 to-pink-500/10 dark:from-rose-500/20 dark:to-pink-500/20',
    border: 'hover:border-rose-500/30 dark:hover:border-rose-500/30',
    bg: 'bg-rose-500/5',
    text: 'text-rose-600 dark:text-rose-400',
    glow: 'shadow-rose-500/10 dark:shadow-rose-500/5',
  },
  automotive: {
    gradient: 'from-amber-500/10 to-red-500/10 dark:from-amber-500/20 dark:to-red-500/20',
    border: 'hover:border-amber-500/30 dark:hover:border-amber-500/30',
    bg: 'bg-amber-500/5',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-amber-500/10 dark:shadow-amber-500/5',
  },
  construction: {
    gradient: 'from-amber-600/10 to-yellow-500/10 dark:from-amber-600/20 dark:to-yellow-500/20',
    border: 'hover:border-amber-600/30 dark:hover:border-amber-600/30',
    bg: 'bg-amber-600/5',
    text: 'text-amber-600 dark:text-amber-500',
    glow: 'shadow-amber-600/10 dark:shadow-amber-600/5',
  },
  gastronomy: {
    gradient: 'from-rose-500/10 to-orange-500/10 dark:from-rose-500/20 dark:to-orange-500/20',
    border: 'hover:border-rose-500/30 dark:hover:border-rose-500/30',
    bg: 'bg-rose-500/5',
    text: 'text-orange-600 dark:text-orange-400',
    glow: 'shadow-orange-500/10 dark:shadow-orange-500/5',
  },
  transport: {
    gradient: 'from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20',
    border: 'hover:border-cyan-500/30 dark:hover:border-cyan-500/30',
    bg: 'bg-cyan-500/5',
    text: 'text-cyan-600 dark:text-cyan-400',
    glow: 'shadow-cyan-500/10 dark:shadow-cyan-500/5',
  },
  ecommerce: {
    gradient: 'from-fuchsia-500/10 to-indigo-500/10 dark:from-fuchsia-500/20 dark:to-indigo-500/20',
    border: 'hover:border-fuchsia-500/30 dark:hover:border-fuchsia-500/30',
    bg: 'bg-fuchsia-500/5',
    text: 'text-fuchsia-600 dark:text-fuchsia-400',
    glow: 'shadow-fuchsia-500/10 dark:shadow-fuchsia-500/5',
  },
  education: {
    gradient: 'from-violet-500/10 to-fuchsia-500/10 dark:from-violet-500/20 dark:to-fuchsia-500/20',
    border: 'hover:border-violet-500/30 dark:hover:border-violet-500/30',
    bg: 'bg-violet-500/5',
    text: 'text-violet-600 dark:text-violet-400',
    glow: 'shadow-violet-500/10 dark:shadow-violet-500/5',
  },
};

const getSectorIcon = (id: string) => {
  switch (id) {
    case 'doctor': return '🩺';
    case 'lawyer': return '⚖️';
    case 'psychologist': return '🧠';
    case 'accountant': return '📊';
    case 'architect': return '📐';
    case 'beauty': return '🌸';
    case 'automotive': return '🚗';
    case 'construction': return '🏗️';
    case 'gastronomy': return '🍔';
    case 'transport': return '🚚';
    case 'ecommerce': return '🛒';
    case 'education': return '🎓';
    default: return '💼';
  }
};

const pageTranslations = {
  pl: {
    title: 'Dedykowane strony i systemy IT dla branż | webwawa.pl',
    description: 'Projektujemy nowoczesne strony www, aplikacje PWA i pozycjonujemy lokalne sektory w Warszawie. Pracujemy w Next.js, WordPress, Django i Laravel.',
    breadcrumbsParent: 'Strony dla branż',
    heroTag: 'Rozwiązania Branżowe',
    heroTitle: 'Strony WWW i systemy IT dla Twojej branży',
    heroSubtitle: 'Tworzymy zaawansowane platformy dopasowane do specyfiki konkretnych zawodów. Zwiększ konwersję klientów i zoptymalizuj pozycję w wyszukiwarkach AI.',
    techStackTag: 'Elastyczność Technologiczna',
    techStackTitle: 'Technologia dopasowana do Twojego celu',
    techStackSubtitle: 'Nie narzucamy jednego frameworka. Dobieramy optymalne narzędzia w zależności od skomplikowania projektu, wymogów bezpieczeństwa i budżetu.',
    seeSolutions: 'Zobacz ofertę',
    specializations: 'Popularne specjalizacje:',
    techDescription: 'Jesteśmy gotowi wdrażać projekty w dowolnym stosie technologicznym - od ultra-wydajnych aplikacji PWA po bezpieczne, skalowalne portale.',
    readMore: 'Czytaj o technologii',
    contactTag: 'Zbudujmy coś razem',
    contactTitle: 'Szukasz dedykowanego rozwiązania dla swojej branży?',
    contactSubtitle: 'Napisz do nas. Przeanalizujemy Twoje potrzeby i zaproponujemy optymalny stos technologiczny oraz strategię pozycjonowania lokalnego.',
    techStack: {
      next: 'Tworzymy ultra-szybkie aplikacje webowe PWA. Gwarancja wyniku 100/100 Mobile PageSpeed, błyskawiczna nawigacja bez przeładowań strony oraz pełna optymalizacja pod indeksację wyszukiwarek AI (GEO/AEO).',
      wp: 'Idealne rozwiązanie dla gabinetów i kancelarii prowadzących blogi eksperckie. Zapewniamy nowoczesny design, pełną integrację z wtyczkami rejestracji i prosty w edycji panel administracyjny.',
      django: 'Niezrównane bezpieczeństwo danych, bezbłędny backend oraz zaawansowane bazy danych. Doskonały wybór do obsługi poufnych danych pacjentów i klientów w systemach CRM i portalach medyczno-prawnych.',
      laravel: 'Solidne, szybkie i wysoce skalowalne systemy biznesowe. Tworzymy dedykowane panele klienta, integracje z systemami płatności (PayU, BLIK), e-rezerwacje oraz skomplikowane portale ogłoszeniowe.',
      presta: 'Zaawansowany e-commerce dostosowany do sprzedaży specjalistycznej. Integracje z magazynami, systemami kurierskimi i hurtowniami. Optymalna konwersja zakupowa (CRO).'
    },
    techFullFlex: "Pełna elastyczność i integracja",
    getInTouch: "Skontaktuj się z nami",
    offerLabel: "OFERTA"
  },
  en: {
    title: 'Dedicated Websites & IT Systems for Industries | webwawa.pl',
    description: 'We design modern websites, PWA applications, and local SEO for Warsaw specialists. We work with Next.js, WordPress, Django, and Laravel.',
    breadcrumbsParent: 'Industry solutions',
    heroTag: 'Industry Solutions',
    heroTitle: 'Websites & IT systems for your industry',
    heroSubtitle: 'We build advanced platforms tailored to the specifics of concrete professions. Boost client conversions and optimize AI search visibility.',
    techStackTag: 'Technological Flexibility',
    techStackTitle: 'Technology tailored to your business goal',
    techStackSubtitle: 'We do not enforce a single framework. We choose the optimal tools depending on project complexity, security requirements, and budget.',
    seeSolutions: 'See offer',
    specializations: 'Popular specializations:',
    techDescription: 'We are ready to deploy projects in any technological stack - from ultra-fast PWA applications to secure, scalable portals.',
    readMore: 'Read about tech',
    contactTag: 'Let\'s build together',
    contactTitle: 'Looking for a custom solution for your industry?',
    contactSubtitle: 'Write to us. We will analyze your requirements and propose the optimal tech stack and local SEO strategy.',
    techStack: {
      next: 'We build ultra-fast PWA web apps. Guaranteed 100/100 Mobile PageSpeed scores, instant transitions, and complete readiness for AI search engine indexing (GEO/AEO).',
      wp: 'Perfect solution for offices and law firms running expert blogs. We deliver modern designs, seamless booking plugin integrations, and an intuitive admin panel.',
      django: 'Unmatched data security, clean backend architectures, and advanced databases. The best fit for handling confidential client records in custom CRM systems.',
      laravel: 'Robust, fast, and highly scalable business software. We build dedicated client panels, payment gateway integrations (Stripe, PayPal), and e-booking systems.',
      presta: 'Advanced e-commerce tailored for professional sales. Direct integrations with warehouses, couriers, and ERP systems. Optimized conversion paths (CRO).'
    },
    techFullFlex: "Full flexibility & integration",
    getInTouch: "Get in touch",
    offerLabel: "VIEW"
  },
  de: {
    title: 'Maßgeschneiderte Websites & IT-Systeme für Branchen | webwawa.pl',
    description: 'Wir entwickeln moderne Webseiten, PWA-Apps und führen lokales SEO für Branchen durch. Wir nutzen Next.js, WordPress, Django und Laravel.',
    breadcrumbsParent: 'Branchenlösungen',
    heroTag: 'Branchenlösungen',
    heroTitle: 'Websites & IT-Systeme für Ihre Branche',
    heroSubtitle: 'Wir erstellen anspruchsvolle Plattformen, die auf die Besonderheiten bestimmter Berufe zugeschnitten sind. Steigern Sie Ihre Conversions.',
    techStackTag: 'Technologische Flexibilität',
    techStackTitle: 'Technologie angepasst an Ihre Ziele',
    techStackSubtitle: 'Wir zwingen Ihnen kein einzelnes Framework auf. Wir wählen das optimale Werkzeug je nach Projektkomplexität, Sicherheit und Budget.',
    seeSolutions: 'Angebot ansehen',
    specializations: 'Beliebte Fachrichtungen:',
    techDescription: 'Wir implementieren Projekte in jedem modernen Tech-Stack - von ultraschnellen PWA-Anwendungen bis hin zu sicheren Portalen.',
    readMore: 'Über Technologien lesen',
    contactTag: 'Lassen Sie uns bauen',
    contactTitle: 'Suchen Sie eine individuelle Lösung für Ihre Branche?',
    contactSubtitle: 'Schreiben Sie uns. Wir analysieren Ihre Anforderungen und schlagen den besten Tech-Stack und eine lokale SEO-Strategie vor.',
    techStack: {
      next: 'Wir entwickeln ultraschnelle PWA-Web-Apps. Garantierte 100/100 Mobile PageSpeed Scores, sofortige Übergänge und vollständige Bereitschaft für die Indexierung von AI-Suchmaschinen (GEO/AEO).',
      wp: 'Perfekte Lösung für Praxen und Kanzleien mit Experten-Blogs. Wir liefern moderne Designs, nahtlose Buchungs-Plugins und ein intuitives Admin-Panel.',
      django: 'Unübertroffene Datensicherheit, sauberer Backend-Code und moderne Datenbanken. Die beste Wahl für vertrauliche Client-Aufzeichnungen in maßgeschneiderten CRM-Systemen.',
      laravel: 'Robuste, schnelle und hochskalierbare Business-Software. Wir bauen dedizierte Kundenportale, Integrationen für Zahlungsgateways (Stripe, PayPal) und E-Buchungssysteme.',
      presta: 'Fortgeschrittener E-Commerce für den professionellen Verkauf. Direkte Integrationen mit Lagern, Kurieren und ERP-Systemen. Optimierte Konversionspfade (CRO).'
    },
    techFullFlex: "Volle Flexibilität & Integration",
    getInTouch: "Kontaktieren Sie uns",
    offerLabel: "ANGEBOT"
  },
  uk: {
    title: 'Спеціалізовані веб-сайти та IT-системи для галузей | webwawa.pl',
    description: 'Проектуємо сучасні сайти, PWA-додатки та здійснюємо SEO-просування для фахівців. Працюємо з Next.js, WordPress, Django та Laravel.',
    breadcrumbsParent: 'Галузеві рішення',
    heroTag: 'Галузеві рішення',
    heroTitle: 'Веб-сайти та IT-системи для вашої сфери',
    heroSubtitle: 'Створюємо передові платформи, налаштовані під специфіку конкретних професій. Збільшуйте конверсії та оптимізуйте видимість в AI пошуку.',
    techStackTag: 'Технологічна гнучкість',
    techStackTitle: 'Технологія, підібрана під ваші завдання',
    techStackSubtitle: 'Ми не нав\'язуємо один фреймворк. Ми обираємо оптимальні інструменти відповідно до складності проекту, вимог безпеки та бюджету.',
    seeSolutions: 'Дивитися пропозицію',
    specializations: 'Популярні спеціалізації:',
    techDescription: 'Ми готові впроваджувати проекти у будь-якому технологічному стеку - від надшвидких PWA до безпечних масштабованих порталів.',
    readMore: 'Детальніше про технології',
    contactTag: 'Побудуймо разом',
    contactTitle: 'Шукаєте індивідуальне рішення для вашої галузі?',
    contactSubtitle: 'Напишіть нам. Ми проаналізуємо ваші потреби та запропонуємо оптимальний технологічний стек та стратегію локального SEO.',
    techStack: {
      next: 'Ми створюємо надшвидкі веб-додатки PWA. Гарантовані оцінки 100/100 Mobile PageSpeed, миттєві переходи та повна готовність до індексації пошуковими системами AI (GEO/AEO).',
      wp: 'Ідеальне рішення для кабінетів та фірм, які ведуть експертні блоги. Ми пропонуємо сучасний дизайн, безперешкодну інтеграцію плагінів бронювання та інтуїтивно зрозумілу панель адміністратора.',
      django: 'Незрівнянна безпека даних, чиста архітектура бекенду та сучасні бази даних. Найкраще підходить для обробки конфіденційних записів клієнтів у спеціальних системах CRM.',
      laravel: 'Надійне, швидке та високомасштабоване бізнес-програмне забезпечення. Ми створюємо спеціальні кабінети клієнтів, інтеграцію платіжних шлюзів (Stripe, PayPal) та системи електронного бронювання.',
      presta: 'Просунута електронна комерція для професійних продажів. Пряма інтеграція зі складами, кур\'єрськими службами та системами ERP. Оптимізовані шляхи конверсії (CRO).'
    },
    techFullFlex: "Повна гнучкість та інтеграція",
    getInTouch: "Зв'яжіться з нами",
    offerLabel: "ПРОПОЗИЦІЯ"
  },
  ru: {
    title: 'Специализированные веб-сайты и IT-системы для отраслей | webwawa.pl',
    description: 'Проектируем современные сайты, PWA-приложения и ведем локальное SEO для специалистов. Работаем с Next.js, WordPress, Django и Laravel.',
    breadcrumbsParent: 'Отраслевые решения',
    heroTag: 'Отраслевые решения',
    heroTitle: 'Веб-сайты и IT-системы для вашей отрасли',
    heroSubtitle: 'Создаем передовые платформы, адаптированные под специфику конкретных профессий. Увеличивайте конверсии и оптимизируйте видимость в AI поиске.',
    techStackTag: 'Технологическая гибкость',
    techStackTitle: 'Технологии под ваши бизнес-цели',
    techStackSubtitle: 'Мы не привязываемся к одному фреймворку. Мы выбираем оптимальные инструменты в зависимости от сложности проекта, требований безопасности и бюджета.',
    seeSolutions: 'Смотреть предложение',
    specializations: 'Популярные специализации:',
    techDescription: 'Мы готовы внедрять проекты в любом технологическом стеке - от сверхбыстрых PWA-приложений до защищенных масштабируемых порталов.',
    readMore: 'О технологиях подробно',
    contactTag: 'Создадим вместе',
    contactTitle: 'Ищете индивидуальное решение для своей отрасли?',
    contactSubtitle: 'Напишите нам. Мы проанализируем ваши задачи и предложим оптимальный стек технологий и локальное SEO-продвижение.',
    techStack: {
      next: 'Мы создаем сверхбыстрые веб-приложения PWA. Гарантированные оценки 100/100 Mobile PageSpeed, мгновенные переходы и полная готовность к индексации поисковыми системами AI (GEO/AEO).',
      wp: 'Идеальное решение для кабинетов и фирм, ведущих экспертные блоги. Мы предлагаем современный дизайн, бесшовную интеграцию плагинов бронирования и интуитивно понятную панель администратора.',
      django: 'Несравненная безопасность данных, чистая архитектура бэкенда и современные базы данных. Лучше всего подходит для обработки конфиденциальных записей клиентов в специальных системах CRM.',
      laravel: 'Надежное, быстрое и высокомасштабируемое бизнес-программное обеспечение. Мы создаем специальные кабинеты клиентов, интеграцию платежных шлюзов (Stripe, PayPal) и системы электронного бронирования.',
      presta: 'Продвинутая электронная коммерция для профессиональных продаж. Прямая интеграция со складами, курьерскими службами и системами ERP. Оптимизированные пути конверсии (CRO).'
    },
    techFullFlex: "Полная гибкость и интеграция",
    getInTouch: "Связаться с нами",
    offerLabel: "ПРЕДЛОЖЕНИЕ"
  },
  zh: {
    title: '针对不同行业的定制网站与 IT 系统解决方案 | webwawa.pl',
    description: '我们为华沙各行业专家设计现代网站、开发 PWA 应用并提供本地 SEO 优化。熟练应用 Next.js、WordPress、Django 及 Laravel。',
    breadcrumbsParent: '行业解决方案',
    heroTag: '行业解决方案',
    heroTitle: '适合您行业的网站与 IT 系统',
    heroSubtitle: '我们搭建契合具体行业特性的高端数字化平台。助您提升客户转化率，并在最新的 AI 搜索引擎中脱颖而出。',
    techStackTag: '技术灵活性',
    techStackTitle: '契合您业务目标的技术选型',
    techStackSubtitle: '我们不墨守成规于单一框架。我们根据项目的复杂程度、数据安全要求以及预算，灵活搭配最佳的开发工具。',
    seeSolutions: '查看方案',
    specializations: '热门细分方向:',
    techDescription: '我们支持在任何现代技术生态中交付项目——从极速响应的 PWA 应用到安全可靠、支持高并发的企业级门户。',
    readMore: '了解技术详情',
    contactTag: '携手共建',
    contactTitle: '正在为您所在的行业寻找定制化解决方案？',
    contactSubtitle: '欢迎随时联系我们。我们将深度剖析您的业务需求，量身定制最佳的技术栈搭配 and 本地谷歌地图 SEO 推广战略。',
    techStack: {
      next: '我们构建极速 PWA Web 应用。确保移动端 PageSpeed 分数达到 100/100、无感加载页面，并完全适配最新的 AI 搜索引擎（GEO/AEO）索引。',
      wp: '适合开展专家博客的诊所与律所的最佳选择。我们提供现代化设计、无缝对接预约插件以及易于操作的管理面板。',
      django: '无与伦比的数据安全性、精简优雅的后端架构和高级数据库。是定制 CRM 系统中处理机密客户记录的最佳选择。',
      laravel: '稳健、快速且高可扩展性的商业软件。我们构建专属的客户面板、在线支付网关集成（Stripe、PayPal）以及在线预订系统。',
      presta: '为专业销售量身定制的高级电子商务系统。直接对接仓库、物流及 ERP 系统。深度优化购买路径与转化率（CRO）。'
    },
    techFullFlex: "高度灵活性与系统集成",
    getInTouch: "联系我们",
    offerLabel: "查看"
  }
};

export async function generateMetadata(props: { params: Promise<{ lang: string  }> }): Promise<Metadata> {
  const params = await props.params;
  const lang = (params.lang || 'pl') as Locale;
  const trans = pageTranslations[lang] || pageTranslations.pl;
  
  // Generate translated alternates for all supported languages
  const alternates: Record<string, string> = {};
  locales.forEach((l) => {
    const path = getLocalizedStaticPath('industries', l);
    alternates[l] = `https://webwawa.pl${path}`;
  });

  const canonicalPath = getLocalizedStaticPath('industries', lang);

  return {
    title: trans.title,
    description: trans.description,
    metadataBase: new URL('https://webwawa.pl'),
    alternates: {
      canonical: `https://webwawa.pl${canonicalPath}`,
      languages: alternates,
    },
    openGraph: {
      title: trans.title,
      description: trans.description,
      url: `https://webwawa.pl${canonicalPath}`,
      siteName: 'webwawa.pl',
      locale: ogLocaleMap[lang],
      type: 'website',
      images: [
        {
          url: '/images/workspace_code.png',
          width: 1200,
          height: 630,
          alt: trans.title,
        },
      ],
    },
  };
}

export default async function IndustriesIndexPage(props: { params: Promise<{ lang: string  }> }) {
  const params = await props.params;
  const lang = (params.lang || 'pl') as Locale;
  const isPl = lang === 'pl';
  const trans = pageTranslations[lang] || pageTranslations.pl;
  const settings = getGlobalSettings();
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  
  const industries = getAllIndustries();

  // Custom static tech stack definition to fulfill B2B technology needs
  const techStack = [
    {
      name: 'Next.js & React',
      logo: '⚡',
      key: 'next' as const,
      desc_pl: 'Tworzymy ultra-szybkie aplikacje webowe PWA. Gwarancja wyniku 100/100 Mobile PageSpeed, błyskawiczna nawigacja bez przeładowań strony oraz pełna optymalizacja pod indeksację wyszukiwarek AI (GEO/AEO).',
      desc_en: 'We build ultra-fast PWA web apps. Guaranteed 100/100 Mobile PageSpeed scores, instant transitions, and complete readiness for AI search engine indexing (GEO/AEO).'
    },
    {
      name: 'WordPress',
      logo: '📝',
      key: 'wp' as const,
      desc_pl: 'Idealne rozwiązanie dla gabinetów i kancelarii prowadzących blogi eksperckie. Zapewniamy nowoczesny design, pełną integrację z wtyczkami rejestracji i prosty w edycji panel administracyjny.',
      desc_en: 'Perfect solution for practices and firms running expert blogs. We deliver modern designs, seamless booking plugin integrations, and an intuitive admin panel.'
    },
    {
      name: 'Django & Python',
      logo: '🐍',
      key: 'django' as const,
      desc_pl: 'Niezrównane bezpieczeństwo danych, bezbłędny backend oraz zaawansowane bazy danych. Doskonały wybór do obsługi poufnych danych pacjentów i klientów w systemach CRM i portalach medyczno-prawnych.',
      desc_en: 'Unmatched data security, clean backend architectures, and advanced databases. The best fit for handling confidential client records in custom CRM systems.'
    },
    {
      name: 'Laravel & PHP',
      logo: '🚀',
      key: 'laravel' as const,
      desc_pl: 'Solidne, szybkie i wysoce skalowalne systemy biznesowe. Tworzymy dedykowane panele klienta, integracje z systemami płatności (PayU, BLIK), e-rezerwacje oraz skomplikowane portale ogłoszeniowe.',
      desc_en: 'Robust, fast, and highly scalable business software. We build dedicated client panels, payment gateway integrations (Stripe, PayPal), and e-booking systems.'
    },
    {
      name: 'PrestaShop',
      logo: '🛒',
      key: 'presta' as const,
      desc_pl: 'Zaawansowany e-commerce dostosowany do sprzedaży specjalistycznej. Integracje z magazynami, systemami kurierskimi i hurtowniami. Optymalna konwersja zakupowa (CRO).',
      desc_en: 'Advanced e-commerce tailored for professional sales. Direct integrations with warehouses, couriers, and ERP systems. Optimized conversion paths (CRO).'
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": trans.heroTitle,
    "description": trans.heroSubtitle,
    "provider": {
      "@type": "LocalBusiness",
      "name": "webwawa.pl",
      "telephone": settings?.phone || "+48 664 946 209"
    },
    "areaServed": {
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
        "item": `https://webwawa.pl${homeUrl}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": trans.breadcrumbsParent,
        "item": `https://webwawa.pl${homeUrl}${isPl ? 'strona-dla' : 'website-for'}`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
<Script
          id="ldjson-industries-index"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbListJsonLd]) }}
        />

      {/* Hero Section */}
      <section className="bg-slate-100 dark:bg-slate-900 py-20 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="flex justify-center mb-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Link href={homeUrl} className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-primary font-semibold">{trans.breadcrumbsParent}</span>
          </nav>

          <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            {trans.heroTag}
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-6 leading-tight">
            {trans.heroTitle}
          </h1>
          <p className="text-xl opacity-80 leading-relaxed text-slate-650 dark:text-slate-350 max-w-3xl mx-auto">
            {trans.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Industry Tiles Section */}
      <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-900/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind) => {
              const industryTrans = ind.translations[lang] || ind.translations.pl;
              const industrySlug = industrySlugsMap[ind.id][lang];
              const parentPath = lang === 'pl' ? 'strona-dla' : 
                                 lang === 'en' ? 'website-for' : 
                                 lang === 'de' ? 'webseite-fuer' : 
                                 lang === 'uk' ? 'sayt-dlya' : 
                                 lang === 'ru' ? 'sayt-dlya' : 'website-for';
              const targetUrl = `${lang === 'pl' ? '' : '/' + lang}/${parentPath}/${industrySlug}`;

              // Get a list of popular specializations (keys and values) to show on the tile
              const modelEntries = Object.entries(industryTrans.models || {}).slice(0, 3);
              
              // Sector theme settings
              const theme = sectorThemeMap[ind.id] || sectorThemeMap.doctor;
              const emoji = getSectorIcon(ind.id);

              return (
                <div 
                  key={ind.id} 
                  className="group relative flex flex-col justify-between overflow-hidden bg-white dark:bg-[#070b19] border border-slate-200 dark:border-white/[0.05] rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-1.5"
                >
                  <div>
                    {/* 1. Website Mockup Banner (FreeFrontend collection hero style) */}
                    <div className={`relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br ${theme.gradient} border border-slate-200/60 dark:border-white/[0.08] mb-6 flex flex-col justify-between p-4 shadow-inner group-hover:scale-[1.02] transition-transform duration-500`}>
                      {/* Browser header bar */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/30 dark:border-white/10">
                        <div className="flex gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                        </div>
                        <span className="text-[9px] font-mono opacity-50 uppercase tracking-widest">
                          {industrySlugsMap[ind.id][lang] || ind.id}.webwawa.pl
                        </span>
                      </div>

                      {/* Mockup Body Content */}
                      <div className="flex-1 flex items-center justify-between mt-3">
                        <div className="space-y-1.5 max-w-[70%]">
                          <div className="h-2 w-16 bg-primary/20 rounded-full" />
                          <h4 className="text-sm font-black tracking-tight text-slate-800 dark:text-white uppercase line-clamp-1">
                            {industryTrans.industryName}
                          </h4>
                          <div className="flex gap-1">
                            <div className="h-1 w-12 bg-slate-400/20 rounded-full" />
                            <div className="h-1 w-8 bg-slate-400/20 rounded-full" />
                          </div>
                        </div>
                        <div className={`w-12 h-12 rounded-xl ${theme.bg} ${theme.text} flex items-center justify-center text-2xl shadow-lg border border-white/20 dark:border-white/10 group-hover:rotate-6 transition-transform duration-300`}>
                          {emoji}
                        </div>
                      </div>

                      {/* Mockup Footer / Badge */}
                      <div className="flex justify-between items-center text-[clamp(7px,0.7vw,9px)] font-bold opacity-60">
                        <span>PWA APP • 0.8S LOAD</span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ONLINE
                        </span>
                      </div>
                    </div>

                    {/* 2. Three Thumbnail-styled specialty sub-cards (FreeFrontend mini thumbnails style) */}
                    {modelEntries.length > 0 && (
                      <div className="mb-6">
                        <span className="block text-[clamp(9px,0.85vw,11px)] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-3">
                          {trans.specializations}
                        </span>
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                          {modelEntries.map(([modelKey, modelVal]) => {
                            const professionSlug = professionSlugsMap[modelKey as ProfessionId][lang];
                            const specialtyUrl = `${lang === 'pl' ? '' : '/' + lang}/${parentPath}/${industrySlug}/${professionSlug}`;
                            return (
                              <Link 
                                key={modelKey} 
                                href={specialtyUrl}
                                className="group/thumb flex flex-col justify-between p-2 sm:p-2.5 min-h-[72px] rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05] hover:border-primary/40 dark:hover:border-primary/40 hover:bg-white dark:hover:bg-slate-900/60 shadow-sm hover:shadow-md transition-all duration-200 text-center hover:scale-105"
                              >
                                <div className={`w-6 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-1.5 opacity-50 group-hover/thumb:opacity-100 transition-opacity`} />
                                <span className="block text-[clamp(8.5px,0.85vw,10.5px)] font-bold text-slate-755 dark:text-slate-300 leading-snug break-words line-clamp-2 min-h-[26px] flex items-center justify-center">
                                  {modelVal.name}
                                </span>
                                <span className="block text-[clamp(6px,0.6vw,7px)] text-slate-450 dark:text-slate-550 font-bold uppercase tracking-wider mt-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                  {trans.offerLabel} &rarr;
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 3. Text Info Section */}
                    <div className="space-y-2 mb-6">
                      <h3 className="text-[clamp(1.25rem,2.2vw,1.625rem)] font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {industryTrans.industryName}
                      </h3>
                      <p className="text-slate-650 dark:text-slate-400 text-[clamp(11px,1vw,13px)] leading-relaxed line-clamp-3">
                        {industryTrans.description}
                      </p>
                    </div>
                  </div>

                  {/* 4. Action Button */}
                  <Link 
                    href={targetUrl} 
                    className="inline-flex items-center justify-center w-full py-3 px-6 bg-slate-950 hover:bg-primary text-white dark:bg-white/5 dark:hover:bg-primary border border-transparent dark:border-white/10 dark:hover:border-transparent rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-md"
                  >
                    {trans.seeSolutions} &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Flexibility Section */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-900/60">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              {trans.techStackTag}
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight">
              {trans.techStackTitle}
            </h2>
            <p className="text-md text-slate-650 dark:text-slate-400 mt-4 leading-relaxed">
              {trans.techStackSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {techStack.map((tech) => (
              <div 
                key={tech.name} 
                className="p-6 bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-4 mb-3.5">
                  <span className="text-3xl bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl block group-hover:scale-105 transition-transform">
                    {tech.logo}
                  </span>
                  <h4 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                    {tech.name}
                  </h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {trans.techStack[tech.key]}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl text-center">
            <span className="text-2xl mb-2 block">⚙️</span>
            <h4 className="font-bold text-lg text-primary uppercase tracking-tight mb-2">
              {trans.techFullFlex}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
              {trans.techDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-900/40">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="inline-block py-1 px-4 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
            {trans.contactTag}
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-6">
            {trans.contactTitle}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            {trans.contactSubtitle}
          </p>
          <a 
            href="#kontakt" 
            className="btn-primary inline-flex py-4 px-8 rounded-xl text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-transform"
            id="cta-industries-contact"
          >
            {trans.getInTouch} &rarr;
          </a>
        </div>
      </section>
    </main>
  );
}
