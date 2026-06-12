'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  lang: string;
  phone?: string;
  email?: string;
}

/* ── Animated counter hook ── */
function useCounter(target: number, duration = 1200, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

/* ── Lighthouse bar ── */
function LighthouseBar({
  label,
  score,
  color,
  animate,
}: {
  label: string;
  score: number;
  color: string;
  animate: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-36 shrink-0 text-slate-600 dark:text-slate-400 text-xs font-medium">{label}</span>
      <div className="flex-1 h-[6px] rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]"
          style={{ width: animate ? `${score}%` : '0%', background: color }}
        />
      </div>
      <span className="w-10 text-right font-semibold text-slate-800 dark:text-slate-200 text-xs tabular-nums">
        {score}/100
      </span>
    </div>
  );
}

const translations = {
  pl: {
    badge: 'webwawa.pl · Warszawa · 2026',
    h1a: 'Twoja strona ładuje się w',
    h1b: 'Konkurencja traci klientów —',
    h1c: 'Ty ich zgarniasz.',
    chartTitle: 'Lighthouse Score — nasze realizacje 90+',
    yourSite: 'Twoja strona',
    industryAvg: 'Średnia branży',
    typicalWordpress: 'Typical WordPress',
    metric1: 'przetestowanych rozwiązań',
    metric2: 'bezpłatna wycena',
    metric3: 'PWA · offline ready',
    metric4: 'wolne miejsca w czerwcu',
    proof1: 'Next.js · React · Tailwind',
    proof2: 'Własny kod, zero page builders',
    proof3: 'Warszawa i cała Polska',
    cta: 'Pobierz bezpłatną wycenę',
    call: 'lub zadzwoń',
    response: 'Odpowiadamy w < 2h',
    trust1: 'Wydajność 90+ gwarantowana umową',
    trust2: 'Wsparcie 12 miesięcy po wdrożeniu',
    trust3: 'SEO techniczne w cenie',
    altTeam: 'Zespół webwawa.pl projektujący dedykowane aplikacje i strony internetowe',
    altCode: 'Wysokiej jakości czysty kod Next.js i Tailwind CSS programowany w webwawa.pl',
  },
  en: {
    badge: 'webwawa.pl · Warsaw · 2026',
    h1a: 'Your site loads in',
    h1b: 'Competitors lose users —',
    h1c: 'you take them.',
    chartTitle: 'Lighthouse Score — our projects 90+',
    yourSite: 'Your site',
    industryAvg: 'Industry avg',
    typicalWordpress: 'Typical WordPress',
    metric1: 'tested solutions',
    metric2: 'free quote',
    metric3: 'PWA · offline ready',
    metric4: 'slots left in June',
    proof1: 'Next.js · React · Tailwind',
    proof2: 'Custom code, no page builders',
    proof3: 'Warsaw & all of Poland',
    cta: 'Get a free quote',
    call: 'or call us',
    response: 'We reply in < 2h',
    trust1: '90+ performance guaranteed by contract',
    trust2: '12-month post-launch support',
    trust3: 'Technical SEO included',
    altTeam: 'webwawa.pl team designing custom web applications and websites',
    altCode: 'High quality clean Next.js and Tailwind CSS code developed by webwawa.pl',
  },
  uk: {
    badge: 'webwawa.pl · Варшава · 2026',
    h1a: 'Ваш сайт завантажується за',
    h1b: 'Конкуренти втрачають клієнтів —',
    h1c: 'Ви їх забираєте.',
    chartTitle: 'Lighthouse Score — наші роботи 90+',
    yourSite: 'Ваш сайт',
    industryAvg: 'Середнє по галузі',
    typicalWordpress: 'Typical WordPress',
    metric1: 'протестованих рішень',
    metric2: 'безкоштовна оцінка',
    metric3: 'PWA · offline ready',
    metric4: 'вільні місця в червні',
    proof1: 'Next.js · React · Tailwind',
    proof2: 'Власний kod, bez конструкторів',
    proof3: 'Варшава та вся Польща',
    cta: 'Отримати безкоштовну оцінку',
    call: 'або зателефонуйте',
    response: 'Відповідаємо за < 2 год',
    trust1: 'Продуктивність 90+ гарантована договором',
    trust2: '12 місяців підтримки після запуску',
    trust3: 'Технічне SEO включено у вартість',
    altTeam: 'Команда webwawa.pl розробляє веб-додатки та веб-сайти',
    altCode: 'Якісний чистий код Next.js і Tailwind CSS від webwawa.pl',
  },
  ru: {
    badge: 'webwawa.pl · Варшава · 2026',
    h1a: 'Ваш сайт загружается за',
    h1b: 'Конкуренты теряют клиентов —',
    h1c: 'Вы их забираете.',
    chartTitle: 'Lighthouse Score — наши работы 90+',
    yourSite: 'Ваш сайт',
    industryAvg: 'Среднее по отрасли',
    typicalWordpress: 'Typical WordPress',
    metric1: 'протестированных решений',
    metric2: 'бесплатная оценка',
    metric3: 'PWA · offline ready',
    metric4: 'свободные места в июне',
    proof1: 'Next.js · React · Tailwind',
    proof2: 'Собственный код, без конструкторов',
    proof3: 'Варшава и вся Польща',
    cta: 'Получить бесплатную оценку',
    call: 'или позвоните',
    response: 'Отвечаем за < 2 ч',
    trust1: 'Производительность 90+ гарантирована договором',
    trust2: '12 месяцев поддержки после запуска',
    trust3: 'Техническое SEO включено в стоимость',
    altTeam: 'Команда webwawa.pl разрабатывает веб-приложения и веб-сайты',
    altCode: 'Качественный чистый код Next.js и Tailwind CSS от webwawa.pl',
  },
  de: {
    badge: 'webwawa.pl · Warschau · 2026',
    h1a: 'Ihre Website lädt in',
    h1b: 'Die Konkurrenz verliert Kunden —',
    h1c: 'Sie gewinnen sie.',
    chartTitle: 'Lighthouse Score — unsere Projekte 90+',
    yourSite: 'Ihre Website',
    industryAvg: 'Branchen-Durchschnitt',
    typicalWordpress: 'Typical WordPress',
    metric1: 'getestete Lösungen',
    metric2: 'kostenloses Angebot',
    metric3: 'PWA · offline ready',
    metric4: 'freie Plätze im Juni',
    proof1: 'Next.js · React · Tailwind',
    proof2: 'Eigener Code, keine Page Builder',
    proof3: 'Warschau & ganz Polen',
    cta: 'Kostenloses Angebot anfordern',
    call: 'oder rufen Sie uns an',
    response: 'Antwort in < 2 Std.',
    trust1: '90+ Performance vertraglich garantiert',
    trust2: '12 Monate Support nach dem Launch',
    trust3: 'Technisches SEO inklusive',
    altTeam: 'webwawa.pl Team beim Entwurf von Webanwendungen und Websites',
    altCode: 'Hochwertiger, sauberer Next.js- und Tailwind CSS-Code von webwawa.pl',
  },
  zh: {
    badge: 'webwawa.pl · 华沙 · 2026',
    h1a: '您的网站加载仅需',
    h1b: '竞争对手正在失去客户 ——',
    h1c: '而您赢得了他们。',
    chartTitle: 'Lighthouse 评分 —— 我们的项目 90+',
    yourSite: '您的网站',
    industryAvg: '行业平均',
    typicalWordpress: 'Typical WordPress',
    metric1: '已测试的解决方案',
    metric2: '免费估价',
    metric3: 'PWA · 离线可用',
    metric4: '六月空余名额',
    proof1: 'Next.js · React · Tailwind',
    proof2: '自研代码，无网页构建器',
    proof3: '华沙及全波兰',
    cta: '获取免费估价',
    call: '或致电我们',
    response: '2小时内回复',
    trust1: '合同保障 90+ 性能体验',
    trust2: '上线后 12 个月技术支持',
    trust3: '包含技术性 SEO 优化',
    altTeam: 'webwawa.pl 团队设计定制 Web 应用和网站',
    altCode: '由 webwawa.pl 开发的高质量整洁 Next.js 和 Tailwind CSS 代码',
  }
};

type Locale = keyof typeof translations;

export default function HeroSection({ lang, phone, email }: HeroSectionProps) {
  const activeLang = (Object.keys(translations).includes(lang) ? lang : 'pl') as Locale;
  const t = translations[activeLang] || translations['pl'];
  
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const projectCount = useCounter(98, 1400, visible);

  const phoneNum = phone || '+48664946209';
  const phoneLabel = phone || '+48 664 946 209';

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-32 overflow-hidden bg-transparent dark:bg-transparent transition-colors z-10"
    >
      {/* ── BACKGROUND SYSTEM ── */}
      
      {/* Vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.015)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Dark Mode: Aurora & Stars */}
      <div className="absolute inset-0 z-0 overflow-hidden hidden dark:block pointer-events-none">
        <div className="stars-bg absolute inset-0 opacity-60" />
        <div className="aurora-container absolute inset-0 opacity-70">
          <div className="aurora-band aurora-band-1" />
          <div className="aurora-band aurora-band-2" />
          <div className="aurora-band aurora-band-3" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-[#050816] via-[#050816]/80 to-transparent" />
      </div>

      {/* Light Mode: Soft Gradients */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-blue-100/40 via-indigo-50/30 to-white dark:hidden pointer-events-none" />
      
      {/* Universal Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* ── CONTENT ── */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ── LEFT ── */}
          <div className="lg:col-span-6 space-y-8 text-left">

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-slate-900 dark:text-white tracking-tight leading-[1.08]">
              {t.h1a}{' '}
              <span className="text-emerald-500 font-black tabular-nums">0.8s.</span>
              <br />
              <span className="bg-gradient-to-r from-slate-700 via-red-500 to-red-600 dark:from-slate-100 dark:via-red-400 dark:to-rose-400 bg-clip-text text-transparent font-semibold text-3xl sm:text-4xl lg:text-[2.5rem] block mt-2 mb-1">
                {t.h1b}
              </span>
              <span className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-2 rounded-none inline-block mt-3 not-italic shadow-[4px_4px_0_rgba(15,23,42,0.1)] dark:shadow-[4px_4px_0_rgba(255,255,255,0.05)] text-3xl sm:text-4xl lg:text-[2.5rem] tracking-tight">
                {t.h1c}
              </span>
            </h1>

            {/* Lighthouse chart */}
            <div className="rounded-none border-l-4 border-l-[#818cf8] border-y border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-white/[0.02] p-6 space-y-4 shadow-sm dark:shadow-none">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">
                {t.chartTitle}
              </p>
              <LighthouseBar label={t.yourSite} score={93} color="#10b981" animate={visible} />
              <LighthouseBar label={t.industryAvg} score={63} color="#94a3b8" animate={visible} />
              <LighthouseBar label={t.typicalWordpress} score={41} color="#f87171" animate={visible} />
            </div>

            {/* Metrics row (Stripe-style Hierarchy) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* 1. Primary (Projects) */}
              <div className="relative overflow-hidden rounded-none border-t-2 border-emerald-500 bg-white dark:bg-emerald-500/10 p-4 shadow-sm dark:shadow-none">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-xl" />
                <p className="relative text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums leading-none">
                  {projectCount}
                </p>
                <p className="relative text-[10px] text-slate-500 dark:text-emerald-500/80 uppercase tracking-wider mt-1.5 font-semibold">
                  {t.metric1}
                </p>
              </div>
              
              {/* 2 & 3. Supporting (Neutral Ghosts) */}
              <div className="rounded-none border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 flex flex-col justify-center">
                <p className="text-xl font-extrabold text-slate-800 dark:text-slate-300 leading-none">24h</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider mt-1.5 font-semibold">{t.metric2}</p>
              </div>
              <div className="rounded-none border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 flex flex-col justify-center">
                <p className="text-xl font-extrabold text-slate-800 dark:text-slate-300 leading-none">100%</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider mt-1.5 font-semibold">{t.metric3}</p>
              </div>
              
              {/* 4. Urgency */}
              <div className="rounded-none border-t-2 border-[#f97316] bg-red-50 dark:bg-orange-500/10 p-4 shadow-sm dark:shadow-none">
                <p className="text-2xl font-black text-red-600 dark:text-red-400 leading-none">2</p>
                <p className="text-[10px] text-red-700/80 dark:text-red-400/80 uppercase tracking-wider mt-1.5 font-bold">
                  {t.metric4}
                </p>
              </div>
            </div>

            {/* Proof bar */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                {t.proof1}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                {t.proof2}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                {t.proof3}
              </span>
            </div>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-5 items-stretch sm:items-center pt-2">
              <Button
                href="#kontakt"
                variant="gradient"
                size="lg"
                className="w-full sm:w-auto text-center"
              >
                {t.cta} →
              </Button>
              <div className="flex flex-col items-center sm:items-start gap-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  {t.call}
                </span>
                <a
                  href={`tel:${phoneNum}`}
                  className="text-xl font-black text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors leading-none"
                >
                  {phoneLabel}
                </a>
                <span className="text-[11px] text-emerald-500 font-semibold">{t.response}</span>
              </div>
            </div>

            {/* Trust signals */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap gap-x-6 gap-y-2 text-slate-600 dark:text-slate-400 text-[11px] font-semibold tracking-wide">
              <span className="flex items-center gap-1.5">✓ {t.trust1}</span>
              <span className="flex items-center gap-1.5">✓ {t.trust2}</span>
              <span className="flex items-center gap-1.5">✓ {t.trust3}</span>
            </div>
          </div>

          {/* ── RIGHT — Overlapping cards ── */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
            <div className="absolute -bottom-6 -left-6 sm:bottom-0 sm:left-0 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-emerald-400/40 to-blue-500/40 dark:from-emerald-500/20 dark:to-blue-600/20 filter blur-2xl shadow-xl opacity-90 animate-pulse-slow -z-10" />

            {/* Card back */}
            <div className="relative w-[80%] aspect-[4/3] rounded-none overflow-hidden shadow-2xl shadow-slate-300/50 dark:shadow-black/60 border-2 border-slate-200/80 dark:border-white/10 transition-all hover:scale-[1.02] duration-500 bg-white dark:bg-white/5 self-start ml-auto">
              <Image
                src="/images/team_meeting.png"
                alt={t.altTeam}
                fill
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 dark:from-[#050816]/60 to-transparent pointer-events-none" />
            </div>

            {/* Card front */}
            <div className="absolute left-0 bottom-0 w-[65%] aspect-[16/10] rounded-none overflow-hidden shadow-2xl shadow-slate-400/40 dark:shadow-black/80 border-2 border-white/80 dark:border-white/10 backdrop-blur-md transition-all hover:scale-[1.05] duration-500 bg-white/80 dark:bg-white/5 p-2">
              <div className="relative w-full h-full rounded-none overflow-hidden bg-slate-900 shadow-inner">
                <Image
                  src="/images/workspace_code.png"
                  alt={t.altCode}
                  fill
                  sizes="(max-width: 1024px) 60vw, 30vw"
                  className="object-cover opacity-90"
                  priority
                />
              </div>
              {/* Live Lighthouse score badge overlay */}
              <div className="absolute top-6 right-6 bg-emerald-500 text-white text-[11px] font-black rounded-none px-3 py-1.5 shadow-lg shadow-emerald-500/40 border-l-2 border-emerald-300 z-20">
                90+ ⚡
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}