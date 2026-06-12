'use client';

import { useActionState, useState, useEffect, startTransition, useRef } from 'react';
import { submitQuoteRequest } from '@/app/actions/contact';
import { GlobalSettings } from '@/lib/settings';
import { Button } from '@/components/ui/Button';
import { BlurReveal } from '@/components/ui/BlurReveal';

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

  const labelsMap = {
    pl: {
      title: "Darmowa Konsultacja & Wycena",
      clientName: "Imię i nazwisko / Nazwa firmy",
      clientNamePlaceholder: "np. Jan Kowalski / WebWawa Sp. z o.o.",
      serviceType: "Rodzaj usługi",
      serviceTypePlaceholder: "np. Strona internetowa, sklep, aplikacja webowa",
      budget: "Planowany budżet",
      budgetPlaceholder: "np. 5000 - 15000 zł",
      timeframe: "Czas realizacji",
      timeframePlaceholder: "np. 1-2 miesiące, pilne",
      city: "Lokalizacja / Siedziba",
      phone: "Numer telefonu",
      phonePlaceholder: "Twój numer telefonu",
      email: "Adres e-mail",
      emailPlaceholder: "twoj@email.pl",
      description: "Opis projektu / Wymagania",
      descriptionPlaceholder: "Opisz krótko swój projekt, cele i oczekiwania...",
      files: "Załącz pliki / Brief",
      submit: "Wyślij zapytanie",
      submitting: "Wysyłanie...",
      successTitle: "Zapytanie wysłane!",
      successMessage: "Dziękujemy za kontakt. Nasz doradca skontaktuje się z Tobą w ciągu 24 godzin.",
      submitAnother: "Wyślij kolejne zapytanie",
      requiredNote: "pola wymagane. Administratorem danych jest",
      attachments: "Załączniki"
    },
    en: {
      title: "Free Consultation & Quote",
      clientName: "Name / Company Name",
      clientNamePlaceholder: "e.g. John Doe / Tech Corp",
      serviceType: "Service Type",
      serviceTypePlaceholder: "e.g. Website, e-commerce, web app",
      budget: "Estimated Budget",
      budgetPlaceholder: "e.g. $3000 - $10000",
      timeframe: "Desired Timeframe",
      timeframePlaceholder: "e.g. 1-2 months, urgent",
      city: "Location / Office",
      phone: "Phone Number",
      phonePlaceholder: "Your phone number",
      email: "Email Address",
      emailPlaceholder: "your@email.com",
      description: "Project Description / Brief",
      descriptionPlaceholder: "Describe your project, goals and expectations...",
      files: "Attach Files / Brief",
      submit: "Send Inquiry",
      submitting: "Sending...",
      successTitle: "Inquiry Sent!",
      successMessage: "Thank you for contacting us. Our advisor will get back to you within 24 hours.",
      submitAnother: "Send another inquiry",
      requiredNote: "required fields. Data controller is",
      attachments: "Attachments"
    },
    de: {
      title: "Kostenlose Beratung & Angebot",
      clientName: "Name / Firmenname",
      clientNamePlaceholder: "z.B. Max Mustermann / Muster GmbH",
      serviceType: "Dienstleistungsart",
      serviceTypePlaceholder: "z.B. Website, E-Commerce, Web-App",
      budget: "Geschätztes Budget",
      budgetPlaceholder: "z.B. 3000 € - 10000 €",
      timeframe: "Gewünschter Zeitrahmen",
      timeframePlaceholder: "z.B. 1-2 Monate, dringend",
      city: "Standort / Büro",
      phone: "Telefonnummer",
      phonePlaceholder: "Ihre Telefonnummer",
      email: "E-Mail-Adresse",
      emailPlaceholder: "ihre@email.de",
      description: "Projektbeschreibung / Briefing",
      descriptionPlaceholder: "Beschreiben Sie kurz Ihr Projekt, Ihre Ziele und Erwartungen...",
      files: "Dateien anhängen / Briefing",
      submit: "Anfrage senden",
      submitting: "Wird gesendet...",
      successTitle: "Anfrage gesendet!",
      successMessage: "Vielen Dank für Ihre Kontaktaufnahme. Unser Berater wird sich innerhalb von 24 Stunden mit Ihnen in Verbindung setzen.",
      submitAnother: "Weitere Anfrage senden",
      requiredNote: "Pflichtfelder. Datenverantwortlicher ist",
      attachments: "Anhänge"
    },
    uk: {
      title: "Безкоштовна консультація та оцінка",
      clientName: "Ім'я та прізвище / Назва компанії",
      clientNamePlaceholder: "напр. Іван Іванов / ТОВ ВебВава",
      serviceType: "Тип послуги",
      serviceTypePlaceholder: "напр. Сайт, інтернет-магазин, веб-додаток",
      budget: "Орієнтовний бюджет",
      budgetPlaceholder: "напр. 5000 - 15000 злотих",
      timeframe: "Термін реалізації",
      timeframePlaceholder: "напр. 1-2 місяці, терміново",
      city: "Місцезнаходження / Офіс",
      phone: "Номер телефону",
      phonePlaceholder: "Ваш номер телефону",
      email: "Електронна пошта",
      emailPlaceholder: "vash@email.com",
      description: "Опис проекту / Бриф",
      descriptionPlaceholder: "Опишіть коротко свій проект, цілі та очікування...",
      files: "Додати файли / Бриф",
      submit: "Надіслати запит",
      submitting: "Надсилання...",
      successTitle: "Запит надіслано!",
      successMessage: "Дякуємо за звернення. Наш консультант зв'яжеться з вами протягом 24 годин.",
      submitAnother: "Надіслати ще один запит",
      requiredNote: "обов'язкові поля. Контролером даних є",
      attachments: "Вкладення"
    },
    ru: {
      title: "Бесплатная консультация и оценка",
      clientName: "Имя и фамилия / Название компании",
      clientNamePlaceholder: "напр. Иван Иванов / ООО ВебВава",
      serviceType: "Тип услуги",
      serviceTypePlaceholder: "напр. Сайт, интернет-магазин, веб-приложение",
      budget: "Ориентировочный бюджет",
      budgetPlaceholder: "напр. 5000 - 15000 злотых",
      timeframe: "Срок реализации",
      timeframePlaceholder: "напр. 1-2 месяца, срочно",
      city: "Местоположение / Офис",
      phone: "Номер телефона",
      phonePlaceholder: "Ваш номер телефона",
      email: "Электронная почта",
      emailPlaceholder: "vash@email.com",
      description: "Описание проекта / Бриф",
      descriptionPlaceholder: "Опишите кратко свой проект, цели и ожидания...",
      files: "Прикрепить файлы / Бриф",
      submit: "Отправить запрос",
      submitting: "Отправка...",
      successTitle: "Запрос отправлен!",
      successMessage: "Благодарим за обращение. Наш консультант свяжется с вами в течение 24 часов.",
      submitAnother: "Отправить еще один запрос",
      requiredNote: "обязательные поля. Контролером данных является",
      attachments: "Вложения"
    },
    zh: {
      title: "免费咨询与估价",
      clientName: "姓名 / 公司名称",
      clientNamePlaceholder: "例如：张三 / 某科技公司",
      serviceType: "服务类型",
      serviceTypePlaceholder: "例如：网站建设、提单系统、Web应用",
      budget: "预估预算",
      budgetPlaceholder: "例如：3000 - 10000 美元",
      timeframe: "期望工期",
      timeframePlaceholder: "例如：1-2 个月、紧急",
      city: "地点 / 办公室",
      phone: "电话号码",
      phonePlaceholder: "您的电话号码",
      email: "电子邮箱",
      emailPlaceholder: "your@email.com",
      description: "项目描述 / 简要需求",
      descriptionPlaceholder: "简要描述您的项目、目标和期望...",
      files: "添加附件 / 简要需求",
      submit: "发送咨询",
      submitting: "正在发送...",
      successTitle: "咨询已发送！",
      successMessage: "感谢您的联系。我们的顾问将在 24 小时内与您联系。",
      submitAnother: "发送另一个咨询",
      requiredNote: "必填项。数据控制者为",
      attachments: "附件"
    }
  };

  const labels = labelsMap[lang as keyof typeof labelsMap] || labelsMap.en;

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
        const sizeLimitAlerts = {
          pl: `Przekroczono limit ${MAX_TOTAL_SIZE_MB}MB na załączniki. Pomiń niektóre pliki.`,
          en: `Limit of ${MAX_TOTAL_SIZE_MB}MB for attachments exceeded. Skip some files.`,
          de: `Limit von ${MAX_TOTAL_SIZE_MB}MB für Anhänge überschritten. Einige Dateien überspringen.`,
          uk: `Перевищено ліміт у ${MAX_TOTAL_SIZE_MB}МБ для вкладень. Пропустіть деякі файли.`,
          ru: `Превышен лимит в ${MAX_TOTAL_SIZE_MB}МБ для вложений. Пропустите некоторые файлы.`,
          zh: `超出附件 ${MAX_TOTAL_SIZE_MB}MB 的限制。请移除部分文件。`
        };
        const alertMsg = sizeLimitAlerts[lang as keyof typeof sizeLimitAlerts] || sizeLimitAlerts.en;
        alert(alertMsg);
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
    <BlurReveal>
      <div ref={formRef} className="glass-card relative overflow-hidden text-slate-800 dark:text-slate-100 scroll-mt-24 transition-colors border-t-4 border-t-[#818cf8]">
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary"></div>
      
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center text-slate-900 dark:text-white mb-8">
        {labels.title}
      </h2>
      
      {state?.success ? (
        <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-8 md:p-16 rounded-none text-center animate-fade-in shadow-inner">
          <div className="text-6xl mb-6 animate-bounce">✅</div>
          <p className="text-2xl font-bold mb-3 tracking-tight text-green-800 dark:text-green-500">{labels.successTitle}</p>
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
            <div className="space-y-1.5">
              <label htmlFor="brandModel" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">{labels.clientName} *</label>
              <input 
                id="brandModel"
                name="brandModel" 
                required 
                type="text" 
                placeholder={labels.clientNamePlaceholder} 
                className="w-full p-4 rounded-none border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
              />
            </div>

            {/* Service Type */}
            <div className="space-y-1.5">
              <label htmlFor="engine" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">{labels.serviceType} *</label>
              <input 
                id="engine"
                name="engine" 
                required
                type="text" 
                placeholder={labels.serviceTypePlaceholder} 
                className="w-full p-4 rounded-none border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
              />
            </div>

            {/* Budget */}
            <div className="space-y-1.5">
              <label htmlFor="price" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">{labels.budget}</label>
              <input 
                id="price"
                name="price" 
                type="text" 
                placeholder={labels.budgetPlaceholder} 
                className="w-full p-4 rounded-none border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
              />
            </div>

            {/* Timeframe */}
            <div className="space-y-1.5">
              <label htmlFor="year" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">{labels.timeframe}</label>
              <input 
                id="year"
                name="year" 
                type="text" 
                placeholder={labels.timeframePlaceholder} 
                className="w-full p-4 rounded-none border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label htmlFor="city" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">{labels.city}</label>
              <input 
                id="city"
                name="city" 
                defaultValue={defaultCity} 
                className="w-full p-4 rounded-none border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">{labels.phone} *</label>
              <input 
                id="phone"
                name="phone" 
                required 
                type="tel" 
                placeholder={labels.phonePlaceholder} 
                className="w-full p-4 rounded-none border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
              />
            </div>

            {/* E-mail */}
            <div className="md:col-span-2 space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">{labels.email} *</label>
              <input 
                id="email"
                name="email" 
                required 
                type="email" 
                placeholder={labels.emailPlaceholder} 
                className="w-full p-4 rounded-none border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
              />
            </div>
          </div>

          {/* Project description */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">{labels.description}</label>
            <textarea 
              id="description"
              name="description" 
              rows={4} 
              placeholder={labels.descriptionPlaceholder} 
              className="w-full p-4 rounded-none border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm focus:shadow-md" 
            />
          </div>

          {/* Files / Brief */}
          <div className="space-y-4">
            <label htmlFor="images-input" className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">{labels.files}</label>
            <div className="flex flex-wrap gap-4">
              <label htmlFor="images-input" className="w-20 h-20 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-none flex items-center justify-center cursor-pointer hover:border-primary dark:hover:border-primary bg-slate-50 dark:bg-slate-950/60 transition-colors text-2xl text-slate-400 dark:text-slate-600">
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
                <div key={i} className="w-20 h-20 bg-slate-50 dark:bg-slate-950/60 rounded-none flex items-center justify-center text-[10px] text-slate-500 font-bold overflow-hidden text-center p-0.5 relative group shadow-sm border border-slate-200 dark:border-slate-800">
                  {img.file.type.startsWith('image/') ? (
                    <img src={img.preview} alt="" className="w-full h-full object-cover rounded-none" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-1 text-slate-700 dark:text-slate-300">
                      <span className="text-xl">📄</span>
                      <span className="text-[8px] truncate max-w-full">{img.file.name}</span>
                    </div>
                  )}
                  <button 
                    type="button" 
                    onClick={() => removeImage(i)} 
                    className="absolute inset-0 bg-red-500/90 text-white font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
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

          <Button 
            disabled={isPending} 
            type="submit" 
            variant="gradient"
            size="lg"
            className="w-full tracking-tight"
          >
            {isPending ? labels.submitting : labels.submit}
          </Button>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 text-center leading-tight">
            * {labels.requiredNote} {settings?.companyName || 'webwawa.pl'}.
          </p>
        </form>
      )}
      </div>
    </BlurReveal>
  );
}
