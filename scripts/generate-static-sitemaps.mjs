import fs from 'fs/promises';
import path from 'path';

// Mock getLocalizedStaticPath logic
const localizedRoutes = {
  brands: { pl: 'marki', en: 'brands', uk: 'marky', ru: 'marki', de: 'marken', zh: 'brands' },
  about: { pl: 'o-nas', en: 'about-us', uk: 'pro-nas', ru: 'o-nas', de: 'ueber-uns', zh: 'about-us' },
  privacy: { pl: 'polityka-prywatnosci', en: 'privacy-policy', uk: 'polityka-konfidentsiynosti', ru: 'politika-konfidentsialnosti', de: 'datenschutz', zh: 'privacy-policy' }
};

function getLocalizedStaticPath(page, lang) {
  const slug = localizedRoutes[page][lang];
  const prefix = lang === 'pl' ? '' : `/${lang}`;
  return `${prefix}/${slug}`;
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const baseUrl = 'https://skupautwawa.pl';
  const PUBLIC_DIR = path.join(process.cwd(), 'public');
  const SITEMAP_DIR = path.join(PUBLIC_DIR, 'sitemap');
  const BRANDS_DIR = path.join(process.cwd(), 'data', 'brands');
  
  // Ensure sitemap folder exists
  await fs.mkdir(SITEMAP_DIR, { recursive: true });
  
  // 1. Get cities
  const citiesModule = await import('../src/lib/cities.ts');
  const cities = citiesModule.getAllCities();
  const locales = ['pl', 'en', 'uk', 'ru', 'de', 'zh'];
  
  // 2. Load brands
  const brandFiles = (await fs.readdir(BRANDS_DIR)).filter(f => f.endsWith('.json'));
  const brands = [];
  for (const file of brandFiles) {
    const content = await fs.readFile(path.join(BRANDS_DIR, file), 'utf8');
    const brandData = JSON.parse(content);
    if (brandData.brand && brandData.brand !== '-') {
      const slug = slugify(brandData.brand);
      const models = Object.keys(brandData.models || {}).map(modelName => ({
        name: modelName,
        slug: slugify(modelName),
        series: (brandData.models[modelName] || []).map(s => ({
          name: String(s["Serie Name"] || s.name || "N/A"),
          years: String(s["Years"] || s.years || "N/A")
        }))
      }));
      brands.push({ name: brandData.brand, slug, models });
    }
  }

  console.log(`Loaded ${cities.length} cities and ${brands.length} brands.`);

  // 3. Generate global sitemap
  let globalXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  globalXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const lang of locales) {
    const langPrefix = lang === 'pl' ? '' : `/${lang}`;
    
    // Home
    globalXml += `  <url>\n    <loc>${baseUrl}${langPrefix}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    
    // Static Pages
    for (const page of ['brands', 'about', 'privacy']) {
      globalXml += `  <url>\n    <loc>${baseUrl}${getLocalizedStaticPath(page, lang)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }
  }
  globalXml += '</urlset>';
  await fs.writeFile(path.join(SITEMAP_DIR, 'global.xml'), globalXml, 'utf8');
  console.log('Saved global.xml');

  // 4. Generate city-locale sub-sitemaps
  const sitemapList = ['global.xml'];
  
  for (const lang of locales) {
    const langPrefix = lang === 'pl' ? '' : `/${lang}`;
    
    for (const city of cities) {
      const sitemapFileName = `${lang}-${city.slug}.xml`;
      sitemapList.push(sitemapFileName);
      
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      // City root page
      xml += `  <url>\n    <loc>${baseUrl}${langPrefix}/${city.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      
      // Brands, Models, Series
      for (const brand of brands) {
        // Brand Page
        xml += `  <url>\n    <loc>${baseUrl}${langPrefix}/${city.slug}/${brand.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        
        for (const model of brand.models) {
          // Model Page
          xml += `  <url>\n    <loc>${baseUrl}${langPrefix}/${city.slug}/${brand.slug}/${model.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
          
          for (const series of model.series) {
            const seriesSlug = encodeURIComponent(series.name.toLowerCase().replace(/\s+/g, '-'));
            // Series Page
            xml += `  <url>\n    <loc>${baseUrl}${langPrefix}/${city.slug}/${brand.slug}/${model.slug}/${seriesSlug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
          }
        }
      }
      
      xml += '</urlset>';
      await fs.writeFile(path.join(SITEMAP_DIR, sitemapFileName), xml, 'utf8');
    }
    console.log(`Generated all city sitemaps for language: ${lang}`);
  }

  // 5. Generate the main sitemap index sitemap.xml in /public
  let indexXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  indexXml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const sitemapFile of sitemapList) {
    indexXml += `  <sitemap>\n    <loc>${baseUrl}/sitemap/${sitemapFile}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n  </sitemap>\n`;
  }
  indexXml += '</sitemapindex>';
  
  await fs.writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), indexXml, 'utf8');
  console.log('Saved main sitemap.xml to /public!');
}

main().catch(console.error);
