import fs from 'fs/promises';
import puppeteer from 'puppeteer';

async function main() {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    try {
        await page.goto('https://motofakty.pl/samochody/4/', { waitUntil: 'networkidle2' });
        
        const html = await page.content();
        await fs.writeFile('motofakty-debug.html', html);
        await page.screenshot({ path: 'motofakty-debug.png' });
        
        console.log("Zapisano HTML i screenshot!");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await browser.close();
    }
}
main();
