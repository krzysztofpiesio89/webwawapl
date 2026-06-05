import * as fs from 'fs';
import * as path from 'path';

/**
 * Normalizes a string to a standard URL slug format.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/[\s_-]+/g, '-')  // replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '');  // remove leading/trailing hyphens
}

// ── Cached brand file data ──────────────────────────────────────────────────

interface BrandFileEntry {
  brand: string;
  models: Record<string, any[]>;
}

let _brandsCache: BrandFileEntry[] | null = null;

/**
 * Reads all brand JSON files from data/brands/ directory.
 * Cached in memory for the lifetime of the server process.
 */
function loadAllBrandFiles(): BrandFileEntry[] {
  if (_brandsCache) return _brandsCache;

  const brandsDir = path.join(process.cwd(), 'data', 'brands');
  if (!fs.existsSync(brandsDir)) {
    _brandsCache = [];
    return _brandsCache;
  }

  const files = fs.readdirSync(brandsDir).filter(f => f.endsWith('.json'));
  _brandsCache = files.map(file => {
    const content = fs.readFileSync(path.join(brandsDir, file), 'utf8');
    return JSON.parse(content) as BrandFileEntry;
  }).filter(b => b.brand && b.brand !== '-');

  return _brandsCache;
}

let _logosCache: Record<string, string> | null = null;

function loadBrandLogos(): Record<string, string> {
  if (_logosCache) return _logosCache;

  const logosPath = path.join(process.cwd(), 'data', 'brand-logos.json');
  if (!fs.existsSync(logosPath)) {
    _logosCache = {};
    return _logosCache;
  }

  try {
    const content = fs.readFileSync(logosPath, 'utf8');
    _logosCache = JSON.parse(content);
  } catch (e) {
    _logosCache = {};
  }
  return _logosCache || {};
}

/**
 * Zwraca logotyp danej marki na podstawie jej sluga
 */
export function getBrandLogo(brandSlug: string): string | null {
  const logos = loadBrandLogos();
  return logos[slugify(brandSlug)] || null;
}

// ── Public types ────────────────────────────────────────────────────────────

export interface BrandInfo {
  name: string;
  slug: string;
  models: ModelInfo[];
  logoUrl: string | null;
}

export interface ModelInfo {
  name: string;
  slug: string;
  series: SeriesInfo[];
}

export interface SeriesInfo {
  name: string;
  years: string;
  specs?: any;
  wiki?: any;
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns a flat list of all brands (name + slug + models count).
 * Used by city pages, marki page, sitemap etc.
 */
export function getAllBrands(): BrandInfo[] {
  const files = loadAllBrandFiles();
  const logos = loadBrandLogos();

  return files.map(f => {
    const slug = slugify(f.brand);
    return {
      name: f.brand,
      slug,
      logoUrl: logos[slug] || null,
      models: Object.keys(f.models || {}).map(modelName => ({
        name: modelName,
        slug: slugify(modelName),
        series: (f.models[modelName] || []).map((s: any) => ({
          name: String(s["Serie Name"] || s.name || "N/A"),
          years: String(s["Years"] || s.years || "N/A"),
          specs: s.specs || null,
          wiki: s.specs?.wiki || null,
        })),
      })),
    };
  })
  .filter(b => b.slug !== '')
  .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Robustly matches and fetches a brand by its slug case-insensitively.
 * Supports partial matches (e.g. "mercedes" -> "Mercedes" file).
 */
export function getBrandBySlug(brandSlug: string): BrandInfo | null {
  const all = getAllBrands();
  const target = slugify(brandSlug);

  const brand = all.find(b => {
    return b.slug === target || b.slug.includes(target) || target.includes(b.slug);
  });

  return brand || null;
}

/**
 * Robustly matches a model under a brand by its slug case-insensitively.
 */
export function getModelBySlug(brand: BrandInfo, modelSlug: string): ModelInfo | null {
  if (!brand || !brand.models) return null;
  const target = slugify(modelSlug);
  const model = brand.models.find(m => m.slug === target);
  return model || null;
}

/**
 * Reads detailed Wiki and Specs data for a brand model from its json file.
 */
export function getWikiData(brandSlug: string, modelName: string) {
  try {
    const brandsDir = path.join(process.cwd(), 'data', 'brands');
    if (!fs.existsSync(brandsDir)) return null;

    const brandFiles = fs.readdirSync(brandsDir).filter(f => f.endsWith('.json'));
    const targetSlug = slugify(brandSlug);
    
    // Match the closest JSON filename robustly
    let matchedFile = brandFiles.find(file => {
      const fileSlug = slugify(file.replace('.json', ''));
      return fileSlug === targetSlug && fileSlug !== '';
    });

    if (!matchedFile) {
      matchedFile = brandFiles.find(file => {
        const fileSlug = slugify(file.replace('.json', ''));
        if (!fileSlug) return false;
        return fileSlug.includes(targetSlug) || targetSlug.includes(fileSlug);
      });
    }

    if (matchedFile) {
      const filePath = path.join(brandsDir, matchedFile);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const brandData = JSON.parse(fileContent);
      
      const modelsObj = brandData.models;
      if (modelsObj && typeof modelsObj === 'object') {
        // Find matching key case-insensitively
        const keys = Object.keys(modelsObj);
        const matchedKey = keys.find(k => slugify(k) === slugify(modelName));
        
        if (matchedKey) {
          const seriesList = modelsObj[matchedKey];
          if (Array.isArray(seriesList) && seriesList.length > 0) {
            // Find a series that has wiki info, or default to the first one
            const seriesWithWiki = seriesList.find(s => s.specs && s.specs.wiki && s.specs.wiki.description) || seriesList[0];
            if (seriesWithWiki && seriesWithWiki.specs) {
              return {
                specs: seriesWithWiki.specs,
                wiki: seriesWithWiki.specs.wiki || null
              };
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching wiki data:', error);
  }
  return null;
}
