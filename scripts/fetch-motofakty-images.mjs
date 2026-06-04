import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           
    .replace(/[^\w\-]+/g, '')       
    .replace(/\-\-+/g, '-')         
    .replace(/^-+/, '')             
    .replace(/-+$/, '');            
}

const BRANDS_DIR = path.resolve(process.cwd(), 'data/brands');
const TARGET_FILE = process.argv[2] || null;

async function processFile(filePath, browser) {
  console.log(`\n[START] Przetwarzam plik: ${path.basename(filePath)}...`);
  const content = await fs.readFile(filePath, 'utf-8');
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
    console.error(`Błąd parsowania JSON: ${filePath}`);
    return;
  }

  const brandName = data.brand;
  const brandSlug = slugify(brandName);
  let updatedCount = 0;

  for (const [modelName, seriesList] of Object.entries(data.models)) {
    console.log(`Pobieram zdjęcie dla: ${brandName} ${modelName}...`);
    let modelSlug = slugify(modelName);
    
    // Mapowanie specyficznych prefiksów Motofakty
    if (brandSlug === 'bmw' && /^\d$/.test(modelSlug)) {
        modelSlug = `seria-${modelSlug}`;
    } else if ((brandSlug === 'mercedes' || brandSlug === 'mercedes-benz') && /^[a-z]$/i.test(modelSlug)) {
        modelSlug = `klasa-${modelSlug}`;
    }

    const url = `https://motofakty.pl/samochody/dane-techniczne/${brandSlug}/${modelSlug}/`;
    
    let imageUrl = null;
    let page = await browser.newPage();
    try {
      // Wyłączamy zbędne zasoby (css, fonts) by przyśpieszyć
      await page.setRequestInterception(true);
      page.on('request', req => {
        if (req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font') {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      const genOptionUrl = await page.evaluate((bSlug, mSlug) => {
         const option = document.querySelectorAll('select[name="marka_model_generacja[id_generacja]"] option')[1];
         if (option && option.value && option.value !== `${bSlug}/${mSlug}/`) {
             return `https://motofakty.pl/samochody/dane-techniczne/${option.value}`;
         }
         return null;
      }, brandSlug, modelSlug);

      if (genOptionUrl) {
          await page.goto(genOptionUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      }

      imageUrl = await page.evaluate(() => {
          const img = document.querySelector('#generacja .zdjecie img');
          if (img) return img.src;
          
          const ogImage = document.querySelector('meta[property="og:image"]');
          if (ogImage && ogImage.content && !ogImage.content.includes('logo') && !ogImage.content.includes('default')) {
              return ogImage.content;
          }
          return null;
      });

    } catch (e) {
      console.log(`    [Debug] Błąd strony: ${e.message}`);
    } finally {
      await page.close();
    }

    if (imageUrl) {
      console.log(`--> Sukces! Znalazłem: ${imageUrl}`);
      for (const series of seriesList) {
        if (!series.specs) series.specs = {};
        series.specs.motofaktyImage = imageUrl;
        updatedCount++;
      }
    } else {
      console.log(`--> Nie znaleziono obrazka w bazie Motofakty dla: ${brandName} ${modelName}`);
    }
  }

  if (updatedCount > 0) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`[ZAPISANO] Dodano ${updatedCount} linków do bazy w pliku: ${path.basename(filePath)}`);
  }
}

async function main() {
  console.log("Uruchamiam przeglądarkę Puppeteer w tle...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    if (TARGET_FILE) {
      await processFile(path.resolve(process.cwd(), TARGET_FILE), browser);
    } else {
      const files = await fs.readdir(BRANDS_DIR);
      for (const file of files) {
        if (file.endsWith('.json') && file !== '-.json') {
          await processFile(path.join(BRANDS_DIR, file), browser);
        }
      }
    }
  } finally {
    await browser.close();
  }
}

main();
