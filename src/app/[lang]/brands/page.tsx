import { Metadata } from 'next';
import { getGlobalSettings } from '@/lib/settings';
import { getDictionary, Locale } from '../dictionaries';

export async function generateMetadata(props: { params: Promise<{ lang: string  }> }): Promise<Metadata> {
  const params = await props.params;
  const dict = await getDictionary(params.lang as Locale);
  return {
    title: `Obszary Technologiczne i Usługi - webwawa.pl`,
    description: `Zobacz zakres świadczonych przez nas usług informatycznych i stosowanych technologii w agencji webwawa.pl.`,
  };
}

export default async function MarkiPage(props: { params: Promise<{ lang: string  }> }) {
  const params = await props.params;
  const settings = getGlobalSettings();
  const dict = await getDictionary(params.lang as Locale);
  
  const isPl = params.lang === 'pl';
  const homeUrl = params.lang === 'pl' ? '/' : `/${params.lang}`;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 md:py-24 text-slate-800 dark:text-white transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex justify-center mb-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <a href={homeUrl} className="hover:text-primary transition-colors">Home</a>
          <span className="mx-2">/</span>
          <span className="font-semibold text-primary">{isPl ? "Technologie" : "Technologies"}</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-bold mb-4 uppercase tracking-wider">
            Stack Technologiczny
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight uppercase italic tracking-tight text-slate-900 dark:text-white">
            Nasze <span className="text-primary">Specjalizacje</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
            {isPl 
              ? "Projektujemy i wdrażamy oprogramowanie w oparciu o najnowocześniejsze i sprawdzone technologie." 
              : "We design and build software using cutting-edge and battle-tested technologies."}
          </p>
        </div>

        {/* Tech Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Web Development</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              React, Next.js, TypeScript, Tailwind CSS. Tworzymy szybkie, nowoczesne strony i aplikacje webowe zoptymalizowane pod SEO.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Mobile Apps</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              React Native, Flutter. Dedykowane aplikacje mobilne na systemy iOS oraz Android od projektu do wdrożenia w sklepach.
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">SEO & Marketing</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Kompleksowa optymalizacja SEO, pozycjonowanie w wyszukiwarkach oraz kampanie reklamowe zwiększające konwersję i widoczność.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
