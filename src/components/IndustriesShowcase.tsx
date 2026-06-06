import Link from 'next/link';
import { Locale } from '@/app/[lang]/dictionaries';
import { getAllIndustries, getLocalizedIndustryPath } from '@/lib/industries';
import { getLocalizedStaticPath } from '@/app/[lang]/i18n-routes';
import { industrySlugsMap, professionSlugsMap, ProfessionId } from '@/lib/industries-list';

interface IndustriesShowcaseProps {
  lang: Locale;
  dict: any;
}

export default function IndustriesShowcase({ lang, dict }: IndustriesShowcaseProps) {
  const industries = getAllIndustries();
  const industriesUrl = getLocalizedStaticPath('industries', lang);

  // Define dynamic color accents for each sector card to match the premium B2B styling
  const sectorThemeMap: Record<string, { gradient: string; border: string; bg: string; text: string; glow: string }> = {
    doctor: {
      gradient: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
      border: 'hover:border-blue-500/30 dark:hover:border-blue-500/30',
      bg: 'bg-blue-500/5',
      text: 'text-blue-600 dark:text-blue-400',
      glow: 'shadow-blue-500/10 dark:shadow-blue-500/5',
    },
    lawyer: {
      gradient: 'from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20',
      border: 'hover:border-indigo-500/30 dark:hover:border-indigo-500/30',
      bg: 'bg-indigo-500/5',
      text: 'text-indigo-600 dark:text-indigo-400',
      glow: 'shadow-indigo-500/10 dark:shadow-indigo-500/5',
    },
    psychologist: {
      gradient: 'from-teal-500/10 to-emerald-500/10 dark:from-teal-500/20 dark:to-emerald-500/20',
      border: 'hover:border-teal-500/30 dark:hover:border-teal-500/30',
      bg: 'bg-teal-500/5',
      text: 'text-teal-600 dark:text-teal-400',
      glow: 'shadow-teal-500/10 dark:shadow-teal-500/5',
    },
    accountant: {
      gradient: 'from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20',
      border: 'hover:border-emerald-500/30 dark:hover:border-emerald-500/30',
      bg: 'bg-emerald-500/5',
      text: 'text-emerald-600 dark:text-emerald-400',
      glow: 'shadow-emerald-500/10 dark:shadow-emerald-500/5',
    },
    architect: {
      gradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
      border: 'hover:border-amber-500/30 dark:hover:border-amber-500/30',
      bg: 'bg-amber-500/5',
      text: 'text-amber-600 dark:text-amber-400',
      glow: 'shadow-amber-500/10 dark:shadow-amber-500/5',
    },
    beauty: {
      gradient: 'from-rose-500/10 to-pink-500/10 dark:from-rose-500/20 dark:to-pink-500/20',
      border: 'hover:border-rose-500/30 dark:hover:border-rose-500/30',
      bg: 'bg-rose-500/5',
      text: 'text-rose-600 dark:text-rose-400',
      glow: 'shadow-rose-500/10 dark:shadow-rose-500/5',
    },
    automotive: {
      gradient: 'from-amber-500/10 to-red-500/10 dark:from-amber-500/20 dark:to-red-500/20',
      border: 'hover:border-amber-500/30 dark:hover:border-amber-500/30',
      bg: 'bg-amber-500/5',
      text: 'text-amber-600 dark:text-amber-400',
      glow: 'shadow-amber-500/10 dark:shadow-amber-500/5',
    },
    construction: {
      gradient: 'from-amber-600/10 to-yellow-500/10 dark:from-amber-600/20 dark:to-yellow-500/20',
      border: 'hover:border-amber-600/30 dark:hover:border-amber-600/30',
      bg: 'bg-amber-600/5',
      text: 'text-amber-600 dark:text-amber-500',
      glow: 'shadow-amber-600/10 dark:shadow-amber-600/5',
    },
    gastronomy: {
      gradient: 'from-rose-500/10 to-orange-500/10 dark:from-rose-500/20 dark:to-orange-500/20',
      border: 'hover:border-rose-500/30 dark:hover:border-rose-500/30',
      bg: 'bg-rose-500/5',
      text: 'text-orange-600 dark:text-orange-400',
      glow: 'shadow-orange-500/10 dark:shadow-orange-500/5',
    },
    transport: {
      gradient: 'from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20',
      border: 'hover:border-cyan-500/30 dark:hover:border-cyan-500/30',
      bg: 'bg-cyan-500/5',
      text: 'text-cyan-600 dark:text-cyan-400',
      glow: 'shadow-cyan-500/10 dark:shadow-cyan-500/5',
    },
    ecommerce: {
      gradient: 'from-fuchsia-500/10 to-indigo-500/10 dark:from-fuchsia-500/20 dark:to-indigo-500/20',
      border: 'hover:border-fuchsia-500/30 dark:hover:border-fuchsia-500/30',
      bg: 'bg-fuchsia-500/5',
      text: 'text-fuchsia-600 dark:text-fuchsia-400',
      glow: 'shadow-fuchsia-500/10 dark:shadow-fuchsia-500/5',
    },
    education: {
      gradient: 'from-violet-500/10 to-fuchsia-500/10 dark:from-violet-500/20 dark:to-fuchsia-500/20',
      border: 'hover:border-violet-500/30 dark:hover:border-violet-500/30',
      bg: 'bg-violet-500/5',
      text: 'text-violet-600 dark:text-violet-400',
      glow: 'shadow-violet-500/10 dark:shadow-violet-500/5',
    },
  };

  const getSectorIcon = (id: string) => {
    switch (id) {
      case 'doctor': return '🩺';
      case 'lawyer': return '⚖️';
      case 'psychologist': return '🧠';
      case 'accountant': return '📊';
      case 'architect': return '📐';
      case 'beauty': return '🌸';
      case 'automotive': return '🚗';
      case 'construction': return '🏗️';
      case 'gastronomy': return '🍔';
      case 'transport': return '🚚';
      case 'ecommerce': return '🛒';
      case 'education': return '🎓';
      default: return '💼';
    }
  };

  return (
    <section className="py-24 bg-transparent dark:bg-transparent border-t border-slate-200 dark:border-slate-900/60 transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {dict.sectorLabel || 'Sektory'}
          </span>
          <h2 className="text-[clamp(1.75rem,4.5vw,3rem)] font-black uppercase italic tracking-tight text-slate-900 dark:text-white leading-tight">
            {dict.title}
          </h2>
          <p className="text-slate-650 dark:text-slate-400 leading-relaxed text-[clamp(13px,1.2vw,16px)]">
            {dict.subtitle}
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.slice(0, 6).map((ind) => {
            const industryTrans = ind.translations[lang] || ind.translations.pl;
            const theme = sectorThemeMap[ind.id] || sectorThemeMap.doctor;
            
            // Generate link to main sector page
            const sectorUrl = getLocalizedIndustryPath(lang, 'all', ind.id);

            // Get up to 3 popular specializations to preview
            const modelEntries = Object.entries(industryTrans.models || {}).slice(0, 3);

            return (
              <div 
                key={ind.id}
                className={`group relative flex flex-col justify-between p-7 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl ${theme.glow} ${theme.border} transition-all duration-300 hover:-translate-y-1`}
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex justify-between items-center mb-6">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${theme.bg} ${theme.text}`}>
                      {dict.sectorLabel || 'Sector'}: {ind.id}
                    </span>
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {getSectorIcon(ind.id)}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-[clamp(1.25rem,2.2vw,1.625rem)] font-black uppercase tracking-tight text-slate-900 dark:text-white mb-3">
                    {industryTrans.industryName}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-[clamp(11px,1vw,13px)] leading-relaxed mb-6 line-clamp-3">
                    {industryTrans.description}
                  </p>

                  {/* Specialization List Preview */}
                  {modelEntries.length > 0 && (
                    <div className="space-y-2 mb-6">
                      <div className="flex flex-wrap gap-2">
                        {modelEntries.map(([modelKey, modelVal]) => {
                          const modelSlug = professionSlugsMap[modelKey as ProfessionId][lang];
                          const brandSlug = industrySlugsMap[ind.id][lang];
                          const parentPath = lang === 'pl' ? 'strona-dla' : 
                                             lang === 'en' ? 'website-for' : 
                                             lang === 'de' ? 'webseite-fuer' : 
                                             lang === 'uk' ? 'sayt-dlya' : 
                                             lang === 'ru' ? 'sayt-dlya' : 'website-for';
                          const specialtyUrl = `${lang === 'pl' ? '' : '/' + lang}/${parentPath}/${brandSlug}/${modelSlug}`;

                          return (
                            <Link
                              key={modelKey}
                              href={specialtyUrl}
                              className="text-[clamp(9.5px,0.9vw,11.5px)] font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-xl hover:scale-105 transition-all shadow-sm"
                            >
                              {modelVal.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card CTA */}
                <Link
                  href={sectorUrl}
                  className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors"
                >
                  <span>{lang === 'pl' ? 'Szczegóły oferty' : 'Explore templates'}</span>
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Global CTA */}
        <div className="text-center mt-16">
          <Link
            href={industriesUrl}
            className="btn-primary inline-flex py-4 px-9 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all"
            id="cta-home-industries"
          >
            {dict.cta} →
          </Link>
        </div>

      </div>
    </section>
  );
}
