import fs from 'fs';
import path from 'path';

const industriesDir = path.join(process.cwd(), 'data', 'industries');

// Database of premium, individualized technical specifications for all 41 professions in 6 languages.
const specsData = {
  // DOCTORS (15 specializations)
  gynecologist: {
    pl: [
      "Szyfrowanie formularzy medycznych zgodnie z normami RODO i HIPAA (Node.js crypto API).",
      "Integracja REST API z systemem rezerwacji wizyt medycznych ZnanyLekarz / Medfile.",
      "Autonomiczny chatbot AI do wstępnego wywiadu medycznego (symptom checker) przed wizytą.",
      "Wdrożenie szablonu Next.js z automatyczną optymalizacją czasu ładowania zdjęć USG (WebP/AVIF)."
    ],
    en: [
      "Medical forms encryption in compliance with GDPR and HIPAA standards (Node.js crypto API).",
      "REST API integration with medical booking platforms like ZnanyLekarz / Medfile.",
      "Autonomous AI symptom checker chatbot for initial medical interviews before visits.",
      "Next.js template implementation with auto-optimized loading of USG images (WebP/AVIF)."
    ],
    de: [
      "Verschlüsselung medizinischer Formulare nach DSGVO- und HIPAA-Standards (Node.js-Kryptographie-API).",
      "REST-API-Integration mit medizinischen Buchungsplattformen wie ZnanyLekarz / Medfile.",
      "Autonomer KI-Symptom-Checker-Chatbot für das erste Anamnesegespräch vor dem Arzttermin.",
      "Next.js-Implementierung mit optimierter Auslieferung von Ultraschallbildern (WebP/AVIF)."
    ],
    uk: [
      "Шифрування медичних форм відповідно до стандартів GDPR та HIPAA (Node.js crypto API).",
      "Інтеграція REST API з медичними системами запису ZnanyLekarz / Medfile.",
      "Автономний чат-бот AI для попереднього аналізу симптомів (symptom checker) перед візитом.",
      "Впровадження Next.js з автоматичною оптимізацією часу завантаження УЗД-знімків (WebP/AVIF)."
    ],
    ru: [
      "Шифрование медицинских форм в соответствии со стандартами GDPR и HIPAA (Node.js crypto API).",
      "Интеграция REST API с медицинскими системами записи ZnanyLekarz / Medfile.",
      "Автономный чат-бот AI для предварительного опроса симптомов (symptom checker) перед визитом.",
      "Внедрение Next.js с автоматической оптимизацией времени загрузки УЗИ-снимков (WebP/AVIF)."
    ],
    zh: [
      "严格符合 GDPR 和 HIPAA 标准的医疗表单加密技术（基于 Node.js 密码学 API）。",
      "与 ZnanyLekarz / Medfile 等医疗预约平台的 REST API 深度集成。",
      "用于就诊前初步病情评估（症状自测）的自主 AI 问诊聊天机器人。",
      "采用 Next.js 框架，实现超声波（USG）影像的自动优化与毫秒级加载（WebP/AVIF 格式）。"
    ]
  },
  urologist: {
    pl: [
      "Anonimowy, w pełni szyfrowany formularz wstępnej konsultacji urologicznej (TypeScript Crypto API).",
      "Integracja z autonomicznym botem telefonicznym AI (Voice Bot) do umawiania i potwierdzania wizyt.",
      "Wdrożenie struktur danych JSON-LD MedicalBusiness dla lepszego pozycjonowania w wyszukiwarkach AI.",
      "Automatyczne przypomnienia o wizytach kontrolnych i badaniach profilaktycznych przez bramkę Twilio."
    ],
    en: [
      "Anonymous, fully encrypted urological intake forms (TypeScript Crypto API).",
      "Integration with an autonomous AI Voice Bot for patient booking and appointment confirmation.",
      "Implementation of structured Schema JSON-LD MedicalBusiness for better rankings in AI search engines.",
      "Automated reminders for follow-ups and diagnostic screens via the Twilio SMS gateway."
    ],
    de: [
      "Anonymer, voll verschlüsselter urologischer Anamnesebogen (TypeScript Crypto API).",
      "Integration mit einem autonomen KI-Voice-Bot für Terminbuchungen und Bestätigungen.",
      "Implementierung strukturierter JSON-LD MedicalBusiness-Daten zur besseren Auffindbarkeit in KI-Suchmaschinen.",
      "Automatische Terminerinnerungen für Nachuntersuchungen über das Twilio-SMS-Gateway."
    ],
    uk: [
      "Анонімна, повністю зашифрована форма первинної консультації уролога (TypeScript Crypto API).",
      "Інтеграція з автономним голосовим ботом AI (Voice Bot) для запису та підтвердження візитів.",
      "Впровадження структурованих даних Schema JSON-LD MedicalBusiness для оптимізації в пошуку AI.",
      "Автоматичні нагадування про профілактичні огляди через SMS-шлюз Twilio."
    ],
    ru: [
      "Анонимная, полностью зашифрованная форма первичной консультации уролога (TypeScript Crypto API).",
      "Интеграция с автономным голосовым ботом AI (Voice Bot) для записи и подтверждения визитов.",
      "Внедрение структурированных данных Schema JSON-LD MedicalBusiness для лучшей видимости в AI-поиске.",
      "Автоматические напоминания о визитах и профилактических осмотрах через SMS-шлюз Twilio."
    ],
    zh: [
      "匿名且完全加密的尿科初步就诊表单（采用 TypeScript 密码学 API）。",
      "集成自主式 AI 语音机器人（Voice Bot），用于患者预约挂号与到诊确认。",
      "部署结构化的 Schema JSON-LD MedicalBusiness 微数据，优化在新型 AI 搜索引擎中的权重。",
      "通过 Twilio 短信网关，针对复查与例行筛查自动发送随访通知。"
    ]
  },
  veterinarian: {
    pl: [
      "Dedykowany system e-kartoteki zwierząt i wizyt zintegrowany z Django (Python) i bazą PostgreSQL.",
      "Interaktywny moduł wyceny zabiegów weterynaryjnych i szczepień oparty o React.",
      "Integracja z chatbotem AI (symptom checker dla zwierząt) pomagającym w nagłych przypadkach przed wizytą.",
      "Szybka mapa Next.js z geolokalizacją i systemem rezerwacji wizyt domowych weterynarza."
    ],
    en: [
      "Dedicated pet medical records and appointment system integrated with Django (Python) and PostgreSQL.",
      "Interactive veterinary treatment and vaccination pricing calculator built with React.",
      "AI veterinary chatbot (pet symptom checker) for immediate first-aid advice before clinical visits.",
      "Fast Next.js map page with geolocation for scheduling mobile home-visit vets."
    ],
    de: [
      "Dediziertes System für Haustierakten und Termine, integriert mit Django (Python) und PostgreSQL.",
      "Interaktiver Kostenrechner für Behandlungen und Impfungen auf Basis von React.",
      "KI-Chatbot zur ersten Symptomanalyse bei Haustieren für Ratschläge vor dem Praxisbesuch.",
      "Schnelle Next.js-Karte mit Geolokalisierung zur Buchung von mobilen Tierarzt-Hausbesuchen."
    ],
    uk: [
      "Спеціалізована система електронної карти тварин та візитів на базі Django (Python) та PostgreSQL.",
      "Інтерактивний модуль розрахунку вартості ветеринарних процедур та щеплень на React.",
      "Інтеграція з чат-ботом AI для первинного аналізу симптомів тварини та порад до візиту до клініки.",
      "Швидка карта Next.js з геолокацією для замовлення виїзду ветеринара додому."
    ],
    ru: [
      "Специализированная система электронных карт питомцев на базе Django (Python) и PostgreSQL.",
      "Интерактивный модуль расчета стоимости ветеринарных услуг и вакцинации на React.",
      "Интеграция с чат-ботом AI для первой помощи животным и оценки симптомов до визита в клинику.",
      "Быстрая карта Next.js с геолокацией для заказа выезда ветеринарного врача на дом."
    ],
    zh: [
      "集成 Django (Python) 和 PostgreSQL 数据库的专属宠物电子病历与就诊管理系统。",
      "基于 React 开发的交互式宠物治疗与疫苗接种费用在线估算模块。",
      "部署动物症状初筛 AI 聊天机器人，在到诊前为宠物主人提供紧急急救指南。",
      "采用具备地理定位功能的 Next.js 地图系统，支持在线预约宠物医生上门诊疗。"
    ]
  },
  dentist: {
    pl: [
      "Wizualny, interaktywny model uzębienia 3D (Three.js/WebGL) do wyboru zębów do leczenia.",
      "Wdrożenie autonomicznego bota głosowego AI do pełnej obsługi infolinii i zapisów do bazy CRM.",
      "Dedykowane podstrony cenników pakietowych (implantologia, ortodoncja) w technologii Next.js SSG.",
      "Integracja z systemem e-recept i dokumentacji medycznej za pomocą rządowego API P1."
    ],
    en: [
      "Visual, interactive 3D dentition model (Three.js/WebGL) allowing patients to select teeth for treatment.",
      "Autonomous AI voice bot deployment for call center automation and direct CRM scheduling.",
      "Dedicated landing pages for treatment packages (implants, orthodontics) using Next.js SSG.",
      "Direct integration with e-prescriptions and medical records via government P1 API."
    ],
    de: [
      "Visuelles, interaktives 3D-Zahnmodell (Three.js/WebGL) zur Auswahl von Behandlungsbereichen.",
      "Implementierung eines autonomen KI-Sprachbots für die Notruf-Hotline und CRM-Terminbuchungen.",
      "Dedizierte Landingpages für Leistungspakete (Implantate, Kieferorthopädie) mittels Next.js SSG.",
      "Direkte Integration mit elektronischen Rezepten über die staatliche P1-API."
    ],
    uk: [
      "Візуальна інтерактивна 3D-модель зубів (Three.js/WebGL) для вибору проблемних зон пацієнтом.",
      "Впровадження автономного голосового бота AI для обробки дзвінків та запису в CRM-систему.",
      "Спеціалізовані сторінки пакетних послуг (імплантація, ортодонтія) на базі Next.js SSG.",
      "Інтеграція з державною системою e-recept через офіційне API P1."
    ],
    ru: [
      "Визуальная интерактивная 3D-модель зубов (Three.js/WebGL) для выбора зубов при отправке заявки.",
      "Внедрение автономного голосового бота AI для полной автоматизации горячей линии и записи в CRM.",
      "Специализированные посадочные страницы тарифов (имплантация, ортодонтия) на Next.js SSG.",
      "Прямая интеграция с государственной системой электронных рецептов через API P1."
    ],
    zh: [
      "基于 Three.js/WebGL 的交互式 3D 牙齿模型，支持患者在线选定待治疗牙齿。",
      "部署自主式 AI 语音客服机器人，实现热线呼叫中心托管与 CRM 系统直接预定挂号。",
      "采用 Next.js SSG 静态生成技术开发的种植牙、牙齿矫正等套餐服务专属落地页。",
      "通过官方 P1 API 与国家电子处方和病历管理系统进行合规集成。"
    ]
  },
  dermatologist: {
    pl: [
      "Bezpieczny moduł przesyłania zdjęć zmian skórnych w Django (Python) z szyfrowaniem AES-256.",
      "Chatbot AI do wstępnej selekcji i triażu pacjentów na podstawie objawów przed wizytą.",
      "Optymalizacja galerii efektów leczenia (przebarwienia, trądzik) w nowoczesnych formatach WebP/AVIF.",
      "Integracja z systemem e-rejestracji oraz płatnościami za telekonsultacje dermatologiczne."
    ],
    en: [
      "Secure skin issue photo upload module in Django (Python) using AES-256 encryption.",
      "AI triage chatbot for initial patient screening based on dermatological symptoms.",
      "Optimized treatment results photo galleries (acne, scars) using modern WebP/AVIF formats.",
      "Integration with e-registration and online payment gateways for dermatological teleconsultations."
    ],
    de: [
      "Sicheres Modul zum Hochladen von Hautbildern in Django (Python) mit AES-256-Verschlüsselung.",
      "KI-Triage-Chatbot zur Patientenvorsortierung basierend auf dermatologischen Symptomen.",
      "Optimierte Bildgalerien für Behandlungsergebnisse (Akne, Narben) in modernen WebP/AVIF-Formaten.",
      "Schnittstelle zur E-Registrierung und Online-Zahlungen für dermatologische Telekonsultationen."
    ],
    uk: [
      "Безпечний модуль завантаження фотографій шкіри на Django (Python) із шифруванням AES-256.",
      "Чат-бот AI для попереднього сортування пацієнтів на основі дерматологічних симптомів.",
      "Оптимізація фотогалерей результатів лікування (акне, рубці) у сучасних форматах WebP/AVIF.",
      "Інтеграція з онлайн-реєстрацією та платіжними шлюзами для теледерматології."
    ],
    ru: [
      "Безопасный модуль загрузки фотографий кожи на Django (Python) с шифрованием AES-256.",
      "Чат-бот AI для предварительной сортировки пациентов на основе дерматологических симптомов.",
      "Оптимизированные фотогалереи результатов лечения (акне, рубцы) в форматах WebP/AVIF.",
      "Интеграция с онлайн-регистрацией и платежными шлюзами для теледерматологии."
    ],
    zh: [
      "在 Django (Python) 中基于 AES-256 加密算法构建的皮肤患部影像安全上传模块。",
      "部署智能分诊 AI 机器人，根据患者自述的皮肤症状进行就诊前的预筛分流。",
      "采用 WebP/AVIF 等前沿格式，对痘痘、瘢痕治疗前后对比图库进行极限性能优化。",
      "集成电子挂号系统及在线支付网关，支持皮肤科远程视频面诊。"
    ]
  },
  cardiologist: {
    pl: [
      "Integracja z systemami telemedycznymi IoT (zdalny monitoring EKG/ciśnienia) w Node.js.",
      "Autonomiczny Voice Bot AI do potwierdzania terminów wizyt i zarządzania kolejkami pacjentów.",
      "Wdrożenie Schema.org MedicalBusiness dla lepszego pozycjonowania kliniki kardiologicznej.",
      "Szyfrowany portal pacjenta do bezpiecznego podglądu wyników badań i historii chorób (SSL/TLS)."
    ],
    en: [
      "IoT telemedicine system integration (remote ECG/blood pressure monitoring) built with Node.js.",
      "Autonomous AI Voice Bot for managing appointment confirmations and waitlists.",
      "Schema.org MedicalBusiness structured data implementation for local cardiology SEO.",
      "Encrypted patient portal for secure viewing of diagnostic test results and medical history."
    ],
    de: [
      "IoT-Telemedizinsystem-Integration (EKG/Blutdruck-Fernüberwachung) auf Basis von Node.js.",
      "Autonomer KI-Voice-Bot für Terminbestätigungen und Wartelistenmanagement.",
      "Schema.org MedicalBusiness strukturierte Daten für lokale Kardiologie-SEO.",
      "Verschlüsseltes Patientenportal zum sicheren Abrufen von kardiologischen Untersuchungsergebnissen."
    ],
    uk: [
      "Інтеграція з телемедичними IoT-системами (дистанційний моніторинг ЕКГ/тиску) на Node.js.",
      "Автономний голосовий бот AI для підтвердження записів та управління чергою пацієнтів.",
      "Впровадження розмітки Schema.org MedicalBusiness для кардіологічної практики.",
      "Зашифрований кабінет пацієнта для безпечного перегляду результатів ЕКГ та історії хвороби."
    ],
    ru: [
      "Интеграция с телемедицинскими IoT-системами (удаленный мониторинг ЭКГ/давления) на Node.js.",
      "Автономный голосовой бот AI для подтверждения записей и управления очередью пациентов.",
      "Внедрение разметки Schema.org MedicalBusiness для кардиологической практики.",
      "Зашифрованный личный кабинет пациента для безопасного просмотра результатов ЭКГ и истории болезни."
    ],
    zh: [
      "基于 Node.js 开发的物联网（IoT）远程医疗监控集成（对接便携式心电图与血压设备）。",
      "部署自主式 AI 语音机器人，用于全自动随访通知、到诊确认及排队候诊管理。",
      "部署专用的 Schema.org MedicalBusiness 微数据，占领心脏病专科本地搜索头部地位。",
      "基于 SSL/TLS 协议构建的加密患者中心，用于安全查询历史心电图与心血管诊断报告。"
    ]
  },
  pediatrician: {
    pl: [
      "Chatbot AI z wbudowaną bazą wiedzy o zdrowiu dzieci i dawkowaniu leków jako lejek konwersji.",
      "Interaktywny kalendarz szczepień ochronnych i bilansów zdrowia w React/TypeScript.",
      "Szyfrowany formularz wywiadu pediatrycznego przed pierwszą wizytą (RODO/SSL).",
      "Integracja z systemem e-rejestracji i e-recept za pośrednictwem API P1."
    ],
    en: [
      "AI pediatric chatbot with a built-in child health and dosage database for patient acquisition.",
      "Interactive child immunization and health check calendar built with React/TypeScript.",
      "Encrypted pediatrician intake form for medical histories before the first visit.",
      "Integration with e-registration and e-prescriptions via the national P1 API."
    ],
    de: [
      "KI-Chatbot mit integrierter Datenbank für Kindergesundheit und Medikamentendosierung.",
      "Interaktiver Impfkalender und Vorsorgeuntersuchungsplaner in React/TypeScript.",
      "Verschlüsselter pädiatrischer Anamnesebogen für Krankengeschichten vor dem ersten Besuch.",
      "Integration mit E-Registrierung und elektronischen Rezepten über die staatliche P1-API."
    ],
    uk: [
      "Чат-бот AI з базою знань про дитяче здоров'я та дозування ліків як інструмент залучення клієнтів.",
      "Інтерактивний календар профілактичних щеплень та оглядів на React/TypeScript.",
      "Зашифрована форма анамнезу дитини перед першим прийомом педіатра (GDPR/SSL).",
      "Інтеграція з онлайн-реєстрацією та електронними рецептами через API P1."
    ],
    ru: [
      "Чат-бот AI с базой знаний о детском здоровье и дозировках лекарств для привлечения пациентов.",
      "Интерактивный календарь прививок и плановых осмотров ребенка на React/TypeScript.",
      "Зашифрованная форма анамнеза ребенка перед первым приемом педиатра (GDPR/SSL).",
      "Интеграция с онлайн-регистрацией и электронными рецептами через API P1."
    ],
    zh: [
      "内置儿童健康指南与常见药物剂量数据库的智能 AI 客服，作为高转化获客漏斗。",
      "基于 React/TypeScript 研发的交互式儿童疫苗接种进程与健康发育体检日历。",
      "严格遵循数据隐私规范的加密儿童病史筛查表单（支持就诊前在线填写）。",
      "通过官方 P1 API 深度对接电子挂号、电子病历以及电子处方系统。"
    ]
  },
  physiotherapist: {
    pl: [
      "Baza wideo ćwiczeń rehabilitacyjnych w chmurze (Cloudinary / Vercel Blob) z dostępem dla pacjentów.",
      "Interaktywny model 3D dolegliwości i kontuzji narządów ruchu (WebGL/React Three Fiber).",
      "Integracja z systemem Cal.com do elastycznego planowania sesji i płatności online (Stripe).",
      "Schema JSON-LD LocalBusiness z optymalizacją pod frazy kluczowe (rehabilitacja Warszawa)."
    ],
    en: [
      "Cloud-hosted rehabilitation exercise video database (Cloudinary / Vercel Blob) for patients.",
      "Interactive 3D body pain and musculoskeletal injury map (WebGL/React Three Fiber).",
      "Seamless Cal.com integration for scheduling physical therapy sessions with Stripe payments.",
      "Schema JSON-LD LocalBusiness optimized for high-intent keywords (physiotherapy near me)."
    ],
    de: [
      "Cloud-basierte Videodatenbank für Rehabilitationsübungen (Cloudinary) für Patienten.",
      "Interaktive 3D-Körperschmerzkarte für Muskel-Skelett-Verletzungen (WebGL/React Three Fiber).",
      "Cal.com-Integration für die Buchung von Physiotherapiesitzungen mit Stripe-Zahlungen.",
      "Schema JSON-LD LocalBusiness optimiert für lokale Suchbegriffe (Physiotherapie Berlin)."
    ],
    uk: [
      "Хмарна база відеоуроків реабілітаційних вправ (Cloudinary / Vercel Blob) з доступом для пацієнтів.",
      "Інтерактивна 3D-карта болю та травм опорно-рухового апарату (WebGL/React Three Fiber).",
      "Інтеграція з Cal.com для гнучкого планування сеансів та оплати через Stripe.",
      "Встановлення Schema JSON-LD LocalBusiness під локальні запити (реабілітація Київ)."
    ],
    ru: [
      "Облачная база видеоуроков реабилитационных упражнений (Cloudinary / Vercel Blob) для пациентов.",
      "Интерактивная 3D-карта боли и травм опорно-двигательного аппарата (WebGL/React Three Fiber).",
      "Интеграция с Cal.com для гибкого планирования сеансов и оплаты через Stripe.",
      "Установка Schema JSON-LD LocalBusiness под локальные запросы (реабилитация Москва)."
    ],
    zh: [
      "基于云存储（Cloudinary / Vercel Blob）构建的康复理疗训练演示视频库，支持患者自主访问。",
      "基于 WebGL/React Three Fiber 开发的交互式 3D 人体骨骼肌肉损伤与疼痛图示模块。",
      "无缝对接 Cal.com 预约引擎，支持物理治疗课程预约与 Stripe 在线快捷支付。",
      "部署 Schema JSON-LD LocalBusiness，针对本地康复理疗核心词进行深度谷歌优化。"
    ]
  },
  orthopedist: {
    pl: [
      "Moduł przesyłania dużych plików obrazowych RTG/MRI przez AWS S3 z szyfrowaniem w locie.",
      "Integracja z botem AI kwalifikującym do zabiegów operacyjnych na podstawie kwestionariusza.",
      "System powiadomień SMS o terminach operacji i zaleceniach przedzabiegowych (SMSAPI).",
      "Zabezpieczenia formularzy medycznych SSL, RODO oraz szyfrowanie baz danych pacjentów."
    ],
    en: [
      "Large RTG/MRI imaging file upload module via AWS S3 with on-the-fly encryption.",
      "Integration with an AI qualification bot for surgical procedures based on an online questionnaire.",
      "SMS notification system for surgery dates and pre-op requirements (SMSAPI).",
      "Medical forms security via SSL, GDPR compliance, and database encryption."
    ],
    de: [
      "Modul zum Hochladen großer Röntgen-/MRT-Bilddateien über AWS S3 mit Verschlüsselung.",
      "Integration mit einem KI-Qualifizierungs-Bot für chirurgische Eingriffe auf Basis von Fragebögen.",
      "SMS-Benachrichtigungssystem für OP-Termine und präoperative Anforderungen (SMSAPI).",
      "Sicherheit medizinischer Formulare über SSL, DSGVO-Konformität und Datenbankverschlüsselung."
    ],
    uk: [
      "Модуль завантаження великих файлів знімків рентгену/МРТ через AWS S3 з шифруванням на льоту.",
      "Інтеграція з ботом AI для попередньої оцінки необхідності операції на основі квізу.",
      "Система SMS-сповіщень про дати операцій та передопераційні інструкції (SMSAPI).",
      "Захист медичних форм SSL, відповідність GDPR та шифрування баз даних пацієнтів."
    ],
    ru: [
      "Модуль загрузки тяжелых снимков рентгена/МРТ через AWS S3 с шифрованием на лету.",
      "Интеграция с ботом AI для предварительной оценки необходимости операции на основе квиза.",
      "Система SMS-оповещений о датах операций и предоперационных инструкциях (SMSAPI).",
      "Защита медицинских форм SSL, соответствие GDPR и шифрование баз данных пациентов."
    ],
    zh: [
      "通过 AWS S3 构建的重症影像（X光片/核磁共振等大文件）高带宽上传模块，支持流式加密。",
      "集成 AI 筛查助理，通过线上结构化问卷，对是否需要进行骨科关节手术进行智能初评。",
      "对接 SMSAPI 短信触发机制，自动发送手术排期提醒与术前注意事项通知。",
      "全站部署 SSL 安全套接层，严格保障符合 GDPR 的医疗病史表单与数据库静态加密。"
    ]
  },
  psychiatrist: {
    pl: [
      "W pełni szyfrowane, bezpieczne konsultacje wideo online (WebRTC) zintegrowane z C#/.NET.",
      "System e-rezerwacji zintegrowany z bazą danych Medfile i kalendarzami pacjentów.",
      "Dyskretne, w 100% anonimowe formularze kontaktowe z szyfrowaniem end-to-end.",
      "Wdrożenie najwyższych standardów bezpieczeństwa danych medycznych (RODO, SSL, certyfikacja medyczna)."
    ],
    en: [
      "Fully encrypted, secure online video consultations (WebRTC) integrated with C#/.NET.",
      "E-booking system integrated with the Medfile database and patient calendars.",
      "Discreet, 100% anonymous contact forms with end-to-end encryption.",
      "Implementation of the highest standards of medical data security (GDPR, SSL, medical certification)."
    ],
    de: [
      "Voll verschlüsselte, sichere Online-Videosprechstunden (WebRTC) integriert mit C#/.NET.",
      "E-Booking-System integriert mit der Medfile-Datenbank und Patientenkalendern.",
      "Diskrete, 100 % anonyme Kontaktformulare mit Ende-zu-Ende-Verschlüsselung.",
      "Implementierung höchster Standards für medizinische Datensicherheit (DSGVO, SSL)."
    ],
    uk: [
      "Повністю зашифровані відеоконсультації (WebRTC), інтегровані з платформою C#/.NET.",
      "Система онлайн-запису, інтегрована з медичною базою Medfile та календарями.",
      "Конфіденційні, на 100% анонімні форми зворотного зв'язку з наскрізним шифруванням.",
      "Впровадження найвищих стандартів медичної безпеки (GDPR, SSL, медичні сертифікати)."
    ],
    ru: [
      "Полностью зашифрованные видеоконсультации (WebRTC), интегрированные с платформой C#/.NET.",
      "Система онлайн-записи, интегрированная с медицинской базой Medfile и календарями.",
      "Конфиденциальные, на 100% анонимные формы обратной связи с сквозным шифрованием.",
      "Внедрение высочайших стандартов медицинской безопасности (GDPR, SSL, медицинские сертификаты)."
    ],
    zh: [
      "基于 C#/.NET 及 WebRTC 技术开发的端到端加密、高带宽安全在线视频会诊系统。",
      "与 Medfile 临床管理系统及患者日历实时同步的电子排班与预约挂号引擎。",
      "高度保密、基于非对称加密算法的 100% 匿名患者咨询与线索搜集表单。",
      "严格执行符合 GDPR 和 ISO 27001 规范的医疗级别隐私安全标准。"
    ]
  },
  ophthalmologist: {
    pl: [
      "Interaktywny, orientacyjny test ostrości wzroku online (React/Canvas API) jako lejek konwersji.",
      "Dedykowany system rezerwacji badań refrakcji i doboru szkieł kontaktowych (Next.js).",
      "Strukturyzowane bazy wiedzy o wadach wzroku zoptymalizowane pod wyszukiwarki AI.",
      "Wdrożenie Schema JSON-LD MedicalBusiness i pełna zgodność z SSL i RODO."
    ],
    en: [
      "Interactive, preliminary online vision acuity test (React/Canvas API) for patient acquisition.",
      "Dedicated booking system for refraction eye exams and contact lens fitting (Next.js).",
      "Structured vision defect knowledge base optimized for AI search engine indexing.",
      "Ophthalmology Schema JSON-LD MedicalBusiness implementation with SSL and GDPR compliance."
    ],
    de: [
      "Interaktiver Online-Sehtest (React/Canvas API) zur Gewinnung von Neupatienten.",
      "Dediziertes Buchungssystem für Refraktionsbestimmungen und Kontaktlinsenanpassungen (Next.js).",
      "Strukturierte Wissensdatenbank für Fehlsichtigkeiten, optimiert für KI-Suchmaschinen.",
      "Implementierung von Schema JSON-LD MedicalBusiness und vollständige DSGVO-Konformität."
    ],
    uk: [
      "Інтерактивний орієнтовний тест гостроти зору онлайн (React/Canvas API) для залучення клієнтів.",
      "Система запису на комп'ютерну діагностику зору та підбір лінз (Next.js).",
      "Структурована база знань про очні захворювання, оптимізована під пошукові алгоритми AI.",
      "Розгортання Schema JSON-LD MedicalBusiness та повна сумісність з SSL та GDPR."
    ],
    ru: [
      "Интерактивный ориентировочный тест остроты зрения онлайн (React/Canvas API) для привлечения пациентов.",
      "Система записи на компьютерную диагностику зрения и подбор линз (Next.js).",
      "Структурированная база знаний о глазных заболеваниях, оптимизированная под алгоритмы AI.",
      "Развертывание Schema JSON-LD MedicalBusiness и полная совместимость с SSL и GDPR."
    ],
    zh: [
      "基于 React/Canvas API 研发的交互式在线视力筛查小游戏，用作获客及引流漏斗。",
      "采用 Next.js 开发的验光配镜与隐形眼镜试戴定制预约挂号页面。",
      "针对新型 AI 搜索引擎（如 Perplexity/SGE）进行知识图谱优化的眼科疾病科普库。",
      "配置专用的眼科诊所 Schema JSON-LD MedicalBusiness 标记并全面实现 SSL 加密。"
    ]
  },
  neurologist: {
    pl: [
      "Szyfrowany formularz zgłaszania objawów neurologicznych zbudowany w Django (Python).",
      "Integracja z systemem e-rejestracji na specjalistyczne badania obrazowe MRI i CT.",
      "Wdrożenie autonomicznego bota głosowego AI do weryfikacji i potwierdzania wizyt.",
      "Certyfikacja SSL, zgodność z RODO oraz ochrona danych wrażliwych pacjentów."
    ],
    en: [
      "Encrypted neurological symptom reporting forms built with Django (Python).",
      "Integration with e-registration systems for specialized MRI and CT imaging exams.",
      "Deployment of an autonomous AI voice bot for scheduling and confirming clinic visits.",
      "SSL certification, GDPR compliance, and sensitive medical data protection."
    ],
    de: [
      "Verschlüsselter neurologischer Symptombogen auf Basis von Django (Python).",
      "Integration mit E-Registrierungssystemen für spezialisierte MRT- und CT-Untersuchungen.",
      "Implementierung eines autonomen KI-Sprachbots zur Terminverifizierung und -bestätigung.",
      "SSL-Zertifizierung, DSGVO-Konformität und Schutz sensibler medizinischer Daten."
    ],
    uk: [
      "Зашифрована форма симптомів неврологічних розладів на базі Django (Python).",
      "Інтеграція з онлайн-реєстрацією на діагностику МРТ та КТ.",
      "Впровадження автономного голосового бота AI для верифікації та підтвердження записів.",
      "Сертифікація SSL, відповідність GDPR та захист персональних даних пацієнтів."
    ],
    ru: [
      "Зашифрованная форма симптомов неврологических расстройств на базе Django (Python).",
      "Интеграция с онлайн-регистрацией на диагностику МРТ и КТ.",
      "Внедрение автономного голосового бота AI для верификации и подтверждения записей.",
      "Сертификация SSL, соответствие GDPR и защита персональных данных пациентов."
    ],
    zh: [
      "在 Django (Python) 中基于高级加解密机制构建的神经系统病理症状自陈量表。",
      "与医院核磁共振（MRI）和 CT 影像检查系统直连的电子预约与转诊平台。",
      "部署智能语音助理，实现就诊电话呼入自动应答与就诊时间确认。",
      "部署 SSL 证书，全方位防护符合 GDPR 标准的神经内科敏感医疗数据。"
    ]
  },
  surgeon: {
    pl: [
      "Trójwymiarowa wizualizacja procedur chirurgicznych (WebGL/Three.js) w celach edukacyjnych.",
      "Formularz kwalifikacji operacyjnej ze zintegrowanym silnikiem analizy medycznej AI.",
      "Wdrożenie w pełni szyfrowanej bazy danych pacjentów (MSSQL z Always Encrypted w C#/.NET).",
      "Zgodność z RODO i SSL oraz standardami bezpieczeństwa placówek chirurgii ambulatoryjnej."
    ],
    en: [
      "3D visualization of surgical procedures (WebGL/Three.js) for educational and marketing purposes.",
      "Surgical qualification intake form integrated with an AI medical analysis engine.",
      "Fully encrypted patient database implementation (MSSQL with Always Encrypted in C#/.NET).",
      "GDPR and SSL compliance and safety standards for ambulatory surgery clinics."
    ],
    de: [
      "Dreidimensionale Visualisierung chirurgischer Eingriffe (WebGL/Three.js) für Patienten.",
      "Chirurgischer Aufklärungs- und Qualifizierungsbogen mit integrierter KI-Analyse.",
      "Voll verschlüsselte Patientendatenbank (MSSQL mit Always Encrypted in C#/.NET).",
      "DSGVO- und SSL-Konformität und Sicherheitsstandards für ambulante Operationszentren."
    ],
    uk: [
      "Тривимірна візуалізація хірургічних втручань (WebGL/Three.js) для пацієнтів.",
      "Форма кваліфікації до хірургічного втручання з інтегрованим алгоритмом оцінки AI.",
      "Впровадження повністю зашифрованої бази даних пацієнтів (MSSQL з Always Encrypted на C#/.NET).",
      "Сумісність з GDPR та SSL, відповідність стандартам хірургічних центрів."
    ],
    ru: [
      "Трехмерная визуализация хирургических вмешательств (WebGL/Three.js) для пациентов.",
      "Форма квалификации к хирургическому вмешательству с интегрированным алгоритмом оценки AI.",
      "Внедрение полностью зашифрованной базы данных пациентов (MSSQL с Always Encrypted на C#/.NET).",
      "Совместимость с GDPR и SSL, соответствие стандартам хирургических центров."
    ],
    zh: [
      "基于 WebGL/Three.js 开发的 3D 手术过程三维渲染展示（用于患者术前科普）。",
      "集成 AI 医学预判定逻辑的线上门诊手术适应症预排查表单。",
      "配置高度防泄密的加密患者数据库（在 C#/.NET 中结合 MSSQL Always Encrypted）。",
      "严格匹配 GDPR 和 SSL 认证，达到日间手术中心同等的信息安全防护规格。"
    ]
  },
  laryngologist: {
    pl: [
      "Orientacyjny test słuchu online oparty o Web Audio API jako nowoczesny element konwersji.",
      "Dedykowany formularz kwalifikacji do zabiegów laryngologicznych (plastyka przegrody, migdałki).",
      "Integracja z systemem ZnanyLekarz / Medfile za pomocą bezpiecznych kluczy REST API.",
      "Pozycjonowanie lokalne i Schema JSON-LD MedicalBusiness dla kliniki laryngologicznej."
    ],
    en: [
      "Online hearing screening test based on Web Audio API as a modern conversion tool.",
      "Dedicated pre-op qualification form for ENT procedures (septoplasty, tonsillectomy).",
      "Integration with ZnanyLekarz / Medfile using secure REST API credentials.",
      "Local SEO optimization and Schema JSON-LD MedicalBusiness for ENT clinics."
    ],
    de: [
      "Online-Hörtest auf Basis der Web Audio API zur interaktiven Patientengewinnung.",
      "Dedizierter präoperativer Fragebogen für HNO-Eingriffe (Septumplastik, Tonsillektomie).",
      "Integration mit ZnanyLekarz / Medfile über sichere REST-API-Schlüssel.",
      "Lokale SEO-Optimierung und Schema JSON-LD MedicalBusiness für HNO-Praxen."
    ],
    uk: [
      "Орієнтовний тест слуху онлайн на базі Web Audio API як інструмент залучення пацієнтів.",
      "Спеціалізована форма підготовки до ЛОР-операцій (септопластика, видалення мигдаликів).",
      "Інтеграція з системами ZnanyLekarz / Medfile через безпечні ключі REST API.",
      "Локальне SEO та розгортання Schema JSON-LD MedicalBusiness для лор-кабінетів."
    ],
    ru: [
      "Ориентировочный тест слуха онлайн на базе Web Audio API для привлечения пациентов.",
      "Специализированная форма подготовки к ЛОР-операциям (септопластика, удаление миндалин).",
      "Интеграция с системами ZnanyLekarz / Medfile через безопасные ключи REST API.",
      "Локальное SEO и развертывание Schema JSON-LD MedicalBusiness для лор-кабинетов."
    ],
    zh: [
      "基于 Web Audio API 研制的在线听力粗测工具，作为新潮的网页互动与留资入口。",
      "耳鼻喉专科手术（如鼻中隔矫正、扁桃体切除）线上适应症预筛查表单。",
      "通过安全的 REST API 凭证，与 ZnanyLekarz / Medfile 挂号数据库进行集成。",
      "本地谷歌地图置顶优化及 Schema JSON-LD MedicalBusiness 眼耳鼻喉科微标记配置。"
    ]
  },
  endocrinologist: {
    pl: [
      "Panel pacjenta do monitorowania wyników badań tarczycy / hormonów (FastAPI/Python).",
      "Interaktywny kalkulator dawek leków i wskaźników hormonalnych napisany w React.",
      "Integracja z systemem e-recept (API P1) dla ułatwienia leczenia chorób przewlekłych.",
      "Zabezpieczenia formularzy medycznych SSL, RODO oraz pełna anonimizacja danych."
    ],
    en: [
      "Secure patient portal to track thyroid and hormone lab results (FastAPI/Python).",
      "Interactive medication dosage and hormone ratios calculator built with React.",
      "Integration with the e-prescription database (P1 API) for chronic disease management.",
      "Medical forms security via SSL, GDPR compliance, and full database anonymization."
    ],
    de: [
      "Sicheres Patientenportal zur Nachverfolgung von Schilddrüsen- und Hormonwerten (FastAPI/Python).",
      "Interaktiver Rechner für Medikamentendosierungen und Hormonverhältnisse in React.",
      "Integration mit elektronischen Rezepten (P1-API) zur Langzeitbehandlungsunterstützung.",
      "Sicherheit medizinischer Formulare über SSL, DSGVO und Anonymisierungsstandards."
    ],
    uk: [
      "Особистий кабінет пацієнта для моніторингу аналізів щитовидної залози (FastAPI/Python).",
      "Інтерактивний калькулятор дозування гормональних препаратів на React.",
      "Інтеграція з державною системою e-recept (API P1) для пацієнтів з хронічними хворобами.",
      "Захист медичних форм SSL, відповідність GDPR та анонімізація чутливих даних."
    ],
    ru: [
      "Личный кабинет пациента для мониторинга анализов щитовидной железы (FastAPI/Python).",
      "Интерактивный калькулятор дозировок гормональных препаратов на React.",
      "Интеграция с государственной системой электронных рецептов (API P1) для хроников.",
      "Защита медицинских форм SSL, соответствие GDPR и анонимизация чувствительных данных."
    ],
    zh: [
      "基于 FastAPI (Python) 搭建的安全患者中心，用于自主上传与追踪甲状腺及各类激素指标。",
      "基于 React 研发的交互式激素比例测算与药物（如优甲乐）参考剂量评估工具。",
      "对接官方电子处方通道（P1 API），便利慢性病患者的在线续方与购药。",
      "表单全面采用 SSL 传输加密，支持严格符合 GDPR 规范的数据库脱敏技术。"
    ]
  },

  // LAWYERS (6 specializations)
  adwokat: {
    pl: [
      "Szyfrowanie formularzy kontaktowych kluczem PGP oraz szyfrowaniem end-to-end (Node.js crypto).",
      "Integracja z autonomicznym botem telefonicznym AI (Voice Bot) do wstępnej kwalifikacji spraw.",
      "Wdrożenie systemu bezpiecznych e-konsultacji z płatnościami online Stripe (Node.js API).",
      "Optymalizacja szybkości ładowania w technologii Next.js SSG z wynikiem 100/100 PageSpeed."
    ],
    en: [
      "Contact forms secured with PGP keys and end-to-end encryption (Node.js crypto).",
      "Integration with an autonomous AI Voice Bot for initial legal case screening.",
      "Secure online booking system for legal consultations with Stripe payments integration.",
      "Performance optimization using Next.js SSG, achieving a 100/100 Mobile PageSpeed score."
    ],
    de: [
      "Kontaktformulare gesichert mit PGP-Schlüsseln und Ende-zu-Ende-Verschlüsselung (Node.js-Krypto).",
      "Integration mit einem autonomen KI-Voice-Bot zur rechtlichen Ersteinschätzung von Fällen.",
      "Sicheres Buchungssystem für Rechtsberatungen mit integrierter Stripe-Zahlungsschnittstelle.",
      "Geschwindigkeitsoptimierung mit Next.js SSG für einen PageSpeed-Score von 100/100."
    ],
    uk: [
      "Захист форм зворотного зв'язку ключами PGP та наскрізним шифруванням (Node.js crypto).",
      "Інтеграція з автономним голосовим ботом AI (Voice Bot) для первинного аналізу судових справ.",
      "Впровадження системи безпечних онлайн-консультацій з платіжним шлюзом Stripe.",
      "Оптимізація швидкості на базі Next.js SSG з оцінкою 100/100 Mobile PageSpeed."
    ],
    ru: [
      "Защита форм обратной связи ключами PGP и сквозным шифрованием (Node.js crypto).",
      "Интеграция с автономным голосовым ботом AI (Voice Bot) для первичного анализа дел.",
      "Внедрение системы безопасных онлайн-консультаций с платежным шлюзом Stripe.",
      "Оптимизация скорости на базе Next.js SSG с оценкой 100/100 Mobile PageSpeed."
    ],
    zh: [
      "在 Node.js 中基于 PGP 非对称密钥及端到端加密机制构建的在线咨询防泄密系统。",
      "集成自主式 AI 语音机器人（Voice Bot），用于法律案件的初步分类与线索采集。",
      "基于 Node.js 核心技术开发的在线视频咨询与 Stripe 担保支付系统。",
      "基于 Next.js SSG 静态生成的极致速度优化，确保移动端 PageSpeed 达到 100/100 满分。"
    ]
  },
  'radca-prawny': {
    pl: [
      "Portal dla klientów biznesowych w technologii C# (.NET Core) z uwierzytelnianiem 2FA/OAuth.",
      "Wdrożenie mikrodanych Schema JSON-LD LegalService dedykowanej dla wyszukiwarek AI.",
      "Automatyczne generowanie projektów umów w PDF (TypeScript/PDFKit) po zebraniu danych z formularza.",
      "Integracja z kalendarzem rezerwacji w czasie rzeczywistym (Cal.com / Microsoft Graph API)."
    ],
    en: [
      "Business client portal built on C# (.NET Core) with 2FA/OAuth authentication.",
      "Implementation of structured Schema JSON-LD LegalService microdata for AI search visibility.",
      "Automated draft contract PDF generation (TypeScript/PDFKit) from form submission data.",
      "Real-time appointment scheduling integration (Cal.com / Microsoft Graph API)."
    ],
    de: [
      "Mandantenportal für Unternehmen in C# (.NET Core) mit 2FA/OAuth-Authentifizierung.",
      "Implementierung strukturierter Schema JSON-LD LegalService-Daten für KI-Suchmaschinen.",
      "Automatische PDF-Vertragsentwurfserstellung (TypeScript/PDFKit) basierend auf Formulardaten.",
      "Terminkalender-Integration in Echtzeit (Cal.com / Microsoft Graph API)."
    ],
    uk: [
      "Особистий кабінет бізнес-клієнта на C# (.NET Core) з автентифікацією 2FA/OAuth.",
      "Розгортання структурованих мікроданих Schema JSON-LD LegalService для пошукових систем AI.",
      "Автоматичне створення проектів договорів у PDF (TypeScript/PDFKit) на основі форм.",
      "Інтеграція з онлайн-календарем запису в реальному часі (Cal.com / Microsoft Graph API)."
    ],
    ru: [
      "Личный кабинет бизнес-клиента на C# (.NET Core) с аутентификацией 2FA/OAuth.",
      "Развертывание структурированных микроданных Schema JSON-LD LegalService для поисковиков AI.",
      "Автоматическое создание проектов договоров в PDF (TypeScript/PDFKit) на основе форм.",
      "Интеграция с онлайн-календарем записи в реальном времени (Cal.com / Microsoft Graph API)."
    ],
    zh: [
      "基于 C# (.NET Core) 开发的企业级法务客户后台，支持 2FA 双重身份验证与 OAuth 授权。",
      "部署专用的 Schema JSON-LD LegalService 微标记以优化 AI 搜索的抓取权重。",
      "基于 TypeScript/PDFKit 开发的在线协议及法律合同 PDF 草案自动生成系统。",
      "与 Cal.com 及 Microsoft Graph API 深度对接的无缝会议时间预约系统。"
    ]
  },
  notariusz: {
    pl: [
      "Zabezpieczony system weryfikacji tożsamości klienta online zintegrowany z ePUAP/mObywatel.",
      "Dedykowana baza wiedzy o taksie notarialnej oparta o FastAPI (Python) i wyszukiwanie semantyczne (RAG).",
      "Integracja z chatbotem AI do wstępnego analizowania potrzeb dokumentowych i doboru terminu.",
      "Szyfrowana komunikacja SSL/TLS w architekturze mikroserwisowej (C# / .NET)."
    ],
    en: [
      "Secured online client identity verification system integrated with ePUAP/mObywatel.",
      "Dedicated notary fee knowledge base powered by FastAPI (Python) and semantic RAG search.",
      "AI chatbot integration for screening document requirements and scheduling visits.",
      "Encrypted SSL/TLS communication within a microservices architecture (C# / .NET)."
    ],
    de: [
      "Sicheres Online-Identitätsprüfungsverfahren integriert mit ePUAP/mObywatel.",
      "Wissensdatenbank für Notargebühren auf Basis von FastAPI (Python) und semantischer RAG-Suche.",
      "KI-Chatbot zur Vorabprüfung von Dokumentenanforderungen und Terminabsprachen.",
      "Verschlüsselte SSL/TLS-Kommunikation in einer Mikroservice-Architektur (C# / .NET)."
    ],
    uk: [
      "Захищена система онлайн-верифікації особи клієнта, інтегрована з ePUAP/mObywatel.",
      "База знань про нотаріальні тарифи на FastAPI (Python) та семантичному пошуку RAG.",
      "Інтеграція з чат-ботом AI для первинної перевірки документів та підбору дати візиту.",
      "Зашифровані канали зв'язку SSL/TLS у мікросервісній архітектурі (C# / .NET)."
    ],
    ru: [
      "Защищенная система онлайн-верификации личности клиента, интегрированная с ePUAP/mObywatel.",
      "База знаний о нотариальных тарифах на FastAPI (Python) и семантическом поиске RAG.",
      "Интеграция с чат-ботом AI для первичной проверки документов и подбора даты визита.",
      "Зашифрованные каналы связи SSL/TLS в микросервисной архитектуре (C# / .NET)."
    ],
    zh: [
      "集成波兰国家身份认证系统 ePUAP/mObywatel 的安全在线实名认证与材料核验接口。",
      "基于 FastAPI (Python) 和检索增强生成技术（RAG）搭建的公证服务规费智能科普系统。",
      "集成 AI 挂号小助手，用于在线初筛材料是否齐全并引导客户锁定制表窗口。",
      "在 C# / .NET 微服务架构中全面实现基于 SSL/TLS 握手的内部服务通信加密。"
    ]
  },
  komornik: {
    pl: [
      "Baza licytacji komorniczych zintegrowana z systemami sądowymi w technologii PHP / Laravel.",
      "Automatyczne wysyłanie przypomnień o terminach wpłat przez bramkę SMSAPI (Node.js cron).",
      "Zabezpieczenie przed atakami DDoS (Cloudflare WAF) i zgodność z normami bezpieczeństwa MSWiA.",
      "Dynamiczny kalkulator opłat egzekucyjnych i kosztów wierzytelności (TypeScript)."
    ],
    en: [
      "Bailiff auction listing database integrated with court systems using PHP / Laravel.",
      "Automated payment reminders sent via the SMSAPI gateway (Node.js cron system).",
      "DDoS protection (Cloudflare WAF) and compliance with strict government security standards.",
      "Dynamic enforcement fees and debt interest calculator built with TypeScript."
    ],
    de: [
      "Datenbank für Zwangsversteigerungen integriert mit Gerichtssystemen mittels PHP / Laravel.",
      "Automatische Zahlungserinnerungen über das SMSAPI-Gateway (Node.js Cron-System).",
      "DDoS-Schutz (Cloudflare WAF) und Einhaltung strenger staatlicher Sicherheitsstandards.",
      "Dynamischer Rechner für Vollstreckungsgebühren und Zinsen auf Basis von TypeScript."
    ],
    uk: [
      "База даних судових аукціонів, інтегрована з судовими реєстрами на PHP / Laravel.",
      "Автоматичне надсилання нагадувань про оплату через шлюз SMSAPI (cron-система на Node.js).",
      "Захист від DDoS-атак (Cloudflare WAF) та відповідність суворим стандартам безпеки МВС.",
      "Динамічний калькулятор судових зборів та відсотків за заборгованістю на TypeScript."
    ],
    ru: [
      "База данных судебных аукционов, интегрированная с судебными реестрами на PHP / Laravel.",
      "Автоматическая отправка напоминаний об оплате через шлюз SMSAPI (cron-система на Node.js).",
      "Защита от DDoS-атак (Cloudflare WAF) и соответствие строгим стандартам безопасности МВД.",
      "Динамический калькулятор исполнительных сборов и процентов по задолженности на TypeScript."
    ],
    zh: [
      "基于 PHP / Laravel 架构开发的司法拍卖房源管理数据库（支持与法院执行系统对接）。",
      "通过 SMSAPI 网关，结合 Node.js 计划任务（cron）自动发送缴款期限通知短信。",
      "部署 Cloudflare WAF 应用防火墙阻断 DDoS 攻击，满足严苛的信息网络安全合规规范。",
      "基于 TypeScript 开发的动态执行规费与迟延履行利息在线测算计算器。"
    ]
  },
  'kancelaria-prawna': {
    pl: [
      "System CRM dla prawników zintegrowany przez protokół MCP w Pythonie, automatyzujący obieg dokumentów.",
      "Autonomiczny bot telefoniczny AI odbierający połączenia poza godzinami pracy kancelarii.",
      "Wielojęzyczna platforma Next.js z dynamicznym routingiem i pozycjonowaniem GEO na rynki zagraniczne.",
      "Dedykowany moduł rozliczeń czasu pracy i stawek godzinowych dla klientów korporacyjnych."
    ],
    en: [
      "Legal CRM system integrated via MCP protocol in Python, automating document workflows.",
      "Autonomous AI voice bot answering client calls outside of standard law office hours.",
      "Multilingual Next.js platform with dynamic routing and GEO SEO optimized for international markets.",
      "Dedicated hourly billing and timesheet module customized for corporate clients."
    ],
    de: [
      "Anwalts-CRM-System integriert über das MCP-Protokoll in Python zur Workflow-Automatisierung.",
      "Autonomer KI-Voice-Bot zur Entgegennahme von Anrufen außerhalb der Kanzleiöffnungszeiten.",
      "Mehrsprachige Next.js-Plattform mit dynamischem Routing und GEO-SEO für internationale Märkte.",
      "Dediziertes Zeiterfassungs- und Stundenabrechnungsmodul für Firmenkunden."
    ],
    uk: [
      "Система CRM для юристів, інтегрована через протокол MCP на Python для автоматизації документообігу.",
      "Автономний телефонний бот AI, який приймає дзвінки клієнтів поза робочим часом канцелярії.",
      "Мультимовна платформа Next.js з динамічним роутингом та GEO SEO для міжнародних ринків.",
      "Спеціалізований модуль обліку робочого часу та погодинних ставок для корпоративних клієнтів."
    ],
    ru: [
      "Система CRM для юристов, интегрированная через протокол MCP на Python для автоматизации документооборота.",
      "Автономный телефонный бот AI, принимающий звонки клиентов во внерабочее время канцелярии.",
      "Мультиязычная платформа Next.js с динамическим роутингом и GEO SEO для международных рынков.",
      "Специализированный модуль учета рабочего времени и почасовых ставок для корпоративных клиентов."
    ],
    zh: [
      "在 Python 中通过 MCP 协议集成的法务 CRM 平台，实现核心案件文书流转完全自动化。",
      "部署 24 小时全天候自主 AI 电话接听机器人，保障在非工作时间漏接电话的实时跟进与建档。",
      "支持多语种动态路由的 Next.js 极速站点开发，面向跨国法律服务进行 GEO 地理定位优化。",
      "为大型企业客户度身定制的工时记录（Timesheet）与多维度费率结算管理模块。"
    ]
  },
  'doradca-podatkowy': {
    pl: [
      "Integracja z rządowym systemem KSeF (Krajowy System e-Faktur) za pomocą API w C# / .NET.",
      "Autonomiczny asystent podatkowy AI (RAG) odpowiadający klientom na pytania o najnowsze przepisy.",
      "Szyfrowany portal klienta do przesyłania i weryfikacji dokumentów księgowych w Django/Python.",
      "Automatyczne wyliczanie ulg podatkowych na podstawie formularza dynamicznego w React."
    ],
    en: [
      "Integration with the national KSeF e-invoicing database via C# / .NET API.",
      "Autonomous AI tax assistant (RAG model) providing real-time guidance on recent tax reforms.",
      "Encrypted client portal for uploading and validating financial documents built on Django/Python.",
      "Automated tax relief and write-off calculator utilizing a dynamic React wizard form."
    ],
    de: [
      "Anbindung an die nationale KSeF-E-Rechnungsdatenbank über eine C# / .NET-API.",
      "Autonomer KI-Steuerassistent (RAG-Modell) zur Beantwortung von Fragen zu aktuellen Steuerreformen.",
      "Verschlüsseltes Mandantenportal zum Hochladen von Finanzdokumenten auf Basis von Django/Python.",
      "Automatischer Steuerentlastungsrechner mittels eines dynamischen React-Assistenten."
    ],
    uk: [
      "Інтеграція з державною системою електронних накладних KSeF через API на C# / .NET.",
      "Автономний податковий асистент AI (модель RAG) для консультацій щодо податкових змін.",
      "Зашифрований кабінет клієнта для завантаження фінансової звітності на базі Django/Python.",
      "Автоматичний розрахунок податкових пільг на основі динамічної форми на React."
    ],
    ru: [
      "Интеграция с государственной системой электронных накладных KSeF через API на C# / .NET.",
      "Автономный налоговый ассистент AI (модель RAG) для консультаций по налоговым изменениям.",
      "Зашифрованный личный кабинет клиента для загрузки финансовой отчетности на базе Django/Python.",
      "Автоматический расчет налоговых льгот на основе динамической формы на React."
    ],
    zh: [
      "通过 C# / .NET API，与波兰国家强制性电子发票系统（KSeF）实现合规级自动对接。",
      "部署基于大语言模型检索增强（RAG）的智能税务助理，解答客户关于税法变更的疑问。",
      "基于 Django (Python) 研发的加密企业财税数据上传通道与自动化票据预审系统。",
      "基于 React 研发的个性化税收减免与抵扣额度多分支动态计算表单。"
    ]
  },

  // PSYCHOLOGISTS (5 specializations)
  psychologist: {
    pl: [
      "Szyfrowany i w pełni anonimowy formularz zgłoszeniowy (zgodność z RODO i etyką zawodu).",
      "Integracja REST API z systemem rezerwacji ZnanyLekarz lub własnym kalendarzem online.",
      "Wdrożenie autonomicznego bota głosowego AI do umawiania i przekładania terminów sesji.",
      "Zabezpieczenia formularzy medycznych SSL oraz czytelne podstrony cenników pakietowych."
    ],
    en: [
      "Encrypted and fully anonymous intake forms complying with GDPR and professional ethics.",
      "REST API integration with the ZnanyLekarz directory or custom online calendars.",
      "Deployment of an autonomous AI voice bot for scheduling and rescheduling therapy sessions.",
      "SSL secure medical forms and transparent session bundle pricing directories."
    ],
    de: [
      "Verschlüsselte und vollkommen anonyme Kontaktformulare gemäß DSGVO und Berufsordnung.",
      "REST-API-Integration mit dem ZnanyLekarz-System oder Online-Kalendern.",
      "Implementierung eines autonomen KI-Sprachbots zur Verwaltung von Therapiesitzungen.",
      "SSL-geschützte Formulare und übersichtliche Unterseiten für Paketpreise."
    ],
    uk: [
      "Зашифрована та повністю анонімна форма запису (відповідність GDPR та етиці психолога).",
      "Інтеграція REST API з календарем ZnanyLekarz або власними плагінами онлайн-запису.",
      "Впровадження автономного голосового бота AI для запису та перенесення сеансів терапії.",
      "Захист медичних форм SSL та структуровані сторінки з цінами на пакети консультацій."
    ],
    ru: [
      "Зашифрованная и полностью анонимная форма записи (соответствие GDPR и этике психолога).",
      "Интеграция REST API с календарем ZnanyLekarz или собственными плагинами онлайн-записи.",
      "Внедрение автономного голосового бота AI для записи и переноса сеансов терапии.",
      "Защита медицинских форм SSL и структурированные страницы с ценами на пакеты консультаций."
    ],
    zh: [
      "严格遵循 GDPR 数据安全保护条例及心理咨询执业伦理的 100% 匿名加密预约表单。",
      "通过 REST API 深度打通 ZnanyLekarz 挂号管理系统或第三方独立电子日程表。",
      "部署智能 AI 语音助手，协助用户在免人工干预下自助预约、修改或取消咨询时间段。",
      "部署 SSL 全链路数据加密，为各类型心理咨询套餐提供清晰易读的资费明细子页。"
    ]
  },
  psychotherapist: {
    pl: [
      "Bezpieczny portal pacjenta w Django (Python) z notatkami z sesji chronionymi hasłem.",
      "Szyfrowany, bezpieczny moduł konsultacji wideo (WebRTC) chroniący poufność rozmów.",
      "Dedykowane podstrony objaśniające nurty terapeutyczne (poznawczo-behawioralny, psychodynamiczny).",
      "Wdrożenie standardów Schema JSON-LD MedicalBusiness i SSL dla lokalnego pozycjonowania."
    ],
    en: [
      "Secure patient portal built in Django (Python) with password-protected session notes.",
      "Encrypted, highly secure video consultation module (WebRTC) guaranteeing session privacy.",
      "Dedicated landing pages explaining therapeutic modalities (CBT, psychodynamic, humanistic).",
      "Schema JSON-LD MedicalBusiness and SSL implementation for localized Google rankings."
    ],
    de: [
      "Sicheres Patientenportal in Django (Python) mit passwortgeschützten Sitzungsnotizen.",
      "Verschlüsseltes Videosprechstunden-Modul (WebRTC) zum Schutz der Vertraulichkeit.",
      "Unterseiten zur Erklärung der Therapierichtungen (Verhaltenstherapie, tiefenpsychologisch).",
      "Implementierung von Schema JSON-LD MedicalBusiness und SSL für die lokale SEO."
    ],
    uk: [
      "Безпечний особистий кабінет на Django (Python) з паролем на конфіденційні записи сесій.",
      "Зашифрований модуль відеозв'язку (WebRTC) для гарантії повної приватності розмов.",
      "Спеціалізовані сторінки з описом методів психотерапії (КПТ, психодинамічний тощо).",
      "Налаштування Schema JSON-LD MedicalBusiness та SSL для підвищення локальних позицій."
    ],
    ru: [
      "Безопасный личный кабинет на Django (Python) с паролем на конфиденциальные записи сессий.",
      "Зашифрованный модуль видеосвязи (WebRTC) для гарантии полной приватности разговоров.",
      "Специализированные страницы с описанием методов психотерапии (КПТ, психодинамический и др.).",
      "Настройка Schema JSON-LD MedicalBusiness и SSL для повышения локальных позиций."
    ],
    zh: [
      "基于 Django (Python) 研发的专属来访者后台，支持对每次咨询反馈日志进行独立密码加密。",
      "基于 WebRTC 开发的端到端超高安全级别视频在线咨询模块，全力保护会谈私密性。",
      "针对不同流派（认知行为疗法 CBT、精神分析、人本主义等）单独生成的高度优化科普子页。",
      "配置 Schema JSON-LD MedicalBusiness 并全站部署 SSL 安全协议以强化谷歌地图 SEO。"
    ]
  },
  childPsychologist: {
    pl: [
      "Interaktywny, wieloetapowy kwestionariusz diagnozy wstępnej dla rodziców stworzony w React.",
      "Autonomiczny chatbot AI z bazą wiedzy o rozwoju psychicznym dzieci i młodzieży.",
      "Szyfrowane, zgodne z RODO przesyłanie formularzy i dokumentów szkolnych / medycznych.",
      "Optymalizacja witryny pod urządzenia mobilne i integracja z kalendarzem wizyt."
    ],
    en: [
      "Interactive, multi-step child diagnosis screening form for parents built with React.",
      "Autonomous AI chatbot powered by a comprehensive child mental development database.",
      "Encrypted, GDPR-compliant portal for uploading educational and clinical documents.",
      "Mobile-first frontend design and seamless online scheduling calendar integration."
    ],
    de: [
      "Interaktiver, mehrstufiger Fragebogen zur Erstdiagnostik für Eltern in React.",
      "Autonomer KI-Chatbot mit Wissensdatenbank zur kindlichen Entwicklung.",
      "Verschlüsselter, DSGVO-konformer Upload von schulischen und medizinischen Unterlagen.",
      "Mobile-First-Optimierung der Website und Integration von Online-Terminkalendern."
    ],
    uk: [
      "Інтерактивний покроковий діагностичний квіз для батьків, розроблений на React.",
      "Автономний чат-бот AI з базою знань про психологічний розвиток дітей та підлітків.",
      "Зашифроване завантаження шкільних характеристик та медичних карток (відповідність GDPR).",
      "Оптимізація інтерфейсу під мобільні екрани та інтеграція з календарем прийомів."
    ],
    ru: [
      "Интерактивный пошаговый диагностический квиз для родителей, разработанный на React.",
      "Автономный чат-бот AI с базой знаний о психологическом развитии детей и подростков.",
      "Зашифрованная загрузка школьных характеристик и медицинских карт (соответствие GDPR).",
      "Оптимизация интерфейса под мобильные экраны и интеграция с календарем приемов."
    ],
    zh: [
      "基于 React 研发的儿童心理发展在线预筛多阶段交互式测评问卷（面向家长）。",
      "内置儿童与青少年心理发育及成长危机干预知识图谱的自主智能 AI 客服机器人。",
      "严格执行 GDPR 规范的加密上传通道，用于家长在线提交学校评估或既往病历材料。",
      "Mobile-First 响应式界面优化及云端智能预约挂号系统的平滑接入。"
    ]
  },
  coupleTherapist: {
    pl: [
      "Formularz zgłoszeniowy dla par z osobnymi profilami partnerów (Node.js / TypeScript).",
      "Integracja z systemem Cal.com do wspólnego dopasowywania dogodnych terminów sesji.",
      "Przejrzysty, pakietowy cennik sesji partnerskich i mediacji rodzinnych (Next.js SSG).",
      "Wdrożenie Schema.org LocalBusiness i optymalizacja profilu Google Maps pod frazy lokalne."
    ],
    en: [
      "Couples intake questionnaire with separate partner profiles powered by Node.js / TypeScript.",
      "Cal.com scheduling integration allowing partners to coordinate convenient session times.",
      "Clear, package-based pricing directories for couple therapy and family mediation (Next.js SSG).",
      "Schema.org LocalBusiness implementation and Google Maps local ranking optimization."
    ],
    de: [
      "Fragebogen für Paare mit getrennten Partnerprofilen auf Basis von Node.js / TypeScript.",
      "Cal.com-Kalender-Integration zur einfachen Abstimmung von Terminen für beide Partner.",
      "Übersichtliche Darstellung von Paketpreisen für Paartherapien und Mediationen (Next.js SSG).",
      "Implementierung von Schema.org LocalBusiness und Google Maps-Optimierung für lokale Suche."
    ],
    uk: [
      "Спеціалізована форма запису для пар з роздільними профілями партнерів (Node.js / TypeScript).",
      "Інтеграція з Cal.com для узгодження зручного часу сеансу обома партнерами.",
      "Прозорий прайс-лист на сімейні консультації та медіацію на базі Next.js SSG.",
      "Налаштування Schema.org LocalBusiness та просування картки Google Maps."
    ],
    ru: [
      "Специализированная форма записи для пар с раздельными профилями партнеров (Node.js / TypeScript).",
      "Интеграция с Cal.com для согласования удобного времени сеанса обоими партнерами.",
      "Прозрачный прайс-лист на семейные консультации и медиацию на базе Next.js SSG.",
      "Настройка Schema.org LocalBusiness и продвижение карточки Google Maps."
    ],
    zh: [
      "基于 Node.js / TypeScript 构建的双账号机制伴侣心理咨询线上登记问卷表单。",
      "引入 Cal.com 精准排程系统，便利两位来访者在线协作选定并锁定共同时间档。",
      "采用 Next.js SSG 静态生成的伴侣咨询及家庭调解资费套餐（Package Pricing）细分子页。",
      "引入 Schema.org LocalBusiness 标签，针对本地亲密关系咨询相关词汇进行谷歌地图 SEO。"
    ]
  },
  addictionTherapist: {
    pl: [
      "W 100% anonimowe zgłoszenia i formularze chronione silnym szyfrowaniem end-to-end.",
      "Przycisk telefonu alarmowego (pogotowie uzależnień) zoptymalizowany pod kątem konwersji mobilnej.",
      "Autonomiczny chatbot AI wspierający pacjentów w kryzysie 24/7 przed wizytą w gabinecie.",
      "Schema JSON-LD MedicalBusiness i pełna optymalizacja PageSpeed (Next.js)."
    ],
    en: [
      "100% anonymous intake forms secured by strong end-to-end encryption.",
      "Emergency helpline click-to-call button optimized for high mobile conversion rate.",
      "Autonomous 24/7 crisis support AI chatbot to guide patients before their appointment.",
      "MedicalBusiness Schema JSON-LD and full PageSpeed performance tuning (Next.js)."
    ],
    de: [
      "100 % anonyme Kontaktformulare gesichert durch starke Ende-zu-Ende-Verschlüsselung.",
      "Notfall-Hotline-Button optimiert für hohe mobile Konversionsraten (Click-to-Call).",
      "Autonomer 24/7-Krisenhilfe-KI-Chatbot zur Begleitung von Patienten vor dem Termin.",
      "MedicalBusiness Schema JSON-LD und vollständige PageSpeed-Optimierung (Next.js)."
    ],
    uk: [
      "100% анонімні форми та звернення, захищені стійким наскрізним шифруванням.",
      "Кнопка гарячої лінії (кризова допомога), оптимізована для швидкого дзвінка зі смартфона.",
      "Автономний чат-бот AI для цілодобової підтримки пацієнтів у кризових станах 24/7.",
      "Розгортання Schema JSON-LD MedicalBusiness та оптимізація швидкості сайту Next.js."
    ],
    ru: [
      "100% анонимные формы и обращения, защищенные стойким сквозным шифрованием.",
      "Кнопка горячей линии (кризисная помощь), оптимизированная для быстрого звонка со смартфона.",
      "Автономный чат-бот AI для круглосуточной поддержки пациентов в кризисных состояниях 24/7.",
      "Развертывание Schema JSON-LD MedicalBusiness и оптимизация скорости сайта Next.js."
    ],
    zh: [
      "基于非对称公钥加密的 100% 匿名病历建档与保密信息上传模块。",
      "针对移动端优化的紧急危机干预热线一键直拨（Click-to-Call）触发控件。",
      "部署 24 小时全天候运行的危机自救引导 AI 机器人，在正式接诊前给予基础指导。",
      "配置 Schema JSON-LD MedicalBusiness 标记结构，并基于 Next.js 实施全方位跑分优化。"
    ]
  },

  // ACCOUNTANTS (5 specializations)
  accountant: {
    pl: [
      "Integracja z rządowym systemem KSeF (Krajowy System e-Faktur) za pomocą API w C# / .NET.",
      "Dedykowany, interaktywny kalkulator składek ZUS i podatków (Polski Ład) w React/TypeScript.",
      "Szyfrowany portal klienta do wgrywania dokumentów księgowych (Django/Python).",
      "Wdrożenie standardów bezpieczeństwa danych finansowych SSL, RODO oraz pełna archiwizacja."
    ],
    en: [
      "Integration with the national KSeF e-invoicing platform via C# / .NET API.",
      "Interactive tax and social security (ZUS) calculator built with React/TypeScript.",
      "Encrypted secure client portal for uploading financial documents (Django/Python).",
      "Financial data security implementation via SSL, GDPR, and automated backup routines."
    ],
    de: [
      "Anbindung an das nationale E-Rechnungsportal KSeF über eine C# / .NET-API.",
      "Interaktiver Steuer- und Sozialversicherungsrechner in React/TypeScript.",
      "Verschlüsseltes Mandantenportal zum sicheren Upload von Belegen (Django/Python).",
      "Finanzdatensicherheit über SSL-Verschlüsselung, DSGVO und automatische Backups."
    ],
    uk: [
      "Інтеграція з державною системою електронних накладних KSeF через API на C# / .NET.",
      "Спеціалізований калькулятор податків та внесків на базі React/TypeScript.",
      "Зашифрований кабінет замовника для завантаження бухгалтерських первинних документів (Django/Python).",
      "Забезпечення безпеки фінансових даних через канали SSL, відповідність GDPR."
    ],
    ru: [
      "Интеграция с государственной системой электронных накладных KSeF через API на C# / .NET.",
      "Специализированный калькулятор налогов и взносов на базе React/TypeScript.",
      "Зашифрованный личный кабинет заказчика для загрузки первичных документов (Django/Python).",
      "Обеспечение безопасности финансовых данных через каналы SSL, соответствие GDPR."
    ],
    zh: [
      "通过 C# / .NET API 与国家 KSeF 电子发票收发系统进行直接整合。",
      "基于 React/TypeScript 研发的精细化个人与企业所得税、社保规费在线试算小工具。",
      "基于 Django (Python) 研发的金融级别高可靠票据上传与数字对账后台。",
      "全链路配置 SSL 握手加密，符合 GDPR 标准并实现自动化财务数据库归档机制。"
    ]
  },
  accountingOffice: {
    pl: [
      "System CRM dla biur rachunkowych zintegrowany przez protokół MCP w Pythonie, automatyzujący obieg spraw.",
      "Autonomiczny bot telefoniczny AI (Voice Bot) do weryfikacji tożsamości i rejestracji zapytań ofertowych.",
      "Szyfrowany portal klienta do wymiany dokumentów i plików płacowych w technologii Django.",
      "Wdrożenie Schema.org LocalBusiness oraz optymalizacja SEO wizytówek pod frazy lokalne."
    ],
    en: [
      "Accounting CRM system integrated via Python MCP protocol for document workflow automation.",
      "Autonomous AI Voice Bot for caller identity verification and lead capturing.",
      "Encrypted Django client portal for secure invoice exchange and payroll sheets.",
      "Schema.org LocalBusiness implementation and targeted Google Maps ranking campaigns."
    ],
    de: [
      "Kanzlei-CRM-System integriert über das Python-MCP-Protokoll zur Dokumenten-Automatisierung.",
      "Autonomer KI-Voice-Bot zur Identitätsprüfung von Anrufern und Lead-Erfassung.",
      "Verschlüsseltes Django-Mandantenportal zum sicheren Austausch von Rechnungen und Gehaltsabrechnungen.",
      "Schema.org LocalBusiness-Implementierung und gezielte Google Maps-Optimierung."
    ],
    uk: [
      "Бухгалтерська система CRM, інтегрована через протокол MCP на Python для автоматизації процесів.",
      "Автономний телефонний бот AI (Voice Bot) для реєстрації звернень та первинного відбору лідів.",
      "Зашифрований кабінет клієнта для обміну документами та розрахунками зарплати на Django.",
      "Налаштування Schema.org LocalBusiness та оптимізація просування картки в Google Картах."
    ],
    ru: [
      "Бухгалтерская система CRM, интегрированная через протокол MCP на Python для автоматизации процессов.",
      "Автономный телефонный бот AI (Voice Bot) для регистрации обращений и первичного отбора лидов.",
      "Зашифрованный личный кабинет клиента для обмена документами и расчетами зарплаты на Django.",
      "Настройка Schema.org LocalBusiness и оптимизация продвижения карточки в Google Картах."
    ],
    zh: [
      "在 Python 中通过 Model Context Protocol (MCP) 构建的记账师专属流程自动化 CRM。",
      "部署智能语音应答系统，用于自主来电身份校验与潜在代理记账线索捕获。",
      "基于 Django 架构构建的客户文件安全柜，用于安全传递工资单及原始财务凭证。",
      "配置 Schema.org LocalBusiness 并进行谷歌商家信息（GBP）排名的精细化调优。"
    ]
  },
  auditor: {
    pl: [
      "Szyfrowana baza danych audytów i sprawozdań finansowych w technologii C# (.NET Core).",
      "Dedykowany moduł analizy finansowej wspierany przez silnik AI do badania sprawozdań.",
      "Portal klienta z dwuskładnikowym uwierzytelnianiem 2FA oraz pełnym szyfrowaniem przesyłu danych.",
      "Wdrożenie standardów bezpieczeństwa SSL i RODO dla poufnych danych korporacyjnych."
    ],
    en: [
      "Encrypted audit database and financial statements system built on C# (.NET Core).",
      "Dedicated financial analysis module powered by an AI engine to analyze balance sheets.",
      "Client portal with mandatory 2FA authentication and full data transfer encryption.",
      "SSL and GDPR security standards implementation for confidential corporate data."
    ],
    de: [
      "Verschlüsselte Wirtschaftsprüfungsdatenbank auf Basis von C# (.NET Core).",
      "Dediziertes Finanzanalyse-Modul mit integrierter KI zur Bilanzprüfung.",
      "Mandantenportal mit verpflichtender Zwei-Faktor-Authentifizierung (2FA) und Verschlüsselung.",
      "SSL- und DSGVO-Sicherheitsstandards für vertrauliche Unternehmensdaten."
    ],
    uk: [
      "Зашифрована база даних аудитів та фінансових звітів на C# (.NET Core).",
      "Спеціалізований модуль фінансового аналізу на базі AI для перевірки балансу.",
      "Кабінет клієнта з обов'язковою двофакторною автентифікацією 2FA та шифруванням каналів.",
      "Впровадження стандартів SSL та GDPR для конфіденційної корпоративної звітності."
    ],
    ru: [
      "Зашифрованная база данных аудитов и финансовых отчетов на C# (.NET Core).",
      "Специализированный модуль финансового анализа на базе AI для проверки баланса.",
      "Личный кабинет клиента с обязательной двухфакторной аутентификацией 2FA и шифрованием каналов.",
      "Внедрение стандартов SSL и GDPR для конфиденциальной корпоративной отчетности."
    ],
    zh: [
      "基于 C# (.NET Core) 开发的加密级审计档案与财务报表审查管理数据库。",
      "集成 AI 智能决策逻辑的专有数据接口，用于辅助识别资产负债表与利润表异常点。",
      "强制采用 2FA（双重校验）的客户专属下载中心，全站实现金融级 HTTPS 加密传输。",
      "严格匹配 GDPR 与 SSL 安全评级，保障涉及企业核心财务秘密的非公开数据隐私。"
    ]
  },
  payrollSpecialist: {
    pl: [
      "Interaktywny kalkulator wynagrodzeń i kosztów pracodawcy napisany w React.",
      "Integracja z systemami kadrowo-płacowymi za pomocą API w technologii C# / .NET.",
      "Automatyczne powiadomienia e-mail i generatory kart pracy oparte o Node.js.",
      "Zgodność z RODO i pełna anonimizacja danych wrażliwych pracowników."
    ],
    en: [
      "Interactive wage and employer labor cost calculator built with React.",
      "Integration with HR and payroll software databases via C# / .NET APIs.",
      "Automated email notifications and timesheet generation powered by Node.js.",
      "GDPR compliance and complete anonymization of sensitive employee data."
    ],
    de: [
      "Interaktiver Lohn- und Lohnnebenkostenrechner für Arbeitgeber in React.",
      "Integration mit Personal- und Gehaltsabrechnungssoftware über C# / .NET-APIs.",
      "Automatische E-Mail-Benachrichtigungen und Stundenzettel-Generatoren mittels Node.js.",
      "DSGVO-Konformität und vollständige Anonymisierung sensibler Mitarbeiterdaten."
    ],
    uk: [
      "Інтерактивний калькулятор заробітної плати та витрат роботодавця на React.",
      "Інтеграція з базами даних кадрові та зарплатні за допомогою API на C# / .NET.",
      "Автоматичні сповіщення на пошту та генератори табелів обліку робочого часу на Node.js.",
      "Сумісність з GDPR та повна анонімізація чутливих даних про працівників."
    ],
    ru: [
      "Интерактивный калькулятор заработной платы и расходов работодателя на React.",
      "Интеграция с базами данных кадров и зарплаты с помощью API на C# / .NET.",
      "Автоматические оповещения на почту и генераторы табелей учета рабочего времени на Node.js.",
      "Совместимость с GDPR и полная анонимизация чувствительных данных о сотрудниках."
    ],
    zh: [
      "基于 React 研发的综合薪酬结构与雇主实际用工成本核算在线计算器。",
      "基于 C# / .NET API，实现与主流企业人事与考勤系统（如 Optima API）的对接。",
      "基于 Node.js 异步任务引擎开发的时间卡（Timesheet）生成与工资单触发邮件系统。",
      "严格执行 GDPR 合规标准，对涉及员工个人隐私（如身份证号、病假条）的数据实施硬加密。"
    ]
  },
  financialAdvisor: {
    pl: [
      "Interaktywny kalkulator zdolności kredytowej i rentowności ROI (React / TypeScript).",
      "System rezerwacji doradztwa online zintegrowany z bramkami płatności (Stripe).",
      "Wdrożenie Schema JSON-LD FinancialService podnoszącej wiarygodność u wyszukiwarek AI.",
      "Szyfrowana komunikacja SSL oraz dedykowany moduł prezentacji produktów finansowych."
    ],
    en: [
      "Interactive borrowing capacity and ROI calculator built with React / TypeScript.",
      "Online financial consulting booking system integrated with payment gateways (Stripe).",
      "Schema JSON-LD FinancialService implementation to boost authority in AI search engines.",
      "SSL-encrypted communication and a dedicated financial product showcase module."
    ],
    de: [
      "Interaktiver Kreditrahmen- und ROI-Rechner in React / TypeScript.",
      "Online-Buchungssystem für Finanzberatungen mit integrierter Stripe-Zahlungsschnittstelle.",
      "Schema JSON-LD FinancialService-Implementierung zur Stärkung der Relevanz in KI-Suchmaschinen.",
      "SSL-verschlüsselte Kommunikation und dediziertes Modul zur Präsentation von Finanzprodukten."
    ],
    uk: [
      "Інтерактивний калькулятор кредитного ліміту та рентабельності інвестицій ROI (React / TypeScript).",
      "Система запису на консультації, інтегрована з платіжним сервісом Stripe.",
      "Розгортання Schema JSON-LD FinancialService для підвищення довіри пошуковиків AI.",
      "Зашифровані канали передачі даних SSL та модуль порівняння фінансових продуктів."
    ],
    ru: [
      "Интерактивный калькулятор кредитного лимита и рентабельности инвестиций ROI (React / TypeScript).",
      "Система записи на консультации, интегрированная с платежным сервисом Stripe.",
      "Развертывание Schema JSON-LD FinancialService для повышения доверия поисковиков AI.",
      "Зашифрованные каналы передачи данных SSL и модуль сравнения финансовых продуктов."
    ],
    zh: [
      "基于 React/TypeScript 研发的互动式贷款额度评估与投资回报率（ROI）在线分析器。",
      "与 Stripe 线上支付无缝集成的财税/金融独立规划预约日程管理系统。",
      "配置 Schema JSON-LD FinancialService 以提升在下一代人工智能搜索中的专业权威度。",
      "配置全站 SSL 传输加密及专属的金融理财产品差异化比对展示模块。"
    ]
  },

  // ARCHITECTS (5 specializations)
  architect: {
    pl: [
      "Szybkie portfolio projektów oparte na Next.js Image i chmurowym hostingu Cloudinary.",
      "Interaktywne rzuty 3D i makiety obiektów (Three.js / WebGL / React Three Fiber).",
      "Przejrzyste formularze zapytań ofertowych i kalkulacji kosztów w technologii React.",
      "Wdrożenie standardów Schema JSON-LD LocalBusiness i pełne szyfrowanie SSL."
    ],
    en: [
      "Fast project portfolio powered by Next.js Image and cloud image hosting via Cloudinary.",
      "Interactive 3D building models and blueprints (Three.js / WebGL / React Three Fiber).",
      "Transparent RFQ forms and construction cost estimators developed in React.",
      "Schema JSON-LD LocalBusiness implementation and full SSL encryption."
    ],
    de: [
      "Schnelles Projektportfolio auf Basis von Next.js Image und Cloudinary-Hosting.",
      "Interaktive 3D-Gebäudemodelle und Entwürfe (Three.js / WebGL / React Three Fiber).",
      "Übersichtliche Formulare für Preisanfragen und Baukostenschätzungen in React.",
      "Implementierung von Schema JSON-LD LocalBusiness und vollständige SSL-Verschlüsselung."
    ],
    uk: [
      "Швидке портфоліо проектів на базі Next.js Image та хмарного медіа-хостингу Cloudinary.",
      "Інтерактивні 3D-плани будинків та тривимірні макети (Three.js / WebGL / React Three Fiber).",
      "Зручні форми запитів комерційних пропозицій та кошторисів на React.",
      "Налаштування Schema JSON-LD LocalBusiness та повне шифрування SSL."
    ],
    ru: [
      "Быстрое портфолио проектов на базе Next.js Image и облачного медиа-хостинга Cloudinary.",
      "Интерактивные 3D-планы зданий и трехмерные макеты (Three.js / WebGL / React Three Fiber).",
      "Удобные формы запросов коммерческих предложений и смет на React.",
      "Настройка Schema JSON-LD LocalBusiness и полное шифрование SSL."
    ],
    zh: [
      "基于 Next.js Image 和 Cloudinary 云图床优化技术构建的超高画质工程案例图集。",
      "基于 Three.js / WebGL / React Three Fiber 开发的交互式 3D 建筑与楼宇渲染模型。",
      "采用 React 编写的建筑开发预算概算评估与合规电子询价表单系统。",
      "配置 Schema JSON-LD LocalBusiness 微数据并配置全链路 SSL 传输加密。"
    ]
  },
  interiorDesigner: {
    pl: [
      "Interaktywny suwak zdjęć 'Przed i Po' (react-compare-image) dla metamorfoz wnętrz.",
      "Integracja z bezgłowym systemem CMS (WordPress REST API) dla łatwego wrzucania galerii.",
      "Przejrzyste formularze zapytań o koszt prac wykończeniowych według metrażu.",
      "Schema JSON-LD LocalBusiness z optymalizacją pod frazy (projektowanie wnętrz Warszawa)."
    ],
    en: [
      "Interactive Before/After image comparison slider (react-compare-image) for interior makeovers.",
      "Headless CMS integration (WordPress REST API) for seamless project gallery management.",
      "Clear, metrage-based interior design fee calculator and RFQ forms.",
      "Schema JSON-LD LocalBusiness optimized for local keywords (interior design Warsaw)."
    ],
    de: [
      "Interaktiver Vorher-Nachher-Vergleich (react-compare-image) für Innenarchitektur-Projekte.",
      "Headless-CMS-Integration (WordPress-REST-API) für eine einfache Verwaltung von Projektgalerien.",
      "Übersichtliche Formulare zur Berechnung von Designkosten basierend auf der Wohnfläche.",
      "Schema JSON-LD LocalBusiness optimiert für lokale Suchbegriffe (Innenarchitektur Berlin)."
    ],
    uk: [
      "Інтерактивний слайдер порівняння фото 'До та Після' (react-compare-image) для дизайну інтер'єрів.",
      "Інтеграція з безголовим CMS (WordPress REST API) для зручного оновлення проектів.",
      "Зручні покрокові форми запиту ціни дизайну проекту відповідно до площі приміщення.",
      "Встановлення Schema JSON-LD LocalBusiness під локальні запити (дизайн інтер'єру Київ)."
    ],
    ru: [
      "Интерактивный слайдер сравнения фото 'До/После' (react-compare-image) для дизайна интерьеров.",
      "Интеграция с безголовым CMS (WordPress REST API) для удобного обновления проектов.",
      "Удобные пошаговые формы запроса цены дизайн-проекта в зависимости от площади помещения.",
      "Установка Schema JSON-LD LocalBusiness под локальные запросы (дизайн интерьера Москва)."
    ],
    zh: [
      "部署基于 react-compare-image 的交互式 Before/After 实景效果对比滑动小工具。",
      "与 Headless WordPress REST API 深度对接，实现后台一键无感分发高清完工图集。",
      "基于房屋面积开发的分段计费设计概算在线收集表单。",
      "配置 Schema JSON-LD LocalBusiness，针对本地空间设计与家装软装关键词进行谷歌优化。"
    ]
  },
  landscapeArchitect: {
    pl: [
      "Baza realizacji w wysokiej rozdzielczości zoptymalizowana w formatach WebP/AVIF.",
      "Interaktywna mapa projektowanych ogrodów i parków (React / Leaflet API).",
      "Dedykowane formularze wyceny prac ogrodniczych i architektury krajobrazu.",
      "Wdrożenie Schema JSON-LD LocalBusiness oraz zabezpieczeń certyfikatem SSL."
    ],
    en: [
      "High-resolution garden project showcase optimized in WebP/AVIF formats.",
      "Interactive map of completed gardens and landscape projects (React / Leaflet API).",
      "Dedicated pricing and estimation forms for landscaping and garden architecture.",
      "Schema JSON-LD LocalBusiness implementation with SSL security certification."
    ],
    de: [
      "Hochauflösende Präsentation von Gartenprojekten optimiert in WebP/AVIF-Formaten.",
      "Interaktive Karte der realisierten Garten- und Landschaftsprojekte (React / Leaflet API).",
      "Dedizierte Formulare für Baukostenschätzungen im Garten- und Landschaftsbau.",
      "Schema JSON-LD LocalBusiness-Implementierung mit SSL-Sicherheitszertifizierung."
    ],
    uk: [
      "Галерея ландшафтних проектів у високій роздільній здатності у форматах WebP/AVIF.",
      "Інтерактивна карта спроектованих садів та паркових зон (React / Leaflet API).",
      "Спеціалізовані форми прорахунку вартості ландшафтного дизайну та озеленення.",
      "Розгортання Schema JSON-LD LocalBusiness та захист з'єднання SSL."
    ],
    ru: [
      "Галерея ландшафтных проектов в высоком разрешении в форматах WebP/AVIF.",
      "Интерактивная карта спроектированных садов и парковых зон (React / Leaflet API).",
      "Специализированные формы просчета стоимости ландшафтного дизайна и озеленения.",
      "Развертывание Schema JSON-LD LocalBusiness и защита соединения SSL."
    ],
    zh: [
      "采用 WebP/AVIF 等高性能媒体格式优化的超高清庭院景观规划实景画廊。",
      "基于 React / Leaflet API 研发的交互式绿化工程与私家花园项目分布地图。",
      "针对庭院土建、植物绿化及软装水景度身定制的在线预算表单。",
      "配置 Schema JSON-LD LocalBusiness 微标记，全站配置 SSL 数据链路加密。"
    ]
  },
  urbanPlanner: {
    pl: [
      "System prezentacji planów zagospodarowania przestrzeni (pliki GeoJSON zintegrowane z Leaflet).",
      "Szyfrowany, bezpieczny moduł pobierania dokumentacji i map planistycznych.",
      "Wyszukiwarka działek i planów miejscowych zoptymalizowana pod kątem wydajności baz danych.",
      "Zgodność z normami dostępności WCAG 2.1 dla stron jednostek samorządu (SSL)."
    ],
    en: [
      "Spatial planning showcase system (GeoJSON files integrated with Leaflet mapping).",
      "Encrypted, secure download module for planning documents and land maps.",
      "Land plot and zoning plan search utility optimized for database performance.",
      "Compliance with WCAG 2.1 accessibility standards for public planning portals (SSL)."
    ],
    de: [
      "Präsentationssystem für Raumordnungspläne (GeoJSON-Dateien integriert in Leaflet).",
      "Verschlüsseltes, sicheres Download-Modul für Planungsunterlagen und Katasterkarten.",
      "Suchwerkzeug für Grundstücke und Bebauungspläne optimiert für Datenbankgeschwindigkeit.",
      "Konformität mit WCAG 2.1 Barrierefreiheitsstandards für öffentliche Planungsportale (SSL)."
    ],
    uk: [
      "Система візуалізації просторового планування (файли GeoJSON, інтегровані з картами Leaflet).",
      "Зашифрований безпечний модуль для завантаження документації та планувальних карт.",
      "Пошук ділянок та кадастрових планів, оптимізований під швидку роботу баз даних.",
      "Відповідність стандартам доступності WCAG 2.1 для громадських порталів (SSL)."
    ],
    ru: [
      "Система визуализации пространственного планирования (файлы GeoJSON, интегрированные с картами Leaflet).",
      "Зашифрованный безопасный модуль для загрузки документации и планировочных карт.",
      "Поиск участков и кадастровых планов, оптимизированный под быструю работу баз данных.",
      "Соответствие стандартам доступности WCAG 2.1 для публичных порталов (SSL)."
    ],
    zh: [
      "空间规划成果可视化陈列系统（基于 Leaflet 渲染 GeoJSON 地理空间矢量文件）。",
      "基于严格访问控制的加密规划设计说明书与红线图纸在线下载模块。",
      "经过高并发数据库调优的规划地块与控制性详细规划方案在线检索小工具。",
      "严格遵循 WCAG 2.1 无障碍网页设计规范（适用于政企规划展示门户）与 SSL 加密。"
    ]
  },
  structuralEngineer: {
    pl: [
      "Moduł kalkulatora nośności i obliczeń konstrukcyjnych oparty o FastAPI (Python).",
      "Prezentacja dokumentacji technicznej i norm budowlanych zoptymalizowana pod SEO.",
      "Szyfrowane repozytorium projektów konstrukcyjnych dla partnerów biznesowych (B2B).",
      "Wdrożenie Schema.org i bezpieczna komunikacja SSL dla biur konstrukcyjno-inżynieryjnych."
    ],
    en: [
      "Load capacity and structural calculations module powered by FastAPI (Python).",
      "SEO-optimized showcase page for technical blueprints and engineering standards.",
      "Encrypted engineering project repository for business-to-business (B2B) partners.",
      "Schema.org structured data implementation and secure SSL protocols for engineering firms."
    ],
    de: [
      "Tragfähigkeits- und Konstruktionsberechnungsmodul betrieben mit FastAPI (Python).",
      "SEO-optimierte Präsentation von technischen Bauzeichnungen und Ingenieurstandards.",
      "Verschlüsseltes Projektarchiv für Tragwerksplanungen für Business-to-Business-Partner (B2B).",
      "Schema.org-Strukturdaten und sichere SSL-Protokolle für Ingenieurbüros."
    ],
    uk: [
      "Модуль розрахунку тримальної здатності та конструктивних елементів на FastAPI (Python).",
      "Оптимізована під SEO сторінка представлення технічної документації та БНіП.",
      "Зашифрований архів інженерних проектів для бізнес-партнерів (B2B-інтеграція).",
      "Налаштування структурованих даних Schema.org та безпечних протоколів SSL."
    ],
    ru: [
      "Модуль расчета несущей способности и конструктивных элементов на FastAPI (Python).",
      "Оптимизированная под SEO страница представления технической документации и СНиП.",
      "Зашифрованный архив инженерных проектов для бизнес-партнеров (B2B-интеграция).",
      "Настройка структурированных данных Schema.org и безопасных протоколов SSL."
    ],
    zh: [
      "基于 FastAPI (Python) 构建的梁柱承载力与结构配筋自动验算模块API。",
      "针对搜索引擎抓取（SEO）深度优化的结构图纸说明与国家建筑标准规范展示页。",
      "基于权限组的安全加密结构施工图图库，用于 B2B 合作伙伴快捷交付。",
      "部署 Schema.org 工程机构微数据标签并全站配置 SSL 访问加密协议。"
    ]
  },

  // CONSTRUCTION (5 specializations)
  generalBuilder: {
    pl: [
      "Interaktywny 'Dziennik Budowy' oparty o Sanity Headless CMS z mobilnym wgrywaniem zdjęć z budowy.",
      "Interaktywna mapa zrealizowanych budów domów jednorodzinnych (Mapbox / Leaflet API).",
      "Autonomiczny bot telefoniczny AI do zbierania danych o lokalizacji działki i parametrach budowy.",
      "Struktury danych Schema JSON-LD dla GeneralContractor podnoszące pozycję w wyszukiwarkach AI."
    ],
    en: [
      "Interactive 'Construction Log' powered by Sanity Headless CMS for quick mobile photo uploads.",
      "Interactive map of completed residential and commercial projects utilizing Mapbox or Leaflet.",
      "Autonomous AI voice bot to capture plot locations and construction specifications from callers.",
      "Structured Schema JSON-LD tags for GeneralContractor to boost rankings in AI search engines."
    ],
    de: [
      "Interaktives 'Bautagebuch' auf Basis von Sanity Headless CMS für schnelles Hochladen per Handy.",
      "Interaktive Projektkarte der fertiggestellten Bauvorhaben mit Mapbox oder Leaflet.",
      "Autonomer KI-Telefonbot zur Erfassung von Grundstücksdaten und Bauspezifikationen.",
      "Strukturierte Schema-JSON-LD-Daten für GeneralContractor zur Erhöhung der Relevanz."
    ],
    uk: [
      "Впровадження інтерактивного 'Журналу будівництва' на базі Sanity Headless CMS з фото зі смартфона.",
      "Інтерактивна карта об'єктів з використанням картографічних сервісів Mapbox або Leaflet.",
      "Автономний телефонний бот AI для збору даних про ділянку та параметри майбутнього будинку.",
      "Розмітка структурованих даних Schema JSON-LD типу GeneralContractor для оптимізації в пошуку."
    ],
    ru: [
      "Разработка интерактивного 'Журнала стройки' на базе Sanity Headless CMS с мобильной выгрузкой.",
      "Интерактивная карта построенных объектов на базе картографических сервисов Mapbox или Leaflet.",
      "Автономный телефонный бот AI для сбора данных об участке и параметрах будущего дома.",
      "Внедрение структурированных данных Schema JSON-LD для GeneralContractor для лучшей индексации."
    ],
    zh: [
      "部署基于 Sanity Headless CMS 的交互式'施工日志'，支持工长手机端一键拍照上传。",
      "基于 Mapbox 或 Leaflet 的交互式已完工住宅工程电子地图系统。",
      "部署智能 AI 语音助手，自动收集意向业主的土地规划情况、建筑面积等建房数据。",
      "配置 Schema JSON-LD 标签，突出 GeneralContractor 属性以优化 AI 搜索展示。"
    ]
  },
  renovator: {
    pl: [
      "Wdrożenie interaktywnego suwaka 'Przed i Po' (porównywarka zdjęć z użyciem react-compare-image).",
      "Stworzenie strony opartej o Next.js zintegrowanej z WordPress REST API dla prostego bloga i galerii.",
      "Przejrzyste formularze zapytań o koszt prac w zależności od metrażu i zakresu wykończenia.",
      "Strukturyzacja danych Schema LocalBusiness i HomeAndConstructionBusiness dla widoczności lokalnej."
    ],
    en: [
      "Integration of interactive Before/After image comparison sliders utilizing react-compare-image.",
      "Fast Next.js frontend integrated with headless WordPress REST API for easy content publishing.",
      "Custom quote request forms based on project scope, room type, and square footage.",
      "Implementation of Schema.org LocalBusiness and HomeAndConstructionBusiness for search visibility."
    ],
    de: [
      "Integration von interaktiven Vorher-Nachher-Bildern mittels react-compare-image.",
      "Next.js-Entwicklung mit Anbindung an die WordPress-REST-API für einfache Inhaltsverwaltung.",
      "Kostenrechner-Formulare zur Abschätzung der Renovierungskosten basierend auf Fläche und Umfang.",
      "Schema.org-Optimierung für LocalBusiness und HomeAndConstructionBusiness."
    ],
    uk: [
      "Впровадження інтерактивних слайдерів порівняння фото 'До та Після' (react-compare-image).",
      "Швидкий Next.js сайт, інтегрований з WordPress REST API для оновлення портфоліо.",
      "Зручні покрокові форми запиту ціни залежно від площі об'єкта та типу ремонту.",
      "Встановлення Schema розмітки LocalBusiness та HomeAndConstructionBusiness."
    ],
    ru: [
      "Интеграция интерактивных слайдеров сравнения 'До/После' (с использованием react-compare-image).",
      "Сайт на Next.js с подключением по WordPress REST API для ведения блога и портфолио.",
      "Удобные опросники (квизы) для расчета сметы ремонта по площади помещения.",
      "Использование структурированных данных Schema LocalBusiness и HomeAndConstructionBusiness."
    ],
    zh: [
      "部署基于 react-compare-image 的交互式 Before/After 施工图片滑动对比控件。",
      "基于 Next.js 开发的高能前端，并与 WordPress REST API 联动以管理装修博客与实景画廊。",
      "按平方米数和装修套餐标准量身定制的多步骤预算在线生成与导出表单。",
      "配置 LocalBusiness 与 HomeAndConstructionBusiness 结构化微标记以提升本地排名。"
    ]
  },
  electrician: {
    pl: [
      "Budowa ultra-lekkiej strony (Vite & React) ładującej się w ułamku sekundy, bez bibliotek blokujących wątek.",
      "Integracja z systemem powiadomień SMS (Twilio / SMSAPI) dla natychmiastowego zgłaszania awarii.",
      "Przycisk bezpośredniego połączenia telefonicznego zoptymalizowany pod kątem konwersji mobilnej (Click-to-Call).",
      "Wdrożenie Schema JSON-LD ProfessionalService dedykowanej dla lokalnych pogotowi technicznych."
    ],
    en: [
      "Building a lightweight static site (Vite & React) that loads in a fraction of a second for emergency visits.",
      "Integration with automated SMS dispatch (Twilio / SMSAPI) for instant emergency notifications.",
      "Prominent direct call button designed for maximum mobile conversion (Click-to-Call).",
      "Implementation of Schema JSON-LD ProfessionalService structured data to drive local map SEO."
    ],
    de: [
      "Entwicklung einer minimalistischen Website (Vite & React) mit extrem kurzen Ladezeiten.",
      "Integration eines SMS-Benachrichtigungssystems (Twilio) für die sofortige Weiterleitung von Notfallmeldungen.",
      "Notruf-Telefonie-Buttons optimiert für mobile Endgeräte zur schnellen Kontaktaufnahme.",
      "Wdrożenie Schema JSON-LD ProfessionalService zur besseren Einordnung in den Suchergebnissen."
    ],
    uk: [
      "Створення надшвидкого статичного сайту (Vite & React), що завантажується за частку секунди.",
      "Інтеграція з системами SMS-сповіщень (Twilio / SMSAPI) для моментального інформування про аварію.",
      "Кнопка швидкого дзвінка, адаптована під мобільні екрани для покращення конверсії.",
      "Додавання структурованої розмітки Schema JSON-LD ProfessionalService."
    ],
    ru: [
      "Разработка супер-быстрого статического сайта (Vite & React), загружающегося мгновенно.",
      "Интеграция с SMS-оповещениями (Twilio / SMSAPI) для срочной отправки заявок мастеру на телефон.",
      "Кнопка быстрого вызова, оптимизированная под мобильных пользователей (Click-to-Call).",
      "Внедрение Schema JSON-LD ProfessionalService для закрепления локальных позиций."
    ],
    zh: [
      "采用 Vite 与 React 搭建超轻量级静态单页，确保弱网甚至无网环境下实现秒开。",
      "整合 Twilio 或本地 SMSAPI 短信通知通道，当用户提交紧急报修时，电工手机可瞬间收到警报。",
      "针对移动端触控优化的 Click-to-Call 一键呼叫按钮，极大缩短客户转化路径。",
      "引入专为本地派工服务优化的 Schema JSON-LD ProfessionalService 标记结构。"
    ]
  },
  plumber: {
    pl: [
      "Zastosowanie Next.js & Edge Middleware do dynamicznej zmiany nazwy dzielnicy i telefonu na podstawie IP.",
      "Integracja z systemem szybkich płatności (Stripe / PayU) do wysyłania linków SMS za nagłe interwencje.",
      "Wdrożenie lekkich skryptów analitycznych (Plausible / Fathom) w celu śledzenia konwersji bez spowalniania strony.",
      "Schema JSON-LD Plumber z precyzyjnym zakresem geolokalizacji świadczonych usług."
    ],
    en: [
      "Using Next.js & Edge Middleware to dynamically customize the nearest district name and phone numbers based on IP.",
      "Quick billing links integration (Stripe / PayU) enabling the plumber to send fast payment links via SMS.",
      "Privacy-first, ultra-lightweight analytics (Plausible / Fathom) to track conversions without cookies.",
      "Structured Schema JSON-LD Plumber data with local service area parameters defined."
    ],
    de: [
      "Einsatz von Next.js & Edge Middleware für dynamische, IP-basierte Text- und Rufnummernanpassungen.",
      "Schnittstelle für Online-Zahlungslinks (Stripe / PayU) zur einfachen Abrechnung von Notfalleinsätzen per SMS.",
      "Einsatz von datenschutzkonformen Analysetools (Plausible / Fathom) für schnelles Laden und Conversion-Tracking.",
      "Implementierung der Schema.org-Struktur Plumber zur gezielten lokalen Optimierung."
    ],
    uk: [
      "Використання Next.js & Edge Middleware для динамічного відображення назви району на основі IP-адреси.",
      "Інтеграція з платіжними сервісами (Stripe / PayU) для швидкої відправки рахунків через SMS за термінові виклики.",
      "Впровадження легкої аналітики (Plausible / Fathom) для відстеження рекламного трафіку без гальмування сайту.",
      "Спеціальна Schema JSON-LD Plumber із зазначенням радіуса обслуговування."
    ],
    ru: [
      "Использование Next.js & Edge Middleware для динамической подстановки ближайшего района по IP пользователя.",
      "Подключение системы выставления быстрых счетов (Stripe / PayU) для отправки платежных ссылок по SMS.",
      "Внедрение легковесных счетчиков (Plausible / Fathom) для отслеживания рекламы без влияния на PageSpeed.",
      "Специализированная разметка Schema JSON-LD Plumber с гео-привязкой услуг."
    ],
    zh: [
      "应用 Next.js & Edge Middleware 技术，根据用户 IP 地址动态调整就近区域名与热线电话。",
      "引入极速支付通道（Stripe / PayU），支持通过短信向客户发送紧急上门服务的在线账单链接。",
      "部署轻量级、无 Cookie 的分析方案（Plausible / Fathom），在确保极速加载的同时追踪转化效果。",
      "配置专用的 Plumber 结构化 Schema JSON-LD，精确圈定服务覆盖半径。"
    ]
  },
  interiorFinisher: {
    pl: [
      "Wdrożenie standardów Next.js PWA z Service Workerem do pobierania zdjęć realizacji i przeglądania offline.",
      "Optymalizacja grafik za pomocą Cloudinary / ImageKit (automatyczne dopasowanie rozdzielczości, kompresja WebP/AVIF).",
      "Dedykowany wieloetapowy kreator wyceny w React (wybór standardu wykończenia, metrażu) generujący kalkulację PDF.",
      "Schema JSON-LD LocalBusiness z bogatym cennikiem (priceRange) i powiązaniem z galeriami zdjęć."
    ],
    en: [
      "Implementing Next.js PWA with Service Workers to pre-cache and allow offline browsing of high-res portfolio images.",
      "Image optimization via Cloudinary / ImageKit (real-time responsive resizing, auto WebP/AVIF format delivery).",
      "A dedicated multi-step React pricing wizard (selecting standard, size, bathrooms) that outputs a custom PDF estimate.",
      "LocalBusiness Schema JSON-LD with detailed price range attributes and direct links to image galleries."
    ],
    de: [
      "Entwicklung als Next.js PWA mit Service Worker zur Offline-Speicherung und -Ansicht von hochauflösenden Projektbildern.",
      "Einsatz von Cloudinary / ImageKit zur automatischen Echtzeit-Skalierung und Auslieferung in WebP/AVIF.",
      "Mehrstufiger React-Kalkulations-Assistent (Auswahl von Qualitätsstufe, Fläche, Raumanzahl) mit PDF-Angebotserstellung.",
      "Ausführliche LocalBusiness JSON-LD Schema-Strukturen mit Preisspannen-Angaben (priceRange) und Galerie-Links."
    ],
    uk: [
      "Впровадження Next.js PWA з Service Worker для кешування та перегляду портфоліо без інтернет-з'єднання.",
      "Оптимізація медіа через Cloudinary / ImageKit (автоматичне стиснення в WebP/AVIF, адаптація під розмір дисплея).",
      "Розробка багатокрокового квіз-калькулятора на React (вибір стилю, площі, кількості санвузлів) з генерацією PDF.",
      "Schema JSON-LD LocalBusiness з детальними ціновими категоріями (priceRange) та зв'язком з фотогалереями."
    ],
    ru: [
      "Внедрение стандартов Next.js PWA с Service Worker для предзагрузки изображений портфолио и просмотра их без интернета.",
      "Оптимизация изображений через Cloudinary / ImageKit (автоматический выбор формата WebP/AVIF, ресайз на лету).",
      "Удобный пошаговый калькулятор на React (выбор материалов, площади, санузлов) с выгрузкой сметы в PDF.",
      "Schema JSON-LD LocalBusiness с указанием ценового диапазона (priceRange) и ссылками на портфолио."
    ],
    zh: [
      "部署 Next.js PWA 规范及 Service Worker，支持离线缓存和无网访问高精度完工实景图。",
      "基于 Cloudinary / ImageKit 优化图片加载（自动适配设备分辨率，实时生成并分发 WebP/AVIF 格式）。",
      "使用 React 编写的多步骤价格计算向导（选择装修档次、房屋面积、卫浴间数量），实时导出 PDF 预算单。",
      "引入包含价格区间（priceRange）和案例图库关联的 LocalBusiness Schema JSON-LD 微数据。"
    ]
  },

  // BEAUTY & HEALTH (5 specializations)
  beautician: {
    pl: [
      "Interaktywny system rezerwacji (Booksy / Versum API) zsynchronizowany z kalendarzem w czasie rzeczywistym.",
      "Autonomiczny chatbot AI na Messengerze/WhatsAppie zbierający preferencje zabiegowe i automatycznie proponujący terminy.",
      "Zoptymalizowana w Next.js Image galeria efektów przed/po z automatyczną kompresją WebP/AVIF.",
      "Wdrożenie precyzyjnych danych strukturalnych Schema LocalBusiness (BeautySalon) w formacie JSON-LD."
    ],
    en: [
      "Interactive booking system (Booksy / Versum API) synchronized with calendars in real time.",
      "Autonomous AI chatbot on Messenger/WhatsApp capturing treatment preferences and suggesting slots.",
      "Next.js Image optimized before/after results gallery with automated WebP/AVIF compression.",
      "Implementation of precise Schema LocalBusiness (BeautySalon) structured data in JSON-LD format."
    ],
    de: [
      "Interaktives Buchungssystem (Booksy / Versum API) synchronisiert mit Kalendern in Echtzeit.",
      "Autonomer KI-Chatbot auf Messenger/WhatsApp zur Erfassung von Behandlungsvorlieben und Terminvorschlägen.",
      "Next.js Image-optimierte Vorher-Nachher-Galerie mit automatischer WebP/AVIF-Komprimierung.",
      "Implementierung präziser strukturierter Schema LocalBusiness (BeautySalon) Daten im JSON-LD-Format."
    ],
    uk: [
      "Інтерактивна система бронювання (Booksy / Versum API), синхронізована з календарем у реальному часі.",
      "Автономний чат-бот AI у Messenger/WhatsApp для збору вподобань та автоматичного підбору часу візиту.",
      "Оптимізована через Next.js Image галерея результатів до/після з автоматичним стисненням у WebP/AVIF.",
      "Впровадження точної розмітки структурованих даних Schema LocalBusiness (BeautySalon) у форматі JSON-LD."
    ],
    ru: [
      "Интерактивная система бронирования (Booksy / Versum API), синхронизированная с календарем в реальном времени.",
      "Автономный чат-бот AI в Messenger/WhatsApp для сбора предпочтений и автоматического подбора времени визита.",
      "Оптимизированная через Next.js Image галерея результатов до/после с автоматическим сжатием в WebP/AVIF.",
      "Внедрение точной разметки структурированных данных Schema LocalBusiness (BeautySalon) в формате JSON-LD."
    ],
    zh: [
      "对接第三方主流预约平台（Booksy / Versum API），实现前台日程与后台排班的实时同步。",
      "部署基于 AI 的 Messenger/WhatsApp 智能客服机器人，自动询问护理需求并智能分配空闲时段。",
      "基于 Next.js Image 组件深度优化的美容前后对比高清图集，支持 WebP/AVIF 自动分发。",
      "配置精准的 Schema LocalBusiness (BeautySalon) 结构化 JSON-LD 微数据以提升本地搜索排名。"
    ]
  },
  hairdresser: {
    pl: [
      "Interaktywny katalog fryzur i portfolio zintegrowane z Instagram API (automatyczna synchronizacja).",
      "Wieloetapowy kreator fryzur 3D online oparty na WebGL i Three.js do wizualizacji cięć.",
      "Program lojalnościowy z wbudowanym portfelem cyfrowym i integracją Apple Wallet / Google Pay.",
      "Schema JSON-LD LocalBusiness z cennikiem usług fryzjerskich (priceRange) i godzinami pracy."
    ],
    en: [
      "Interactive hairstyle catalog and portfolio integrated with Instagram API for automatic syncing.",
      "Multi-step 3D hairstyle visualizer online based on WebGL and Three.js to preview cuts.",
      "Loyalty program with built-in digital wallet and Apple Wallet / Google Pay integration.",
      "Schema JSON-LD LocalBusiness with hairdressing pricing structure (priceRange) and opening hours."
    ],
    de: [
      "Interaktiver Frisurenkatalog und Portfolio integriert mit Instagram API für automatische Synchronisierung.",
      "Mehrstufiger 3D-Frisuren-Visualisierer online basierend auf WebGL und Three.js zur Vorschau von Schnitten.",
      "Treueprogramm mit integrierter digitaler Geldbörse und Apple Wallet / Google Pay Integration.",
      "Schema JSON-LD LocalBusiness mit Friseur-Preisstruktur (priceRange) und Öffnungszeiten."
    ],
    uk: [
      "Інтерактивний каталог зачісок та портфоліо, інтегровані з Instagram API для автосинхронізації.",
      "Багатокроковий онлайн-візуалізатор зачісок у 3D на базі WebGL та Three.js для демонстрації стрижок.",
      "Програма лояльності з вбудованим цифровим гаманцем та інтеграцією з Apple Wallet / Google Pay.",
      "Schema JSON-LD LocalBusiness з детальним прайсом послуг (priceRange) та графіком роботи."
    ],
    ru: [
      "Интерактивный каталог причесок и портфолио, интегрированные с Instagram API для автосинхронизации.",
      "Пошаговый онлайн-визуализатор причесок в 3D на базе WebGL и Three.js для демонстрации стрижек.",
      "Программа лояльности с встроенным цифровым кошельком и интеграцией с Apple Wallet / Google Pay.",
      "Schema JSON-LD LocalBusiness с подробным прайсом услуг (priceRange) и графиком работы."
    ],
    zh: [
      "集成 Instagram API 的动态发型展示墙与个人作品集，支持社交媒体内容自动同步。",
      "基于 WebGL 与 Three.js 研发的 3D 在线虚拟发型发色搭配与裁剪预览系统。",
      "内置会员积分与返利系统，支持一键添加到 Apple Wallet 与 Google Pay 电子卡包。",
      "配置含发廊详细价格区间（priceRange）和营业时间的 LocalBusiness JSON-LD 结构化标记。"
    ]
  },
  cosmetologist: {
    pl: [
      "Dedykowana baza wiedzy i blog zintegrowany z headless WordPress REST API dla edukacji pacjentów.",
      "Autonomiczny Voice Bot AI (odbierający połączenia głosowe, zapisujący na wizyty medycyny estetycznej).",
      "Zabezpieczone szyfrowaniem SSL i RODO formularze kart pacjenta z historią zabiegów medycznych.",
      "Oznaczenia Schema JSON-LD (BeautySalon / MedicalBusiness) z powiązaniem ze specjalistami."
    ],
    en: [
      "Dedicated knowledge base and blog integrated with headless WordPress REST API for patient education.",
      "Autonomous AI Voice Bot (answering phone calls, booking aesthetic medicine appointments).",
      "SSL and GDPR encrypted patient intake forms with comprehensive medical treatment history.",
      "Schema JSON-LD tags (BeautySalon / MedicalBusiness) with direct practitioner links."
    ],
    de: [
      "Dedizierte Wissensdatenbank und Blog integriert mit Headless WordPress REST API zur Patientenaufklärung.",
      "Autonomer KI-Sprachbot zur Entgegennahme von Telefonanrufen und Buchung von Terminen für ästhetische Medizin.",
      "SSL- und DSGVO-verschlüsselte Patientenaufnahmeformulare mit vollständiger medizinischer Behandlungshistorie.",
      "Schema JSON-LD Tags (BeautySalon / MedicalBusiness) mit direkter Verknüpfung zu Behandlern."
    ],
    uk: [
      "Спеціалізована база знань та блог, інтегровані з headless WordPress REST API для навчання пацієнтів.",
      "Автономний голосовий бот AI для прийому дзвінків та запису на процедури естетичної медицини.",
      "Захищені шифруванням SSL та GDPR форми карт пацієнтів з історією проведених процедур.",
      "Розмітка Schema JSON-LD (BeautySalon / MedicalBusiness) із прив'язкою до конкретних спеціалістів."
    ],
    ru: [
      "Специализированная база знаний и блог, интегрированные с headless WordPress REST API для обучения пациентов.",
      "Autonomny голосовой бот AI для приема звонков и записи на процедуры эстетической медицины.",
      "Защищенные шифрованием SSL и GDPR формы карт пациентов с историей проведенных процедур.",
      "Разметка Schema JSON-LD (BeautySalon / MedicalBusiness) с привязкой к конкретным специалистам."
    ],
    zh: [
      "通过 Headless WordPress REST API 驱动的专业美容护肤知识库与科普博客前端页面。",
      "部署 AI 智能语音电话机器人，支持全天候自动接听咨询并完成医美项目预约排班。",
      "经过 SSL 强加密并符合 RODO/GDPR 隐私规范的在线顾客电子病历与疗程档案管理模块。",
      "配置精细 of Schema JSON-LD 标签，混合 BeautySalon 与 MedicalBusiness 双重属性以优化收录。"
    ]
  },
  masseur: {
    pl: [
      "Interaktywny system zakupu kart podarunkowych i voucherów online z automatycznym generowaniem PDF i kodów QR.",
      "Lekka, zoptymalizowana pod mobile strona zintegrowana z interaktywnym wyborem technik masażu (React).",
      "System powiadomień e-mail/SMS z prośbą o opinię po zabiegu, zintegrowany z wizytówką Google Maps.",
      "Implementacja Schema JSON-LD LocalBusiness pod kątem fraz związanych z masażem i relaksem."
    ],
    en: [
      "Interactive gift card and voucher purchase system online with automated PDF and QR code generation.",
      "Lightweight, mobile-optimized site integrated with interactive massage technique selector (React).",
      "Email/SMS feedback request system post-treatment, integrated with Google Maps profile.",
      "Schema JSON-LD LocalBusiness implementation targeting massage and relaxation keywords."
    ],
    de: [
      "Interaktives Geschenkkarten- und Gutscheinkaufsystem online mit automatischer PDF- und QR-Code-Generierung.",
      "Leichte, mobiloptimierte Website mit interaktiver Auswahl der Massagetechniken (React).",
      "E-Mail/SMS-Feedback-System nach der Behandlung, integriert in das Google Maps-Profil.",
      "Schema JSON-LD LocalBusiness-Implementierung ausgerichtet auf Massage- und Entspannungs-Keywords."
    ],
    uk: [
      "Інтерактивна система купівлі подарункових сертифікатів онлайн з автоматичною генерацією PDF та QR-кодів.",
      "Легкий мобільний сайт, інтегрований з інтерактивним вибором технік масажу на React.",
      "Система збору відгуків через e-mail/SMS після сеансу, інтегрована з профілем Google Maps.",
      "Впровадження Schema JSON-LD LocalBusiness під пошукові запити, пов'язані з масажем і релаксацією."
    ],
    ru: [
      "Интерактивная система покупки подарочных сертификатов онлайн с автоматической генерацией PDF и QR-кодов.",
      "Легкий мобильный сайт, интегрированный с интерактивным выбором техник массажа на React.",
      "Система сбора отзывов через e-mail/SMS после сеанса, интегрированная с профилем Google Maps.",
      "Внедрение Schema JSON-LD LocalBusiness под поисковые запросы, связанные с массажем и релаксацией."
    ],
    zh: [
      "线上礼品卡与代金券自助订购系统，支持自动生成电子 PDF 优惠券及防伪核销 QR 码。",
      "轻量化移动优先页面，配置基于 React 编写的交互式按摩理疗方案与套餐自选组件。",
      "理疗结束后自动触发 of 邮件/短信评价邀请机制，无缝关联并提升 Google 地图商家好评率。",
      "配置专用的 LocalBusiness 结构化 Schema JSON-LD 标签，侧重推拿按摩与放松解压本地词优化。"
    ]
  },
  personalTrainer: {
    pl: [
      "Zintegrowana strefa klienta (React / Next.js) z planami treningowymi, dietetycznymi i śledzeniem postępów.",
      "Automatyczny kalkulator zapotrzebowania kalorycznego (BMR/TDEE) i makroskładników w czasie rzeczywistym.",
      "Baza ćwiczeń wideo z odtwarzaczem zoptymalizowanym pod kątem transferu danych mobilnych (Cloudinary Video).",
      "Schema JSON-LD LocalBusiness z bogatym profilem społecznościowym i cennikiem treningów indywidualnych."
    ],
    en: [
      "Integrated client portal (React / Next.js) for workout plans, nutrition guidance, and progress tracking.",
      "Automated real-time BMR/TDEE and macronutrient calculator for tailored fitness advice.",
      "Video exercise library with a player optimized for low mobile data usage (Cloudinary Video).",
      "Schema JSON-LD LocalBusiness with social media links and personal training package rates."
    ],
    de: [
      "Integriertes Kundenportal (React / Next.js) für Trainingspläne, Ernährungsberatung und Fortschrittsverfolgung.",
      "Automatischer Echtzeit-BMR/TDEE- und Makronährstoff-Rechner für maßgeschneiderte Fitnessberatung.",
      "Video-Übungsbibliothek mit einem für geringe mobile Datennutzung optimierten Player (Cloudinary Video).",
      "Schema JSON-LD LocalBusiness mit Social-Media-Links und Preisen für Personal-Training-Pakete."
    ],
    uk: [
      "Інтегрований кабінет клієнта (React / Next.js) з планами тренувань, харчування та відстеженням прогресу.",
      "Автоматичний калькулятор добової потреби калорій (BMR/TDEE) та макронутриєнтів у реальному часі.",
      "Відеотека вправ з плеєром, оптимізованим під мінімальне використання мобільного трафіку (Cloudinary Video).",
      "Schema JSON-LD LocalBusiness з інтеграцією соціальних мереж та прайсом на індивідуальні тренування."
    ],
    ru: [
      "Интегрированный личный кабинет клиента (React / Next.js) с планами тренировок, питания и отслеживанием прогресса.",
      "Автоматический калькулятор суточной потребности калорий (BMR/TDEE) и макронутриентов в реальном времени.",
      "Видеотека упражнений с плеером, оптимизированным под минимальное использование мобильного трафика (Cloudinary Video).",
      "Schema JSON-LD LocalBusiness с интеграцией социальных сетей и прайсом на индивидуальные тренировки."
    ],
    zh: [
      "集成在 React/Next.js 前台的客户个人中心，包含健身训练计划、饮食管理与身体维度追踪系统。",
      "基于客户端运行的实时基础代谢率（BMR）及每日总能耗（TDEE）宏量营养素计算器。",
      "部署基于 Cloudinary Video 编码调优的动作库小视频播放器，保障手机弱网下极速播放且省流量。",
      "配置专属的 LocalBusiness Schema JSON-LD，关联私教社交账号及一对一专属私教课时价格。"
    ]
  }
};

// Database of core requirements for each industry category in 6 languages.
const industryCoreSpecs = {
  doctor: {
    pl: [
      "Budowa ultra-lekkiej strony (Vite & React / Next.js) ładującej się w ułamku sekundy, z optymalizacją obrazów medycznych.",
      "Integracja z systemem powiadomień SMS (Twilio / SMSAPI) dla natychmiastowego potwierdzania wizyt pacjentów.",
      "Przycisk bezpośredniego połączenia telefonicznego zoptymalizowany pod kątem konwersji mobilnej (Mobile-First Click-to-Call)."
    ],
    en: [
      "Ultra-lightweight website development (Vite & React / Next.js) loading in a fraction of a second, with medical image optimization.",
      "Integration with SMS dispatch (Twilio / SMSAPI) for instant patient booking confirmations.",
      "Mobile-first direct call button (Click-to-Call) optimized for maximum call conversion rates."
    ],
    de: [
      "Entwicklung einer ultra-leichten Website (Vite & React / Next.js), die in Sekundenbruchteilen lädt, mit medizinischer Bildoptimierung.",
      "SMS-Benachrichtigungssystem (Twilio / SMSAPI) für sofortige Terminbestätigungen von Patienten.",
      "Direktruf-Schaltfläche optimiert für mobile Endgeräte (Mobile-First Click-to-Call) zur Maximierung der Conversions."
    ],
    uk: [
      "Створення надлегкого сайту (Vite & React / Next.js), що завантажується за частку секунди, з оптимізацією медичних зображень.",
      "Інтеграція з системою SMS-сповіщень (Twilio / SMSAPI) для миттєвого підтвердження записів пацієнтів.",
      "Кнопка прямого телефонного дзвінка, оптимізована для мобільної конверсії (Mobile-First Click-to-Call)."
    ],
    ru: [
      "Создание сверхлегкого сайта (Vite & React / Next.js), загружающегося за долю секунды, с оптимизацией медицинских изображений.",
      "Интеграция с системой SMS-оповещений (Twilio / SMSAPI) для мгновенного подтверждения записей пациентов.",
      "Кнопка прямого телефонного звонка, оптимизированная для мобильной конверсии (Mobile-First Click-to-Call)."
    ],
    zh: [
      "构建超轻量级（Vite & React / Next.js）页面，毫秒级瞬间加载，配合医学影像优化。",
      "深度集成短信网关（Twilio / SMSAPI），用于就诊时间实时确认与通知。",
      "针对移动端专门优化的 Mobile-First Click-to-Call 一键呼叫按钮，极大提升来电转化率。"
    ]
  },
  lawyer: {
    pl: [
      "Budowa ultra-lekkiej strony (Vite & React / Next.js) ładującej się w ułamku sekundy, bez zbędnych bibliotek blokujących wątek.",
      "Integracja z systemem powiadomień SMS (Twilio / SMSAPI) dla natychmiastowego zgłaszania spraw i zapytań prawnych.",
      "Przycisk bezpośredniego połączenia telefonicznego zoptymalizowany pod kątem konwersji mobilnej (Mobile-First Click-to-Call)."
    ],
    en: [
      "Ultra-lightweight website development (Vite & React / Next.js) loading in a fraction of a second, without thread-blocking libraries.",
      "Integration with SMS dispatch (Twilio / SMSAPI) for instant notifications of legal inquiries.",
      "Mobile-first direct call button (Click-to-Call) optimized for maximum call conversion rates."
    ],
    de: [
      "Entwicklung einer ultra-leichten Website (Vite & React / Next.js), die in Sekundenbruchteilen lädt, ohne den Thread blockierende Bibliotheken.",
      "SMS-Benachrichtigungssystem (Twilio / SMSAPI) für sofortige rechtliche Anfragen und Aktenbenachrichtigungen.",
      "Direktruf-Schaltfläche optimiert für mobile Endgeräte (Mobile-First Click-to-Call) zur Maximierung der Conversions."
    ],
    uk: [
      "Створення надлегкого сайту (Vite & React / Next.js), що завантажується за частку секунди, без бібліотек, які блокують потік.",
      "Інтеграція з системою SMS-сповіщень (Twilio / SMSAPI) для миттєвих сповіщень про нові юридичні справи.",
      "Кнопка прямого телефонного дзвінка, оптимізована для мобільної конверсії (Mobile-First Click-to-Call)."
    ],
    ru: [
      "Создание сверхлегкого сайта (Vite & React / Next.js), загружающегося за долю секунды, без блокирующих поток библиотек.",
      "Интеграция с системой SMS-оповещений (Twilio / SMSAPI) для мгновенных уведомлений о новых юридических делах.",
      "Кнопка прямого телефонного звонка, оптимизированная для мобильной конверсии (Mobile-First Click-to-Call)."
    ],
    zh: [
      "构建超轻量级（Vite & React / Next.js）页面，毫秒级瞬间加载，杜绝任何阻塞主线程的冗余库。",
      "深度集成短信网关（Twilio / SMSAPI），用于法律咨询及案件线索实时通报。",
      "针对移动端专门优化的 Mobile-First Click-to-Call 一键呼叫按钮，极大提升来电转化率。"
    ]
  },
  psychologist: {
    pl: [
      "Budowa ultra-lekkiej strony (Vite & React / Next.js) dla gabinetów psychoterapii i poradnictwa.",
      "Integracja z systemem powiadomień SMS (Twilio / SMSAPI) dla dyskretnego potwierdzania terminów sesji.",
      "Przycisk bezpośredniego połączenia telefonicznego zoptymalizowany pod kątem konwersji mobilnej (Mobile-First Click-to-Call)."
    ],
    en: [
      "Ultra-lightweight website development (Vite & React / Next.js) tailored for psychotherapy clinics.",
      "Integration with SMS dispatch (Twilio / SMSAPI) for discreet therapy session reminders.",
      "Mobile-first direct call button (Click-to-Call) optimized for maximum call conversion rates."
    ],
    de: [
      "Entwicklung einer ultra-leichten Website (Vite & React / Next.js) für Psychotherapie-Praxen.",
      "SMS-Benachrichtigungssystem (Twilio / SMSAPI) für diskrete Therapiesitzungserinnerungen.",
      "Direktruf-Schaltfläche optimiert für mobile Endgeräte (Mobile-First Click-to-Call) zur Maximierung der Conversions."
    ],
    uk: [
      "Створення надлегкого сайту (Vite & React / Next.js) для кабінетів психотерапії та консультування.",
      "Інтеграція з системою SMS-сповіщень (Twilio / SMSAPI) для конфіденційного нагадування про сеанси.",
      "Кнопка прямого телефонного дзвінка, оптимізована для мобільної конверсії (Mobile-First Click-to-Call)."
    ],
    ru: [
      "Создание сверхлегкого сайта (Vite & React / Next.js) для кабинетов психотерапии и консультирования.",
      "Интеграция с системой SMS-оповещений (Twilio / SMSAPI) для конфиденциального напоминания о сеансах.",
      "Кнопка прямого телефонного звонка, оптимизированная для мобильной конверсии (Mobile-First Click-to-Call)."
    ],
    zh: [
      "构建超轻量级（Vite & React / Next.js）页面，毫秒级瞬间加载，适合心理咨询诊所。",
      "深度集成短信网关（Twilio / SMSAPI），用于会谈日程的保密级自动提醒与确认。",
      "针对移动端专门优化的 Mobile-First Click-to-Call 一键呼叫按钮，极大提升来电转化率。"
    ]
  },
  accountant: {
    pl: [
      "Budowa ultra-lekkiej strony (Vite & React / Next.js) ładującej się w ułamku sekundy, bez zbędnych bibliotek.",
      "Integracja z systemem powiadomień SMS (Twilio / SMSAPI) do automatycznych alertów o terminach podatkowych.",
      "Przycisk bezpośredniego połączenia telefonicznego zoptymalizowany pod kątem konwersji mobilnej (Mobile-First Click-to-Call)."
    ],
    en: [
      "Ultra-lightweight website development (Vite & React / Next.js) loading in a fraction of a second, without thread-blocking libraries.",
      "Integration with SMS dispatch (Twilio / SMSAPI) for automated tax deadline alerts.",
      "Mobile-first direct call button (Click-to-Call) optimized for maximum call conversion rates."
    ],
    de: [
      "Entwicklung einer ultra-leichten Website (Vite & React / Next.js), die in Sekundenbruchteilen lädt, ohne den Thread blockierende Bibliotheken.",
      "SMS-Benachrichtigungssystem (Twilio / SMSAPI) für automatische Steuerfristalarme.",
      "Direktruf-Schaltfläche optimiert für mobile Endgeräte (Mobile-First Click-to-Call) zur Maximierung der Conversions."
    ],
    uk: [
      "Створення надлегкого сайту (Vite & React / Next.js), що завантажується за частку секунди, без бібліотек, які блокують потік.",
      "Інтеграція з системою SMS-сповіщень (Twilio / SMSAPI) для автоматичних нагадувань про податкові терміни.",
      "Кнопка прямого телефонного дзвінка, оптимізована для мобільної конверсії (Mobile-First Click-to-Call)."
    ],
    ru: [
      "Создание сверхлегкого сайта (Vite & React / Next.js), загружающегося за долю секунды, без блокирующих поток библиотек.",
      "Интеграция с системой SMS-оповещений (Twilio / SMSAPI) для автоматических напоминаний о налоговых сроках.",
      "Кнопка прямого телефонного звонка, оптимизированная для мобильной конверсии (Mobile-First Click-to-Call)."
    ],
    zh: [
      "构建超轻量级（Vite & React / Next.js）页面，毫秒级瞬间加载，杜绝任何阻塞主线程的冗余库。",
      "深度集成短信网关（Twilio / SMSAPI），用于纳税申报及社保缴费等申报节点自动短信提醒。",
      "针对移动端专门优化的 Mobile-First Click-to-Call 一键呼叫按钮，极大提升来电转化率。"
    ]
  },
  architect: {
    pl: [
      "Budowa ultra-lekkiej strony (Vite & React / Next.js) ładującej się w ułamku sekundy, z optymalizacją ciężkich portfolio i grafik.",
      "Integracja z systemem powiadomień SMS (Twilio / SMSAPI) dla błyskawicznego potwierdzania konsultacji projektowych.",
      "Przycisk bezpośredniego połączenia telefonicznego zoptymalizowany pod kątem konwersji mobilnej (Mobile-First Click-to-Call)."
    ],
    en: [
      "Ultra-lightweight website development (Vite & React / Next.js) loading in a fraction of a second, with portfolio image optimization.",
      "Integration with SMS dispatch (Twilio / SMSAPI) for instant design consultation booking confirmations.",
      "Mobile-first direct call button (Click-to-Call) optimized for maximum call conversion rates."
    ],
    de: [
      "Entwicklung einer ultra-leichten Website (Vite & React / Next.js), die in Sekundenbruchteilen lädt, mit Portfolio-Bildoptimierung.",
      "SMS-Benachrichtigungssystem (Twilio / SMSAPI) für sofortige Designberatungsterminbestätigungen.",
      "Direktruf-Schaltfläche optimiert für mobile Endgeräte (Mobile-First Click-to-Call) zur Maximierung der Conversions."
    ],
    uk: [
      "Створення надлегкого сайту (Vite & React / Next.js), що завантажується за частку секунди, з оптимізацією портфоліо та зображень.",
      "Інтеграція з системою SMS-сповіщень (Twilio / SMSAPI) для миттєвого підтвердження записів на консультації.",
      "Кнопка прямого телефонного дзвінка, оптимізована для мобільної конверсії (Mobile-First Click-to-Call)."
    ],
    ru: [
      "Создание сверхлегкого сайта (Vite & React / Next.js), загружающегося за долю секунды, с оптимизацией портфолио и изображений.",
      "Интеграция с системой SMS-оповещений (Twilio / SMSAPI) для мгновенного подтверждения записей на консультации.",
      "Кнопка прямого телефонного звонка, оптимизированная для мобильной конверсии (Mobile-First Click-to-Call)."
    ],
    zh: [
      "构建超轻量级（Vite & React / Next.js）页面，毫秒级瞬间加载，针对高精图集实施多重压缩优化。",
      "深度集成短信网关（Twilio / SMSAPI），用于客户创意方案咨询与确认。",
      "针对移动端专门优化的 Mobile-First Click-to-Call 一键呼叫按钮，极大提升来电转化率。"
    ]
  },
  construction: {
    pl: [
      "Budowa ultra-lekkiej strony (Vite & React / Next.js) ładującej się w ułamku sekundy, bez zbędnych bibliotek blokujących wątek.",
      "Integracja z systemem powiadomień SMS (Twilio / SMSAPI) dla natychmiastowego zgłaszania awarii i zleceń budowlanych.",
      "Przycisk bezpośredniego połączenia telefonicznego zoptymalizowany pod kątem konwersji mobilnej (Mobile-First Click-to-Call)."
    ],
    en: [
      "Ultra-lightweight website development (Vite & React / Next.js) loading in a fraction of a second, without thread-blocking libraries.",
      "Integration with SMS dispatch (Twilio / SMSAPI) for instant emergency service and job alerts.",
      "Mobile-first direct call button (Click-to-Call) optimized for maximum call conversion rates."
    ],
    de: [
      "Entwicklung einer ultra-leichten Website (Vite & React / Next.js), die in Sekundenbruchteilen lädt, ohne den Thread blockierende Bibliotheken.",
      "SMS-Benachrichtigungssystem (Twilio / SMSAPI) für sofortige Notfalleinsätze und Bauauftragsalarme.",
      "Direktruf-Schaltfläche optimiert für mobile Endgeräte (Mobile-First Click-to-Call) zur Maximierung der Conversions."
    ],
    uk: [
      "Створення надлегкого сайту (Vite & React / Next.js), що завантажується за частку секунди, без бібліотек, які блокують потік.",
      "Інтеграція з системою SMS-сповіщень (Twilio / SMSAPI) для моментального інформування про аварії та замовлення.",
      "Кнопка швидкого дзвінка, адаптована під мобільні екрани для покращення конверсії (Mobile-First Click-to-Call)."
    ],
    ru: [
      "Создание сверхлегкого сайта (Vite & React / Next.js), загружающегося за долю секунды, без блокирующих поток библиотек.",
      "Интеграция с SMS-оповещениями (Twilio / SMSAPI) для срочной отправки аварийных заявок мастеру на телефон.",
      "Кнопка быстрого вызова, оптимизированная под мобильных пользователей (Mobile-First Click-to-Call)."
    ],
    zh: [
      "采用 Vite 与 React 搭建超轻量级静态单页，确保弱网甚至无网环境下实现秒开。",
      "整合 Twilio 或本地 SMSAPI 短信通知通道，当用户提交紧急报修或施工委托时，手机瞬间收到警报。",
      "针对移动端触控优化的 Click-to-Call 一键呼叫按钮，极大缩短客户转化路径。"
    ]
  },
  beauty: {
    pl: [
      "Budowa ultra-lekkiej strony (Vite & React / Next.js) zoptymalizowanej pod kątem szybkiej rezerwacji wizyt online.",
      "Integracja z systemem powiadomień SMS (Twilio / SMSAPI) dla automatycznych przypomnień o terminach zabiegów.",
      "Przycisk bezpośredniego połączenia telefonicznego oraz szybkiego kontaktu przez WhatsApp (Mobile-First)."
    ],
    en: [
      "Ultra-lightweight website (Vite & React / Next.js) optimized for fast online booking and scheduling.",
      "Integration with SMS notifications (Twilio / SMSAPI) for automated appointment and booking reminders.",
      "Mobile-first click-to-call button and direct WhatsApp quick contact integration."
    ],
    de: [
      "Entwicklung einer ultra-leichten Website (Vite & React / Next.js), optimiert für schnelle Online-Terminbuchung.",
      "SMS-Benachrichtigungssystem (Twilio / SMSAPI) für automatische Erinnerungen an Behandlungstermine.",
      "Direktruf-Schaltfläche und schnelle WhatsApp-Kontakt-Integration optimiert für mobile Endgeräte."
    ],
    uk: [
      "Створення надлегкого сайту (Vite & React / Next.js), оптимізованого для швидкого онлайн-запису на прийом.",
      "Інтеграція з системою SMS-сповіщень (Twilio / SMSAPI) для автоматичних нагадувань про процедури.",
      "Кнопка швидкого дзвінка та інтеграція швидкого зв'язку через WhatsApp (Mobile-First)."
    ],
    ru: [
      "Создание сверхлегкого сайта (Vite & React / Next.js), оптимизированного для быстрой онлайн-записи на процедуры.",
      "Интеграция с системой SMS-оповещений (Twilio / SMSAPI) для автоматических напоминаний о визитах.",
      "Кнопка быстрого звонка и интеграция быстрого контакта через WhatsApp (Mobile-First)."
    ],
    zh: [
      "构建超轻量级（Vite & React / Next.js）页面，针对线上预约与排班日程进行极速加载优化。",
      "深度集成短信网关（Twilio / SMSAPI），用于客户护理及美容预约时间自动提醒。",
      "针对移动端专门优化的 Mobile-First 一键呼叫按钮与 WhatsApp 快捷咨询通道。"
    ]
  }
};

// Main logic to iterate through data/industries directories, load each JSON file, and update specifications.
console.log("Starting specifications update process for all 41 specializations...");

const categories = fs.readdirSync(industriesDir);
let filesUpdated = 0;

categories.forEach(category => {
  const categoryPath = path.join(industriesDir, category);
  if (!fs.existsSync(categoryPath) || !fs.statSync(categoryPath).isDirectory()) {
    return;
  }

  const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.json') && file !== 'main.json');
  
  files.forEach(file => {
    const filePath = path.join(categoryPath, file);
    const profId = file.replace('.json', '');
    const customSpecs = specsData[profId];

    if (!customSpecs) {
      console.warn(`No custom specifications defined for profession: ${profId} in ${category}`);
      return;
    }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      let updated = false;

      // Update specifications array for each available locale
      Object.keys(data).forEach(locale => {
        if (!data[locale] || typeof data[locale] !== 'object') {
          return;
        }
        let baseSpecs = [];
        if (customSpecs[locale]) {
          baseSpecs = customSpecs[locale];
        } else {
          baseSpecs = customSpecs.en || customSpecs.pl;
        }

        // Get core specs for this category and locale
        const categoryCore = industryCoreSpecs[category];
        let coreSpecsForLocale = [];
        if (categoryCore) {
          coreSpecsForLocale = categoryCore[locale] || categoryCore.en || categoryCore.pl;
        }

        // Merge: 3 core specs first, then the custom specs
        const combinedSpecs = [...coreSpecsForLocale];
        
        baseSpecs.forEach(spec => {
          // Check if this spec is not already covered in coreSpecs (avoid duplicates)
          const isDuplicate = combinedSpecs.some(core => 
            core.toLowerCase().includes(spec.slice(0, 15).toLowerCase()) ||
            spec.toLowerCase().includes(core.slice(0, 15).toLowerCase())
          );
          if (!isDuplicate) {
            combinedSpecs.push(spec);
          }
        });

        // Limit to maximum of 6 specifications to keep it neat (perfectly balanced 3x2 grid)
        data[locale].specifications = combinedSpecs.slice(0, 6);
        updated = true;
      });

      if (updated) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Successfully updated: ${filePath}`);
        filesUpdated++;
      }
    } catch (err) {
      console.error(`Error updating file ${filePath}:`, err.message);
    }
  });
});

console.log(`Update process completed successfully! Total files updated: ${filesUpdated}`);
