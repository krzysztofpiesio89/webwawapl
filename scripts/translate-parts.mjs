import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.join(__dirname, '../data/csvjson.json');
const TARGET_LANGS = ['en', 'de', 'uk', 'zh'];

// Helper for delay to avoid API rate limits
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function isTranslatable(text) {
  if (!text || typeof text !== 'string') return false;
  if (/^[0-9\-\.\s–]+$/.test(text)) return false;
  return true;
}

async function translateText(text, targetLang, sourceLang = 'pl') {
  if (!text || typeof text !== 'string') return text;
  if (/^[0-9\-\.\s–]+$/.test(text)) return text;
  
  let retries = 5;
  let delayTime = 3000; // start with 3s delay on error
  
  while (retries > 0) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 429) {
          console.warn(`Rate limited (429) translating to ${targetLang}. Waiting ${delayTime}ms before retry... (${retries} retries left)`);
          await delay(delayTime);
          retries--;
          delayTime *= 2;
          continue;
        }
        throw new Error(`API Error: ${response.status}`);
      }
      const data = await response.json();
      if (!data || !data[0]) {
        throw new Error(`Invalid response structure`);
      }
      return data[0].map(item => item[0]).join('');
    } catch (error) {
      console.error(`Translation attempt failed to ${targetLang} for "${text.substring(0, 25)}...":`, error.message);
      retries--;
      if (retries === 0) {
        throw error;
      }
      await delay(delayTime);
      delayTime *= 2;
    }
  }
}

async function main() {
  try {
    console.log(`Reading parts database from ${FILE_PATH}...`);
    const content = await fs.readFile(FILE_PATH, 'utf-8');
    const items = JSON.parse(content);
    console.log(`Loaded ${items.length} parts items.`);

    let changedCount = 0;
    const saveProgress = async () => {
      if (changedCount > 0) {
        await fs.writeFile(FILE_PATH, JSON.stringify(items, null, 2), 'utf-8');
        console.log(`[PROGRESS] Saved ${changedCount} new translations to database file.`);
        changedCount = 0;
      }
    };

    for (const lang of TARGET_LANGS) {
      const tasks = [];
      
      // 1. Gather all items missing translations for the active language
      for (const item of items) {
        const plVal = item.pl || item.main_pl;
        if (!plVal || !isTranslatable(plVal)) continue;

        // Translate if key is missing or empty
        if (!item[lang]) {
          tasks.push({ item, plVal });
        }
      }

      if (tasks.length === 0) {
        console.log(`All items are already translated to ${lang.toUpperCase()}.`);
        continue;
      }

      console.log(`Translating ${tasks.length} items to ${lang.toUpperCase()}...`);
      
      // Process tasks in batches to minimize API calls
      const BATCH_SIZE = 25;
      const SEPARATOR = ' [X] ';
      
      for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
        const batch = tasks.slice(i, i + BATCH_SIZE);
        const batchPlTexts = batch.map(t => t.plVal);
        
        const joinedText = batchPlTexts.join(SEPARATOR);
        let translatedJoined = '';
        let splitTranslations = [];
        let success = false;
        
        try {
          translatedJoined = await translateText(joinedText, lang);
          splitTranslations = translatedJoined.split(SEPARATOR).map(t => t.trim());
          if (splitTranslations.length === batch.length) {
            success = true;
          } else {
            console.warn(`Batch size mismatch (expected ${batch.length}, got ${splitTranslations.length}) for ${lang}. Falling back to individual translations...`);
          }
        } catch (err) {
          console.warn(`Batch translation failed for ${lang}. Falling back to individual translations...`);
        }
        
        if (success) {
          for (let k = 0; k < batch.length; k++) {
            batch[k].item[lang] = splitTranslations[k];
          }
          changedCount += batch.length;
        } else {
          // Fallback: translate individually
          for (const task of batch) {
            try {
              const trans = await translateText(task.plVal, lang);
              task.item[lang] = trans;
              changedCount++;
            } catch (err) {
              console.error(`Individual translation failed for "${task.plVal.substring(0, 20)}...":`, err.message);
            }
            await delay(200); // Small delay between individual requests
          }
        }

        // Auto-save every 100 items to avoid losing progress
        if (changedCount >= 100) {
          await saveProgress();
        }
        
        await delay(1000); // 1s delay between batches to respect rate limits
      }
      
      // Save remaining changes at the end of each language
      await saveProgress();
    }

    console.log('Translation process completed successfully!');
  } catch (error) {
    console.error('Fatal error during parts translation:', error);
  }
}

main();
