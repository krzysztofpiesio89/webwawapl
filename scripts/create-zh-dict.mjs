import fs from 'fs/promises';
import path from 'path';

const PL_DICT_PATH = path.join(process.cwd(), 'src', 'app', '[lang]', 'dictionaries', 'pl.json');
const ZH_DICT_PATH = path.join(process.cwd(), 'src', 'app', '[lang]', 'dictionaries', 'zh.json');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function translateText(text, targetLang = 'zh-CN', sourceLang = 'pl', retries = 5) {
  if (typeof text !== 'string' || !text.trim() || /^[0-9\-\.\s]+$/.test(text)) {
    return text; // Skip translation for numbers, empty strings
  }

  // Handle placeholders like {city}, {brand}, {model}
  // We'll replace them with temporary tokens that won't be translated
  const placeholders = [];
  let processedText = text.replace(/\{([^}]+)\}/g, (match, p1) => {
    placeholders.push(match);
    return `__PH${placeholders.length - 1}__`;
  });

  let delayTime = 2000;
  
  while (retries > 0) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(processedText)}`;
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 429) {
          console.warn(`Rate limited (429). Waiting ${delayTime}ms before retry... (${retries} retries left)`);
          await delay(delayTime);
          delayTime *= 2;
          retries--;
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      let translated = json[0].map(part => part[0]).join('');

      // Restore placeholders
      translated = translated.replace(/__PH(\d+)__/g, (match, p1) => {
        return placeholders[parseInt(p1, 10)] || match;
      });

      return translated;
    } catch (e) {
      console.error('Translation error:', e.message);
      retries--;
      if (retries === 0) throw e;
      await delay(delayTime);
      delayTime *= 2;
    }
  }
}

async function translateObject(obj) {
  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      console.log(`Translating key: ${key}`);
      result[key] = await translateText(obj[key]);
      await delay(300); // 300ms delay between strings
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      result[key] = await translateObject(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

async function main() {
  console.log('Reading pl.json...');
  const plData = JSON.parse(await fs.readFile(PL_DICT_PATH, 'utf-8'));
  
  let zhData = {};
  if (await fs.stat(ZH_DICT_PATH).catch(() => null)) {
     zhData = JSON.parse(await fs.readFile(ZH_DICT_PATH, 'utf-8'));
     console.log('zh.json already exists, skipping translation to save time. Delete it to re-translate.');
     return;
  }

  console.log('Starting translation to zh-CN...');
  zhData = await translateObject(plData);

  // Apply some specific UI tweaks if needed, e.g., language names should be native usually,
  // but since we translate from PL it might translate "Polski" to Chinese. The dictionary
  // is mainly site content though, not language switcher names (which are in dictionaries.ts).

  await fs.writeFile(ZH_DICT_PATH, JSON.stringify(zhData, null, 2), 'utf-8');
  console.log('Successfully created zh.json!');
}

main().catch(console.error);
