import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../globals.css"; // Zmieniona ścieżka względem [lang]
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getGlobalSettings } from "@/lib/settings";
import { locales, Locale, getDictionary, htmlLangMap, ogLocaleMap } from "./dictionaries";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"], // Outfit nie wspiera natywnie cyrylicy - przeglądarka użyje fallbacku
  weight: ["300", "400", "600", "700"],
  variable: "--font-outfit",
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
    languages[l] = l === 'pl' ? 'https://skupautwawa.pl' : `https://skupautwawa.pl/${l}`;
  });

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    metadataBase: new URL('https://skupautwawa.pl'),
    alternates: {
      canonical: languages[lang],
      languages: languages,
    },
    openGraph: {
      title: dict.meta.ogTitle,
      description: dict.meta.description,
      url: languages[lang],
      siteName: 'skupautwawa.pl',
      locale: ogLocaleMap[lang as Locale],
      type: 'website',
      images: [
        {
          url: '/images/skupautwawa.webp',
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
      images: ['/images/skupautwawa.webp'],
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
    "@type": "AutoDealer",
    "name": dict.schema.dealerName,
    "description": dict.schema.dealerDescription,
    "inLanguage": htmlLangMap[params.lang as Locale],
    "availableLanguage": locales,
    "image": "https://skupautwawa.pl/images/skupautwawa.webp",
    "@id": "https://skupautwawa.pl",
    "url": "https://skupautwawa.pl",
    "telephone": settings?.phone || "+48 664 946 209",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings?.address || "ul. Przykładowa 123",
      "addressLocality": "Warszawa",
      "postalCode": "00-001",
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
    <html lang={htmlLangMap[params.lang as Locale]} className={`${outfit.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {/* Przekazujemy słownik i aktualny język do nagłówka i stopki */}
        <Header settings={settings} dict={dict} lang={params.lang as Locale} />
        {children}
        <Footer settings={settings} dict={dict} lang={params.lang as Locale} />
      </body>
    </html>
  );
}
