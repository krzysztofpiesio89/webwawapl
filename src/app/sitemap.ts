import { MetadataRoute } from 'next';
import { getAllCities } from '@/lib/cities';
import { locales, Locale } from './[lang]/dictionaries';
import { getLocalizedStaticPath } from './[lang]/i18n-routes';
import { getAllIndustries, getLocalizedIndustryPath } from '@/lib/industries';
import { industryModelsMap, ProfessionId } from '@/lib/industries-list';
import { getAllTechnologies } from '@/lib/technology';

export async function generateSitemaps() {
  const cities = getAllCities();
  const sitemaps = [{ id: 'global' }];
  
  for (const lang of locales) {
    sitemaps.push({ id: `${lang}-all` });
    for (const city of cities) {
      sitemaps.push({ id: `${lang}-${city.slug}` });
    }
  }
  
  return sitemaps;
}

export default async function sitemap(props: { id: string | Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  const baseUrl = 'https://webwawa.pl';
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
      
      // SEO
      sitemapEntries.push({ 
        url: `${baseUrl}${getLocalizedStaticPath('seo', lang as Locale)}`, 
        lastModified: new Date(), 
        changeFrequency: 'weekly', 
        priority: 0.8 
      });

      // Websites
      sitemapEntries.push({ 
        url: `${baseUrl}${getLocalizedStaticPath('websites', lang as Locale)}`, 
        lastModified: new Date(), 
        changeFrequency: 'weekly', 
        priority: 0.9 
      });

      // Ecommerce
      sitemapEntries.push({ 
        url: `${baseUrl}${getLocalizedStaticPath('ecommerce', lang as Locale)}`, 
        lastModified: new Date(), 
        changeFrequency: 'weekly', 
        priority: 0.9 
      });

      // Software
      sitemapEntries.push({ 
        url: `${baseUrl}${getLocalizedStaticPath('software', lang as Locale)}`, 
        lastModified: new Date(), 
        changeFrequency: 'weekly', 
        priority: 0.9 
      });

      // Technologies (software/[tech])
      const techs = getAllTechnologies();
      for (const tech of techs) {
        sitemapEntries.push({ 
          url: `${baseUrl}${getLocalizedStaticPath('software', lang as Locale)}/${tech}`, 
          lastModified: new Date(), 
          changeFrequency: 'monthly', 
          priority: 0.8 
        });
      }
    }
    return sitemapEntries;
  }

  // Handle dynamic routes split by lang-citySlug (e.g. "pl-warszawa", "en-all")
  const parts = id.split('-');
  const lang = parts[0] as Locale;
  const citySlug = parts.slice(1).join('-'); // handles multi-dash city slugs like praga-polnoc
  const industries = getAllIndustries();
  const langPrefix = lang === 'pl' ? '' : `/${lang}`;
  
  // 1. City Page (only if it's a real city, 'all' is not a real city overview page)
  if (citySlug !== 'all') {
    sitemapEntries.push({
      url: `${baseUrl}${langPrefix}/${citySlug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // 2. City + Industry Pages
  for (const industry of industries) {
    const industryPath = getLocalizedIndustryPath(lang, citySlug, industry.id);
    sitemapEntries.push({
      url: `${baseUrl}${industryPath}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
    
    // 3. City + Industry + Profession Pages
    const professions = industryModelsMap[industry.id] || [];
    for (const professionId of professions) {
      const professionPath = getLocalizedIndustryPath(lang, citySlug, industry.id, professionId as ProfessionId);
      sitemapEntries.push({
        url: `${baseUrl}${professionPath}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return sitemapEntries;
}
