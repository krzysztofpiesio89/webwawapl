const fs = require('fs');
const path = require('path');

const dictsDir = path.join(__dirname, '..', 'src', 'app', '[lang]', 'dictionaries');
const locales = ['pl', 'en', 'uk', 'ru', 'de', 'zh'];

const additions = {
    privacy: {
      metaTitle: "Polityka Prywatności | skupautwawa.pl",
      metaDescription: "Dowiedz się, w jaki sposób chronimy Twoje dane osobowe. Polityka prywatności skupautwawa.pl.",
      title: "Polityka Prywatności",
      lastUpdate: "Ostatnia aktualizacja",
      backHome: "Wróć do strony głównej",
      h1: "Polityka Prywatności",
      p1: "Niniejsza polityka prywatności określa zasady przetwarzania danych.",
      h2: "Gromadzenie danych",
      p2Intro: "Gromadzimy następujące dane:",
      p2List: ["Imię i nazwisko", "Numer telefonu", "Adres e-mail", "Dane pojazdu"],
      h3: "Cel przetwarzania",
      p3Intro: "Dane przetwarzamy w celu:",
      p3List: ["Przygotowania wyceny", "Realizacji umowy", "Kontaktu z klientem"],
      h4: "Udostępnianie danych",
      p4: "Nie udostępniamy danych osobom trzecim bez wyraźnej zgody klienta, chyba że wymaga tego prawo.",
      h5: "Prawa użytkownika",
      p5Intro: "Jako użytkownik masz prawo do:",
      p5List: ["Dostępu do danych", "Modyfikacji danych", "Usunięcia danych (Prawo do bycia zapomnianym)"],
      h6: "Ciasteczka (Cookies)",
      p6: "Strona wykorzystuje pliki cookies do prawidłowego działania oraz analizy ruchu.",
      h7: "Kontakt",
      p7: "W razie pytań dotyczących polityki prywatności prosimy o kontakt drogą mailową.",
      intro: "Twoja prywatność jest dla nas ważna. W niniejszym dokumencie wyjaśniamy zasady przetwarzania danych.",
      sections: []
    },
    brandsPage: {
      metaTitle: "Obsługiwane Marki Samochodów",
      metaDescription: "Skupujemy samochody osobowe i dostawcze wszystkich marek.",
      breadcrumbHome: "Strona Główna",
      breadcrumbBrands: "Nasze Marki",
      breadcrumb: "Marki",
      badge: "Złomowanie i Skup 2000-2026",
      title: "Marki pojazdów,",
      titleHighlight: "które skupujemy",
      subtitle: "Niezależnie od stanu technicznego, wizualnego czy roku produkcji. Skupujemy i kasujemy auta każdej marki.",
      description: "Zobacz pełną listę obsługiwanych marek i wybierz swoje miasto do dedykowanej wyceny.",
      list: []
    },
    cityPage: {
      metaTitle: "Skup aut {city} - Kasacja i Złomowanie | Gotówka do ręki",
      metaDescription: "Szybki skup aut w {city}. Kupujemy każde auto, dojazd gratis. Złomowanie, kasacja pojazdów i gotówka od ręki.",
      heroTitle: "Skup aut {city}",
      heroSubtitle: "Sprzedaj auto w {city} w 15 minut. Darmowy dojazd lawetą i wycena na miejscu.",
      benefitsTitle: "Dlaczego my?",
      benefit1: "Gotówka od ręki",
      benefit2: "Darmowa laweta",
      benefit3: "Minimum formalności",
      benefit4: "Legalna kasacja",
      callBtn: "Zadzwoń teraz",
      brandsTitle: "Skupujemy wszystkie marki",
      brandsSubtitle: "Wybierz markę swojego auta",
      seoTitle: "Najlepszy skup aut {city}",
      seoTitle1: "Złomowanie aut i autokasacja {city}",
      seoP1: "Oferujemy profesjonalną usługę kasacji pojazdów. Gwarantujemy wydanie odpowiednich dokumentów dla urzędu komunikacji.",
      seoTitle2: "Szybka gotówka za samochód",
      seoP2: "Jeżeli zależy Ci na czasie, nasz rzeczoznawca przyjedzie na miejsce, wyceni auto i od razu wypłaci należność do ręki.",
      quickContactTitle: "Szybki kontakt w {city}",
      quickContactDesc: "Zadzwoń, aby umówić się na odbiór auta nawet tego samego dnia.",
      hoursNotice: "Jesteśmy dostępni przez 7 dni w tygodniu.",
      seoDesc: "Jesteśmy liderem w odkupie samochodów w {city}. Oferujemy najlepsze ceny rynkowe.",
      seoCard1Title: "Uczciwa wycena",
      seoCard1Desc: "Nie zaniżamy cen. Zawsze płacimy adekwatnie do stanu pojazdu.",
      seoCard2Title: "Szybki dojazd",
      seoCard2Desc: "W {city} i okolicach jesteśmy w stanie dojechać nawet w 30 minut.",
      seoCard3Title: "Brak ukrytych opłat",
      seoCard3Desc: "Wszystkie koszty transportu i formalności bierzemy na siebie."
    },
    cityBrandPage: {
      metaTitle: "Skup aut {brand} {city} - Złomowanie i Kasacja",
      metaDescription: "Skup samochodów marki {brand} w miejscowości {city}. Szybka gotówka, uczciwe ceny, legalna kasacja.",
      heroTitle: "Skup {brand} w {city}",
      heroSubtitle: "Masz {brand} na sprzedaż? Skupujemy wszystkie modele tej marki. Sprawdź naszą ofertę.",
      modelsTitle: "Wybierz model {brand}",
      seoTitle: "Dlaczego warto sprzedać {brand} u nas?",
      seoP1: "Posiadamy wieloletnie doświadczenie w skupie aut marki {brand} w {city}.",
      card1Title: "Specjaliści od {brand}",
      card1Desc: "Znamy słabe i mocne strony aut {brand}, dzięki czemu wyceniamy je najrzetelniej w {city}.",
      card1Link: "Wyceń za darmo →",
      card2Title: "Wycena każdego stanu",
      card2Desc: "Kupimy Twoje auto {brand} nawet jeśli jest rozbite lub bez opłat.",
      card2Link: "Skontaktuj się z nami →",
      card3Title: "Oszczędność czasu",
      card3Desc: "Unikasz wystawiania ofert i negocjacji. Sprzedajesz {brand} w jeden dzień.",
      card3Link: "Sprzedaj auto →"
    },
    cityModelPage: {
      metaTitle: "Skup {brand} {model} {city} - Najlepsze ceny",
      metaDescription: "Skup aut {brand} {model} {city}. Gwarantujemy darmową wycenę, szybki odbiór i płatność gotówką. Sprawdź!",
      heroTitle: "Skup aut {brand} {model} w {city}",
      heroSubtitle: "Sprzedaj swój {brand} {model} szybko i bezpiecznie w {city}.",
      versionsTitle: "Wybierz generację {brand} {model}",
      versionsSubtitle: "Którą generację posiadasz?",
      wikiTitle: "Kompendium wiedzy",
      wikiSubtitle: "Wszystko o {brand} {model}",
      wikiDescTitle: "Historia i opis modelu",
      wikiDescFallback: "Samochód {brand} {model} to bardzo popularny pojazd na polskich drogach.",
      wikiFactTitle: "Ciekawostka o modelu",
      wikiFactDesc: "{brand} {model} to jedno z najchętniej sprzedawanych aut w naszym skupie w {city}.",
      specsTitle: "Dane techniczne {model}",
      specBody: "Nadwozie:",
      specEngine: "Silnik:",
      specFuel: "Paliwo:",
      specDrive: "Napęd:",
      specSegment: "Segment:",
      specOldtimer: "Klasyk:",
      seoTitle: "Sprzedaż {brand} {model}",
      seoDesc: "Nie trać czasu na samodzielną sprzedaż. Oferujemy skup aut za gotówkę.",
      seoCard1Title: "Bezstresowa sprzedaż",
      seoCard1Desc: "Wszystko załatwiamy u Ciebie na miejscu w {city}.",
      seoCard2Title: "Cena rynkowa",
      seoCard2Desc: "Płacimy tyle, ile {brand} {model} jest faktycznie wart.",
      seoCard3Title: "Odbiór uszkodzonych",
      seoCard3Desc: "Twój {model} nie jeździ? My zabierzemy go za darmo z {city}."
    },
    citySeriesPage: {
      metaTitle: "Skup {brand} {model} {series} {city} - Kasacja",
      metaDescription: "Sprzedaj {brand} {model} {series} w {city}. Darmowa wycena online i dojazd lawetą.",
      heroTitle: "Skup {brand} {model} {city}",
      heroSubtitle: "Rocznik {years}. Wyceniamy modele {series} bez względu na ich stan w {city}.",
      benefit1: "Gotówka w 15 minut",
      benefit2: "Darmowa laweta z {city}",
      benefit3: "Załatwiamy formalności",
      benefit4: "Możliwa legalna kasacja",
      callBtn: "Zadzwoń teraz",
      formBadge: "Szybka wycena",
      formTitle: "Wyceń {brand} {model}",
      formName: "Imię",
      formPhone: "Telefon",
      formInfo: "Dodatkowe informacje",
      formSubmit: "Wyceń Auto",
      formConsent: "Wysyłając formularz, akceptujesz politykę prywatności.",
      wikiTitle: "Informacje o generacji",
      wikiSubtitle: "{brand} {model} {series}",
      wikiDescTitle: "Opis generacji",
      wikiDescFallback: "Generacja {series} produkowana w latach {years}.",
      wikiFactTitle: "Ciekawostka o {series}",
      wikiFactDesc: "Ten model {brand} {model} {series} ({years}) często gości na drogach w {city}.",
      specsTitle: "Dane techniczne",
      specYears: "Lata produkcji",
      specBody: "Nadwozie",
      specEngine: "Silnik",
      specFuel: "Paliwo",
      specDrive: "Napęd",
      specOldtimer: "Oldtimer",
      seoTitle: "Gdzie sprzedać {city}",
      seoDesc: "Sprzedaż {brand} {model} {series} jeszcze nigdy nie była tak prosta jak z nami w {city}.",
      seoCard1Title: "Oszczędność",
      seoCard1Desc: "Darmowa wycena i odbiór.",
      seoCard2Title: "Bezpieczeństwo",
      seoCard2Desc: "Podpisujemy legalną umowę lub wydajemy zaświadczenie o kasacji.",
      seoCard3Title: "Czas to pieniądz",
      seoCard3Desc: "Cały proces trwa nie dłużej niż 15 minut."
    }
};

locales.forEach(loc => {
    const file = path.join(dictsDir, loc + '.json');
    if(fs.existsSync(file)) {
        let data = JSON.parse(fs.readFileSync(file, 'utf8'));
        
        Object.keys(additions).forEach(key => {
            if(!data[key]) {
                data[key] = additions[key];
            } else {
                Object.keys(additions[key]).forEach(subKey => {
                    if(data[key][subKey] === undefined) {
                        data[key][subKey] = additions[key][subKey];
                    }
                });
            }
        });
        
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        console.log(`Updated ${loc}.json`);
    }
});
