import { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary, Locale } from '../dictionaries';
import { getGlobalSettings } from '@/lib/settings';
import { getAllIndustries } from '@/lib/industries';
import { industrySlugsMap, professionSlugsMap, ProfessionId } from '@/lib/industries-list';

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
    contactSubtitle: 'Napisz do nas. Przeanalizujemy Twoje potrzeby i zaproponujemy optymalny stos technologiczny oraz strategię pozycjonowania lokalnego.'
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
    contactSubtitle: 'Write to us. We will analyze your requirements and propose the optimal tech stack and local SEO strategy.'
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
    contactSubtitle: 'Schreiben Sie uns. Wir analysieren Ihre Anforderungen und schlagen den besten Tech-Stack und eine lokale SEO-Strategie vor.'
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
    contactSubtitle: 'Напишіть нам. Ми проаналізуємо ваші потреби та запропонуємо оптимальний технологічний стек та стратегію локального SEO.'
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
    contactSubtitle: 'Напишите нам. Мы проанализируем ваши задачи и предложим оптимальный стек технологий и локальное SEO-продвижение.'
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
    contactSubtitle: '欢迎随时联系我们。我们将深度剖析您的业务需求，量身定制最佳的技术栈搭配和本地谷歌地图 SEO 推广战略。'
  }
};

export async function generateMetadata(props: { params: Promise<{ lang: string  }> }): Promise<Metadata> {
  const params = await props.params;
  const lang = (params.lang || 'pl') as Locale;
  const trans = pageTranslations[lang] || pageTranslations.pl;
  return {
    title: trans.title,
    description: trans.description,
    alternates: {
      canonical: lang === 'pl' ? 'https://webwawa.pl/strona-dla' : `https://webwawa.pl/${lang}/${pageTranslations[lang].breadcrumbsParent.toLowerCase().replace(/ /g, '-')}`,
    }
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
      desc_pl: 'Tworzymy ultra-szybkie aplikacje webowe PWA. Gwarancja wyniku 100/100 Mobile PageSpeed, błyskawiczna nawigacja bez przeładowań strony oraz pełna optymalizacja pod indeksację wyszukiwarek AI (GEO/AEO).',
      desc_en: 'We build ultra-fast PWA web apps. Guaranteed 100/100 Mobile PageSpeed scores, instant transitions, and complete readiness for AI search engine indexing (GEO/AEO).'
    },
    {
      name: 'WordPress',
      logo: '📝',
      desc_pl: 'Idealne rozwiązanie dla gabinetów i kancelarii prowadzących blogi eksperckie. Zapewniamy nowoczesny design, pełną integrację z wtyczkami rejestracji i prosty w edycji panel administracyjny.',
      desc_en: 'Perfect solution for practices and firms running expert blogs. We deliver modern designs, seamless booking plugin integrations, and an intuitive admin panel.'
    },
    {
      name: 'Django & Python',
      logo: '🐍',
      desc_pl: 'Niezrównane bezpieczeństwo danych, bezbłędny backend oraz zaawansowane bazy danych. Doskonały wybór do obsługi poufnych danych pacjentów i klientów w systemach CRM i portalach medyczno-prawnych.',
      desc_en: 'Unmatched data security, clean backend architectures, and advanced databases. The best fit for handling confidential client records in custom CRM systems.'
    },
    {
      name: 'Laravel & PHP',
      logo: '🚀',
      desc_pl: 'Solidne, szybkie i wysoce skalowalne systemy biznesowe. Tworzymy dedykowane panele klienta, integracje z systemami płatności (PayU, BLIK), e-rezerwacje oraz skomplikowane portale ogłoszeniowe.',
      desc_en: 'Robust, fast, and highly scalable business software. We build dedicated client panels, payment gateway integrations (Stripe, PayPal), and e-booking systems.'
    },
    {
      name: 'PrestaShop',
      logo: '🛒',
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
      <script
        type="application/ld+json"
        id="ldjson-industries-index"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industries.map((ind) => {
              const industryTrans = ind.translations[lang] || ind.translations.pl;
              const brandSlug = industrySlugsMap[ind.id][lang];
              const parentPath = lang === 'pl' ? 'strona-dla' : 
                                 lang === 'en' ? 'website-for' : 
                                 lang === 'de' ? 'webseite-fuer' : 
                                 lang === 'uk' ? 'sayt-dlya' : 
                                 lang === 'ru' ? 'sayt-dlya' : 'website-for';
              const targetUrl = `${lang === 'pl' ? '' : '/' + lang}/${parentPath}/${brandSlug}`;

              // Get a list of popular specializations (keys and values) to show on the tile
              const modelEntries = Object.entries(industryTrans.models || {}).slice(0, 4);

              return (
                <div 
                  key={ind.id} 
                  className="group relative overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary transition-all" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 py-1 px-3.5 rounded-full">
                      Sektor: {ind.id}
                    </span>
                    <span className="text-3xl group-hover:scale-110 transition-transform">
                      {ind.id === 'doctor' ? '🩺' : ind.id === 'lawyer' ? '⚖️' : ind.id === 'psychologist' ? '🧠' : ind.id === 'accountant' ? '📊' : ind.id === 'architect' ? '📐' : ind.id === 'beauty' ? '🌸' : ind.id === 'automotive' ? '🚗' : '🏗️'}
                    </span>
                  </div>

                  <h3 className="text-3xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white mb-4">
                    {industryTrans.industryName}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {industryTrans.description}
                  </p>

                  {modelEntries.length > 0 && (
                    <div className="mb-8">
                      <span className="block text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-3">
                        {trans.specializations}
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {(() => {
                          const badgeStyles = ind.id === 'doctor'
                            ? 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/20 dark:border-blue-400/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 hover:border-blue-400 dark:hover:border-blue-300'
                            : ind.id === 'lawyer'
                            ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/20 dark:border-indigo-400/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 dark:hover:bg-indigo-500/30 hover:border-indigo-400 dark:hover:border-indigo-300'
                            : ind.id === 'psychologist'
                            ? 'bg-teal-500/10 dark:bg-teal-500/20 border-teal-500/20 dark:border-teal-400/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 dark:hover:bg-teal-500/30 hover:border-teal-400 dark:hover:border-teal-300'
                            : ind.id === 'accountant'
                            ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20 dark:border-emerald-400/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-300'
                            : ind.id === 'architect'
                            ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/20 dark:border-amber-400/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 dark:hover:bg-amber-500/30 hover:border-amber-400 dark:hover:border-amber-300'
                            : ind.id === 'beauty'
                            ? 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/20 dark:border-rose-400/30 text-rose-700 dark:text-rose-355 hover:bg-rose-500/20 dark:hover:bg-rose-500/30 hover:border-rose-400 dark:hover:border-rose-300'
                            : ind.id === 'automotive'
                            ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/20 dark:border-amber-400/30 text-amber-750 dark:text-amber-300 hover:bg-amber-500/20 dark:hover:bg-amber-500/30 hover:border-amber-400 dark:hover:border-amber-300'
                            : 'bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/20 dark:border-orange-400/30 text-orange-700 dark:text-orange-300 hover:bg-orange-500/20 dark:hover:bg-orange-500/30 hover:border-orange-400 dark:hover:border-orange-300';
                          return modelEntries.map(([modelKey, modelVal]) => {
                            const modelSlug = professionSlugsMap[modelKey as ProfessionId][lang];
                            const specialtyUrl = `${lang === 'pl' ? '' : '/' + lang}/${parentPath}/${brandSlug}/${modelSlug}`;
                            return (
                              <Link 
                                key={modelKey} 
                                href={specialtyUrl}
                                className={`text-xs border py-1.5 px-3 rounded-full font-bold tracking-wide transition-all duration-200 hover:scale-105 shadow-sm block ${badgeStyles}`}
                              >
                                {modelVal.name}
                              </Link>
                            );
                          });
                        })()}
                        {Object.keys(industryTrans.models || {}).length > 4 && (
                          <span className="text-xs text-primary dark:text-blue-400 font-extrabold py-1 px-2.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/40">
                            +{Object.keys(industryTrans.models).length - 4} więcej
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <Link 
                    href={targetUrl} 
                    className="inline-flex items-center justify-center w-full py-3 px-6 bg-slate-900 hover:bg-primary text-white dark:bg-slate-800 dark:hover:bg-primary rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-md"
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
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white leading-tight">
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
                  {isPl ? tech.desc_pl : tech.desc_en}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl text-center">
            <span className="text-2xl mb-2 block">⚙️</span>
            <h4 className="font-bold text-lg text-primary uppercase tracking-tight mb-2">
              {isPl ? 'Pełna elastyczność i integracja' : 'Full flexibility & integration'}
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
          <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white mb-6">
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
            {isPl ? 'Skontaktuj się z nami' : 'Get in touch'} &rarr;
          </a>
        </div>
      </section>
    </main>
  );
}
