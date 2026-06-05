'use client';

import { useActionState, useState, useEffect, startTransition, useRef } from 'react';
import { submitQuoteRequest } from '@/app/actions/contact';
import { GlobalSettings } from '@/lib/settings';

export default function ContactForm({ 
  lang,
  defaultCity, 
  settings, 
  dict 
}: { 
  lang: string,
  defaultCity: string, 
  settings: GlobalSettings | null,
  dict: any
}) {
  const [state, action, isPending] = useActionState(submitQuoteRequest, null);
  const [images, setImages] = useState<{file: File, preview: string}[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  const isPl = lang === 'pl';
  const labels = {
    title: isPl ? "Darmowa Konsultacja & Wycena" : "Free Consultation & Quote",
    clientName: isPl ? "Imię i nazwisko / Nazwa firmy" : "Name / Company Name",
    clientNamePlaceholder: isPl ? "np. Jan Kowalski / WebWawa Sp. z o.o." : "e.g. John Doe / Tech Corp",
    serviceType: isPl ? "Rodzaj usługi" : "Service Type",
    serviceTypePlaceholder: isPl ? "np. Strona internetowa, sklep, aplikacja webowa" : "e.g. Website, e-commerce, web app",
    budget: isPl ? "Planowany budżet" : "Estimated Budget",
    budgetPlaceholder: isPl ? "np. 5000 - 15000 zł" : "e.g. $3000 - $10000",
    timeframe: isPl ? "Czas realizacji" : "Desired Timeframe",
    timeframePlaceholder: isPl ? "np. 1-2 miesiące, pilne" : "e.g. 1-2 months, urgent",
    city: isPl ? "Lokalizacja / Siedziba" : "Location / Office",
    phone: isPl ? "Numer telefonu" : "Phone Number",
    phonePlaceholder: isPl ? "Twój numer telefonu" : "Your phone number",
    email: isPl ? "Adres e-mail" : "Email Address",
    emailPlaceholder: isPl ? "twoj@email.pl" : "your@email.com",
    description: isPl ? "Opis projektu / Wymagania" : "Project Description / Brief",
    descriptionPlaceholder: isPl ? "Opisz krótko swój projekt, cele i oczekiwania..." : "Describe your project, goals and expectations...",
    files: isPl ? "Załącz pliki / Brief" : "Attach Files / Brief",
    submit: isPl ? "Wyślij zapytanie" : "Send Inquiry",
    submitting: isPl ? "Wysyłanie..." : "Sending...",
    successTitle: isPl ? "Zapytanie wysłane!" : "Inquiry Sent!",
    successMessage: isPl ? "Dziękujemy za kontakt. Nasz doradca skontaktuje się z Tobą w ciągu 24 godzin." : "Thank you for contacting us. Our advisor will get back to you within 24 hours.",
    submitAnother: isPl ? "Wyślij kolejne zapytanie" : "Send another inquiry",
    requiredNote: isPl ? "pola wymagane. Administratorem danych jest" : "required fields. Data controller is",
    attachments: isPl ? "Załączniki" : "Attachments"
  };

  useEffect(() => {
    if (state?.success && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }, [state?.success]);

  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const MAX_TOTAL_SIZE_MB = 20;
  const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;
  const totalSize = images.reduce((acc, img) => acc + img.file.size, 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      let currentSize = totalSize;
      const validImages: {file: File, preview: string}[] = [];
      let sizeExceeded = false;
      
      for (const file of newFiles) {
        if (currentSize + file.size <= MAX_TOTAL_SIZE_BYTES) {
          validImages.push({
            file,
            preview: URL.createObjectURL(file)
          });
          currentSize += file.size;
        } else {
          sizeExceeded = true;
        }
      }
      
      if (sizeExceeded) {
        alert(isPl ? `Przekroczono limit ${MAX_TOTAL_SIZE_MB}MB na załączniki. Pomiń niektóre pliki.` : `Limit of ${MAX_TOTAL_SIZE_MB}MB for attachments exceeded. Skip some files.`);
      }
      
      setImages(prev => [...prev, ...validImages].slice(0, 6));
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[indexToRemove].preview);
      newImages.splice(indexToRemove, 1);
      return newImages;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.delete('images');
    images.forEach(img => {
      formData.append('images', img.file);
    });
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div ref={formRef} className="glass-card relative overflow-hidden text-slate-800 dark:text-slate-100 scroll-mt-24 transition-colors">
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary"></div>
      
      <h2 className="text-3xl font-black mb-8 text-center text-slate-900 dark:text-white uppercase tracking-tighter italic">
        {labels.title}
      </h2>
      
      {state?.success ? (
        <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-8 md:p-16 rounded-2xl text-center animate-fade-in shadow-inner">
          <div className="text-6xl mb-6 animate-bounce">✅</div>
          <p className="text-3xl font-black mb-4 uppercase italic tracking-tight text-green-800 dark:text-green-500">{labels.successTitle}</p>
          <p className="font-medium opacity-80">{labels.successMessage}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 text-sm font-bold text-green-700 dark:text-green-400 hover:underline"
          >
            {labels.submitAnother}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="lang" value={lang} />
          
          {/* Honeypot field */}
          <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
            <label htmlFor="website">Strona WWW</label>
            <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Name */}
            <div className="space-y-1">
              <label htmlFor="brandModel" className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest block">{labels.clientName} *</label>
              <input 
                id="brandModel"
                name="brandModel" 
                required 
                type="text" 
                placeholder={labels.clientNamePlaceholder} 
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
              />
            </div>

            {/* Service Type */}
            <div className="space-y-1">
              <label htmlFor="engine" className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest block">{labels.serviceType} *</label>
              <input 
                id="engine"
                name="engine" 
                required
                type="text" 
                placeholder={labels.serviceTypePlaceholder} 
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
              />
            </div>

            {/* Budget */}
            <div className="space-y-1">
              <label htmlFor="price" className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest block">{labels.budget}</label>
              <input 
                id="price"
                name="price" 
                type="text" 
                placeholder={labels.budgetPlaceholder} 
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
              />
            </div>

            {/* Timeframe */}
            <div className="space-y-1">
              <label htmlFor="year" className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest block">{labels.timeframe}</label>
              <input 
                id="year"
                name="year" 
                type="text" 
                placeholder={labels.timeframePlaceholder} 
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
              />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label htmlFor="city" className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest block">{labels.city}</label>
              <input 
                id="city"
                name="city" 
                defaultValue={defaultCity} 
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label htmlFor="phone" className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest block">{labels.phone} *</label>
              <input 
                id="phone"
                name="phone" 
                required 
                type="tel" 
                placeholder={labels.phonePlaceholder} 
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
              />
            </div>

            {/* E-mail */}
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="email" className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest block">{labels.email} *</label>
              <input 
                id="email"
                name="email" 
                required 
                type="email" 
                placeholder={labels.emailPlaceholder} 
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
              />
            </div>
          </div>

          {/* Project description */}
          <div className="space-y-1">
            <label htmlFor="description" className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest block">{labels.description}</label>
            <textarea 
              id="description"
              name="description" 
              rows={4} 
              placeholder={labels.descriptionPlaceholder} 
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
            />
          </div>

          {/* Files / Brief */}
          <div className="space-y-4">
            <label htmlFor="images-input" className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest block">{labels.files}</label>
            <div className="flex flex-wrap gap-4">
              <label htmlFor="images-input" className="w-20 h-20 border-2 border-dashed border-slate-300 dark:border-slate-850 rounded-xl flex items-center justify-center cursor-pointer hover:border-primary dark:hover:border-primary bg-slate-50 dark:bg-slate-950/60 transition-colors text-2xl text-slate-400 dark:text-slate-600">
                +
                <input 
                  id="images-input"
                  type="file" 
                  name="images" 
                  multiple 
                  accept="*/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
              {images.map((img, i) => (
                <div key={i} className="w-20 h-20 bg-slate-50 dark:bg-slate-950/60 rounded-xl flex items-center justify-center text-[10px] text-slate-500 font-bold overflow-hidden text-center p-0.5 relative group shadow-sm border border-slate-200 dark:border-slate-800">
                  {img.file.type.startsWith('image/') ? (
                    <img src={img.preview} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-1 text-slate-700 dark:text-slate-300">
                      <span className="text-xl">📄</span>
                      <span className="text-[8px] truncate max-w-full">{img.file.name}</span>
                    </div>
                  )}
                  <button 
                    type="button" 
                    onClick={() => removeImage(i)} 
                    className="absolute inset-0 bg-red-500/90 text-white font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <div className="w-full mt-2">
              <div className="w-full bg-slate-150 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${totalSize > MAX_TOTAL_SIZE_BYTES * 0.9 ? 'bg-red-500' : 'bg-primary'}`} 
                  style={{ width: `${Math.min((totalSize / MAX_TOTAL_SIZE_BYTES) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                <span>{labels.attachments} (Max 6)</span>
                <span className={totalSize > MAX_TOTAL_SIZE_BYTES * 0.9 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}>
                  {images.length > 0 ? `${(totalSize / (1024 * 1024)).toFixed(1)} MB / ${MAX_TOTAL_SIZE_MB} MB` : `Max ${MAX_TOTAL_SIZE_MB} MB`}
                </span>
              </div>
            </div>
          </div>

          <button 
            disabled={isPending} 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary text-white font-black text-xl py-5 rounded-2xl shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed uppercase italic tracking-wide"
          >
            {isPending ? labels.submitting : labels.submit}
          </button>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 text-center leading-tight">
            * {labels.requiredNote} {settings?.companyName || 'webwawa.pl'}.
          </p>
        </form>
      )}
    </div>
  );
}
