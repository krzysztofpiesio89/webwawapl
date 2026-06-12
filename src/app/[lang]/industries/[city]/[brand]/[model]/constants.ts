import { Locale } from '../../../../dictionaries';
import { IndustryId, ProfessionId } from '@/lib/industries-list';

// Popular car brands for SEO tag cloud internal links
export const POPULAR_BRAND_SLUGS = [
  'bmw', 'mercedes-benz', 'audi', 'volkswagen', 'toyota', 'ford',
  'opel', 'skoda', 'renault', 'peugeot', 'honda', 'hyundai',
  'kia', 'volvo', 'seat', 'mazda', 'nissan', 'fiat',
  'porsche', 'lexus', 'subaru', 'mitsubishi'
];

// All automotive professions for cross-linking
export const AUTOMOTIVE_PROFESSIONS = [
  { id: 'carRental', slugPl: 'wynajem-aut', emojiIcon: '🚗' },
  { id: 'leasing', slugPl: 'leasing-samochodowy', emojiIcon: '📋' },
  { id: 'carBuying', slugPl: 'skup-aut', emojiIcon: '💰' },
  { id: 'mechanic', slugPl: 'mechanik', emojiIcon: '🔧' },
  { id: 'carParts', slugPl: 'czesci-samochodowe', emojiIcon: '⚙️' },
] as const;

// Key Warsaw districts + nearby cities for regional SEO links (non-automotive)
export const KEY_LOCATIONS = [
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
export const RELATED_INDUSTRIES: Record<IndustryId, IndustryId[]> = {
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
export const PROFESSION_UI = {
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
export const ECOMMERCE_UI = {
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
        a: "Да, наша база данных полностью относится к категориям Allegro и переведена на 5 языков (EN, DE, UK, RU, ZH). Это позволяет мгновенно запустить многоязычное SEO без дополнительных затрат на перевод."
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
    stackSub: "没有适合所有人的单一方案。与我们一起选择最佳的技术栈，以确保最大的转化率 and SEO 表现。",
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
