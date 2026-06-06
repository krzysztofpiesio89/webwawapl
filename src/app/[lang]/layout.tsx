import type { Metadata } from "next";
import "../globals.css"; // Zmieniona ścieżka względem [lang]
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getGlobalSettings } from "@/lib/settings";
import { locales, Locale, getDictionary, htmlLangMap, ogLocaleMap } from "./dictionaries";
import Script from "next/script";
import { CookieConsentProvider } from "@/components/CookieConsent";
import { Public_Sans, Instrument_Sans } from "next/font/google";

const publicSans = Public_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-public-sans",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata(props: { params: Promise<{ lang: string  }> }): Promise<Metadata> {
  const params = await props.params;
  const dict = await getDictionary(params.lang as Locale);
  const lang = params.lang as Locale;

  // Generowanie alternate links dla hreflang
  const languages: Record<string, string> = {};
  locales.forEach((l) => {
    // Domyślny polski nie ma prefiksu
    languages[l] = l === 'pl' ? 'https://webwawa.pl' : `https://webwawa.pl/${l}`;
  });

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    metadataBase: new URL('https://webwawa.pl'),
    alternates: {
      canonical: languages[lang],
      languages: languages,
    },
    openGraph: {
      title: dict.meta.ogTitle,
      description: dict.meta.description,
      url: languages[lang],
      siteName: 'webwawa.pl',
      locale: ogLocaleMap[lang as Locale],
      type: 'website',
      images: [
        {
          url: '/images/workspace_code.png',
          width: 1200,
          height: 630,
          alt: dict.meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.description,
      images: ['/images/workspace_code.png'],
    },
    icons: {
      icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
      apple: [
        { url: '/ios/180.png', sizes: '180x180', type: 'image/png' },
        { url: '/ios/152.png', sizes: '152x152', type: 'image/png' },
        { url: '/ios/120.png', sizes: '120x120', type: 'image/png' },
        { url: '/ios/76.png', sizes: '76x76', type: 'image/png' },
      ],
    },
    other: {
      'msapplication-TileImage': '/windows/Square150x150Logo.scale-100.png',
      'msapplication-TileColor': '#fbbf24',
    },
  };
}

export default async function RootLayout(props: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string  }>;
}>) {
  const { children } = props;
  const params = await props.params;
  const settings = getGlobalSettings();
  const dict = await getDictionary(params.lang as Locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": dict.schema.dealerName,
    "description": dict.schema.dealerDescription,
    "inLanguage": htmlLangMap[params.lang as Locale],
    "availableLanguage": locales,
    "image": "https://webwawa.pl/images/workspace_code.png",
    "@id": "https://webwawa.pl",
    "url": "https://webwawa.pl",
    "telephone": settings?.phone || "+48 664 946 209",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings?.addressWarsaw || "ul. Księżycowa 76/8",
      "addressLocality": "Warszawa",
      "postalCode": "01-934",
      "addressCountry": "PL"
    },
    "areaServed": {
      "@type": "City",
      "name": "Warszawa"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "PLN"
  };

  return (
    <html lang={htmlLangMap[params.lang as Locale]} className={`${publicSans.variable} ${instrumentSans.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          id="ldjson-root"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="theme-detect"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function() {
  try {
    var theme = localStorage.getItem('theme');
    var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (!theme && supportDarkMode)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();`
          }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'personalization_storage': 'denied',
              'functionality_storage': 'granted',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied'
            });
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'}');
          `}
        </Script>
        <CookieConsentProvider lang={params.lang}>
          {/* Przekazujemy słownik i aktualny język do nagłówka i stopki */}
          <Header settings={settings} dict={dict} lang={params.lang as Locale} />
          {children}
          <Footer settings={settings} dict={dict} lang={params.lang as Locale} />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
