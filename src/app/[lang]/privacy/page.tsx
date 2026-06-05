import { Metadata } from 'next';
import { getGlobalSettings } from '@/lib/settings';
import Link from 'next/link';
import { getDictionary, Locale } from '../dictionaries';
import CookiePreferencesButton from '@/components/CookiePreferencesButton';

export async function generateMetadata(props: { params: Promise<{ lang: string  }> }): Promise<Metadata> {
  const params = await props.params;
  const dict = await getDictionary(params.lang as Locale);
  return {
    title: dict.privacy.metaTitle,
    description: dict.privacy.metaDescription,
  };
}

export default async function PrivacyPolicy(props: { params: Promise<{ lang: string  }> }) {
  const params = await props.params;
  const settings = await getGlobalSettings();
  const dict = await getDictionary(params.lang as Locale);
  
  const companyName = settings?.companyName || 'Krzysztof Piesio WIKOL';
  const address = settings?.addressRegistered || 'ul. Nadrzeczna 9, 08-400 Górki';
  const nip = settings?.nip || '8262147079';

  const homeUrl = params.lang === 'pl' ? '/' : `/${params.lang}`;

  return (
    <main className="min-h-screen py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-xl border border-slate-100">
          <Link href={homeUrl} className="text-primary font-bold hover:underline mb-8 inline-block">
            {dict.privacy.backHome}
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 uppercase tracking-tighter">
            {dict.privacy.title}
          </h1>
          
          <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700">
            <p className="lead italic">
              {dict.privacy.intro}
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">{dict.privacy.h1}</h2>
            <p dangerouslySetInnerHTML={{ __html: dict.privacy.p1.replace('{companyName}', `<strong>${companyName}</strong>`).replace('{address}', address).replace('{nip}', nip) }} />

            <h2 className="text-2xl font-bold mt-12 mb-4">{dict.privacy.h2}</h2>
            <p>{dict.privacy.p2Intro}</p>
            <ul dangerouslySetInnerHTML={{ __html: dict.privacy.p2List }} />

            <h2 className="text-2xl font-bold mt-12 mb-4">{dict.privacy.h3}</h2>
            <p>{dict.privacy.p3Intro}</p>
            <ul dangerouslySetInnerHTML={{ __html: dict.privacy.p3List }} />

            <h2 className="text-2xl font-bold mt-12 mb-4">{dict.privacy.h4}</h2>
            <p>{dict.privacy.p4}</p>

            <h2 className="text-2xl font-bold mt-12 mb-4">{dict.privacy.h5}</h2>
            <p>{dict.privacy.p5Intro}</p>
            <ul dangerouslySetInnerHTML={{ __html: dict.privacy.p5List }} />

            <h2 className="text-2xl font-bold mt-12 mb-4">{dict.privacy.h6}</h2>
            <p>{dict.privacy.p6}</p>

            <h2 className="text-2xl font-bold mt-12 mb-4">{dict.privacy.h7}</h2>
            <p dangerouslySetInnerHTML={{ __html: dict.privacy.p7.replace('{email}', `<strong>${settings?.email || 'kontakt@webwawa.pl'}</strong>`).replace('{phone}', `<strong>${settings?.phone || '+48 664 946 209'}</strong>`) }} />

            <h2 className="text-2xl font-bold mt-12 mb-4">{params.lang === 'pl' ? 'Ustawienia plików cookie' : 'Cookie Settings'}</h2>
            <p className="mb-4">
              {params.lang === 'pl' 
                ? 'W każdej chwili możesz dostosować lub wycofać swoje zgody na pliki cookie, klikając poniższy przycisk.' 
                : 'You can adjust or withdraw your cookie consents at any time by clicking the button below.'}
            </p>
            <div className="my-6 p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl w-fit">
              <CookiePreferencesButton label={params.lang === 'pl' ? '⚙️ Zarządzaj preferencjami cookies' : '⚙️ Manage cookie preferences'} />
            </div>

            <div className="mt-16 pt-8 border-t border-slate-100 text-sm text-slate-400">
              {dict.privacy.lastUpdate}: {new Date().toLocaleDateString('pl-PL')}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
