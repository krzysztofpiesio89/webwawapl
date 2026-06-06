import { cookies } from 'next/headers';
import ContactForm from '@/components/ContactForm';
import HeroSection from '@/components/HeroSection';
import IndustriesShowcase from '@/components/IndustriesShowcase';
import { getGlobalSettings } from '@/lib/settings';
import { getCityBySlug } from '@/lib/cities';
import { getDictionary, Locale } from './dictionaries';

export default async function Home(props: { params: Promise<{ lang: string  }> }) {
  const params = await props.params;
  const settings = getGlobalSettings();
  const cookieStore = await cookies();
  const userCitySlug = cookieStore.get('user-city')?.value || 'warszawa';
  
  const city = getCityBySlug(userCitySlug);
  const cityName = city?.name || 'Warszawa';
  const dict = await getDictionary(params.lang as Locale);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white transition-colors">
      {/* Hero Section */}
      <HeroSection lang={params.lang} phone={settings?.phone} email={settings?.email} />

      {/* Industries Showcase Section */}
      <IndustriesShowcase lang={params.lang as Locale} dict={dict.industriesShowcase} />

      {/* Formularz Kontaktowy */}
      <section id="kontakt" className="py-24 bg-slate-100 dark:bg-slate-950/40 border-t border-slate-200 dark:border-slate-900/60 transition-colors duration-300">
        <div className="container mx-auto px-4 max-w-4xl">
          <ContactForm lang={params.lang} defaultCity={cityName} settings={settings} dict={dict.form} />
        </div>
      </section>

      {/* Legal Footer Info */}
      <section className="py-12 bg-slate-100 dark:bg-slate-950 text-center border-t border-slate-200 dark:border-slate-900/60 text-slate-500 dark:text-slate-400 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase font-bold tracking-widest">
            webwawa.pl
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Administratorem danych osobowych jest właściciel serwisu webwawa.pl. Szczegółowe dane rejestrowe i kontaktowe znajdują się w polityce prywatności.
          </p>
        </div>
      </section>
    </main>
  );
}
