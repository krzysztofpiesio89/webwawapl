# Założenia Projektowe: skupautwawa.pl

## 1. Cel Projektu
Zbudowanie ultralekkiego, szybkiego i wysoce zoptymalizowanego pod kątem SEO systemu do pozyskiwania klientów na skup i kasację pojazdów.

## 2. Architektura i Technologia
*   **Framework:** Next.js (najnowsza wersja z App Router).
*   **Stylizacja:** Tailwind CSS (najnowsza wersja) - prosty, przejrzysty design ukierunkowany na konwersję.
*   **Baza Danych i ORM:** Prisma ORM w wersji 4.0 (zgodnie z wymaganiem). Zapewnia to sztywny schemat i bezpieczeństwo typów.
*   **API:** GraphQL - do optymalnego pobierania ustrukturyzowanych danych i zaawansowanych integracji.

## 3. Optymalizacja i Wydajność
*   **Wyniki PageSpeed Insights:** Cel to 100/100/100.
*   Maksymalne wykorzystanie renderowania po stronie serwera (SSR) oraz generowania statycznego (SSG), aby serwować gotowy kod HTML botom indeksującym.
*   Minimalizacja skryptów i zależności po stronie klienta.

## 4. Strategia SEO (Programmatic SEO)
*   **Dynamiczne generowanie stron:** Wykorzystanie ogromnej ilości danych z `data/brands` oraz `car-data.json` do stworzenia tysięcy precyzyjnie targetowanych podstron (landing pages).
*   **Struktura URL:** `skupautwawa.pl/aut/[miasto]/[marka]/[model]/[wersja]` (np. `skupautwawa.pl/aut/warszawa/audi/a4/b8`).
*   **Personalizacja (IP-based):** Wykorzystanie pakietu `cities` oraz geolokalizacji po IP użytkownika do automatycznego dopasowania treści (np. wyświetlenie najbliższego miasta na stronie głównej i w ofertach).
*   **Dane Strukturalne (Schema.org):** Implementacja zaawansowanego oznaczania Schema dla lokalnych biznesów (LocalBusiness, AutoDealer), pojazdów (Vehicle), chlebowca (BreadcrumbList) i ofert (Offer), serwowanych w formacie JSON-LD.

## 5. Design i UI/UX
*   **Inspiracje:** Prostota i bezpośredniość ze stron typu `autoskup-100.pl` czy `skup-samochodow.com.pl`.
*   **Założenia:** Strona nie ma być przeładowana grafikami. Ma natychmiast komunikować cel i dawać łatwy sposób kontaktu (duży formularz kontaktowy do darmowej wyceny, widoczny przycisk z numerem telefonu). "Mobile First" to absolutny priorytet.

## 6. Źródła Danych
*   Główne zasilenie systemu opiera się na dostarczonym pliku `data/car-data.json` oraz plikach z katalogu `data/brands/`. Posłużą one do zasilenia bazy danych Prisma oraz do wygenerowania statycznych ścieżek URL dla poszczególnych modeli pojazdów.
