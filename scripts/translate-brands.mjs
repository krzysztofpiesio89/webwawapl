import fs from 'fs/promises';
import path from 'path';

const BRANDS_DIR = path.join(process.cwd(), 'data', 'brands');
const TARGET_LANGS = ['en', 'de', 'uk', 'ru', 'zh'];

// Helper for delay to avoid rate limits
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
  let delayTime = 2000; // start with 2s delay on error
  
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
      console.error(`Translation attempt failed to ${targetLang} for "${text.substring(0, 15)}...":`, error.message);
      retries--;
      if (retries === 0) {
        throw error; // Propagate fatal errors to prevent writing fallback duplicates
      }
      await delay(delayTime);
      delayTime *= 2;
    }
  }
}

function getTranslatableFields(data) {
  const fields = [];
  if (!data.models) return fields;
  
  for (const seriesKey of Object.keys(data.models)) {
    const modelsArr = data.models[seriesKey];
    for (const model of modelsArr) {
      if (model.specs && model.specs.wiki) {
        const wiki = model.specs.wiki;
        
        // 1. Description
        if (wiki.description !== undefined) {
          fields.push({ parent: wiki, key: 'description' });
        }
        
        // 2. Infobox
        if (wiki.infobox && typeof wiki.infobox === 'object') {
          for (const key of Object.keys(wiki.infobox)) {
            fields.push({ parent: wiki.infobox, key: key });
          }
        }
      }
    }
  }
  return fields;
}

async function processFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(content);
  
  const fields = getTranslatableFields(data);
  if (fields.length === 0) {
    console.log(`No fields to process in ${path.basename(filePath)}`);
    return;
  }
  
  let changed = false;
  
  // 1. Pre-pass: Normalize strings to objects with { pl: string }
  for (const item of fields) {
    const val = item.parent[item.key];
    if (typeof val === 'string' && isTranslatable(val)) {
      item.parent[item.key] = { pl: val };
      changed = true;
    }
  }
  
  // 2. Translate missing languages for each target language
  for (const lang of TARGET_LANGS) {
    const tasks = [];
    
    for (const item of fields) {
      const val = item.parent[item.key];
      if (typeof val === 'object' && val !== null && val.pl) {
        const plVal = val.pl;
        if (!isTranslatable(plVal)) continue;
        
        // Skip fixing if the Polish value is short and has no spaces (proper nouns etc.)
        if (plVal.length <= 12 && !plVal.includes(' ')) {
          continue;
        }
        
        const currentTranslation = val[lang];
        // If translation is missing OR is exactly identical to the Polish version, we translate
        if (!currentTranslation || currentTranslation === plVal) {
          tasks.push({ valObj: val, plVal });
        }
      }
    }
    
    if (tasks.length === 0) continue;
    
    console.log(`Translating ${tasks.length} fields to ${lang} in ${path.basename(filePath)}...`);
    
    // Process tasks in batches of 25
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
          console.warn(`Batch size mismatch (expected ${batch.length}, got ${splitTranslations.length}) for ${lang} in ${path.basename(filePath)}. Falling back to individual...`);
        }
      } catch (err) {
        console.warn(`Batch translation failed for ${lang} in ${path.basename(filePath)}. Falling back to individual...`);
      }
      
      if (success) {
        for (let k = 0; k < batch.length; k++) {
          batch[k].valObj[lang] = splitTranslations[k];
        }
        changed = true;
      } else {
        // Fallback: translate individually
        for (const task of batch) {
          try {
            const trans = await translateText(task.plVal, lang);
            task.valObj[lang] = trans;
            changed = true;
          } catch (err) {
            console.error(`Individual translation fallback failed for "${task.plVal.substring(0, 15)}...":`, err.message);
          }
          await delay(250); // Small delay between individual requests
        }
      }
      
      await delay(500); // 500ms delay between batches to respect API limits
    }
  }
  
  if (changed) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Saved translations for ${path.basename(filePath)}`);
  } else {
    console.log(`No changes needed for ${path.basename(filePath)}`);
  }
}

async function main() {
  try {
    const files = await fs.readdir(BRANDS_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        await processFile(path.join(BRANDS_DIR, file));
      }
    }
    console.log('All files processed successfully!');
  } catch (error) {
    console.error('Fatal error during brand translations:', error);
  }
}

main();
