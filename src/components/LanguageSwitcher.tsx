'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { locales, languageNames, languageFlags, Locale, defaultLocale } from '@/app/[lang]/dictionaries';
import { resolveStaticSlug, localizedRoutes } from '@/app/[lang]/i18n-routes';

export default function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const getLocalizedUrl = (targetLang: Locale) => {
    let pathWithoutLocale = pathname;
    const pathHasLocale = locales.some(
      (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
    );

    if (pathHasLocale) {
      const currentPrefix = pathname.split('/')[1];
      pathWithoutLocale = pathname.replace(`/${currentPrefix}`, '') || '/';
    }

    // Tłumaczymy statyczne strony na docelowy język
    const segments = pathWithoutLocale.split('/').filter(Boolean);
    const firstSegment = segments[0] || '';
    
    const resolved = resolveStaticSlug(firstSegment, currentLang);
    if (resolved) {
      segments[0] = localizedRoutes[resolved.page][targetLang];
      pathWithoutLocale = '/' + segments.join('/');
    }

    if (targetLang === defaultLocale) {
      return pathWithoutLocale || '/';
    }
    
    return `/${targetLang}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
  };

  const listItems = locales.map((locale) => (
    <Link
      key={locale}
      href={getLocalizedUrl(locale)}
      onClick={() => setIsOpen(false)}
      className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all duration-300 w-full max-w-[250px] transform hover:scale-105 active:scale-95 ${
        currentLang === locale 
          ? 'bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
      }`}
      role="option"
      aria-selected={currentLang === locale}
    >
      <span className="text-2xl sm:text-3xl drop-shadow-sm">{languageFlags[locale]}</span>
      <span className={`text-xl sm:text-2xl tracking-tight ${currentLang === locale ? 'font-bold' : 'font-medium'}`}>
        {languageNames[locale]}
      </span>
    </Link>
  ));

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium transition-colors group"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="uppercase tracking-wide text-lg">{currentLang}</span>
      </button>

      {mounted && typeof document !== 'undefined' && createPortal(
        <div 
          className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center transition-all duration-500 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Glassmorphism Backdrop */}
          <div 
            className={`absolute inset-0 bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl transition-opacity duration-500 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Close Button Top Right */}
          <button 
            onClick={() => setIsOpen(false)}
            className={`absolute top-6 right-6 md:top-10 md:right-10 z-50 p-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all duration-500 transform hover:scale-110 active:scale-95 shadow-sm border border-slate-200 dark:border-slate-800/60 ${
              isOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
            }`}
            aria-label={currentLang === 'pl' ? 'Zamknij' : 'Close'}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div 
            className={`relative z-10 w-full px-6 flex flex-col items-center transition-all duration-500 delay-75 ${
              isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
            }`}
          >
            <div className="mb-8 text-center">
              <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] mb-2">
                {currentLang === 'pl' ? 'Wybierz język' : 'Choose Language'}
              </h2>
            </div>
            
            <div role="listbox" aria-label="Wybierz język" className="w-full flex flex-col items-center space-y-2">
              {listItems}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
