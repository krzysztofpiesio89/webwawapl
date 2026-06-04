import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';

const OUTPUT_FILE = path.resolve(process.cwd(), 'data/brand-logos.json');

async function main() {
    console.log("Uruchamiam przeglądarkę Puppeteer do pobrania logotypów...");
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    
    try {
        const page = await browser.newPage();
        
        // Optymalizacja: odrzucamy zbędne zasoby (czcionki, duże skrypty), ale zostawiamy obrazki bo potrzebujemy ich adresów
        await page.setRequestInterception(true);
        page.on('request', req => {
            if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font') {
                req.abort();
            } else {
                req.continue();
            }
        });

        const allBrands = [];
        
        // Motofakty posiada ustandaryzowaną paginację dla marek
        for (let i = 1; i <= 6; i++) {
            const url = i === 1 ? 'https://motofakty.pl/samochody/' : `https://motofakty.pl/samochody/${i}/`;
            console.log(`\nSkanuję podstronę: ${url}`);
            
            try {
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
                
                const brandsOnPage = await page.evaluate(() => {
                    // Logotypy na stronie głównej w Motofakty mają link prowadzący wprost do marki
                    const items = document.querySelectorAll('a[href*="/samochody/"]');
                    const results = [];
                    items.forEach(item => {
                        const img = item.querySelector('img');
                        let nameText = item.innerText || '';
                        nameText = nameText.trim();
                        
                        // Czyste logotypy w kafelkach zazwyczaj zawierają podpis z nazwą marki
                        if (img && img.src && nameText && nameText.length < 20) {
                            results.push({
                                brand: nameText,
                                logoUrl: img.src
                            });
                        }
                    });
                    return results;
                });
                
                if (brandsOnPage.length === 0) {
                    console.log(`Brak marek na podstronie ${i}, prawdopodobnie to koniec paginacji.`);
                    break;
                }
                
                console.log(`--> Znaleziono ${brandsOnPage.length} potencjalnych logotypów na tej stronie.`);
                allBrands.push(...brandsOnPage);
            } catch (err) {
                console.error(`--> Błąd wejścia na ${url}:`, err.message);
                break;
            }
        }
        
        // Deduplikacja wyników i utworzenie czystego słownika (Słownik: slug -> URL)
        const logosDict = {};
        for (const b of allBrands) {
            const slug = b.brand.toLowerCase()
                .replace(/\s+/g, '-')           
                .replace(/[^\w\-]+/g, '')       
                .replace(/\-\-+/g, '-')         
                .replace(/^-+/, '')             
                .replace(/-+$/, '');            
            
            // Pomiń śmieciowe obrazki reklamowe
            if (slug && slug.length > 0 && b.logoUrl && !b.logoUrl.includes('logo-motofakty') && !b.logoUrl.includes('reklama')) {
                if (!logosDict[slug]) {
                    logosDict[slug] = b.logoUrl;
                }
            }
        }
        
        const count = Object.keys(logosDict).length;
        if (count > 0) {
            await fs.writeFile(OUTPUT_FILE, JSON.stringify(logosDict, null, 2), 'utf-8');
            console.log(`\n[SUKCES] Zapisano ${count} wyczyszczonych logotypów marek w pliku: ${OUTPUT_FILE}`);
        } else {
            console.log("\n[BŁĄD] Nie udało się odnaleźć poprawnych logotypów na stronie.");
        }
        
    } catch (e) {
        console.error("Błąd scrapowania:", e.message);
    } finally {
        await browser.close();
    }
}

main();
