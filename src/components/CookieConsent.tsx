'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface CookieConsentContextType {
  acceptedServices: string[];
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const useCookieConsent = (): CookieConsentContextType => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};

interface CookieConsentProviderProps {
  children: ReactNode;
  lang: string;
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children, lang }) => {
  const [acceptedServices, setAcceptedServices] = useState<string[]>([]);

  useEffect(() => {
    // Dynamic import — vanilla-cookieconsent is NOT in the critical path
    // Deferred after first render to avoid render-blocking JS and CSS
    const initCookieConsent = async () => {
      // Lazy-load CSS (non-blocking, deferred)
      if (!document.querySelector('link[data-cc-css]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/cookie-consent.css';
        link.setAttribute('data-cc-css', '1');
        document.head.appendChild(link);

        // Inline overrides injected AFTER cc CSS to ensure correct cascade
        link.onload = () => {
          if (!document.querySelector('style[data-cc-overrides]')) {
            const style = document.createElement('style');
            style.setAttribute('data-cc-overrides', '1');
            style.textContent = `
              #cc-main {
                --cc-font-family: inherit;
                --cc-modal-border-radius: 1.5rem;
                --cc-btn-border-radius: 0.75rem;
                --cc-btn-primary-bg: #0369a1;
                --cc-btn-primary-border-color: #0369a1;
                --cc-btn-primary-hover-bg: #0284c7;
                --cc-btn-primary-hover-border-color: #0284c7;
                --cc-btn-primary-text: #ffffff;
                --cc-btn-primary-hover-text: #ffffff;
                --cc-btn-secondary-bg: #f1f5f9;
                --cc-btn-secondary-border-color: #e2e8f0;
                --cc-btn-secondary-hover-bg: #e2e8f0;
                --cc-btn-secondary-hover-border-color: #cbd5e1;
                --cc-btn-secondary-text: #1e293b;
                --cc-btn-secondary-hover-text: #0f172a;
              }
              .cc--darkmode #cc-main {
                --cc-btn-secondary-bg: #1e293b;
                --cc-btn-secondary-border-color: #334155;
                --cc-btn-secondary-hover-bg: #334155;
                --cc-btn-secondary-hover-border-color: #475569;
                --cc-btn-secondary-text: #f1f5f9;
                --cc-btn-secondary-hover-text: #ffffff;
                --cc-btn-primary-bg: #0284c7;
                --cc-btn-primary-border-color: #0284c7;
                --cc-btn-primary-hover-bg: #0ea5e9;
                --cc-btn-primary-hover-border-color: #0ea5e9;
                --cc-btn-primary-text: #ffffff;
                --cc-btn-primary-hover-text: #ffffff;
                --cc-bg: #090e1a;
                --cc-modal-bg: #0c1322;
                --cc-text: #e2e8f0;
                --cc-title-text: #ffffff;
              }
            `;
            document.head.appendChild(style);
          }
        };
      }

      const CookieConsent = await import('vanilla-cookieconsent');

      // Sync dark mode class
      const updateDarkMode = () => {
        const isDark = document.documentElement.classList.contains('dark');
        const hasCcDark = document.documentElement.classList.contains('cc--darkmode');
        if (isDark && !hasCcDark) {
          document.documentElement.classList.add('cc--darkmode');
        } else if (!isDark && hasCcDark) {
          document.documentElement.classList.remove('cc--darkmode');
        }
      };

      updateDarkMode();

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            updateDarkMode();
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      const updateGtmConsent = () => {
        if (typeof window.gtag !== 'function') return;

        const userPreferences = CookieConsent.getUserPreferences();
        const acceptedCategories: string[] = userPreferences.acceptedCategories || [];
        const acceptedServices = userPreferences.acceptedServices || {};

        const isGoogleAccepted = acceptedCategories.includes('analytics') &&
          (acceptedServices.analytics?.includes('google') || acceptedCategories.includes('analytics'));

        const consentUpdate = {
          analytics_storage: isGoogleAccepted ? 'granted' : 'denied',
          ad_storage: isGoogleAccepted ? 'granted' : 'denied',
          personalization_storage: isGoogleAccepted ? 'granted' : 'denied',
          functionality_storage: 'granted',
          ad_user_data: isGoogleAccepted ? 'granted' : 'denied',
          ad_personalization: isGoogleAccepted ? 'granted' : 'denied',
        };

        window.gtag('consent', 'update', consentUpdate);
      };

      const updateAcceptedServices = () => {
        const userPreferences = CookieConsent.getUserPreferences();
        const acceptedServices = userPreferences.acceptedServices || {};
        const acceptedServicesList = Object.values(acceptedServices).flat() as string[];
        setAcceptedServices(acceptedServicesList);
      };

      const validLangs = ['pl', 'en', 'de', 'uk', 'ru', 'zh'];
      const currentLang = validLangs.includes(lang) ? lang : 'pl';

      CookieConsent.reset(true);

      CookieConsent.run({
        cookie: {
          name: 'webwawa_consent',
          domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || window.location.hostname,
        },
        guiOptions: {
          consentModal: {
            layout: 'cloud',
            position: 'bottom center',
            equalWeightButtons: true,
            flipButtons: false
          },
          preferencesModal: {
            layout: 'box',
            position: 'right',
            equalWeightButtons: true,
            flipButtons: false
          }
        },
        categories: {
          necessary: {
            enabled: true,
            readOnly: true,
          },
          analytics: {
            services: {
              google: { label: 'Google Analytics & Tag Manager' },
            },
          },
        },
        language: {
          default: currentLang,
          translations: {
            pl: {
              consentModal: {
                title: 'Ustawienia Prywatności',
                description: 'Używamy plików cookie, aby ułatwić korzystanie z naszej witryny, analizować ruch i personalizować treści. Wybierz swoje preferencje.',
                acceptAllBtn: 'Zaakceptuj wszystkie',
                acceptNecessaryBtn: 'Tylko niezbędne',
                showPreferencesBtn: 'Zarządzaj preferencjami',
              },
              preferencesModal: {
                title: 'Preferencje plików cookie',
                sections: [
                  {
                    title: 'Niezbędne pliki cookie',
                    description: 'Te pliki cookie są wymagane do prawidłowego działania naszej witryny, np. do zapamiętania Twoich preferencji dotyczących prywatności.',
                    linkedCategory: 'necessary',
                  },
                  {
                    title: 'Analityczne pliki cookie',
                    description: 'Pomagają nam mierzyć ruch na stronie, analizować źródła odwiedzin i optymalizować działanie witryny pod kątem wygody użytkowników.',
                    linkedCategory: 'analytics',
                  },
                ],
                acceptAllBtn: 'Zaakceptuj wszystkie',
                acceptNecessaryBtn: 'Tylko niezbędne',
                savePreferencesBtn: 'Zapisz preferencje',
              },
            },
            en: {
              consentModal: {
                title: 'Privacy Settings',
                description: 'We use cookies to enhance your experience, analyze site traffic, and personalize content. Please choose your preferences.',
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Accept only necessary',
                showPreferencesBtn: 'Manage preferences',
              },
              preferencesModal: {
                title: 'Cookie Preferences',
                sections: [
                  {
                    title: 'Necessary cookies',
                    description: 'These cookies are required for the site to function properly and cannot be disabled.',
                    linkedCategory: 'necessary',
                  },
                  {
                    title: 'Analytics cookies',
                    description: 'These cookies help us understand how visitors interact with the site, measure performance, and optimize user experience.',
                    linkedCategory: 'analytics',
                  },
                ],
                acceptAllBtn: 'Accept all',
                acceptNecessaryBtn: 'Accept only necessary',
                savePreferencesBtn: 'Save preferences',
              },
            },
            de: {
              consentModal: {
                title: 'Privatsphäre-Einstellungen',
                description: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern, den Datenverkehr zu analysieren und Inhalte zu personalisieren. Bitte wählen Sie Ihre Einstellungen.',
                acceptAllBtn: 'Alle akzeptieren',
                acceptNecessaryBtn: 'Nur notwendige',
                showPreferencesBtn: 'Einstellungen verwalten',
              },
              preferencesModal: {
                title: 'Cookie-Einstellungen',
                sections: [
                  {
                    title: 'Notwendige Cookies',
                    description: 'Diese Cookies sind für das Funktionieren der Website erforderlich und können nicht deaktiviert werden.',
                    linkedCategory: 'necessary',
                  },
                  {
                    title: 'Analytische Cookies',
                    description: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren, und die Leistung zu optimieren.',
                    linkedCategory: 'analytics',
                  },
                ],
                acceptAllBtn: 'Alle akzeptieren',
                acceptNecessaryBtn: 'Nur notwendige',
                savePreferencesBtn: 'Einstellungen speichern',
              },
            },
            uk: {
              consentModal: {
                title: 'Налаштування конфіденційності',
                description: 'Ми використовуємо файли cookie для покращення роботи сайту, аналізу трафіку та персоналізації вмісту. Будь ласка, оберіть ваші налаштування.',
                acceptAllBtn: 'Прийняти всі',
                acceptNecessaryBtn: 'Тільки необхідні',
                showPreferencesBtn: 'Налаштувати',
              },
              preferencesModal: {
                title: 'Налаштування файлів cookie',
                sections: [
                  {
                    title: 'Необхідні файли cookie',
                    description: 'Ці файли cookie потрібні для належного функціонування нашого сайту і не можуть бути вимкнені.',
                    linkedCategory: 'necessary',
                  },
                  {
                    title: 'Аналітичні файли cookie',
                    description: 'Ці файли cookie допомагають нам зрозуміти, як відвідувачі взаємодіють із сайтом, та оптимізувати його продуктивність.',
                    linkedCategory: 'analytics',
                  },
                ],
                acceptAllBtn: 'Прийняти всі',
                acceptNecessaryBtn: 'Тільки необхідні',
                savePreferencesBtn: 'Зберегти налаштування',
              },
            },
            ru: {
              consentModal: {
                title: 'Настройки конфиденциальности',
                description: 'Мы используем файлы cookie для улучшения работы сайта, анализа трафика и персонализации контента. Пожалуйста, выберите ваши предпочтения.',
                acceptAllBtn: 'Принять все',
                acceptNecessaryBtn: 'Только необходимые',
                showPreferencesBtn: 'Настройки',
              },
              preferencesModal: {
                title: 'Настройки файлов cookie',
                sections: [
                  {
                    title: 'Необходимые файлы cookie',
                    description: 'Эти файлы cookie необходимы для работы сайта и не могут быть отключены.',
                    linkedCategory: 'necessary',
                  },
                  {
                    title: 'Аналитические файлы cookie',
                    description: 'Эти файлы cookie помогают нам понять, как посетители взаимодействуют с сайтом, и оптимизировать его производительность.',
                    linkedCategory: 'analytics',
                  },
                ],
                acceptAllBtn: 'Принять все',
                acceptNecessaryBtn: 'Только необходимые',
                savePreferencesBtn: 'Сохранить настройки',
              },
            },
            zh: {
              consentModal: {
                title: '隐私设置',
                description: '我们使用 Cookie 来提升您的体验、分析网站流量并个性化内容。请选择您的偏好。',
                acceptAllBtn: '接受全部',
                acceptNecessaryBtn: '仅接受必要',
                showPreferencesBtn: '管理偏好设置',
              },
              preferencesModal: {
                title: 'Cookie 偏好设置',
                sections: [
                  {
                    title: '必要 Cookie',
                    description: '这些 Cookie 是网站正常运行所必需的，无法禁用。',
                    linkedCategory: 'necessary',
                  },
                  {
                    title: '分析 Cookie',
                    description: '这些 Cookie 帮助我们了解访客如何与网站互动，衡量性能并优化用户体验。',
                    linkedCategory: 'analytics',
                  },
                ],
                acceptAllBtn: '接受全部',
                acceptNecessaryBtn: '仅接受必要',
                savePreferencesBtn: '保存偏好设置',
              },
            },
          },
        },
        onChange: () => {
          updateAcceptedServices();
          updateGtmConsent();
        },
        onFirstConsent: () => {
          updateAcceptedServices();
          updateGtmConsent();
        },
      });

      const existingPreferences = CookieConsent.getUserPreferences();
      if (existingPreferences && existingPreferences.acceptedCategories) {
        updateAcceptedServices();
        updateGtmConsent();
      }

      return () => {
        observer.disconnect();
        CookieConsent.reset(true);
      };
    };

    // Smart deferred init:
    // - Returning users (consent already set) → fast init after 500ms (just syncs GTM)
    // - New users (no consent) → wait for browser idle (maxWait 4000ms) to avoid
    //   inflating Speed Index with cookie banner appearing during Lighthouse measurement
    const hasExistingConsent = document.cookie.includes('webwawa_consent');

    const scheduleInit = (callback: () => void) => {
      if (hasExistingConsent) {
        // Returning visitor: init quickly to sync GTM consent state
        setTimeout(callback, 500);
      } else {
        // New visitor: defer until browser idle to not affect Speed Index
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(callback, { timeout: 4000 });
        } else {
          setTimeout(callback, 4000);
        }
      }
    };

    let cleanup: (() => void) | undefined;
    scheduleInit(() => {
      initCookieConsent().then(fn => { cleanup = fn; });
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [lang]);

  return <CookieConsentContext.Provider value={{ acceptedServices }}>{children}</CookieConsentContext.Provider>;
};
