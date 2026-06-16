'use client';

import React, { useRef, useState, useEffect } from 'react';
import { BlurReveal } from '@/components/ui/BlurReveal';

const translations = {
  pl: {
    title: 'Wyniki wydajności',
    subtitle: 'Weryfikowane przez Google PageSpeed Insights. Nie idziemy na kompromisy.',
    performance: 'Wydajność',
    accessibility: 'Dostępność',
    bestPractices: 'Dobre Praktyki',
    seo: 'SEO',
  },
  en: {
    title: 'Performance Scores',
    subtitle: 'Verified by Google PageSpeed Insights. We never compromise.',
    performance: 'Performance',
    accessibility: 'Accessibility',
    bestPractices: 'Best Practices',
    seo: 'SEO',
  },
  uk: {
    title: 'Показники продуктивності',
    subtitle: 'Перевірено Google PageSpeed Insights. Ми не йдемо на компроміси.',
    performance: 'Продуктивність',
    accessibility: 'Доступність',
    bestPractices: 'Кращі практики',
    seo: 'SEO',
  },
  ru: {
    title: 'Показатели производительности',
    subtitle: 'Проверено Google PageSpeed Insights. Мы не идем на компромиссы.',
    performance: 'Производительность',
    accessibility: 'Доступность',
    bestPractices: 'Лучшие практики',
    seo: 'SEO',
  },
  de: {
    title: 'Leistungsergebnisse',
    subtitle: 'Verifiziert durch Google PageSpeed Insights. Wir gehen keine Kompromisse ein.',
    performance: 'Leistung',
    accessibility: 'Barrierefreiheit',
    bestPractices: 'Best Practices',
    seo: 'SEO',
  },
  zh: {
    title: '性能得分',
    subtitle: '经由 Google PageSpeed Insights 验证。我们从不妥协。',
    performance: '性能',
    accessibility: '无障碍',
    bestPractices: '最佳实践',
    seo: 'SEO',
  }
};

export default function PageSpeedSection({ lang }: { lang: string }) {
  const t = translations[lang as keyof typeof translations] || translations['pl'];
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const metrics = [
    { label: t.performance, score: 99, size: 'large' },
    { label: t.accessibility, score: 100, size: 'small' },
    { label: t.bestPractices, score: 100, size: 'small' },
    { label: t.seo, score: 100, size: 'small' }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-white/5 relative overflow-hidden transition-colors"
    >
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <BlurReveal delay={0} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-4">
            {t.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </BlurReveal>

        <BlurReveal delay={150} className="flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-20">
          {/* Main Large Metric */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/10 bg-white dark:bg-slate-950 transition-transform duration-700 hover:scale-105">
              <svg className="absolute inset-0 w-full h-full -rotate-90 scale-95" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-slate-800" />
                <circle 
                  cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="6" 
                  className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-1500 ease-out" 
                  strokeDasharray="289" 
                  strokeDashoffset={visible ? 289 - (289 * 0.99) : 289} 
                />
              </svg>
              <div className="text-center">
                <span className="block text-5xl md:text-[4rem] font-black text-emerald-600 dark:text-emerald-400 leading-none tracking-tighter">
                  {visible ? 99 : 0}
                </span>
              </div>
            </div>
            <span className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">
              {t.performance}
            </span>
          </div>

          <div className="h-px w-full md:w-px md:h-32 bg-slate-200 dark:bg-slate-800" />

          {/* Small Metrics */}
          <div className="flex gap-6 md:gap-10">
            {metrics.slice(1).map((metric, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-3 bg-white dark:bg-slate-950 shadow-lg shadow-emerald-500/5 transition-transform duration-700 hover:scale-110">
                  <svg className="absolute inset-0 w-full h-full -rotate-90 scale-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                    <circle 
                      cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" 
                      className="text-emerald-500 transition-all duration-1500 ease-out" 
                      style={{ transitionDelay: `${100 * (i + 1)}ms` }}
                      strokeDasharray="289" 
                      strokeDashoffset={visible ? 0 : 289} 
                    />
                  </svg>
                  <span className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {visible ? 100 : 0}
                  </span>
                </div>
                <span className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400 text-center max-w-[80px] leading-tight">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
