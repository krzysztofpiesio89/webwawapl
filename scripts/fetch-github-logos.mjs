import fs from 'fs/promises';
import path from 'path';

const OUTPUT_FILE = path.resolve(process.cwd(), 'data/brand-logos.json');

async function main() {
    console.log("Pobieram bazę logotypów z repozytorium GitHub...");
    
    try {
        const response = await fetch('https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const logosDict = {};
        
        data.forEach(item => {
            // Slug w tej bazie może być np. 'aston-martin'
            const slug = item.slug.toLowerCase().trim()
                .replace(/\s+/g, '-')           
                .replace(/[^\w\-]+/g, '')       
                .replace(/\-\-+/g, '-')         
                .replace(/^-+/, '')             
                .replace(/-+$/, '');            
            
            // Format URL do zoptymalizowanych obrazków z GitHuba
            const logoUrl = item.image?.optimized || `https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/${slug}.png`;
            
            logosDict[slug] = logoUrl;
        });

        // Dorzucenie paru popularnych skrótów, dla pewności
        logosDict['mercedes-benz'] = logosDict['mercedes-benz'] || logosDict['mercedes'];
        logosDict['mercedes'] = logosDict['mercedes'] || logosDict['mercedes-benz'];
        logosDict['vw'] = logosDict['volkswagen'];
        logosDict['alfa-romeo'] = logosDict['alfa-romeo'] || `https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/alfa-romeo.png`;

        await fs.writeFile(OUTPUT_FILE, JSON.stringify(logosDict, null, 2), 'utf-8');
        console.log(`[SUKCES] Zapisano ${Object.keys(logosDict).length} logotypów w pliku: ${OUTPUT_FILE}`);
        
    } catch (e) {
        console.error("Błąd pobierania:", e.message);
    }
}

main();
