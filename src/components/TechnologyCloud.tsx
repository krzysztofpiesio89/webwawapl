import Link from 'next/link';
import type { Locale } from '@/app/[lang]/dictionaries';
import { getLocalizedIndustryPath } from '@/lib/industries';
import type { IndustryId, ProfessionId, ServiceId } from '@/lib/industries-list';

interface TechnologyCloudProps {
  lang: Locale;
  city: string;
  industryId: IndustryId;
  professionId?: ProfessionId;
  serviceId?: ServiceId;
  activeTech?: string;
}

const TECH_CATEGORIES = [
  {
    namePl: 'Frameworki Frontend',
    nameEn: 'Frontend Frameworks',
    techs: [
      { slug: 'astro-build', name: 'Astro' },
      { slug: 'nextjs', name: 'Next.js' },
      { slug: 'nuxt', name: 'Nuxt.js' },
      { slug: 'tailwind-css', name: 'Tailwind CSS' },
      { slug: 'javascript', name: 'JavaScript' },
      { slug: 'typescript', name: 'TypeScript' },
      { slug: 'html5', name: 'HTML5' },
      { slug: 'jquery', name: 'jQuery' }
    ]
  },
  {
    namePl: 'Systemy Backend & CMS',
    nameEn: 'Backend & CMS Systems',
    techs: [
      { slug: 'wordpress', name: 'WordPress' },
      { slug: 'woocommerce', name: 'WooCommerce' },
      { slug: 'sylius', name: 'Sylius' },
      { slug: 'laravel', name: 'Laravel' },
      { slug: 'symfony', name: 'Symfony' },
      { slug: 'django', name: 'Django' },
      { slug: 'php', name: 'PHP' },
      { slug: 'rust', name: 'Rust' }
    ]
  },
  {
    namePl: 'Bazy danych i Integracje',
    nameEn: 'Databases & Integrations',
    techs: [
      { slug: 'postgresql', name: 'PostgreSQL' },
      { slug: 'mysql', name: 'MySQL' },
      { slug: 'sqlite', name: 'SQLite' },
      { slug: 'prisma', name: 'Prisma ORM' },
      { slug: 'websocket', name: 'WebSockets' },
      { slug: 'hosting', name: 'Hosting / CDN' }
    ]
  },
  {
    namePl: 'Pozycjonowanie i Optymalizacje SEO',
    nameEn: 'SEO & Web Optimizations',
    techs: [
      { slug: 'schema-org', name: 'Schema.org JSON-LD' },
      { slug: 'open-graph', name: 'Open Graph Meta' },
      { slug: 'push-notifications', name: 'Push Notifications' },
      { slug: 'vapid', name: 'VAPID Security' }
    ]
  }
];

export default function TechnologyCloud({
  lang,
  city,
  industryId,
  professionId,
  serviceId,
  activeTech
}: TechnologyCloudProps) {
  const isPl = lang === 'pl';

  const headingText = isPl 
    ? 'Wybierz stos technologiczny dla swojej strony'
    : 'Choose technology stack for your website';

  const subText = isPl
    ? 'Kliknij technologię, aby zobaczyć jak optymalizujemy ją pod kątem Twojej branży i lokalnego pozycjonowania SEO.'
    : 'Click a technology to see how we optimize it for your industry and local SEO rankings.';

  const basePath = getLocalizedIndustryPath(lang, city, industryId, professionId, serviceId);

  return (
    <section className="my-16 py-12 px-6 bg-slate-100/80 dark:bg-slate-900/60 rounded-none border-t-4 border-b border-t-indigo-500 border-b-slate-200 dark:border-b-slate-800 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
          {headingText}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm md:text-base transition-colors duration-300">
          {subText}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {TECH_CATEGORIES.map((cat, idx) => (
          <div key={idx} className="bg-white/60 dark:bg-slate-950/80 p-6 rounded-none border border-slate-200 dark:border-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-500/80 transition-all duration-300 [clip-path:polygon(16px_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%,0_16px)]">
            <h3 className="text-sm font-black tracking-wider text-indigo-700 dark:text-indigo-400 uppercase mb-4 transition-colors duration-300">
              {isPl ? cat.namePl : cat.nameEn}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cat.techs.map(tech => {
                const isActive = activeTech === tech.slug;
                const linkHref = `${basePath}/${tech.slug}`;

                return (
                  <Link
                    key={tech.slug}
                    href={linkHref}
                    className={`text-xs md:text-sm px-5 py-2 rounded-none transition-all duration-200 font-bold [clip-path:polygon(10px_0,calc(100%-10px)_0,100%_50%,calc(100%-10px)_100%,10px_100%,0_50%)] ${
                      isActive
                        ? 'bg-gradient-to-r from-[#818cf8] to-[#0ea5e9] text-slate-950 scale-105'
                        : 'bg-slate-200 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {tech.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
