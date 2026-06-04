import { Metadata } from 'next';
import { getGlobalSettings } from '@/lib/settings';
import Link from 'next/link';
import { getDictionary, Locale } from '../dictionaries';

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
  
  const companyName = settings?.companyName || 'Yuliya Taurel';
  const address = settings?.address || 'ul. Józefa Piłsudskiego 20, 07-130 Kamionna';
  const nip = settings?.nip || '9662148516';

  const homeUrl = params.lang === 'pl' ? '/' : `/${params.lang}`;

  return (
    <main className="min-h-screen py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-xl border border-slate-100">
          <Link href={homeUrl} className="text-amber-600 font-bold hover:underline mb-8 inline-block">
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
            <p dangerouslySetInnerHTML={{ __html: dict.privacy.p7.replace('{email}', `<strong>${settings?.email || 'kontakt@skupautwawa.pl'}</strong>`).replace('{phone}', `<strong>${settings?.phone || '+48 664 946 209'}</strong>`) }} />

            <div className="mt-16 pt-8 border-t border-slate-100 text-sm text-slate-400">
              {dict.privacy.lastUpdate}: {new Date().toLocaleDateString('pl-PL')}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
