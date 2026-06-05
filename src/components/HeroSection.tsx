import Image from 'next/image';

interface HeroSectionProps {
  lang: string;
  phone?: string;
  email?: string;
}

export default function HeroSection({ lang, phone, email }: HeroSectionProps) {
  const isPl = lang === 'pl';
  
  const badgeText = isPl ? "🚀 webwawa.pl • Nowość 2026" : "🚀 webwawa.pl • New in 2026";
  const headingText = isPl 
    ? "Nowoczesne Aplikacje PWA i Strony WWW." 
    : "Modern PWA Apps & Custom Websites.";
  const headingHighlight = isPl
    ? "Zbuduj przewagę w Warszawie."
    : "Build your edge in Warsaw.";
  
  const subtitleText = isPl
    ? "Projektujemy i wdrażamy ultraszybkie, dopasowane do urządzeń mobilnych systemy webowe i witryny w oparciu o Next.js, React i Tailwind CSS. Zapewniamy najwyższą wydajność, nieskazitelne SEO oraz wsparcie powdrożeniowe."
    : "We design and deliver ultra-fast, mobile-friendly web systems and sites powered by Next.js, React, and Tailwind CSS. We ensure peak performance, flawless SEO, and post-deployment support.";

  const ctaText = isPl ? "Porozmawiajmy o Twoim projekcie" : "Let's talk about your project";
  const contactText = isPl ? "Lub zadzwoń bezpośrednio:" : "Or call us directly:";

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50 dark:bg-[#020510] transition-colors z-10">
      
      {/* ── BACKGROUND LAYERS ── */}
      
      {/* Dark Mode: CSS Aurora Background Animation & Stars */}
      <div className="absolute inset-0 z-0 overflow-hidden hidden dark:block pointer-events-none">
        <div className="stars-bg absolute inset-0" />
        <div className="aurora-container absolute inset-0">
          <div className="aurora-band aurora-band-1" />
          <div className="aurora-band aurora-band-2" />
          <div className="aurora-band aurora-band-3" />
        </div>
        {/* Soft dark horizon blend at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-[#020510] via-[#020510]/80 to-transparent" />
      </div>

      {/* Light Mode: Soft, premium light-blue/indigo pastel gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-blue-50/65 via-indigo-50/30 to-white dark:hidden pointer-events-none" />
      
      {/* Ambient glows behind columns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 dark:bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* ── CONTENT CONTAINER ── */}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/40 text-primary dark:text-blue-400 text-xs font-black uppercase tracking-wider backdrop-blur-sm">
              {badgeText}
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase italic">
              {headingText} <br />
              <span className="gradient-text block mt-2 drop-shadow-md">
                {headingHighlight}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-medium">
              {subtitleText}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 items-stretch sm:items-center">
              <a 
                href="#kontakt" 
                className="btn-primary text-lg px-8 py-4.5 text-center shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
              >
                {ctaText}
              </a>
              <div className="flex flex-col items-center sm:items-start gap-1">
                <span className="text-xs text-slate-500 dark:text-slate-450 uppercase tracking-widest font-black">
                  {contactText}
                </span>
                <a 
                  href={`tel:${phone || '+48664946209'}`} 
                  className="text-xl md:text-2xl font-black text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2"
                >
                  {phone || '+48 664 946 209'}
                </a>
              </div>
            </div>

            {/* Trust signals */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800/60 flex flex-wrap gap-6 items-center text-slate-500 dark:text-slate-400 text-sm font-semibold">
              <span className="flex items-center gap-2">✓ {isPl ? "Wydajność 100/100" : "100/100 Performance"}</span>
              <span className="flex items-center gap-2">✓ {isPl ? "PWA & Offline Ready" : "PWA & Offline Ready"}</span>
              <span className="flex items-center gap-2">✓ {isPl ? "Bezpłatna wycena w 24h" : "Free quote in 24h"}</span>
            </div>
          </div>

          {/* Right Column: Visual Overlapping Cards */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
            
            {/* Ozdobna trójwymiarowa kula w tle */}
            <div className="absolute -bottom-6 -left-6 sm:bottom-0 sm:left-0 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-primary to-secondary filter blur-sm shadow-xl opacity-90 animate-pulse-slow -z-10" />

            {/* Karta z tyłu: Spotkanie Zespołu */}
            <div className="relative w-[80%] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transition-all hover:scale-[1.02] duration-500 bg-slate-900 self-start ml-auto">
              <Image 
                src="/images/team_meeting.png" 
                alt="Team working on IT project"
                fill
                sizes="(max-w-768px) 100vw, 50vw"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
            </div>

            {/* Karta z przodu: Kodowanie Workspace */}
            <div className="absolute left-0 bottom-0 w-[65%] aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800/50 backdrop-blur-md transition-all hover:scale-[1.05] duration-500 bg-white/10 dark:bg-slate-900/30">
              <div className="relative w-full h-full p-2">
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <Image 
                    src="/images/workspace_code.png" 
                    alt="Developer workspace with Next.js code"
                    fill
                    sizes="(max-w-768px) 100vw, 50vw"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
