import Link from 'next/link';
import { GlobalSettings } from '@/lib/settings';
import Logo from './Logo';
import { Locale } from '@/app/[lang]/dictionaries';
import { getLocalizedStaticPath } from '@/app/[lang]/i18n-routes';
import { getWarsawDistricts, getAllCities } from '@/lib/cities';
import CookiePreferencesButton from './CookiePreferencesButton';

export default function Footer({ 
  settings, 
  dict, 
  lang 
}: { 
  settings: GlobalSettings | null;
  dict: any;
  lang: Locale;
}) {
  const homeUrl = lang === 'pl' ? '/' : `/${lang}`;
  const privacyUrl = getLocalizedStaticPath('privacy', lang);
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  
  const translations = {
    pl: {
      description: 'Profesjonalne usługi informatyczne, dedykowane aplikacje webowe oraz pozycjonowanie SEO dla biznesu.',
      servicesHeading: 'Usługi',
      serviceCustomWebsites: 'Dedykowane Strony WWW',
      serviceECommerce: 'E-commerce & Sklepy',
      serviceCustomSoftware: 'Aplikacje Dedykowane',
      serviceSEO: 'Pozycjonowanie SEO',
      contactHeading: 'Kontakt',
      officeWarsaw: 'Biuro Warszawa',
      allRightsReserved: 'Wszelkie prawa zastrzeżone.',
      cookieSettings: 'Ustawienia cookies'
    },
    en: {
      description: 'Professional IT services, dedicated web applications, and SEO optimization for your business.',
      servicesHeading: 'Services',
      serviceCustomWebsites: 'Custom Websites',
      serviceECommerce: 'E-commerce',
      serviceCustomSoftware: 'Custom Software',
      serviceSEO: 'SEO Optimization',
      contactHeading: 'Contact',
      officeWarsaw: 'Office Warsaw',
      allRightsReserved: 'All rights reserved.',
      cookieSettings: 'Cookie settings'
    },
    de: {
      description: 'Professionelle IT-Dienstleistungen, dedizierte Webanwendungen und SEO-Optimierung für Ihr Unternehmen.',
      servicesHeading: 'Dienste',
      serviceCustomWebsites: 'Dedizierte Webseiten',
      serviceECommerce: 'E-Commerce',
      serviceCustomSoftware: 'Maßgeschneiderte Software',
      serviceSEO: 'SEO-Optimierung',
      contactHeading: 'Kontakt',
      officeWarsaw: 'Büro Warschau',
      allRightsReserved: 'Alle Rechte vorbehalten.',
      cookieSettings: 'Cookie-Einstellungen'
    },
    uk: {
      description: 'Професійні IT-послуги, спеціалізовані веб-додатки та SEO-оптимізація для вашого бізнесу.',
      servicesHeading: 'Послуги',
      serviceCustomWebsites: 'Спеціалізовані веб-сайти',
      serviceECommerce: 'Інтернет-магазини / E-commerce',
      serviceCustomSoftware: 'Спеціалізоване ПЗ',
      serviceSEO: 'SEO-оптимізація',
      contactHeading: 'Контакти',
      officeWarsaw: 'Офіс Варшава',
      allRightsReserved: 'Усі права захищені.',
      cookieSettings: 'Налаштування файлів cookie'
    },
    ru: {
      description: 'Профессиональные IT-услуги, специализированные веб-приложения и SEO-оптимизация для вашего бизнеса.',
      servicesHeading: 'Услуги',
      serviceCustomWebsites: 'Специализированные веб-сайты',
      serviceECommerce: 'Интернет-магазины / E-commerce',
      serviceCustomSoftware: 'Специализированное ПО',
      serviceSEO: 'SEO-оптимизация',
      contactHeading: 'Контакты',
      officeWarsaw: 'Офис Варшава',
      allRightsReserved: 'Все права защищены.',
      cookieSettings: 'Настройки файлов cookie'
    },
    zh: {
      description: '为您的企业提供专业的 IT 服务、定制 Web 应用开发和 SEO 优化。',
      servicesHeading: '服务项目',
      serviceCustomWebsites: '定制网站建设',
      serviceECommerce: '电子商务系统',
      serviceCustomSoftware: '定制软件开发',
      serviceSEO: 'SEO 排名优化',
      contactHeading: '联系我们',
      officeWarsaw: '华沙办公室',
      allRightsReserved: '版权所有。',
      cookieSettings: 'Cookie 设置'
    }
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 pt-20 pb-8 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="space-y-6">
            <Link href={homeUrl} className="flex items-center gap-3 group">
              <Logo className="h-12 w-auto transform group-hover:scale-105 transition-transform" />
              <div className="flex flex-col leading-none">
                <span className="text-[23px] font-extrabold text-slate-900 dark:text-white tracking-tight font-display lowercase">
                  webwawa<span className="text-amber-700 dark:text-amber-400 font-semibold">.pl</span>
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed">
              {t.description}
            </p>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-6">{t.servicesHeading}</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href={getLocalizedStaticPath('websites', lang)} className="hover:text-primary transition-colors">{t.serviceCustomWebsites}</Link></li>
              <li><Link href={getLocalizedStaticPath('ecommerce', lang)} className="hover:text-primary transition-colors">{t.serviceECommerce}</Link></li>
              <li><Link href={getLocalizedStaticPath('software', lang)} className="hover:text-primary transition-colors">{t.serviceCustomSoftware}</Link></li>
              <li><Link href={getLocalizedStaticPath('seo', lang)} className="hover:text-primary transition-colors">{t.serviceSEO}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-6">{t.contactHeading}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <span className="text-primary">📞</span> {settings?.phone || '+48 664 946 209'}
              </li>
              <li className="flex items-center gap-3">
                <span className="text-primary">📧</span> {settings?.email || 'kontakt@webwawa.pl'}
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary shrink-0 mt-0.5">🏢</span>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">{t.officeWarsaw}</span>
                  <span className="text-xs text-slate-700 dark:text-slate-300 block">ul. Księżycowa 76/8, 01-934 Warszawa</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} webwawa.pl - {t.allRightsReserved}</p>
          <div className="flex items-center gap-6">
            <Link href={privacyUrl} className="hover:text-primary transition-colors">{dict.footer.privacyPolicy}</Link>
            <CookiePreferencesButton label={t.cookieSettings} />
          </div>
        </div>
      </div>
    </footer>
  );
}
