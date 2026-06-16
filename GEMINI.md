# Założenia Projektowe: webwawa.pl

## 1. Cel Projektu
Budowa wysoce zoptymalizowanej pod kątem SEO i konwersji platformy dla agencji interaktywnej / software house **webwawa.pl**. System realizuje strategię Programmatic SEO B2B, generując spersonalizowane strony docelowe (landing pages) dla różnych branż, technologii, miast oraz marek w wielu wersjach językowych w celu pozyskiwania kontaktów biznesowych (B2B lead generation).

## 2. Architektura i Technologia
*   **Framework:** Next.js (App Router, wersja 16.x) z pełną obsługą dynamicznego trasowania wielojęzycznego (i18n).
*   **Stylizacja:** Tailwind CSS (wersja 4) – nowoczesny, dynamiczny, responsywny design ze wsparciem dla motywu ciemnego (dark mode) i efektów glassmorfizmu.
*   **Baza Danych i ORM:** Prisma ORM (wersja 7.x) współpracująca z bazą SQLite/LibSQL (Turso) za pomocą dedykowanego adaptera.
*   **API:** GraphQL (Apollo Server i integracja `@as-integrations/next`) do elastycznego serwowania i agregowania danych strukturalnych.
*   **Obsługa e-mail:** Resend i React Email do wysyłki formularzy kontaktowych oraz zapytań ofertowych.

## 3. Optymalizacja i Wydajność
*   **Wskaźniki Core Web Vitals:** Cel to 100/100 na PageSpeed Insights dla urządzeń mobilnych i komputerów.
*   **Rendering:** Maksymalne użycie renderowania po stronie serwera (SSR) i statycznego generowania stron (SSG) w celu serwowania czystego, gotowego kodu HTML botom indeksującym wyszukiwarek tradycyjnych oraz AI.
*   **Minimalizacja skryptów:** Ograniczenie interaktywnego kodu po stronie klienta (Client Components) do absolutnego minimum (np. formularze kontaktowe, przełącznik języków).

## 4. Strategia SEO (Programmatic SEO & GEO)
*   **Wielojęzyczność:** Pełna obsługa języków: polskiego (PL), angielskiego (EN), niemieckiego (DE), ukraińskiego (UK), rosyjskiego (RU) oraz chińskiego (ZH).
*   **Dynamiczne generowanie podstron:** Połączenie baz miast, technologii, branż oraz marek pojazdów (używanych w celach B2B dla serwisów motoryzacyjnych, wypożyczalni, skupów aut itp.) do automatycznego tworzenia zoptymalizowanych stron usługowych.
*   **Struktura URL:**
    *   Główny katalog usług: `/[lang]/websites` (strony WWW), `/[lang]/software` (oprogramowanie).
    *   Strony branżowe: `/[lang]/strona-dla/[branza]` (zintegrowane z mapowaniem aliasów językowych).
    *   Lokalne i brandowe strony docelowe: `/[lang]/[miasto]`, `/[lang]/[miasto]/[marka]`, `/[lang]/[miasto]/[marka]/[model]`.
*   **Personalizacja:** Wykorzystanie ciasteczek (np. `user-city`) oraz geolokalizacji do automatycznego dopasowania najbliższego miasta na stronie głównej oraz w formularzach.
*   **Dane Strukturalne (Schema.org):** Zaawansowana implementacja JSON-LD (`ProfessionalService`, `Service`, `LocalBusiness`, `BreadcrumbList`) dopasowana do każdego wariantu branży i lokalizacji w celu optymalizacji pod kątem wyszukiwarek AI (np. Perplexity, ChatGPT Search) oraz tradycyjnego pozycjonowania (Google, Google Maps).

## 5. Design i UI/UX
*   **Estetyka:** Premium Dark Mode z harmonijną paletą barw (odcienie slate, indygo, błękitu). Delikatne gradienty, nowoczesna typografia (np. Roboto/Inter) oraz mikro-interakcje na elementach interaktywnych (hover effects, glassmorphic cards).
*   **Konwersja:** Bezpośredni przekaz i proste wezwania do działania (CTA). Widoczny, zintegrowany formularz kontaktowy (`ContactForm`) oraz łatwo dostępny numer telefonu i adres e-mail.
*   **Mobile-First:** Interfejs zaprojektowany z myślą o użytkownikach mobilnych, stanowiących ponad 70% ruchu.

## 6. Źródła Danych
*   **Baza danych:** Tabela miast, ustawień globalnych oraz rejestr zapytań ofertowych (`QuoteRequest`) zarządzane za pomocą Prisma.
*   **Pliki JSON:** Konfiguracja branż i nisz (`data/industries`), technologii (`data/technology`), marek i modeli samochodów (`data/brands/`, `data/car-data.json`) służąca do zasilania routingu i budowania kontekstu biznesowego.
