import fs from 'fs';
import path from 'path';
import type { Locale } from '@/app/[lang]/dictionaries';
import { 
  industrySlugsMap, 
  professionSlugsMap, 
  serviceSlugsMap,
  IndustryId,
  ProfessionId,
  ServiceId
} from './industries-list';

export interface IndustryTranslation {
  industryName: string;
  heroSubtitle: string;
  title: string;
  description: string;
  about: string;
  models: Record<ProfessionId, {
    name: string;
    about: string;
    focus: string;
    specifications: string[];
  }>;
  series: Record<ServiceId, {
    title: string;
    desc: string;
  }>;
}

export interface IndustryData {
  id: IndustryId;
  slugs: Record<Locale, string>;
  translations: Record<Locale, IndustryTranslation>;
}

const INDUSTRIES_DIR = path.join(process.cwd(), 'data', 'industries');

export function getIndustryById(id: IndustryId): IndustryData | null {
  try {
    const dirPath = path.join(INDUSTRIES_DIR, id);
    const legacyFilePath = path.join(INDUSTRIES_DIR, `${id}.json`);
    
    let industryData: IndustryData | null = null;
    
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      const mainPath = path.join(dirPath, 'main.json');
      if (!fs.existsSync(mainPath)) return null;
      
      const mainContent = fs.readFileSync(mainPath, 'utf8');
      industryData = JSON.parse(mainContent) as IndustryData;
      
      // Initialize translations models
      for (const locale of Object.keys(industryData.translations) as Locale[]) {
        if (!industryData.translations[locale].models) {
          industryData.translations[locale].models = {} as Record<ProfessionId, any>;
        }
      }
      
      // Load all sub-files (professions/models)
      const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.json') && file !== 'main.json');
      for (const file of files) {
        const professionId = file.replace('.json', '') as ProfessionId;
        const profFilePath = path.join(dirPath, file);
        const profContent = fs.readFileSync(profFilePath, 'utf8');
        const profData = JSON.parse(profContent) as Record<Locale, any>;
        
        for (const locale of Object.keys(industryData.translations) as Locale[]) {
          if (profData[locale]) {
            industryData.translations[locale].models[professionId] = profData[locale];
          }
        }
      }
    } else if (fs.existsSync(legacyFilePath)) {
      const content = fs.readFileSync(legacyFilePath, 'utf8');
      industryData = JSON.parse(content) as IndustryData;
    }
    
    return industryData;
  } catch (error) {
    console.error(`Error reading industry data for ${id}:`, error);
    return null;
  }
}

export function getAllIndustries(): IndustryData[] {
  try {
    if (!fs.existsSync(INDUSTRIES_DIR)) return [];
    
    const entries = fs.readdirSync(INDUSTRIES_DIR);
    const industryIds = new Set<IndustryId>();
    
    for (const entry of entries) {
      const fullPath = path.join(INDUSTRIES_DIR, entry);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        industryIds.add(entry as IndustryId);
      } else if (entry.endsWith('.json')) {
        industryIds.add(entry.replace('.json', '') as IndustryId);
      }
    }
    
    return Array.from(industryIds)
      .map(id => getIndustryById(id))
      .filter((ind): ind is IndustryData => ind !== null);
  } catch (error) {
    console.error('Error reading all industries:', error);
    return [];
  }
}

export function getLocalizedIndustryPath(
  lang: Locale, 
  citySlug: string, 
  brandId: IndustryId, 
  modelId?: ProfessionId, 
  serviceId?: ServiceId
): string {
  const prefix = lang === 'pl' ? '' : `/${lang}`;
  
  // Resolve slugs based on locale
  const brandSlug = industrySlugsMap[brandId][lang];
  const modelSlug = modelId ? professionSlugsMap[modelId][lang] : '';
  const serviceSlug = serviceId ? serviceSlugsMap[serviceId][lang] : '';
  
  // Parent route for general pages
  const parentSlug = lang === 'pl' ? 'strona-dla' : 
                     lang === 'en' ? 'website-for' : 
                     lang === 'de' ? 'webseite-fuer' : 
                     lang === 'uk' ? 'sayt-dlya' : 
                     lang === 'ru' ? 'sayt-dlya' : 'website-for';
  
  if (citySlug === 'all') {
    // General path e.g. /branze/lekarz/ginekolog/strona-pwa
    let path = `${prefix}/${parentSlug}/${brandSlug}`;
    if (modelSlug) path += `/${modelSlug}`;
    if (serviceSlug) path += `/${serviceSlug}`;
    return path;
  } else {
    // City-specific path e.g. /bemowo/lekarz/ginekolog/strona-pwa
    let path = `${prefix}/${citySlug}/${brandSlug}`;
    if (modelSlug) path += `/${modelSlug}`;
    if (serviceSlug) path += `/${serviceSlug}`;
    return path;
  }
}

