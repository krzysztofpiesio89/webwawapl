import puppeteer from 'puppeteer';

async function main() {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    try {
        await page.goto('https://motofakty.pl/samochody/4/', { waitUntil: 'domcontentloaded' });
        
        // Let's just log ALL links with images to see what we are dealing with
        const links = await page.evaluate(() => {
            const results = [];
            const allLinks = document.querySelectorAll('a');
            allLinks.forEach(a => {
                const img = a.querySelector('img');
                if (img) {
                    results.push({
                        href: a.href,
                        imgSrc: img.src,
                        text: a.innerText.trim()
                    });
                }
            });
            return results;
        });
        
        console.log("Znalezione linki ze zdjęciami:", JSON.stringify(links.slice(0, 15), null, 2));
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await browser.close();
    }
}
main();
