import PartsSearchDemo from '@/components/PartsSearchDemo';

interface EcommerceShowcaseProps {
  lang: string;
  ecomUi: {
    readonly stackTag: string;
    readonly stackTitle: string;
    readonly stackSub: string;
    readonly faqTag: string;
    readonly faqTitle: string;
    readonly faqSub: string;
    readonly stacks: ReadonlyArray<{ readonly name: string; readonly desc: string; readonly benefit: string; readonly cost: string }>;
    readonly faqs: ReadonlyArray<{ readonly q: string; readonly a: string }>;
  };
}

export default function EcommerceShowcase({ lang, ecomUi }: EcommerceShowcaseProps) {
  return (
    <>
      {/* 1. Parts Search Demo */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/10 border-t border-slate-200 dark:border-slate-900/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <PartsSearchDemo lang={lang} />
        </div>
      </section>

      {/* 2. E-commerce Stack Showcase */}
      <section className="py-20 bg-white dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-900/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-4 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              {ecomUi.stackTag}
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-4">
              {ecomUi.stackTitle}
            </h2>
            <p className="text-slate-650 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              {ecomUi.stackSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ecomUi.stacks.map((stack, idx) => (
              <div key={idx} className="p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05] rounded-3xl relative overflow-hidden group hover:border-primary/45 transition-colors shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl p-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-xl">
                    {idx === 0 ? '🔌' : idx === 1 ? '🛍️' : idx === 2 ? '⚙️' : '🐍'}
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                    {stack.name}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {stack.desc}
                </p>
                <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-2xl border border-primary/10 text-xs font-semibold">
                  <span className="text-primary uppercase tracking-wider font-bold block mb-1">Kluczowa Zaleta SEO:</span>
                  <span className="text-slate-700 dark:text-slate-350">{stack.benefit}</span>
                </div>
                <div className="mt-4 flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">
                  <span>Koszt wdrożenia:</span>
                  <span className="text-primary">{stack.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FAQ Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/10 border-t border-slate-200 dark:border-slate-900/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-4 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
              {ecomUi.faqTag}
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-4">
              {ecomUi.faqTitle}
            </h2>
            <p className="text-slate-650 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
              {ecomUi.faqSub}
            </p>
          </div>

          <div className="space-y-6">
            {ecomUi.faqs.map((faq, idx) => (
              <div key={idx} className="p-6 bg-white dark:bg-[#070b19] border border-slate-200/80 dark:border-white/[0.05] rounded-3xl shadow-sm hover:border-primary/20 transition-all duration-300">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-3 flex items-start gap-2.5">
                  <span className="text-primary font-black text-lg">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <div className="text-sm text-slate-650 dark:text-slate-455 leading-relaxed pl-7 flex items-start gap-2.5">
                  <span className="text-emerald-500 font-black text-lg">A:</span>
                  <span>{faq.a}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
