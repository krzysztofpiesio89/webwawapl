'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CarLogo from './CarLogo';
import { GlobalSettings } from '@/lib/settings';
import LanguageSwitcher from './LanguageSwitcher';
import { Locale } from '@/app/[lang]/dictionaries';
import { getLocalizedStaticPath } from '@/app/[lang]/i18n-routes';

export default function Header({ 
  settings, 
  dict, 
  lang 
}: { 
  settings: GlobalSettings | null;
  dict: any;
  lang: Locale;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  const aboutUrl = getLocalizedStaticPath('about', lang);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-400 ease-out-expo border-b ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-2xl border-amber-500/20 shadow-sm py-2 sm:py-3' 
          : 'bg-white/80 backdrop-blur-xl border-slate-200/50 py-3 sm:py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center relative">
          <Link href={homeUrl} className="flex items-center gap-2 sm:gap-3 group shrink-0" onClick={() => setIsMenuOpen(false)}>
            <CarLogo className="h-9 sm:h-12 w-auto transform group-hover:scale-105 transition-transform duration-300" />
            <div className="flex flex-col leading-none">
              <span className="text-[17px] sm:text-[22px] font-black text-slate-900 tracking-tight uppercase">
                SKUP<span className="text-amber-700">AUTWAWA.PL</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex gap-1 xl:gap-2 font-bold items-center">
            <Link href={homeUrl} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 px-4 py-2.5 rounded-full transition-all duration-300 text-sm xl:text-base">{dict.nav.home}</Link>
            <a href="#wycena" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 px-4 py-2.5 rounded-full transition-all duration-300 text-sm xl:text-base">{dict.nav.valuation}</a>
            <a href="#ostatniokupioneauta" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 px-4 py-2.5 rounded-full transition-all duration-300 text-sm xl:text-base">{dict.nav.recentlyBought}</a>
            <Link href={aboutUrl} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 px-4 py-2.5 rounded-full transition-all duration-300 text-sm xl:text-base">{dict.nav.aboutUs}</Link>
            
            <div className="mx-1 xl:mx-2 border-l border-slate-200/60 pl-3">
              <LanguageSwitcher currentLang={lang} />
            </div>
            
            <a href={`tel:${settings?.phone || '+48664946209'}`} className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 animate-pulse-slow shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-300 rounded-full ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {dict.nav.callNow}
            </a>
          </nav>

          {/* Mobile Toggle & Language Switcher */}
          <div className="flex items-center gap-1 lg:hidden">
            <LanguageSwitcher currentLang={lang} />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="relative w-11 h-11 text-slate-700 hover:bg-slate-100/60 rounded-full transition-colors flex items-center justify-center focus:outline-none ml-1"
              aria-label="Menu"
            >
              <div className="relative w-5 h-[16px]">
                <span className={`absolute left-0 h-[2px] w-5 bg-current transform transition-all duration-300 ease-out rounded-full ${isMenuOpen ? 'rotate-45 top-[7px]' : 'top-0'}`} />
                <span className={`absolute left-0 h-[2px] bg-current transform transition-all duration-300 ease-out rounded-full ${isMenuOpen ? 'w-0 opacity-0 top-[7px] left-1/2' : 'w-5 opacity-100 top-[7px]'}`} />
                <span className={`absolute left-0 h-[2px] w-5 bg-current transform transition-all duration-300 ease-out rounded-full ${isMenuOpen ? '-rotate-45 top-[7px]' : 'top-[14px]'}`} />
              </div>
            </button>
          </div>
          
          {/* Mobile Menu Backdrop */}
          <div 
            className={`lg:hidden absolute top-full left-0 right-0 h-screen bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 -z-10 ${
              isMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
            }`}
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile Menu Overlay */}
          <div 
            className={`lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-b border-slate-200/50 overflow-hidden transition-all duration-400 ease-out-expo origin-top ${
              isMenuOpen ? 'opacity-100 scale-y-100 visible pointer-events-auto' : 'opacity-0 scale-y-95 invisible pointer-events-none'
            }`}
          >
            <nav className="flex flex-col p-3 font-bold text-center gap-1">
              <Link href={homeUrl} className="text-lg text-slate-800 py-3.5 hover:bg-slate-50/80 rounded-none transition-colors" onClick={() => setIsMenuOpen(false)}>{dict.nav.home}</Link>
              <a href="#wycena" className="text-lg text-slate-800 py-3.5 hover:bg-slate-50/80 rounded-none transition-colors" onClick={() => setIsMenuOpen(false)}>{dict.nav.valuation}</a>
              <a href="#ostatniokupioneauta" className="text-lg text-slate-800 py-3.5 hover:bg-slate-50/80 rounded-none transition-colors" onClick={() => setIsMenuOpen(false)}>{dict.nav.recentlyBought}</a>
              <Link href={aboutUrl} className="text-lg text-slate-800 py-3.5 hover:bg-slate-50/80 rounded-none transition-colors" onClick={() => setIsMenuOpen(false)}>{dict.nav.aboutUs}</Link>
              
              <div className="px-2 pt-2 pb-1 mt-1 border-t border-slate-100">
                <a href={`tel:${settings?.phone || '+48664946209'}`} className="btn-primary py-4 px-5 text-lg flex items-center justify-center gap-3 w-full rounded-xl shadow-lg shadow-amber-500/20" onClick={() => setIsMenuOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {dict.nav.callNow}
                </a>
              </div>
            </nav>
          </div>
        </div>
    </header>
  );
}
