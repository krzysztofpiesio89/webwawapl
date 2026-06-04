import { MetadataRoute } from 'next';
import { getAllBrands } from '@/lib/brands';
import { getAllCities } from '@/lib/cities';
import { locales, Locale } from './[lang]/dictionaries';
import { getLocalizedStaticPath } from './[lang]/i18n-routes';

export async function generateSitemaps() {
  const cities = getAllCities();
  const sitemaps = [{ id: 'global' }];
  
  for (const lang of locales) {
    for (const city of cities) {
      sitemaps.push({ id: `${lang}-${city.slug}` });
    }
  }
  
  return sitemaps;
}

export default async function sitemap(props: { id: string | Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  const baseUrl = 'https://skupautwawa.pl';
  const sitemapEntries: MetadataRoute.Sitemap = [];

  if (id === 'global') {
    for (const lang of locales) {
      const langPrefix = lang === 'pl' ? '' : `/${lang}`;
      
      // Home
      sitemapEntries.push({ 
        url: `${baseUrl}${langPrefix}/`, 
        lastModified: new Date(), 
        changeFrequency: 'daily', 
        priority: 1 
      });
      
      // Brands (Nasze Marki)
      sitemapEntries.push({ 
        url: `${baseUrl}${getLocalizedStaticPath('brands', lang as Locale)}`, 
        lastModified: new Date(), 
        changeFrequency: 'weekly', 
        priority: 0.8 
      });
      
      // About (O nas)
      sitemapEntries.push({ 
        url: `${baseUrl}${getLocalizedStaticPath('about', lang as Locale)}`, 
        lastModified: new Date(), 
        changeFrequency: 'monthly', 
        priority: 0.6 
      });
      
      // Privacy (Polityka Prywatności)
      sitemapEntries.push({ 
        url: `${baseUrl}${getLocalizedStaticPath('privacy', lang as Locale)}`, 
        lastModified: new Date(), 
        changeFrequency: 'yearly', 
        priority: 0.3 
      });
    }
    return sitemapEntries;
  }

  // Handle dynamic routes split by lang-citySlug (e.g. "pl-warszawa", "en-pruszkow")
  const [lang, citySlug] = id.split('-');
  const brands = getAllBrands();
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  
  // 1. City Page
  sitemapEntries.push({
    url: `${baseUrl}${langPrefix}/${citySlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  });

  // 2. City + Brand Pages
  for (const brand of brands) {
    sitemapEntries.push({
      url: `${baseUrl}${langPrefix}/${citySlug}/${brand.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
    
    // 3. City + Brand + Model Pages
    for (const model of brand.models) {
      sitemapEntries.push({
        url: `${baseUrl}${langPrefix}/${citySlug}/${brand.slug}/${model.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
      
      // 4. City + Brand + Model + Series Pages
      for (const series of model.series) {
        // We use encodeURIComponent because some series names might have spaces or special characters
        const seriesSlug = encodeURIComponent(series.name.toLowerCase().replace(/\s+/g, '-'));
        sitemapEntries.push({
          url: `${baseUrl}${langPrefix}/${citySlug}/${brand.slug}/${model.slug}/${seriesSlug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  }

  return sitemapEntries;
}
