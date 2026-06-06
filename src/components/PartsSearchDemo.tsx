"use client";

import React, { useState, useEffect, useRef } from 'react';

interface PartItem {
  id: number;
  category_allegro: string;
  pl: string;
  ru: string;
  en?: string;
  de?: string;
  uk?: string;
  zh?: string;
}

interface PartsSearchDemoProps {
  lang: string;
}

const DICT = {
  pl: {
    title: "Interaktywna Wyszukiwarka Części (Demo PWA)",
    subtitle: "Przetestuj wydajność silnika wyszukiwania Next.js na naszej gotowej bazie części motoryzacyjnych przetłumaczonej na 5 języków.",
    placeholder: "Wpisz np. wahacz, tłok, filtr, kabina, pasek...",
    quickTags: "Szybki test:",
    noResults: "Brak wyników. Spróbuj wpisać inną część (np. 'wahacz').",
    searching: "Przeszukiwanie bazy...",
    allegroCategory: "Kategoria Allegro",
    ctaTitle: "Chcesz wdrożyć taki silnik wyszukiwania lub przenieść obecny sklep?",
    ctaDesc: "Niezależnie od tego, czy budujesz nowy sklep motoryzacyjny, chcesz stworzyć nowoczesną stronę e-commerce B2B, czy planujesz migrację ze starej platformy (PrestaShop, WooCommerce, Shopify) – dostarczamy ten ultra-szybki silnik PWA oraz całą zmapowaną bazę części w cenie wdrożenia. Zyskaj 100/100 PageSpeed, zminimalizuj koszty i zwiększ konwersję!",
    ctaBtn: "Skonsultuj projekt bezpłatnie",
    langLabels: {
      pl: "Polski (PL)",
      en: "Angielski (EN)",
      de: "Niemiecki (DE)",
      uk: "Ukraiński (UK)",
      ru: "Rosyjski (RU)",
      zh: "Chiński (ZH)"
    }
  },
  en: {
    title: "Interactive Parts Search (PWA Demo)",
    subtitle: "Test the performance of the Next.js search engine on our ready-to-use automotive parts database translated into 5 languages.",
    placeholder: "Type e.g., control arm, piston, filter, cabin, belt...",
    quickTags: "Quick test:",
    noResults: "No results. Try searching for something else (e.g., 'cabin').",
    searching: "Searching database...",
    allegroCategory: "Allegro Category",
    ctaTitle: "Want to implement this search engine or migrate your store?",
    ctaDesc: "Whether you are building a new auto parts store, need a custom B2B e-commerce system, or plan to migrate from a legacy system (PrestaShop, WooCommerce, Shopify) – we deliver this ultra-fast PWA engine and the entire mapped parts database included in our service. Reach a 100/100 PageSpeed score, cut hosting costs, and drive higher sales conversion!",
    ctaBtn: "Get a free project quote",
    langLabels: {
      pl: "Polish (PL)",
      en: "English (EN)",
      de: "German (DE)",
      uk: "Ukrainian (UK)",
      ru: "Russian (RU)",
      zh: "Chinese (ZH)"
    }
  },
  de: {
    title: "Interaktive Teilesuche (PWA Demo)",
    subtitle: "Testen Sie die Leistung der Next.js-Suchmaschine in unserer gebrauchsfertigen Kfz-Teiledatenbank, die in 5 Sprachen übersetzt ist.",
    placeholder: "Geben Sie z.B. Querlenker, Kolben, Filter, Kabine, Riemen ein...",
    quickTags: "Schnelltest:",
    noResults: "Keine Ergebnisse. Suchen Sie nach etwas anderem (z. B. 'Filter').",
    searching: "Datenbank durchsuchen...",
    allegroCategory: "Allegro-Kategorie",
    ctaTitle: "Möchten Sie diese Suchmaschine implementieren oder Ihren Shop migrieren?",
    ctaDesc: "Egal, ob Sie einen neuen Autoteile-Shop aufbauen, eine B2B-Plattform benötigen oder eine Migration von Altsystemen (PrestaShop, WooCommerce, Shopify) planen – wir liefern diese ultraschnelle PWA-Engine und die gesamte Datenbank im Paket. Sichern Sie sich 100/100 PageSpeed und hängen Sie die Konkurrenz ab!",
    ctaBtn: "Kostenlose Beratung anfordern",
    langLabels: {
      pl: "Polnisch (PL)",
      en: "Englisch (EN)",
      de: "Deutsch (DE)",
      uk: "Ukrainisch (UK)",
      ru: "Russisch (RU)",
      zh: "Chinesisch (ZH)"
    }
  },
  uk: {
    title: "Інтерактивний пошук деталей (Демо PWA)",
    subtitle: "Перевірте швидкість пошукового рушія Next.js на нашій готовій базі автозапчастин, перекладеній 5 мовами.",
    placeholder: "Введіть, наприклад, важіль, поршень, фільтр, ремінь...",
    quickTags: "Швидкий тест:",
    noResults: "Нічого не знайдено. Спробуйте пошукати щось інше (наприклад, 'важіль').",
    searching: "Пошук у базі даних...",
    allegroCategory: "Категорія Allegro",
    ctaTitle: "Хочете впровадити такий пошуковий двигун або перенести існуючий магазин?",
    ctaDesc: "Незалежно від того, чи будуєте ви новий автомагазин, створюєте B2B-платформу, чи плануєте міграцію з застарілих систем (PrestaShop, WooCommerce, Shopify) – ми надаємо цей надшвидкий PWA-двигун та всю базу даних автозапчастин у вартості розробки. Отримайте PageSpeed 100/100 та обійдіть конкурентів!",
    ctaBtn: "Отримати безкоштовну консультацію",
    langLabels: {
      pl: "Польська (PL)",
      en: "Англійська (EN)",
      de: "Німецька (DE)",
      uk: "Українська (UK)",
      ru: "Російська (RU)",
      zh: "Китайська (ZH)"
    }
  },
  ru: {
    title: "Интерактивный поиск деталей (Демо PWA)",
    subtitle: "Проверьте скорость поискового движка Next.js на нашей готовой базе автозапчастей, переведенной на 5 языков.",
    placeholder: "Введите, например, рычаг, поршень, фильтр, ремень...",
    quickTags: "Быстрый тест:",
    noResults: "Ничего не найдено. Попробуйте поискать что-то другое (например, 'рычаг').",
    searching: "Поиск в базе данных...",
    allegroCategory: "Категория Allegro",
    ctaTitle: "Хотите внедрить такой поисковый движок или перенести существующий магазин?",
    ctaDesc: "Независимо от того, строите ли вы новый автомагазин, создаете B2B-платформу или планируете миграцию с устаревших систем (PrestaShop, WooCommerce, Shopify) – мы предоставляем этот сверхбыстрый PWA-движок и всю базу автозапчастей в стоимости разработки. Получите PageSpeed 100/100 и обойдите конкурентов!",
    ctaBtn: "Получить бесплатную консультацию",
    langLabels: {
      pl: "Польская (PL)",
      en: "Английская (EN)",
      de: "Немецкая (DE)",
      uk: "Украинская (UK)",
      ru: "Русская (RU)",
      zh: "Китайская (ZH)"
    }
  },
  zh: {
    title: "交互式配件检索（PWA 电商演示）",
    subtitle: "在搭载已汉化并翻译成 5 国语言的汽配大库上，测试 Next.js 服务端检索引擎的高效性能。",
    placeholder: "输入关键词，例如：控制臂, 活塞, 滤清器, 驾驶室, 皮带...",
    quickTags: "快捷测试:",
    noResults: "未找到结果。请尝试搜索其他零件（例如：'控制臂'）。",
    searching: "正在检索大库中...",
    allegroCategory: "Allegro 对应类目",
    ctaTitle: "想要在您自己的独立站中实现这样的极速检索功能或完成迁移吗？",
    ctaDesc: "无论您是准备全新搭建汽配零售商城、开发高端 B2B 分销系统，还是计划将现有的店铺（PrestaShop、WooCommerce、Shopify）迁移至现代化平台——我们都将在开发方案中直接提供这套超高性能 PWA 搜索引擎以及完整翻译好的零部件大库。帮助您的网站跑满 100/100 PageSpeed 分数，大获全胜！",
    ctaBtn: "获取免费方案评估咨询",
    langLabels: {
      pl: "波兰语 (PL)",
      en: "英语 (EN)",
      de: "德语 (DE)",
      uk: "乌克兰语 (UK)",
      ru: "俄语 (RU)",
      zh: "中文 (ZH)"
    }
  }
};

const QUICK_TAGS_MAP: Record<string, string[]> = {
  pl: ["wahacz", "tłok", "filtr", "kabina", "pasek"],
  en: ["control arm", "piston", "filter", "cabin", "belt"],
  de: ["querlenker", "kolben", "filter", "kabine", "riemen"],
  uk: ["важіль", "поршень", "фільтр", "кабіна", "ремінь"],
  ru: ["рычаг", "поршень", "фильтр", "кабина", "ремень"],
  zh: ["控制臂", "活塞", "滤清器", "驾驶室", "皮带"]
};

export default function PartsSearchDemo({ lang }: PartsSearchDemoProps) {
  const t = DICT[lang as keyof typeof DICT] || DICT.pl;
  const quickTags = QUICK_TAGS_MAP[lang] || QUICK_TAGS_MAP.pl;

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<PartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Perform search call to API route
  const performSearch = async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/parts-search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results || []);
      }
    } catch (err) {
      console.error('Error fetching parts search results:', err);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  // Debounced search logic
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchTerm.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
  };

  // Format the Allegro category path to make it look clean
  const formatCategory = (pathStr: string) => {
    if (!pathStr) return '';
    return pathStr.split('/').join('  ❯  ');
  };

  // Smooth scroll handler to the contact form section at the bottom of the page
  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('kontakt');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#kontakt';
    }
  };

  return (
    <div className="glass-card relative overflow-hidden my-12 border border-slate-200 dark:border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Header */}
      <div className="mb-6 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Demo
        </span>
        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2">
          {t.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
          {t.subtitle}
        </p>
      </div>

      {/* Input container */}
      <div className="space-y-4 mb-6 relative z-10">
        <div className="relative">
          <input
            type="text"
            className="w-full py-4 pl-12 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-2xl text-sm font-semibold shadow-inner outline-none transition-all placeholder-slate-400 dark:placeholder-slate-600 text-slate-800 dark:text-slate-200"
            placeholder={t.placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
            🔍
          </span>
          {loading && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary flex items-center gap-1">
              <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          )}
        </div>

        {/* Quick tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{t.quickTags}</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${
                searchTerm.toLowerCase() === tag.toLowerCase()
                  ? 'bg-primary border-transparent text-white'
                  : 'bg-white hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] border-slate-200 dark:border-white/[0.05] text-slate-600 dark:text-slate-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results grid */}
      <div className="relative z-10 mb-8">
        {loading && results.length === 0 && (
          <div className="py-10 text-center text-sm font-semibold text-slate-400">
            {t.searching}
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="py-10 text-center text-sm font-bold text-amber-500 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
            ⚠️ {t.noResults}
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 gap-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {results.map((part) => (
              <div 
                key={part.id} 
                className="p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.05] hover:border-primary/45 rounded-2xl transition-all duration-200 shadow-sm"
              >
                {/* Polish name & ID badge */}
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-tight">
                    {part.pl || part.main_pl}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-550 bg-slate-100 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">
                    ID: #{part.id}
                  </span>
                </div>

                {/* Multilingual Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3 pt-3 border-t border-slate-200/50 dark:border-white/[0.04] text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {/* EN */}
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">{t.langLabels.en}</span>
                    <span className="text-slate-800 dark:text-slate-350">{part.en || '—'}</span>
                  </div>
                  {/* DE */}
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">{t.langLabels.de}</span>
                    <span className="text-slate-800 dark:text-slate-350">{part.de || '—'}</span>
                  </div>
                  {/* UK */}
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">{t.langLabels.uk}</span>
                    <span className="text-slate-800 dark:text-slate-350">{part.uk || '—'}</span>
                  </div>
                  {/* RU */}
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">{t.langLabels.ru}</span>
                    <span className="text-slate-800 dark:text-slate-350">{part.ru || '—'}</span>
                  </div>
                  {/* ZH */}
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">{t.langLabels.zh}</span>
                    <span className="text-slate-800 dark:text-slate-350 font-sans">{part.zh || '—'}</span>
                  </div>
                </div>

                {/* Allegro Category */}
                {part.category_allegro && (
                  <div className="mt-3 text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5 pt-2 border-t border-dashed border-slate-200 dark:border-white/[0.04]">
                    <span className="font-bold uppercase tracking-wider">{t.allegroCategory}:</span>
                    <span className="font-medium truncate">{formatCategory(part.category_allegro)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic CTA Banner for Lead Generation (Web / E-commerce / Migration) */}
      <div className="relative z-10 mt-6 pt-6 border-t border-slate-200 dark:border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/[0.02] dark:bg-white/[0.01] p-6 rounded-2xl border border-primary/10 dark:border-white/[0.02]">
        <div className="space-y-2 text-left flex-1">
          <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            🚀 {t.ctaTitle}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            {t.ctaDesc}
          </p>
        </div>
        <button
          onClick={handleCtaClick}
          className="btn-primary py-3 px-6 text-xs uppercase tracking-wider whitespace-nowrap"
        >
          {t.ctaBtn} &rarr;
        </button>
      </div>
    </div>
  );
}
