'use client';

import React, { useState } from 'react';

interface SpecsTabsProps {
  lang: string;
  specifications: string[];
}

export default function SpecsTabs({ lang, specifications }: SpecsTabsProps) {
  const [activeTab, setActiveTab] = useState<'standards' | 'custom'>('standards');

  const isPl = lang === 'pl';
  
  // Tab title translations
  const tabTitles = {
    pl: {
      standards: 'Standardy Wdrożenia',
      custom: 'Dedykowana Specyfikacja IT',
      standardsDesc: 'Nasze standardowe fundamenty techniczne gwarantujące najwyższą wydajność.',
      customDesc: 'Zaawansowane technologie, bazy danych, boty AI i integracje dopasowane do branży.'
    },
    en: {
      standards: 'Implementation Standards',
      custom: 'Dedicated IT Specification',
      standardsDesc: 'Our core technical foundations guaranteeing top-tier performance.',
      customDesc: 'Advanced technologies, databases, AI bots, and integrations tailored to the sector.'
    },
    de: {
      standards: 'Implementierungsstandards',
      custom: 'Dedizierte IT-Spezifikation',
      standardsDesc: 'Unsere technischen Kernstandards, die höchste Leistung garantieren.',
      customDesc: 'Fortgeschrittene Technologien, Datenbanken, KI-Bots und branchenspezifische Integrationen.'
    },
    uk: {
      standards: 'Стандарти впровадження',
      custom: 'Спеціальна IT-специфікація',
      standardsDesc: 'Наші основні технічні засади, що гарантують максимальну швидкість.',
      customDesc: 'Сучасні технології, бази даних, боти AI та інтеграції для вашої галузі.'
    },
    ru: {
      standards: 'Стандарты внедрения',
      custom: 'Специальная IT-спецификация',
      standardsDesc: 'Наши базовые технические стандарты, гарантирующие максимальную скорость.',
      customDesc: 'Передовые технологии, базы данных, боты AI и интеграции для вашей отрасли.'
    },
    zh: {
      standards: '交付与开发标准',
      custom: '行业定制 IT 规范',
      standardsDesc: '保障极致性能与安全性的核心技术底座。',
      customDesc: '根据行业深度定制的先进技术架构、数据库、智能 AI 机器人与第三方接口集成。'
    }
  };

  const currentTrans = tabTitles[lang as keyof typeof tabTitles] || tabTitles.en;

  // Core standards translations
  const coreStandards = {
    pl: [
      {
        title: 'Lekka Architektura Vite & React',
        desc: 'Budowa ultra-lekkiej strony (Vite & React) ładującej się w ułamku sekundy, bez zbędnych bibliotek blokujących wątek.',
        badge: '100 PageSpeed'
      },
      {
        title: 'Powiadomienia SMS i AI',
        desc: 'Integracja z systemem powiadomień SMS (Twilio / SMSAPI) dla natychmiastowego zgłaszania awarii i automatyzacji leadów.',
        badge: 'Real-time'
      },
      {
        title: 'Mobilny Click-to-Call',
        desc: 'Przycisk bezpośredniego połączenia telefonicznego zoptymalizowany pod kątem konwersji mobilnej (Mobile-First Click-to-Call).',
        badge: 'UX Mobile'
      }
    ],
    en: [
      {
        title: 'Lightweight Vite & React Architecture',
        desc: 'Ultra-lightweight website development (Vite & React) loading in a fraction of a second, without thread-blocking libraries.',
        badge: '105 PageSpeed'
      },
      {
        title: 'SMS & AI Notifications',
        desc: 'Integration with SMS dispatch (Twilio / SMSAPI) for instant alerts and AI workflow automation.',
        badge: 'Real-time'
      },
      {
        title: 'Mobile Click-to-Call',
        desc: 'Mobile-first direct call button (Click-to-Call) optimized for maximum call conversion rates.',
        badge: 'UX Mobile'
      }
    ],
    de: [
      {
        title: 'Schlanke Vite & React Architektur',
        desc: 'Entwicklung einer ultra-leichten Website (Vite & React), die in Sekundenbruchteilen lädt, ohne den Thread blockierende Bibliotheken.',
        badge: '100 PageSpeed'
      },
      {
        title: 'SMS & KI Benachrichtigungen',
        desc: 'SMS-Benachrichtigungssystem (Twilio / SMSAPI) für sofortige Notfall-Alarmierung und KI-Automatisierung.',
        badge: 'Realzeit'
      },
      {
        title: 'Mobile Click-to-Call',
        desc: 'Direktruf-Schaltfläche optimiert für mobile Endgeräte (Mobile-First Click-to-Call) zur Maximierung der Conversions.',
        badge: 'UX Mobil'
      }
    ],
    uk: [
      {
        title: 'Легка архітектура Vite & React',
        desc: 'Створення надлегкого сайту (Vite & React), що завантажується за частку секунди, без бібліотек, які блокують потік.',
        badge: '100 PageSpeed'
      },
      {
        title: 'SMS та AI сповіщення',
        desc: 'Інтеграція з системою SMS-сповіщень (Twilio / SMSAPI) для миттєвих повідомлень та AI-автоматизації.',
        badge: 'Real-time'
      },
      {
        title: 'Мобільний Click-to-Call',
        desc: 'Кнопка прямого телефонного дзвінка, оптимізована для мобільної конверсії (Mobile-First Click-to-Call).',
        badge: 'UX Mobile'
      }
    ],
    ru: [
      {
        title: 'Легкая архитектура Vite & React',
        desc: 'Создание сверхлегкого сайта (Vite & React), загружающегося за долю секунды, без блокирующих поток библиотек.',
        badge: '100 PageSpeed'
      },
      {
        title: 'SMS и AI оповещения',
        desc: 'Интеграция с системой SMS-оповещений (Twilio / SMSAPI) для мгновенных уведомлений и AI-автоматизации.',
        badge: 'В реальном времени'
      },
      {
        title: 'Мобильный Click-to-Call',
        desc: 'Кнопка прямого телефонного звонка, оптимизированная для мобильной конверсии (Mobile-First Click-to-Call).',
        badge: 'UX Mobile'
      }
    ],
    zh: [
      {
        title: '极速 Vite & React 架构',
        desc: '构建超轻量级（Vite & React）页面，毫秒级瞬间加载，杜绝任何阻塞主线程的冗余库。',
        badge: '100 满分 PageSpeed'
      },
      {
        title: '短信通知与 AI 联动',
        desc: '深度集成短信通知通道（Twilio / SMSAPI），支持异常警报瞬间触达及 AI 工作流自动化。',
        badge: '毫秒级响应'
      },
      {
        title: '一键触控拨号',
        desc: '针对移动端专门优化的 Mobile-First Click-to-Call 一键呼叫按钮，极大提升来电转化率。',
        badge: '移动端体验'
      }
    ]
  };

  const currentStandards = coreStandards[lang as keyof typeof coreStandards] || coreStandards.en;

  // Render SVG icons helper
  const getIcon = (type: 'speed' | 'sms' | 'phone' | 'tech', index?: number) => {
    switch (type) {
      case 'speed':
        return (
          <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        );
      case 'sms':
        return (
          <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        );
      case 'phone':
        return (
          <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        );
      case 'tech':
      default:
        // Render different icons based on index to look rich and non-repetitive
        const idx = index || 0;
        if (idx % 4 === 0) {
          return (
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
            </svg>
          );
        } else if (idx % 4 === 1) {
          return (
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
            </svg>
          );
        } else if (idx % 4 === 2) {
          return (
            <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          );
        } else {
          return (
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          );
        }
    }
  };

  return (
    <div className="w-full glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden border border-slate-200/60 dark:border-slate-800/80 shadow-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-800 pb-5 mb-6 gap-4">
        <div>
          <h3 className="font-black text-2xl uppercase tracking-tight text-slate-900 dark:text-white">
            {isPl ? 'Standardy & Specyfikacja' : 'Standards & Specification'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === 'standards' ? currentTrans.standardsDesc : currentTrans.customDesc}
          </p>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 w-full sm:w-auto relative">
          <button
            onClick={() => setActiveTab('standards')}
            className={`flex-1 sm:flex-initial py-2.5 px-5 text-sm font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${
              activeTab === 'standards'
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {currentTrans.standards}
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 sm:flex-initial py-2.5 px-5 text-sm font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${
              activeTab === 'custom'
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {currentTrans.custom}
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="relative min-h-[300px]">
        {/* TAB 1: Standards */}
        {activeTab === 'standards' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            {currentStandards.map((std, i) => (
              <div 
                key={i} 
                className="group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-250/50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-white dark:hover:bg-slate-900 hover:border-primary/30 dark:hover:border-primary/45 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                      {getIcon(i === 0 ? 'speed' : i === 1 ? 'sms' : 'phone')}
                    </div>
                    <span className="text-[10px] font-black tracking-widest uppercase py-1 px-2.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                      {std.badge}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-base mb-2 text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {std.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {std.desc}
                  </p>
                </div>
                
                {/* Arrow hint */}
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>{isPl ? 'Standard wdrożeniowy' : 'Deployment standard'}</span>
                  <span>&rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Custom Spec */}
        {activeTab === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {specifications.map((spec, i) => (
              <div 
                key={i} 
                className="group flex gap-4 p-5 rounded-2xl border border-slate-250/50 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-white dark:hover:bg-slate-900 hover:border-primary/30 dark:hover:border-primary/45 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex-shrink-0 flex items-start mt-0.5">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                    {getIcon('tech', i)}
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-widest text-primary mb-1">
                    {isPl ? `MODUŁ ${i + 1}` : `MODULE ${i + 1}`}
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-350 leading-relaxed font-medium">
                    {spec}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
