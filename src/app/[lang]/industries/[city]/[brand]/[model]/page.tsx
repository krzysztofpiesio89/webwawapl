import fs from 'fs';
import path from 'path';
import Script from 'next/script';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getIndustryById } from '@/lib/industries';
import { getCityBySlug } from '@/lib/cities';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale, ogLocaleMap } from '../../../../dictionaries';
import ContactForm from '@/components/ContactForm';
import PartsSearchDemo from '@/components/PartsSearchDemo';
import { 
  industrySlugsMap, 
  professionSlugsMap, 
  serviceSlugsMap, 
  IndustryId, 
  ProfessionId,
  industryModelsMap
} from '@/lib/industries-list';
import { getBrandBySlug, getModelBySlug, getBrandLogo, getWikiData, getAllBrands } from '@/lib/brands';

// Popular car brands for SEO tag cloud internal links
const POPULAR_BRAND_SLUGS = [
  'bmw', 'mercedes-benz', 'audi', 'volkswagen', 'toyota', 'ford',
  'opel', 'skoda', 'renault', 'peugeot', 'honda', 'hyundai',
  'kia', 'volvo', 'seat', 'mazda', 'nissan', 'fiat',
  'porsche', 'lexus', 'subaru', 'mitsubishi'
];

// All automotive professions for cross-linking
const AUTOMOTIVE_PROFESSIONS = [
  { id: 'carRental', slugPl: 'wynajem-aut', emojiIcon: '🚗' },
  { id: 'leasing', slugPl: 'leasing-samochodowy', emojiIcon: '📋' },
  { id: 'carBuying', slugPl: 'skup-aut', emojiIcon: '💰' },
  { id: 'mechanic', slugPl: 'mechanik', emojiIcon: '🔧' },
  { id: 'carParts', slugPl: 'czesci-samochodowe', emojiIcon: '⚙️' },
] as const;

// Key Warsaw districts + nearby cities for regional SEO links (non-automotive)
const KEY_LOCATIONS = [
  { slug: 'mokotow', name: 'Mokotów' },
  { slug: 'wola', name: 'Wola' },
  { slug: 'srodmiescie', name: 'Śródmieście' },
  { slug: 'ursynow', name: 'Ursynów' },
  { slug: 'bialoleka', name: 'Białołęka' },
  { slug: 'bemowo', name: 'Bemowo' },
  { slug: 'ochota', name: 'Ochota' },
  { slug: 'wilanow', name: 'Wilanow' },
  { slug: 'zoliborz', name: 'Żoliborz' },
  { slug: 'bielany', name: 'Bielany' },
  { slug: 'legionowo', name: 'Legionowo' },
  { slug: 'pruszkow', name: 'Pruszków' },
  { slug: 'piaseczno', name: 'Piaseczno' },
  { slug: 'otwock', name: 'Otwock' },
  { slug: 'konstancin-jeziorna', name: 'Konstancin' },
  { slug: 'lomianki', name: 'Łomianki' },
  { slug: 'wolomin', name: 'Wołomin' },
  { slug: 'marki-miasto', name: 'Marki' },
];

// Related industries map for cross-linking (non-automotive)
const RELATED_INDUSTRIES: Record<IndustryId, IndustryId[]> = {
  doctor: ['psychologist', 'beauty'],
  lawyer: ['accountant'],
  psychologist: ['doctor', 'beauty'],
  accountant: ['lawyer'],
  architect: ['construction'],
  construction: ['architect', 'transport'],
  beauty: ['psychologist'],
  automotive: ['transport'],
  gastronomy: [],
  transport: ['automotive', 'construction'],
  ecommerce: ['accountant', 'transport'],
  education: ['psychologist'],
};

// Profession-level UI translation strings for non-automotive
const PROFESSION_UI = {
  pl: {
    specHeading: (ind: string) => `Inne specjalizacje: ${ind}`,
    locationsHeading: (prof: string) => `${prof} – Warszawa i okolice`,
    relatedHeading: 'Podobne branże',
    disclaimer: (prof: string, ind: string) => `webwawa.pl – projektujemy strony WWW i systemy IT dla specjalizacji ${prof} (branża: ${ind}) w Warszawie i regionie mazowieckim.`,
  },
  en: {
    specHeading: (ind: string) => `Other ${ind} specializations`,
    locationsHeading: (prof: string) => `${prof} – Warsaw & surrounding area`,
    relatedHeading: 'Related industries',
    disclaimer: (prof: string, ind: string) => `webwawa.pl – we build websites & IT systems for ${prof} (${ind} sector) in Warsaw and the Masovian region.`,
  },
  de: {
    specHeading: (ind: string) => `Weitere ${ind}-Spezialisierungen`,
    locationsHeading: (prof: string) => `${prof} – Warschau & Umgebung`,
    relatedHeading: 'Verwandte Branchen',
    disclaimer: (prof: string, ind: string) => `webwawa.pl – Websites & IT-Systeme für ${prof} (${ind}) in Warschau und Umgebung.`,
  },
  uk: {
    specHeading: (ind: string) => `Інші спеціалізації: ${ind}`,
    locationsHeading: (prof: string) => `${prof} – Варшава та околиці`,
    relatedHeading: 'Похожі галузі',
    disclaimer: (prof: string, ind: string) => `webwawa.pl – розробляємо сайти для ${prof} (${ind}) у Варшаві та Мазовії.`,
  },
  ru: {
    specHeading: (ind: string) => `Другие специализации: ${ind}`,
    locationsHeading: (prof: string) => `${prof} – Варшава и окрестности`,
    relatedHeading: 'Похожие отрасли',
    disclaimer: (prof: string, ind: string) => `webwawa.pl – разрабатываем сайты для ${prof} (${ind}) в Варшаве и регионе.`,
  },
  zh: {
    specHeading: (ind: string) => `其他${ind}专业`,
    locationsHeading: (prof: string) => `${prof} – 华沙及周边地区`,
    relatedHeading: '相关行业',
    disclaimer: (prof: string, ind: string) => `webwawa.pl – 为华沙及马佐得天山地区${prof}(${ind})企业提供网站开发服务。`,
  },
} as const;

// E-commerce Stacks and FAQs UI text
const ECOMMERCE_UI = {
  pl: {
    stackTag: "Rozwiązania E-commerce",
    stackTitle: "Nowoczesne Architektury dla e-Sklepów",
    stackSub: "Nie ma jednego rozwiązania dla każdego. Wybierz z nami optymalny stos technologiczny zapewniający maksymalną konwersję i SEO.",
    faqTag: "Pytania i Odpowiedzi",
    faqTitle: "FAQ – Sklepy internetowe z częściami",
    faqSub: "Wszystko, co musisz wiedzieć o wdrażaniu nowoczesnych platform e-commerce w motoryzacji.",
    stacks: [
      {
        name: "Headless WooCommerce (Next.js + WordPress)",
        desc: "Optymalne połączenie znajomego systemu administracyjnego z niesamowicie szybkim frontendem. Przeznaczone dla małych i średnich sklepów stacjonarnych wkraczających w e-commerce.",
        benefit: "Czas ładowania strony PWA poniżej 0.5s, zerowa podatność na awarie bazy danych WooCommerce w szczytach ruchu.",
        cost: "Niski / Średni"
      },
      {
        name: "Headless Shopify (Next.js + Shopify API)",
        desc: "Wykorzystanie stabilnej chmury transakcyjnej Shopify z autorskim, ultra-szybkim frontem w Next.js. Omijamy ograniczenia szablonów i sztywnej struktury linków Shopify.",
        benefit: "Dowolne projektowanie ścieżek URL dla wielojęzycznego SEO, pełna kontrola nad CSS i metadanymi.",
        cost: "Średni / Wysoki (prowizje Shopify)"
      },
      {
        name: "PrestaShop + PWA Frontend",
        desc: "Zaawansowany silnik e-commerce zintegrowany z Twoim systemem magazynowym (ERP, Subiekt) połączony z nowoczesną aplikacją PWA po stronie klienta. Idealne dla hurtowni.",
        benefit: "Stabilna gospodarka magazynowa połączona z brakiem opóźnień przy filtrowaniu tysięcy części samochodowych.",
        cost: "Średni"
      },
      {
        name: "Dedykowany Sklep Django/Python",
        desc: "W pełni autorskie systemy sprzedażowe budowane od podstaw pod specyfikację klienta. Idealne do zaawansowanych konfiguratorów i integracji fabrycznych.",
        benefit: "Niezrównane bezpieczeństwo, najwyższa wydajność zapytań SQL przy wyszukiwaniu po VIN oraz pełna skalowalność.",
        cost: "Wysoki"
      }
    ],
    faqs: [
      {
        q: "Dlaczego szybkość strony (PageSpeed) ma tak ogromne znaczenie dla sklepu z częściami?",
        a: "Klienci szukający części często robią to w pośpiechu na telefonach. Każda sekunda opóźnienia zwiększa współczynnik odrzuceń o kilkadziesiąt procent. Nasze aplikacje PWA w Next.js osiągają wyniki bliskie 100/100, co drastycznie podnosi pozycje w wyszukiwarkach i konwersję sprzedaży."
      },
      {
        q: "Czy udostępniona baza części samochodowych jest przetłumaczona?",
        a: "Tak, nasza baza części została w pełni zmapowana z kategoriami Allegro i przetłumaczona na 5 języków (angielski, niemiecki, ukraiński, rosyjski, chiński). Pozwala to na natychmiastowe uruchomienie wielojęzycznego SEO i dotarcie do zagranicznych odbiorców bez kosztów tłumaczenia."
      },
      {
        q: "Czym różni się podejście Headless od klasycznego WooCommerce lub PrestaShop?",
        a: "W klasycznym podejściu serwer musi jednocześnie generować wygląd strony i przetwarzać zakupy, co spowalnia sklep. W architekturze Headless wygląd strony (Next.js) jest w całości wygenerowany wcześniej i załadowany na szybkich serwerach CDN, a z bazą danych komunikuje się tylko w krytycznych momentach za pomocą bezpiecznego API."
      }
    ]
  },
  en: {
    stackTag: "E-commerce Solutions",
    stackTitle: "Modern Architectures for e-Stores",
    stackSub: "There is no single solution for everyone. Choose the optimal tech stack ensuring maximum conversion and SEO with us.",
    faqTag: "Questions & Answers",
    faqTitle: "FAQ – Auto Parts Online Stores",
    faqSub: "Everything you need to know about implementing modern e-commerce platforms in the automotive sector.",
    stacks: [
      {
        name: "Headless WooCommerce (Next.js + WordPress)",
        desc: "Optimal blend of a familiar administration system with an incredibly fast frontend. Perfect for small to medium stores entering e-commerce.",
        benefit: "PWA page load times below 0.5s, zero database bottlenecks during peak traffic.",
        cost: "Low / Medium"
      },
      {
        name: "Headless Shopify (Next.js + Shopify API)",
        desc: "Leveraging the transactional stability of Shopify with a custom, ultra-fast frontend in Next.js. We bypass theme limitations and rigid Shopify URL structures.",
        benefit: "Total freedom in URL routing for multilingual SEO, complete control over CSS and meta tags.",
        cost: "Medium / High"
      },
      {
        name: "PrestaShop + PWA Frontend",
        desc: "Advanced e-commerce engine integrated with your warehouse systems (ERP) connected to a modern client-side PWA. Ideal for wholesale distributors.",
        benefit: "Robust stock control combined with zero filtering lag across thousands of car parts.",
        cost: "Medium"
      },
      {
        name: "Custom Django/Python Store",
        desc: "Fully custom sales systems built from scratch to client specifications. Ideal for advanced configurators and factory integrations.",
        benefit: "Unmatched security, ultimate SQL query speeds for VIN searches, and total scalability.",
        cost: "High"
      }
    ],
    faqs: [
      {
        q: "Why does page speed matter so much for an auto parts store?",
        a: "Customers searching for parts are often in a hurry on mobile devices. Every second of delay spikes the bounce rate. Our Next.js PWAs hit nearly 100/100 scores, dramatically boosting search rankings and conversion rates."
      },
      {
        q: "Is the provided auto parts database translated?",
        a: "Yes, our parts database is fully mapped to Allegro categories and translated into 5 languages (EN, DE, UK, RU, ZH). This allows you to launch multilingual SEO instantly and reach international buyers without manual translation costs."
      },
      {
        q: "What is the difference between Headless and classic WooCommerce or PrestaShop?",
        a: "In classic setups, the server must generate pages and process transactions at the same time, which slows down the shop. In Headless, the frontend (Next.js) is statically pre-rendered and served from fast edge CDNs, communicating with the backend only via a secure API."
      }
    ]
  },
  de: {
    stackTag: "E-Commerce-Lösungen",
    stackTitle: "Moderne Architekturen für E-Shops",
    stackSub: "Es gibt keine Universallösung. Wählen Sie mit uns den optimalen Technologie-Stack für maximale Conversion und SEO.",
    faqTag: "Fragen & Antworten",
    faqTitle: "FAQ – Autoteile Online-Shops",
    faqSub: "Alles, was Sie über die Implementierung moderner E-Commerce-Plattformen im Automobilbereich wissen müssen.",
    stacks: [
      {
        name: "Headless WooCommerce (Next.js + WordPress)",
        desc: "Optimale Mischung aus vertrautem Admin-System und schnellem Frontend. Ideal für kleine bis mittlere Shops.",
        benefit: "Ladezeiten unter 0,5s, keine Datenbankengpässe bei hohem Traffic.",
        cost: "Niedrig / Mittel"
      },
      {
        name: "Headless Shopify (Next.js + Shopify API)",
        desc: "Nutzung der Stabilität von Shopify mit einem schnellen Next.js-Frontend. Umgehen Sie Theme-Limits und starre URL-Strukturen.",
        benefit: "Freie URL-Gestaltung für mehrsprachiges SEO, volle Kontrolle über CSS und Metadaten.",
        cost: "Mittel / Hoch"
      },
      {
        name: "PrestaShop + PWA Frontend",
        desc: "Fortschrittliche E-Commerce-Engine integriert mit ERP-Systemen, verbunden mit einer modernen PWA. Ideal für den Großhandel.",
        benefit: "Robuste Lagersteuerung kombiniert mit verzögerungsfreiem Filtern von Tausenden Teilen.",
        cost: "Mittel"
      },
      {
        name: "Dedyzierter Django/Python Shop",
        desc: "Individuelle Verkaufssysteme nach Kundenspezifikation. Ideal für Konfiguratoren und Werksintegrationen.",
        benefit: "Hervorragende Sicherheit, extrem schnelle SQL-Abfragen bei der Fahrgestellnummer-Suche.",
        cost: "Hoch"
      }
    ],
    faqs: [
      {
        q: "Warum ist die Ladegeschwindigkeit (PageSpeed) für einen Teile-Shop so wichtig?",
        a: "Kunden suchen oft eilig auf Mobilgeräten nach Teilen. Jede Sekunde Verzögerung erhöht die Absprungrate. Unsere Next.js PWAs erreichen fast 100/100 Punkte, was Rankings und Conversions steigert."
      },
      {
        q: "Ist die bereitgestellte Autoteile-Datenbank übersetzt?",
        a: "Ja, unsere Datenbank ist vollständig mit Allegro-Kategorien verknüpft und in 5 Sprachen (EN, DE, UK, RU, ZH) übersetzt. Dies ermöglicht den sofortigen Start eines mehrsprachigen SEO ohne Übersetzungskosten."
      },
      {
        q: "Was ist der Unterschied zwischen Headless und klassischem WooCommerce/PrestaShop?",
        a: "In klassischen Systemen muss der Server Seiten erstellen und Käufe gleichzeitig verarbeiten, was den Shop verlangsamt. Bei Headless ist der Frontend (Next.js) vorgerendert auf schnellen CDNs gespeichert und kommuniziert nur per sicherer API mit dem Backend."
      }
    ]
  },
  uk: {
    stackTag: "Рішення E-commerce",
    stackTitle: "Сучасні архітектури для інтернет-магазинів",
    stackSub: "Не існує єдиного рішення для всіх. Виберіть оптимальний технологічний стек для максимальної конверсії та SEO разом з нами.",
    faqTag: "Питання та відповіді",
    faqTitle: "FAQ – Інтернет-магазини автозапчастин",
    faqSub: "Все, що вам потрібно знати про впровадження сучасних платформ електронної комерції в автомобільній сфері.",
    stacks: [
      {
        name: "Headless WooCommerce (Next.js + WordPress)",
        desc: "Оптимальне поєднання знайомої адміністративної системи з надшвидким фронтендом. Призначено для малих та середніх магазинів.",
        benefit: "Час завантаження сторінки PWA менше 0,5 с, відсутність збоїв бази даних при піковому трафіку.",
        cost: "Низький / Середній"
      },
      {
        name: "Headless Shopify (Next.js + Shopify API)",
        desc: "Використання стабільної хмари транзакцій Shopify з ультрашвидким фронтендом Next.js. Ми обходимо обмеження шаблонів та структури посилань Shopify.",
        benefit: "Вільний дизайн URL-шляхів для багатомовного SEO, повний контроль над CSS та метаданими.",
        cost: "Середній / Високий"
      },
      {
        name: "PrestaShop + PWA Frontend",
        desc: "Сучасний двигун e-commerce, інтегрований з вашими складськими системами (ERP), підключений до клієнтського PWA. Ідеально для оптової торгівлі.",
        benefit: "Стабільне керування запасами у поєднанні з відсутністю затримок фільтрації тисяч автозапчастин.",
        cost: "Середній"
      },
      {
        name: "Спеціалізований магазин Django/Python",
        desc: "Повністю кастомні системи продажу, створені з нуля за специфікацією клієнта. Ідеально для конфігураторів та заводських інтеграцій.",
        benefit: "Незрівнянна безпека, висока швидкість SQL-запитів при пошуку за VIN та повна масштабованість.",
        cost: "Високий"
      }
    ],
    faqs: [
      {
        q: "Договір завантаження сторінки (PageSpeed) так важливий для магазину запчастин?",
        a: "Клієнти, які шукають запчастини, часто роблять це поспіхом на мобільних пристроях. Кожна секунда затримки різко збільшує показник відмов. Наші PWA на Next.js досягають показників майже 100/100, що покращує пошукові позиції та конверсію."
      },
      {
        q: "Чи перекладена база даних автозапчастин?",
        a: "Так, наша база даних повністю інтегрована з категоріями Allegro і перекладена 5 мовами (EN, DE, UK, RU, ZH). Це дозволяє миттєво запустити багатомовне SEO без додаткових витрат на переклад."
      },
      {
        q: "Яка різниця між архітектурою Headless та класичними WooCommerce або PrestaShop?",
        a: "У класичних системах сервер повинен одночасно створювати вигляд сторінки та обробляти покупки, що сповільнює роботу сайту. В архітектурі Headless фронтенд (Next.js) заздалегідь згенерований і завантажується з швидких CDN, а з базою даних спілкується через безпечний API."
      }
    ]
  },
  ru: {
    stackTag: "Решения E-commerce",
    stackTitle: "Современные архитектуры для интернет-магазинов",
    stackSub: "Не существует единого решения для всех. Выберите оптимальный технологический стек для максимальной конверсии и SEO вместе с нами.",
    faqTag: "Вопросы и ответы",
    faqTitle: "FAQ – Интернет-магазины автозапчастей",
    faqSub: "Все, что вам нужно знать о внедрении современных платформ электронной коммерции в автомобильной сфере.",
    stacks: [
      {
        name: "Headless WooCommerce (Next.js + WordPress)",
        desc: "Оптимальное сочетание знакомой административной системы со сверхбыстрым фронтендом. Предназначено для малых и средних магазинов.",
        benefit: "Время загрузки страницы PWA менее 0,5 с, отсутствие сбоев базы данных при пиковом трафике.",
        cost: "Низкий / Средний"
      },
      {
        name: "Headless Shopify (Next.js + Shopify API)",
        desc: "Использование стабильного облака транзакций Shopify с ультрабыстрым фронтендом Next.js. Мы обходим ограничения шаблонов и структуры ссылок Shopify.",
        benefit: "Свободный дизайн URL-путей для многоязычного SEO, полный контроль над CSS и метаданными.",
        cost: "Средний / Высокий"
      },
      {
        name: "PrestaShop + PWA Frontend",
        desc: "Современный движок e-commerce, интегрированный с вашими складскими системами (ERP), подключенный к клиентскому PWA. Идеально для оптовой торговли.",
        benefit: "Стабильное управление запасами в сочетании с отсутствием задержек фильтрации тысяч автозапчастей.",
        cost: "Средний"
      },
      {
        name: "Специализированный магазин Django/Python",
        desc: "Полностью кастомные системы продаж, созданные с нуля по спецификации клиента. Идеально для конфигураторов и заводских интеграций.",
        benefit: "Несравненная безопасность, высокая скорость SQL-запросов при поиске по VIN и полная масштабируемость.",
        cost: "Высокий"
      }
    ],
    faqs: [
      {
        q: "Почему скорость загрузки страницы так важна для магазина запчастей?",
        a: "Клиенты, ищущие запчасти, часто делают это в спешке на мобильных устройствах. Каждая секунда задержки резко увеличивает показатель отказов. Наши PWA на Next.js достигают показателей почти 100/100, что улучшает поисковые позиции и конверсию."
      },
      {
        q: "Переведена ли база данных автозапчастей?",
        a: "Да, наша база данных полностью интегрирована с категориями Allegro и переведена на 5 языков (EN, DE, UK, RU, ZH). Это позволяет мгновенно запустить многоязычное SEO без дополнительных затрат на перевод."
      },
      {
        q: "Какова разница между архитектурой Headless и классическими WooCommerce или PrestaShop?",
        a: "В классических системах сервер должен одновременно создавать вид страницы и обрабатывать покупки, что замедляет работу сайта. В архитектуре Headless фронтенд (Next.js) заранее сгенерирован и загружается с быстрых CDN, а с базой данных общается через безопасный API."
      }
    ]
  },
  zh: {
    stackTag: "电商解决方案",
    stackTitle: "现代电商建站架构选择",
    stackSub: "没有适合所有人的单一方案。与我们一起选择最佳的技术栈，以确保最大的转化率和 SEO 表现。",
    faqTag: "常见问题解答",
    faqTitle: "FAQ – 汽配在线商城搭建",
    faqSub: "关于在汽车出行和配件行业实施现代化电子商务平台，您需要了解的一切。",
    stacks: [
      {
        name: "Headless WooCommerce (Next.js + WordPress)",
        desc: "将熟悉的管理后台与极速的 Next.js 前端完美结合。非常适合刚刚步入电商领域的中小型实体汽配店。",
        benefit: "PWA 页面加载时间低于 0.5s，在大流量并发时避免 WooCommerce 数据库堵塞挂掉。",
        cost: "低 / 中"
      },
      {
        name: "Headless Shopify (Next.js + Shopify API)",
        desc: "利用 Shopify 的交易稳定和出海生态，搭配 Next.js 自建极速前端。避开 Shopify 模版及链接结构限制。",
        benefit: "可为多语言 SEO 自由配置 URL 路径，对 CSS 与元数据实现完全的控制。",
        cost: "中 / 高（包含 Shopify 佣金）"
      },
      {
        name: "PrestaShop + PWA 前端",
        desc: "成熟的 PrestaShop 后台与企业现有的 ERP/进销存库存系统直接对接，前端使用 Next.js 极速渲染。适合汽配批发商。",
        benefit: "强大的进销存数据处理能力，同时保障客户端筛选数万配件时做到零延迟。",
        cost: "中"
      },
      {
        name: "Django/Python 定制化独立站",
        desc: "完全基于客户具体业务流和工业级需求自研开发。适用于大型复杂的产品配适器、计算器和整车厂对接。",
        benefit: "顶级的数据安全性，面对海量 VIN 码反查时具备优异的 SQL 复杂查询性能，且拥有极高扩展度。",
        cost: "高"
      }
    ],
    faqs: [
      {
        q: "为什么网页打开速度（PageSpeed）对汽配电商商城如此关键？",
        a: "找配件的买家（通常是车主或汽修厂技师）很多是在手机上紧急操作的。每延迟一秒都会成倍增加跳出率。我们的 Next.js PWA 页面通常能达到接近 100/100 的 PageSpeed 评分，极大提升谷歌排名和成单转化。"
      },
      {
        q: "随项目赠送预置的汽配数据库完成多语言翻译了吗？",
        a: "是的，我们的汽配大库已全面完成与 Allegro 类目映射，并已完整翻译为 5 种语言（波兰语、英语、德语、乌克兰语、俄语、中文）。这使您可以立刻启动全球跨境 SEO 推广，无需任何人工翻译费用。"
      },
      {
        q: "前后端分离（Headless）与传统的 WooCommerce/PrestaShop 整站开发有何区别？",
        a: "传统整站开发下，服务器需要一边读取数据库一边实时渲染页面，这会导致访问卡顿。而在 Headless 架构下，Next.js 页面在构建时就已经静态渲染好了，部署在全球 CDN 上，只在购物车或付款等关键环节通过 API 传输数据，速度快且安全。"
      }
    ]
  }
} as const;

interface PageProps {
  params: Promise<{
    lang: string;
    city: string;
    industry: string;
    profession: string;
  }>;
  searchParams: Promise<{
    carBrand?: string;
    carModel?: string;
    carSeries?: string;
  }>;
}

export async function generateStaticParams() {
  const langs = ['pl', 'en', 'de', 'uk', 'ru', 'zh'];
  const cities = [
    'all',
    'bemowo', 'bialoleka', 'bielany', 'mokotow', 'ochota', 'praga-poludnie', 'praga-polnoc',
    'rembertow', 'srodmiescie', 'targowek', 'ursus', 'ursynow', 'wawer', 'wesola',
    'wilanow', 'wlochy', 'wola', 'zoliborz',
    'legionowo', 'jablonna', 'otwock', 'jozefow', 'piaseczno', 'konstancin-jeziorna',
    'pruszkow', 'piastow', 'zabki', 'marki-miasto', 'wolomin', 'kobylka', 'zielonka',
    'sulejowek', 'grodzisk-mazowiecki', 'nowy-dwor-mazowiecki', 'minsk-mazowiecki',
    'lomianki', 'ozarow-mazowiecki', 'nadarzyn', 'warszawa'
  ];
  const industriesList = ['doctor', 'lawyer', 'psychologist', 'accountant', 'architect', 'construction', 'beauty', 'automotive', 'gastronomy', 'transport', 'ecommerce', 'education'] as const;
  
  const paramsList = [];
  for (const lang of langs) {
    for (const city of cities) {
      for (const industry of industriesList) {
        const professions = industryModelsMap[industry];
        for (const profession of professions) {
          paramsList.push({ lang, city, industry, profession });
        }
      }
    }
  }
  return paramsList;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { lang, city: citySlug, industry: industryId, profession: professionId } = await params;
  const searchParamsData = await searchParams;
  const carBrandSlug = typeof searchParamsData?.carBrand === 'string' ? searchParamsData.carBrand : null;
  const carModelSlug = typeof searchParamsData?.carModel === 'string' ? searchParamsData.carModel : null;
  const carSeriesSlug = typeof searchParamsData?.carSeries === 'string' ? searchParamsData.carSeries : null;

  const industry = getIndustryById(industryId as IndustryId);
  if (!industry) return {};

  const city = citySlug === 'all' ? null : getCityBySlug(citySlug);
  const cityName = city ? city.name : 'Warszawa';
  const trans = industry.translations[lang as Locale];
  
  if (!trans) return {};

  const modelData = trans.models[professionId as ProfessionId];
  if (!modelData) return {};

  const isPl = lang === 'pl';
  const localizedProfession = modelData.name;

  // Resolve car details for contextual B2B metadata
  let carDetails = '';
  if (carBrandSlug) {
    const carBrand = getBrandBySlug(carBrandSlug);
    const carBrandName = carBrand ? carBrand.name : (carBrandSlug.charAt(0).toUpperCase() + carBrandSlug.slice(1));
    carDetails = carBrandName;
    if (carModelSlug) {
      const carModel = carBrand ? getModelBySlug(carBrand, carModelSlug) : null;
      const carModelName = carModel ? carModel.name : carModelSlug.toUpperCase();
      carDetails += ` ${carModelName}`;
      if (carSeriesSlug) {
        const decodedSeries = decodeURIComponent(carSeriesSlug);
        let seriesDisplayName = decodedSeries;
        const modelClean = carModelName.toLowerCase();
        if (seriesDisplayName.toLowerCase().startsWith(modelClean)) {
          seriesDisplayName = seriesDisplayName.slice(modelClean.length).trim();
        }
        carDetails += ` ${seriesDisplayName}`;
      }
    }
  }

  const metaTitles = {
    pl: carDetails
      ? `${localizedProfession} (${carDetails}) - Strony WWW i IT ${cityName} | webwawa.pl`
      : `Systemy IT i strony WWW dla: ${localizedProfession} - ${cityName} | webwawa.pl`,
    en: carDetails
      ? `${localizedProfession} (${carDetails}) - Websites & IT ${cityName} | webwawa.pl`
      : `Websites & IT Solutions for ${localizedProfession} - ${cityName} | webwawa.pl`,
    de: carDetails
      ? `${localizedProfession} (${carDetails}) - Webseiten & IT ${cityName} | webwawa.pl`
      : `IT-Systeme und Webseiten für: ${localizedProfession} - ${cityName} | webwawa.pl`,
    uk: carDetails
      ? `${localizedProfession} (${carDetails}) - Сайти та IT-послуги ${cityName} | webwawa.pl`
      : `IT-системи та сайти для: ${localizedProfession} - ${cityName} | webwawa.pl`,
    ru: carDetails
      ? `${localizedProfession} (${carDetails}) - Сайты и IT-услуги ${cityName} | webwawa.pl`
      : `IT-системы и сайты для: ${localizedProfession} - ${cityName} | webwawa.pl`,
    zh: carDetails
      ? `${localizedProfession} (${carDetails}) - 网站与 IT 服务 ${cityName} | webwawa.pl`
      : `${localizedProfession}专属 IT 系统与 网站建设 - ${cityName} | webwawa.pl`
  };

  const metaDescriptions = {
    pl: carDetails
      ? `Projektowanie stron i systemów IT dla: ${localizedProfession} dedykowanych dla samochodów ${carDetails} w lokalizacji ${cityName}.`
      : `Projektowanie profesjonalnych stron WordPress, szybkich aplikacji PWA i lokalne pozycjonowanie SEO dla profesji: ${localizedProfession} w lokalizacji ${cityName}. Sprawdź ofertę.`,
    en: carDetails
      ? `Web design and IT systems for ${localizedProfession} customized for ${carDetails} vehicles in ${cityName}.`
      : `Custom WordPress sites, PWA applications, and local map SEO rankings for ${localizedProfession} in ${cityName}. Attract clients today.`,
    de: carDetails
      ? `Webdesign und IT-Systeme für: ${localizedProfession}, angepasst für ${carDetails}-Fahrzeuge in ${cityName}.`
      : `Professionelles WordPress-Webdesign, schnelle PWA-Anwendungen und lokales SEO für die Spezialisierung: ${localizedProfession} in ${cityName}. Angebot ansehen.`,
    uk: carDetails
      ? `Розробка сайтів та IT-систем для: ${localizedProfession}, адаптованих під автомобілі ${carDetails} у ${cityName}.`
      : `Розробка професійних сайтів WordPress, швидких додатків PWA та локальне просування SEO для спеціалізації: ${localizedProfession} у ${cityName}. Переглянути пропозицію.`,
    ru: carDetails
      ? `Разработка сайтов и IT-систем для: ${localizedProfession}, адаптированных под автомобили ${carDetails} в ${cityName}.`
      : `Разработка профессиональных сайтов WordPress, быстрых приложений PWA и локальное продвижение SEO для специализации: ${localizedProfession} в ${cityName}. Посмотреть предложение.`,
    zh: carDetails
      ? `在 ${cityName} 专为 ${localizedProfession} 设计并针对 ${carDetails} 车辆优化的网站与 IT 系统。`
      : `为在 ${cityName} 的 ${localizedProfession} 行业提供专业的 WordPress 网站设计、极速 PWA 应用开发和本地地图 SEO 排名优化。查看报价。`
  };

  const title = metaTitles[lang as Locale] || metaTitles.en;
  const description = metaDescriptions[lang as Locale] || metaDescriptions.en;

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  const parentSlug = lang === 'pl' ? 'strona-dla' : 
                     lang === 'en' ? 'website-for' : 
                     lang === 'de' ? 'webseite-fuer' : 
                     lang === 'uk' ? 'sayt-dlya' : 
                     lang === 'ru' ? 'sayt-dlya' : 'website-for';
  const canonicalUrl = citySlug === 'all'
    ? `https://webwawa.pl${langPrefix}/${parentSlug}/${industrySlugsMap[industryId as IndustryId][lang as Locale]}/${professionSlugsMap[professionId as ProfessionId][lang as Locale]}`
    : `https://webwawa.pl${langPrefix}/${citySlug}/${industrySlugsMap[industryId as IndustryId][lang as Locale]}/${professionSlugsMap[professionId as ProfessionId][lang as Locale]}`;

  let imageUrl = `https://webwawa.pl/images/industries/${industryId}/${professionId}.png`;
  const modelSvgPath = path.join(process.cwd(), 'public', 'images', 'industries', industryId, `${professionId}.svg`);
  if (fs.existsSync(modelSvgPath)) {
    imageUrl = `https://webwawa.pl/images/industries/${industryId}/${professionId}.svg`;
  } else {
    const modelPngPath = path.join(process.cwd(), 'public', 'images', 'industries', industryId, `${professionId}.png`);
    if (!fs.existsSync(modelPngPath)) {
      const mainSvgPath = path.join(process.cwd(), 'public', 'images', 'industries', industryId, 'main.svg');
      if (fs.existsSync(mainSvgPath)) {
        imageUrl = `https://webwawa.pl/images/industries/${industryId}/main.svg`;
      } else {
        imageUrl = `https://webwawa.pl/images/industries/${industryId}/main.png`;
      }
    }
  }

  const brandLogo = carBrandSlug ? getBrandLogo(carBrandSlug) : null;
  const wikiData = carBrandSlug && carModelSlug ? getWikiData(carBrandSlug, carModelSlug) : null;
  const finalImageUrl = wikiData?.specs?.motofaktyImage || wikiData?.wiki?.imageUrl;

  const brandLogoUrl = brandLogo ? (brandLogo.startsWith('http') ? brandLogo : `https://webwawa.pl${brandLogo}`) : null;
  const ogImages = [];
  if (finalImageUrl) {
    ogImages.push({
      url: finalImageUrl,
      width: 1200,
      height: 630,
      alt: title,
    });
  }
  if (brandLogoUrl) {
    ogImages.push({
      url: brandLogoUrl,
      width: 400,
      height: 400,
      alt: `${carBrandSlug} Logo`,
    });
  }
  if (ogImages.length === 0) {
    ogImages.push({
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: title,
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
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map(img => img.url),
    }
  };
}

export default async function IndustryModelPage({ params, searchParams }: PageProps) {
  const { lang, city: citySlug, industry: industryId, profession: professionId } = await params;
  const searchParamsData = await searchParams;
  const carBrandSlug = typeof searchParamsData?.carBrand === 'string' ? searchParamsData.carBrand : null;
  const carModelSlug = typeof searchParamsData?.carModel === 'string' ? searchParamsData.carModel : null;
  const carSeriesSlug = typeof searchParamsData?.carSeries === 'string' ? searchParamsData.carSeries : null;

  const industry = getIndustryById(industryId as IndustryId);
  if (!industry) notFound();

  const city = citySlug === 'all' ? null : getCityBySlug(citySlug);
  if (citySlug !== 'all' && !city) notFound();

  const trans = industry.translations[lang as Locale];
  if (!trans) notFound();

  const modelData = trans.models[professionId as ProfessionId];
  if (!modelData) notFound();

  const settings = await getGlobalSettings();
  const dict = await getDictionary(lang as Locale);
  const isPl = lang === 'pl';
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  const cityName = city ? city.name : (isPl ? 'Warszawa / cała Polska' : 'Warsaw');

  // Full multilingual UI strings
  const uiStrings = {
    pl: {
      h1Prefix: 'Projektowanie i SEO dla:',
      heroSubWith: (name: string, car: string, city: string) => `Tworzenie dedykowanych rozwiązań internetowych oraz pozycjonowanie specjalizacji ${name} dla pojazdów ${car} w regionie ${city}.`,
      heroSubWithout: (name: string, city: string) => `Tworzenie dedykowanych rozwiązań internetowych oraz pozycjonowanie specjalizacji ${name} w regionie ${city}.`,
      profBadge: 'Specyfika profesji',
      profHeading: (name: string) => `Jak rozwinąć specjalizację ${name}?`,
      vehicleContext: 'Kontekst pojazdu:',
      vehicleDisclaimer: (car: string) => `*Powyższa specyfikacja modelu służy zasileniu parametrów semantycznych pod kątem pozycjonowania SEO oferty dedykowanej dla aut ${car}.`,
      googleRankHeading: 'Co wpływa najbardziej na pozycję w Google?',
      implementationHeading: 'Wymagania i standardy wdrożenia:',
      dedicatedServices: 'Dedykowane Usługi',
      seeDetails: 'Zobacz szczegóły oferty',
      brandsHeading: (prof: string) => `${prof} – inne marki samochodowe`,
      servicesHeading: (brand: string) => `Inne usługi IT dla branży motoryzacyjnej${brand ? ` (${brand})` : ''}`,
      citiesHeading: 'Ta sama usługa w innych dzielnicach i miastach',
      disclaimer: 'webwawa.pl – projektujemy strony WWW i systemy IT dla branży motoryzacyjnej w Warszawie i okolicach. Powyższe linki prowadzą do dedykowanych ofert dla poszczególnych marek, specjalizacji i lokalizacji.',
    },
    en: {
      h1Prefix: 'Web Design & SEO for:',
      heroSubWith: (name: string, car: string, city: string) => `Designing custom digital products and high-ranking local SEO for ${name} specialized for ${car} vehicles in ${city}.`,
      heroSubWithout: (name: string, city: string) => `Designing custom digital products and high-ranking local SEO for ${name} in ${city}.`,
      profBadge: 'Profession overview',
      profHeading: (name: string) => `How to grow your ${name} business?`,
      vehicleContext: 'Vehicle context:',
      vehicleDisclaimer: (car: string) => `*The above vehicle description enriches the semantic context for SEO ranking of our solutions dedicated for ${car} vehicles.`,
      googleRankHeading: 'Key factors affecting Google rankings:',
      implementationHeading: 'Implementation standards & requirements:',
      dedicatedServices: 'Dedicated Services',
      seeDetails: 'See service details',
      brandsHeading: (prof: string) => `${prof} – other car brands`,
      servicesHeading: (brand: string) => `Other IT services for automotive${brand ? ` (${brand})` : ''}`,
      citiesHeading: 'Same service in other districts & cities',
      disclaimer: 'webwawa.pl – we build websites & IT systems for the automotive industry in Warsaw and surrounding area.',
    },
    de: {
      h1Prefix: 'Webdesign & SEO für:',
      heroSubWith: (name: string, car: string, city: string) => `Wir entwickeln maßgeschneiderte digitale Lösungen und lokales SEO für ${name} spezialisiert auf ${car}-Fahrzeuge in ${city}.`,
      heroSubWithout: (name: string, city: string) => `Maßgeschneiderte Webentwicklung und lokales SEO für ${name} in ${city}.`,
      profBadge: 'Berufsübersicht',
      profHeading: (name: string) => `Wie wächst Ihr ${name}-Unternehmen?`,
      vehicleContext: 'Fahrzeugkontext:',
      vehicleDisclaimer: (car: string) => `*Die obige Fahrzeugbeschreibung dient der semantischen Anreicherung für das SEO-Ranking unserer Lösungen für ${car}-Fahrzeuge.`,
      googleRankHeading: 'Wichtige Google-Rankingfaktoren:',
      implementationHeading: 'Implementierungsstandards & Anforderungen:',
      dedicatedServices: 'Dedizierte Dienste',
      seeDetails: 'Details anzeigen',
      brandsHeading: (prof: string) => `${prof} – andere Automarken`,
      servicesHeading: (brand: string) => `Weitere IT-Dienste für die Automobilbranche${brand ? ` (${brand})` : ''}`,
      citiesHeading: 'Gleicher Service in anderen Bezirken & Städten',
      disclaimer: 'webwawa.pl – wir entwickeln Websites & IT-Systeme für die Automobilbranche in Warschau und Umgebung.',
    },
    uk: {
      h1Prefix: 'Веб-дизайн та SEO для:',
      heroSubWith: (name: string, car: string, city: string) => `Розробка індивідуальних цифрових рішень та локальне SEO для ${name} з орієнтацією на автомобілі ${car} у ${city}.`,
      heroSubWithout: (name: string, city: string) => `Розробка індивідуальних веб-рішень та локальне SEO для ${name} у ${city}.`,
      profBadge: 'Огляд спеціалізації',
      profHeading: (name: string) => `Як розвивати бізнес у сфері ${name}?`,
      vehicleContext: 'Контекст автомобіля:',
      vehicleDisclaimer: (car: string) => `*Наведений опис автомобіля збагачує семантичний контекст для SEO-ранжування наших рішень, присвячених ${car}.`,
      googleRankHeading: 'Ключові фактори ранжування у Google:',
      implementationHeading: 'Стандарти та вимоги впровадження:',
      dedicatedServices: 'Спеціалізовані послуги',
      seeDetails: 'Дивитися деталі',
      brandsHeading: (prof: string) => `${prof} – інші автомобільні марки`,
      servicesHeading: (brand: string) => `Інші IT-послуги для автомобільної галузі${brand ? ` (${brand})` : ''}`,
      citiesHeading: 'Та сама послуга в інших районах і містах',
      disclaimer: 'webwawa.pl – розробляємо сайти та IT-системи для автомобільного бізнесу у Варшаві та регіоні.',
    },
    ru: {
      h1Prefix: 'Веб-дизайн и SEO для:',
      heroSubWith: (name: string, car: string, city: string) => `Разработка индивидуальных цифровых решений и локальное SEO для ${name} с ориентацией на автомобили ${car} в ${city}.`,
      heroSubWithout: (name: string, city: string) => `Разработка индивидуальных веб-решений и локальное SEO для ${name} в ${city}.`,
      profBadge: 'Обзор специализации',
      profHeading: (name: string) => `Как развивать бизнес в сфере ${name}?`,
      vehicleContext: 'Контекст автомобиля:',
      vehicleDisclaimer: (car: string) => `*Описание автомобиля обогащает семантический контекст для SEO-ранжирования наших решений, посвящённых ${car}.`,
      googleRankHeading: 'Ключевые факторы ранжирования в Google:',
      implementationHeading: 'Стандарты и требования внедрения:',
      dedicatedServices: 'Специализированные услуги',
      seeDetails: 'Смотреть детали',
      brandsHeading: (prof: string) => `${prof} – другие автомобильные марки`,
      servicesHeading: (brand: string) => `Другие IT-услуги для автомобильной отрасли${brand ? ` (${brand})` : ''}`,
      citiesHeading: 'Та же услуга в других районах и городах',
      disclaimer: 'webwawa.pl – разрабатываем сайты и IT-системы для автомобильного бизнеса в Варшаве и регионе.',
    },
    zh: {
      h1Prefix: '网页设计与SEO：',
      heroSubWith: (name: string, car: string, city: string) => `为${city}专注${car}车型的${name}企业提供定制数字解决方案及本地SEO优化服务。`,
      heroSubWithout: (name: string, city: string) => `为${city}的${name}企业提供定制网站开发与本地SEO排名服务。`,
      profBadge: '专业概览',
      profHeading: (name: string) => `如何发展您的${name}业务？`,
      vehicleContext: '车辆背景：',
      vehicleDisclaimer: (car: string) => `*以上车辆描述用于丰富我们面向${car}车型解决方案的语义SEO优化背景。`,
      googleRankHeading: 'Google排名关键因素：',
      implementationHeading: '实施标准与要求：',
      dedicatedServices: '专属服务',
      seeDetails: '查看服务详情',
      brandsHeading: (prof: string) => `${prof} – 其他汽车品牌`,
      servicesHeading: (brand: string) => `其他汽车行业IT服务${brand ? `（${brand}）` : ''}`,
      citiesHeading: '同一服务覆盖其他区域与城市',
      disclaimer: 'webwawa.pl – 为华沙及周边地区汽车行业提供网站开发与IT系统服务。',
    },
  };
  const t = uiStrings[lang as keyof typeof uiStrings] || uiStrings.en;

  // Resolve car details for contextual B2B customizations
  let carDetails = '';
  if (carBrandSlug) {
    const carBrand = getBrandBySlug(carBrandSlug);
    const carBrandName = carBrand ? carBrand.name : (carBrandSlug.charAt(0).toUpperCase() + carBrandSlug.slice(1));
    carDetails = carBrandName;
    if (carModelSlug) {
      const carModel = carBrand ? getModelBySlug(carBrand, carModelSlug) : null;
      const carModelName = carModel ? carModel.name : carModelSlug.toUpperCase();
      carDetails += ` ${carModelName}`;
      if (carSeriesSlug) {
        const decodedSeries = decodeURIComponent(carSeriesSlug);
        let seriesDisplayName = decodedSeries;
        const modelClean = carModelName.toLowerCase();
        if (seriesDisplayName.toLowerCase().startsWith(modelClean)) {
          seriesDisplayName = seriesDisplayName.slice(modelClean.length).trim();
        }
        carDetails += ` ${seriesDisplayName}`;
      }
    }
  }

  const wikiData = carBrandSlug && carModelSlug ? getWikiData(carBrandSlug, carModelSlug) : null;
  const finalImageUrl = wikiData?.specs?.motofaktyImage || wikiData?.wiki?.imageUrl;
  const brandLogo = carBrandSlug ? getBrandLogo(carBrandSlug) : null;

  let imageRelativePath = `/images/industries/${industryId}/${professionId}.svg`;
  let imageFileSystemPath = path.join(process.cwd(), 'public', imageRelativePath);
  if (!fs.existsSync(imageFileSystemPath)) {
    imageRelativePath = `/images/industries/${industryId}/${professionId}.png`;
    imageFileSystemPath = path.join(process.cwd(), 'public', imageRelativePath);
  }
  
  let heroImageSrc = '/images/workspace_code.png';
  if (finalImageUrl) {
    heroImageSrc = finalImageUrl;
  } else if (fs.existsSync(imageFileSystemPath)) {
    heroImageSrc = imageRelativePath;
  } else {
    const mainSvgPath = `/images/industries/${industryId}/main.svg`;
    if (fs.existsSync(path.join(process.cwd(), 'public', mainSvgPath))) {
      heroImageSrc = mainSvgPath;
    } else {
      const mainPngPath = `/images/industries/${industryId}/main.png`;
      if (fs.existsSync(path.join(process.cwd(), 'public', mainPngPath))) {
        heroImageSrc = mainPngPath;
      }
    }
  }

  const industrySlug = industrySlugsMap[industryId as IndustryId][lang as Locale];
  const professionSlug = professionSlugsMap[professionId as ProfessionId][lang as Locale];

  const parentSlug = lang === 'pl' ? 'strona-dla' : 
                     lang === 'en' ? 'website-for' : 
                     lang === 'de' ? 'webseite-fuer' : 
                     lang === 'uk' ? 'sayt-dlya' : 
                     lang === 'ru' ? 'sayt-dlya' : 'website-for';

  const parentLabelMap = {
    pl: 'Strona dla',
    en: 'Website for',
    de: 'Webseite für',
    uk: 'Сайт для',
    ru: 'Сайт для',
    zh: '网站适用'
  };
  const parentLabel = parentLabelMap[lang as Locale] || 'Website for';

  const brandUrl = city 
    ? `${lang === 'pl' ? '' : '/' + lang}/${city.slug}/${industrySlug}`
    : `${lang === 'pl' ? '' : '/' + lang}/${parentSlug}/${industrySlug}`;

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${modelData.name} - Usługi IT & Marketing`,
    "description": modelData.about,
    "image": `https://webwawa.pl/images/industries/${industryId}/${professionId}.png`,
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
      ...(city 
        ? [
            {
              "@type": "ListItem",
              "position": 2,
              "name": city.name,
              "item": `https://webwawa.pl${langPrefix}/${city.slug}`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": trans.industryName,
              "item": `https://webwawa.pl${langPrefix}/${city.slug}/${industrySlug}`
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": modelData.name,
              "item": `https://webwawa.pl${langPrefix}/${city.slug}/${industrySlug}/${professionSlug}`
            }
          ]
        : [
            {
              "@type": "ListItem",
              "position": 2,
              "name": parentLabel,
              "item": `https://webwawa.pl${langPrefix}/${parentSlug}`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": trans.industryName,
              "item": `https://webwawa.pl${langPrefix}/${parentSlug}/${industrySlug}`
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": modelData.name,
              "item": `https://webwawa.pl${langPrefix}/${parentSlug}/${industrySlug}/${professionSlug}`
            }
          ]
      )
    ]
  };

  const ecomUi = ECOMMERCE_UI[lang as keyof typeof ECOMMERCE_UI] || ECOMMERCE_UI.pl;

  const faqJsonLd = professionId === 'carParts' ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": ecomUi.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors duration-300">
<Script
          id={`ldjson-model-${industryId}-${professionId}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify([jsonLd, breadcrumbListJsonLd, faqJsonLd].filter(Boolean)) 
          }}
        />

      {/* Hero Section */}
      <section className="bg-slate-100 dark:bg-slate-900 py-20 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-left">
              {/* Breadcrumbs */}
              <nav className="flex mb-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <Link href={homeUrl} className="hover:text-primary transition-colors">Home</Link>
                <span className="mx-2">/</span>
                {city ? (
                  <>
                    <Link href={`${lang === 'pl' ? '' : '/' + lang}/${city.slug}`} className="hover:text-primary transition-colors">{city.name}</Link>
                    <span className="mx-2">/</span>
                  </>
                ) : null}
                <Link href={brandUrl} className="hover:text-primary transition-colors">{trans.industryName}</Link>
                <span className="mx-2">/</span>
                <span className="text-primary font-semibold">{modelData.name}</span>
              </nav>

              <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-6 flex items-center gap-4 flex-wrap">
                {brandLogo && (
                  <img src={brandLogo} alt={`${carBrandSlug} Logo`} className="h-12 w-auto object-contain dark:invert" />
                )}
                <span>{t.h1Prefix} <span className="gradient-text">{modelData.name}</span>{carDetails ? <span className="text-primary"> {carDetails}</span> : ''} - {cityName}</span>
              </h1>
              <p className="text-xl opacity-80 leading-relaxed text-slate-650 dark:text-slate-350">
                {carDetails
                  ? t.heroSubWith(modelData.name, carDetails, cityName)
                  : t.heroSubWithout(modelData.name, cityName)}
              </p>
            </div>
            <div className="lg:col-span-5 relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/40">
              <img 
                src={heroImageSrc} 
                alt={modelData.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Specialization Details */}
      <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-900/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-7 space-y-6">
              <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                {t.profBadge}
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.profHeading(modelData.name)}
              </h2>
              <p className="text-slate-650 dark:text-slate-400 leading-relaxed">
                {modelData.about}
              </p>

              {wikiData?.wiki?.description && (
                <div className="bg-slate-50 dark:bg-slate-950/20 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 my-6 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 uppercase">
                    {t.vehicleContext} {carDetails}
                  </h3>
                  <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                    {typeof wikiData.wiki.description === 'string' 
                      ? wikiData.wiki.description 
                      : (wikiData.wiki.description[lang] || wikiData.wiki.description.pl)}
                  </p>
                  <div className="mt-4 text-xs font-bold text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
                    {t.vehicleDisclaimer(carDetails)}
                  </div>
                </div>
              )}
              
              <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-2 text-primary">
                  {t.googleRankHeading}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-455 leading-relaxed">
                  {modelData.focus}
                </p>
              </div>

              {/* Specifications checklist */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-900/60 mt-8">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {t.implementationHeading}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {modelData.specifications.map((spec, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 items-start hover:text-slate-900 dark:hover:text-white transition-colors duration-200">
                      <span className="text-primary mt-0.5 flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Services navigation */}
            <div className="md:col-span-5 glass-card relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
              <h3 className="font-black text-xl mb-6 uppercase tracking-tight text-slate-900 dark:text-white">
                {t.dedicatedServices}
              </h3>
              <div className="space-y-4">
                {Object.entries(trans.series).map(([seriesKey, val]) => {
                  const serviceSlug = serviceSlugsMap[seriesKey as keyof typeof serviceSlugsMap][lang as Locale];
                  let serviceUrl = '';
                  if (carBrandSlug) {
                    serviceUrl = `${langPrefix}/${parentSlug}/${industrySlug}/${professionSlug}/${citySlug}/${carBrandSlug}`;
                    if (carModelSlug) {
                      serviceUrl += `/${carModelSlug}`;
                      if (carSeriesSlug) {
                        serviceUrl += `/${carSeriesSlug}`;
                      }
                    }
                    serviceUrl += `/${serviceSlug}`;
                  } else {
                    serviceUrl = city 
                      ? `${langPrefix}/${city.slug}/${industrySlug}/${professionSlug}/${serviceSlug}`
                      : `${langPrefix}/${parentSlug}/${industrySlug}/${professionSlug}/${serviceSlug}`;
                  }

                  return (
                    <div key={seriesKey} className="border-b border-slate-200 dark:border-slate-800/80 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-md">{val.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">{val.desc}</p>
                      <Link 
                        href={serviceUrl} 
                        className="text-primary text-xs font-bold hover:underline inline-flex items-center gap-1 mt-2.5"
                      >
                        {t.seeDetails} &rarr;
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {professionId === 'carParts' && (
        <>
          {/* 1. Parts Search Demo */}
          <section className="py-20 bg-slate-50 dark:bg-slate-900/10 border-t border-slate-200 dark:border-slate-900/40">
            <div className="container mx-auto px-4 max-w-5xl">
              <PartsSearchDemo lang={lang} />
            </div>
          </section>

          {/* 2. E-commerce Stack Showcase */}
          <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-900/40">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="text-center mb-16">
                <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                  {ecomUi.stackTag}
                </span>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-4">
                  {ecomUi.stackTitle}
                </h2>
                <p className="text-slate-650 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                  {ecomUi.stackSub}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {ecomUi.stacks.map((stack, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05] rounded-3xl relative overflow-hidden group hover:border-primary/45 transition-colors shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl p-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-xl">
                        {idx === 0 ? '🔌' : idx === 1 ? '🛍️' : idx === 2 ? '⚙️' : '🐍'}
                      </span>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                        {stack.name}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {stack.desc}
                    </p>
                    <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-2xl border border-primary/10 text-xs font-semibold">
                      <span className="text-primary uppercase tracking-wider font-bold block mb-1">Kluczowa Zaleta SEO:</span>
                      <span className="text-slate-700 dark:text-slate-350">{stack.benefit}</span>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">
                      <span>Koszt wdrożenia:</span>
                      <span className="text-primary">{stack.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. FAQ Section */}
          <section className="py-20 bg-slate-50 dark:bg-slate-900/10 border-t border-slate-200 dark:border-slate-900/40">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-12">
                <span className="inline-block py-1 px-4 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
                  {ecomUi.faqTag}
                </span>
                <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-4">
                  {ecomUi.faqTitle}
                </h2>
                <p className="text-slate-650 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                  {ecomUi.faqSub}
                </p>
              </div>

              <div className="space-y-6">
                {ecomUi.faqs.map((faq, idx) => (
                  <div key={idx} className="p-6 bg-white dark:bg-[#070b19] border border-slate-200/80 dark:border-white/[0.05] rounded-3xl shadow-sm hover:border-primary/20 transition-all duration-300">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-3 flex items-start gap-2.5">
                      <span className="text-primary font-black text-lg">Q:</span>
                      <span>{faq.q}</span>
                    </h3>
                    <div className="text-sm text-slate-650 dark:text-slate-455 leading-relaxed pl-7 flex items-start gap-2.5">
                      <span className="text-emerald-500 font-black text-lg">A:</span>
                      <span>{faq.a}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Formularz Kontaktowy */}
      <section id="kontakt" className="py-20 bg-slate-100 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <ContactForm 
            lang={lang} 
            defaultCity={city ? city.name : 'Warszawa'} 
            settings={settings} 
            dict={dict.form} 
          />
        </div>
      </section>

      {/* SEO Tag Cloud – Automotive */}
      {industryId === 'automotive' && (
        <section className="py-14 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900/50">
          <div className="container mx-auto px-4 max-w-5xl space-y-10">

            {/* Block 1: Same profession, other car brands */}
            {carBrandSlug && (() => {
              const allBrands = getAllBrands();
              const relatedBrands = POPULAR_BRAND_SLUGS
                .filter(s => s !== carBrandSlug)
                .map(s => {
                  const found = allBrands.find(b => b.slug === s || b.slug.includes(s) || s.includes(b.slug));
                  if (!found) return null;
                  return { name: found.name, slug: found.slug, logo: getBrandLogo(found.slug) };
                })
                .filter(Boolean) as { name: string; slug: string; logo: string | null }[];

              if (relatedBrands.length === 0) return null;
              return (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">🔗</span>
                    <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
                      {t.brandsHeading(professionSlugsMap[professionId as ProfessionId]?.[lang as Locale] || modelData.name)}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {relatedBrands.map((rb) => (
                      <Link
                        key={rb.slug}
                        href={`${langPrefix}/${parentSlug}/${industrySlug}/${professionSlug}/${rb.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                        title={`${rb.name} – ${trans.models[professionId as ProfessionId]?.name || professionId}`}
                      >
                        {rb.logo && (
                          <img src={rb.logo} alt={rb.name} className="h-3.5 w-auto object-contain dark:invert" loading="lazy" />
                        )}
                        {rb.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Block 2: Other automotive professions for current brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">⚙️</span>
                <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
                  {t.servicesHeading(carBrandSlug ? (carBrandSlug.charAt(0).toUpperCase() + carBrandSlug.slice(1).replace(/-/g, ' ')) : '')}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {AUTOMOTIVE_PROFESSIONS
                  .filter(p => p.id !== professionId)
                  .map(prof => {
                    const profSlug = professionSlugsMap[prof.id as ProfessionId]?.[lang as Locale] || prof.slugPl;
                    const href = carBrandSlug
                      ? `${langPrefix}/${parentSlug}/${industrySlug}/${profSlug}/${carBrandSlug}${carModelSlug ? '/' + carModelSlug : ''}`
                      : `${langPrefix}/${parentSlug}/${industrySlug}/${profSlug}`;
                    const profName = trans.models[prof.id as ProfessionId]?.name || profSlug;
                    return (
                      <Link
                        key={prof.id}
                        href={href}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                      >
                        <span>{prof.emojiIcon}</span>
                        <span>{profName}</span>
                      </Link>
                    );
                  })}
              </div>
            </div>

            {/* Block 3: Same profession + brand across key cities */}
            {carBrandSlug && (() => {
              const keyCities = [
                { slug: 'warszawa', name: 'Warszawa' },
                { slug: 'mokotow', name: 'Mokotów' },
                { slug: 'wola', name: 'Wola' },
                { slug: 'srodmiescie', name: 'Śródmieście' },
                { slug: 'ursynow', name: 'Ursynów' },
                { slug: 'bialoleka', name: 'Białołęka' },
                { slug: 'legionowo', name: 'Legionowo' },
                { slug: 'pruszkow', name: 'Pruszków' },
                { slug: 'piaseczno', name: 'Piaseczno' },
                { slug: 'otwock', name: 'Otwock' },
              ];
              return (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">📍</span>
                    <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
                      {t.citiesHeading}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {keyCities.map(kc => (
                      <Link
                        key={kc.slug}
                        href={`${langPrefix}/${kc.slug}/${industrySlug}/${professionSlug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                      >
                        <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                        {kc.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Webwawa disclaimer */}
            <p className="text-xs text-slate-400 dark:text-slate-600 text-center pt-2 border-t border-slate-100 dark:border-slate-900">
              {t.disclaimer}
            </p>

          </div>
        </section>
      )}
      {/* SEO Internal Link Cloud – Non-Automotive Industries */}
      {industryId !== 'automotive' && (() => {
        const mt = PROFESSION_UI[lang as keyof typeof PROFESSION_UI] || PROFESSION_UI.en;
        const relatedIds = RELATED_INDUSTRIES[industryId as IndustryId] || [];
        // Other specializations within same industry
        const siblingModels = Object.entries(trans.models)
          .filter(([k]) => k !== professionId)
          .map(([k, v]) => ({
            id: k as ProfessionId,
            name: v.name,
            slug: professionSlugsMap[k as ProfessionId]?.[lang as Locale] || k,
          }));

        return (
          <section className="py-14 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900/50">
            <div className="container mx-auto px-4 max-w-5xl space-y-10">

              {/* Block 1: Other specializations in same industry */}
              {siblingModels.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">📑</span>
                    <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
                      {mt.specHeading(trans.industryName)}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {siblingModels.map(sm => {
                      const href = city
                        ? `${langPrefix}/${city.slug}/${industrySlug}/${sm.slug}`
                        : `${langPrefix}/${parentSlug}/${industrySlug}/${sm.slug}`;
                      return (
                        <Link
                          key={sm.id}
                          href={href}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                        >
                          {sm.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Block 2: Same profession across Warsaw districts */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">📍</span>
                  <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
                    {mt.locationsHeading(modelData.name)}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {KEY_LOCATIONS.map(loc => (
                    <Link
                      key={loc.slug}
                      href={`${langPrefix}/${loc.slug}/${industrySlug}/${professionSlug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                    >
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {loc.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Block 3: Related industries */}
              {relatedIds.length > 0 && (() => {
                const relatedItems = relatedIds
                  .map(rid => {
                    const relInd = getIndustryById(rid);
                    if (!relInd) return null;
                    const relTrans = relInd.translations[lang as Locale];
                    if (!relTrans) return null;
                    const relSlug = industrySlugsMap[rid][lang as Locale];
                    return { name: relTrans.industryName, slug: relSlug, id: rid };
                  })
                  .filter(Boolean) as { name: string; slug: string; id: string }[];

                if (relatedItems.length === 0) return null;
                return (
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-2xl">🔗</span>
                      <h2 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white">
                        {mt.relatedHeading}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {relatedItems.map(ri => (
                        <Link
                          key={ri.id}
                          href={`${langPrefix}/${parentSlug}/${ri.slug}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-150"
                        >
                          {ri.name} →
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Disclaimer */}
              <p className="text-xs text-slate-400 dark:text-slate-600 text-center pt-2 border-t border-slate-100 dark:border-slate-900">
                {mt.disclaimer(modelData.name, trans.industryName)}
              </p>

            </div>
          </section>
        );
      })()}
    </main>
  );
}
