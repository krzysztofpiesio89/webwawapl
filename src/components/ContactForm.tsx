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

  useEffect(() => {
    if (state?.success && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }, [state?.success]);

  useEffect(() => {
    // Sprzątanie wirtualnych URL ze zdjęciami po odmontowaniu komponentu, aby nie zapychać RAM
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);

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
        alert(dict.imagesSizeExceeded || `Przekroczono limit ${MAX_TOTAL_SIZE_MB}MB na zdjęcia. Pomiń niektóre pliki.`);
      }
      
      setImages(prev => [...prev, ...validImages].slice(0, 6));
      // Zabezpieczenie przed podwójnym dodaniem tego samego pliku (reset wartości natywnego inputu)
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
    
    // Usuń surowe (być może niepełne/nadpisane) wejście plików
    formData.delete('images');
    
    // Wstrzyknij pełną pulę plików zapamiętaną w React State
    images.forEach(img => {
      formData.append('images', img.file);
    });
    
    // Ręczne uruchomienie akcji serwerowej za pomocą hooka React 19 (useActionState)
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div ref={formRef} className="bg-white border border-slate-200/80 rounded-[32px] p-8 md:p-10 shadow-2xl animate-fade-in relative overflow-hidden text-slate-800 scroll-mt-24">
      <div className="absolute top-0 left-0 w-full h-2 bg-amber-400"></div>
      <h2 className="text-3xl font-black mb-8 text-center text-slate-900 uppercase tracking-tighter italic">
        {dict.title}
      </h2>
      
      {state?.success ? (
        <div className="bg-green-500/10 border border-green-500/20 text-green-700 p-8 md:p-16 rounded-2xl text-center animate-fade-in shadow-inner">
          <div className="text-6xl mb-6 animate-bounce">✅</div>
          <p className="text-3xl font-black mb-4 uppercase italic tracking-tight text-green-800">{dict.successTitle}</p>
          <p className="font-medium opacity-80">{state.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 text-sm font-bold text-green-700 hover:underline"
          >
            {dict.submitAnother}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="lang" value={lang} />
          
          {/* Honeypot field - niewidoczne dla użytkownika, wypełniane przez boty */}
          <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
            <label htmlFor="website">Strona WWW</label>
            <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="brandModel" className="text-xs font-black text-slate-700 uppercase tracking-widest">{dict.brandModel} *</label>
              <input 
                id="brandModel"
                name="brandModel" 
                required 
                type="text" 
                placeholder={dict.brandModelPlaceholder} 
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 ring-amber-400 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="year" className="text-xs font-black text-slate-700 uppercase tracking-widest">{dict.year}</label>
              <input 
                id="year"
                name="year" 
                type="number" 
                placeholder={dict.yearPlaceholder} 
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 ring-amber-400 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="engine" className="text-xs font-black text-slate-700 uppercase tracking-widest">{dict.engine}</label>
              <input 
                id="engine"
                name="engine" 
                type="text" 
                placeholder={dict.enginePlaceholder} 
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 ring-amber-400 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="price" className="text-xs font-black text-slate-700 uppercase tracking-widest">{dict.price}</label>
              <input 
                id="price"
                name="price" 
                type="text" 
                placeholder={dict.pricePlaceholder} 
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 ring-amber-400 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="city" className="text-xs font-black text-slate-700 uppercase tracking-widest">{dict.city}</label>
              <input 
                id="city"
                name="city" 
                defaultValue={defaultCity} 
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:ring-2 ring-amber-400 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs font-black text-slate-700 uppercase tracking-widest">{dict.phone} *</label>
              <input 
                id="phone"
                name="phone" 
                required 
                type="tel" 
                placeholder={dict.phonePlaceholder} 
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 ring-amber-400 outline-none transition-all" 
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="email" className="text-xs font-black text-slate-700 uppercase tracking-widest">{dict.email} *</label>
              <input 
                id="email"
                name="email" 
                required 
                type="email" 
                placeholder={dict.emailPlaceholder} 
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 ring-amber-400 outline-none transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-xs font-black text-slate-700 uppercase tracking-widest">{dict.description}</label>
            <textarea 
              id="description"
              name="description" 
              rows={3} 
              placeholder={dict.descriptionPlaceholder} 
              className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 ring-amber-400 outline-none transition-all" 
            />
          </div>

          <div className="space-y-4">
            <label htmlFor="images-input" className="text-xs font-black text-slate-700 uppercase tracking-widest">{dict.images}</label>
            <div className="flex flex-wrap gap-4">
              <label htmlFor="images-input" className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-amber-400 transition-colors text-2xl text-slate-300">
                +
                <input 
                  id="images-input"
                  type="file" 
                  name="images" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
              {images.map((img, i) => (
                <div key={i} className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-[10px] text-slate-500 font-bold overflow-hidden text-center p-0.5 relative group shadow-sm border border-slate-200">
                  <img src={img.preview} alt="" className="w-full h-full object-cover rounded-lg" />
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
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${totalSize > MAX_TOTAL_SIZE_BYTES * 0.9 ? 'bg-red-500' : 'bg-amber-400'}`} 
                  style={{ width: `${Math.min((totalSize / MAX_TOTAL_SIZE_BYTES) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-700">
                <span>{dict.attachments || 'Załączniki'} (Max 6)</span>
                <span className={totalSize > MAX_TOTAL_SIZE_BYTES * 0.9 ? 'text-red-500' : 'text-slate-700'}>
                  {images.length > 0 ? `${(totalSize / (1024 * 1024)).toFixed(1)} MB / ${MAX_TOTAL_SIZE_MB} MB` : `Max ${MAX_TOTAL_SIZE_MB} MB`}
                </span>
              </div>
            </div>
          </div>

          <button 
            disabled={isPending} 
            type="submit" 
            className="btn-primary w-full text-xl py-5 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed uppercase italic font-black"
          >
            {isPending ? dict.submitting : dict.submit}
          </button>
          <p className="text-[10px] text-slate-700 text-center leading-tight">
            * {dict.requiredNote} {settings?.companyName || 'właściciel serwisu'}.
          </p>
        </form>
      )}
    </div>
  );
}
