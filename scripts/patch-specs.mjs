import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'scripts/update-all-specifications.mjs');
let content = fs.readFileSync(filePath, 'utf8');

const beautyIdx = content.indexOf('  beauty: {');
if (beautyIdx === -1) {
  console.error('Could not find beauty key!');
  process.exit(1);
}

const endIdx = content.indexOf('};', beautyIdx);
if (endIdx === -1) {
  console.error('Could not find closing }; of industryCoreSpecs!');
  process.exit(1);
}

// Find the last closing brace '}' before '};'
const lastBraceIdx = content.lastIndexOf('}', endIdx);

const automotiveCoreSpecs = `,
  automotive: {
    pl: [
      "Budowa ultra-lekkiej strony (Vite & React / Next.js) ładującej się w ułamku sekundy, bez zbędnych bibliotek blokujących wątek.",
      "Integracja z systemem powiadomień SMS (Twilio / SMSAPI) dla natychmiastowego zgłaszania awarii i umawiania wizyt.",
      "Przycisk bezpośredniego połączenia telefonicznego zoptymalizowany pod kątem konwersji mobilnej (Mobile-First Click-to-Call)."
    ],
    en: [
      "Ultra-lightweight website development (Vite & React / Next.js) loading in a fraction of a second, without thread-blocking libraries.",
      "Integration with SMS dispatch (Twilio / SMSAPI) for instant alerts and booking notifications.",
      "Mobile-first direct call button (Click-to-Call) optimized for maximum call conversion rates."
    ],
    de: [
      "Entwicklung einer ultra-leichten Website (Vite & React / Next.js), die in Sekundenbruchteilen lädt, ohne den Thread blockierende Bibliotheken.",
      "SMS-Benachrichtigungssystem (Twilio / SMSAPI) für Notfall- und Buchungsalarme in Echtzeit.",
      "Direktruf-Schaltfläche optimiert für mobile Endgeräte (Mobile-First Click-to-Call) zur Maximierung der Conversions."
    ],
    uk: [
      "Створення надлегкого сайту (Vite & React / Next.js), що завантажується за частку секунди, без бібліотек, які блокують потік.",
      "Інтеграція з системою SMS-сповіщень (Twilio / SMSAPI) для моментальних сповіщень та записів.",
      "Кнопка прямого телефонного дзвінка, оптимізована для мобільної конверсії (Mobile-First Click-to-Call)."
    ],
    ru: [
      "Создание сверхлегкого сайта (Vite & React / Next.js), загружающегося за долю секунды, без блокирующих поток библиотек.",
      "Интеграция с системой SMS-оповещений (Twilio / SMSAPI) для моментальных уведомлений и записей.",
      "Кнопка прямого телефонного звонка, оптимизированная для мобильной конверсии (Mobile-First Click-to-Call)."
    ],
    zh: [
      "构建超轻量级（Vite & React / Next.js）页面，毫秒级瞬间加载，杜绝任何阻塞主线程的冗余库。",
      "深度集成短信网关（Twilio / SMSAPI），用于即时提醒与预约通知。",
      "针对移动端专门优化的 Mobile-First Click-to-Call 一键呼叫按钮，极大提升来电转化率。"
    ]
  }`;

// Insert automotiveCoreSpecs right before the last closing brace
content = content.slice(0, lastBraceIdx) + automotiveCoreSpecs + "\n  " + content.slice(lastBraceIdx);

// Update console log message
content = content.replace(
  'console.log("Starting specifications update process for all 41 specializations...");',
  'console.log("Starting specifications update process for all 46 specializations...");'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched update-all-specifications.mjs!');
