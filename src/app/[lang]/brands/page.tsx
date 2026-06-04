import { Metadata } from 'next';
import { getGlobalSettings } from '@/lib/settings';
import BrandsList from './BrandsList';
import { getAllBrands } from '@/lib/brands';
import { getAllCities } from '@/lib/cities';
import { getDictionary, Locale } from '../dictionaries';

export async function generateMetadata(props: { params: Promise<{ lang: string  }> }): Promise<Metadata> {
  const params = await props.params;
  const dict = await getDictionary(params.lang as Locale);
  return {
    title: dict.brandsPage.metaTitle,
    description: dict.brandsPage.metaDescription,
  };
}

export default async function MarkiPage(props: { params: Promise<{ lang: string  }> }) {
  const params = await props.params;
  const settings = getGlobalSettings();
  const dict = await getDictionary(params.lang as Locale);
  
  // Get all brands from JSON files (no DB needed)
  const allBrands = getAllBrands();
  const brands = allBrands.map(b => ({
    ...b,
    id: b.slug,
    models: b.models.map(m => ({ id: m.slug })),
  }));

  // Get cities from local data
  const cities = getAllCities();

  const homeUrl = params.lang === 'pl' ? '/' : `/${params.lang}`;

  return (
    <main className="min-h-screen bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex justify-center mb-8 text-sm text-slate-500">
          <a href={homeUrl} className="hover:text-amber-600 transition-colors">{dict.breadcrumbs.home}</a>
          <span className="mx-2">/</span>
          <span className="font-medium text-slate-800">{dict.brandsPage.breadcrumb}</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-4 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-700 text-sm font-bold mb-4 uppercase tracking-wider">
            {dict.brandsPage.badge}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight uppercase italic tracking-tight" dangerouslySetInnerHTML={{ __html: dict.brandsPage.title.replace('<span class="gradient-text">', '<span class="gradient-text">') }}></h1>
          <p className="text-lg text-slate-600 mt-6 leading-relaxed">
            {dict.brandsPage.description}
          </p>
        </div>

        {/* Dynamic Brands List Component */}
        <BrandsList brands={brands} cities={cities} dict={dict.brandsPage.list} lang={params.lang as Locale} />
      </div>
    </main>
  );
}
