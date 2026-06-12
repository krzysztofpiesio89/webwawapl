import fs from 'fs';
import path from 'path';
import type { Locale } from '@/app/[lang]/dictionaries';

export interface TechnologyTranslation {
  title: string;
  description: string;
  advantages: string[];
  faq: { q: string; a: string }[];
}

export interface TechnologyData {
  slug: string;
  name: string;
  translations: Record<Locale, TechnologyTranslation>;
}

const TECHNOLOGY_DIR = path.join(process.cwd(), 'data', 'technology');

export function getTechnologyById(id: string): TechnologyData | null {
  try {
    const filePath = path.join(TECHNOLOGY_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) return null;

    const content = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(content) as Record<Locale, TechnologyTranslation>;
    const names: Record<string, string> = {
      'astro-build': 'Astro',
      'nextjs': 'Next.js',
      'nuxt': 'Nuxt.js',
      'tailwind-css': 'Tailwind CSS',
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'html5': 'HTML5',
      'jquery': 'jQuery',
      'wordpress': 'WordPress',
      'woocommerce': 'WooCommerce',
      'sylius': 'Sylius',
      'laravel': 'Laravel',
      'symfony': 'Symfony',
      'django': 'Django',
      'php': 'PHP',
      'rust': 'Rust',
      'postgresql': 'PostgreSQL',
      'mysql': 'MySQL',
      'sqlite': 'SQLite',
      'prisma': 'Prisma ORM',
      'websocket': 'WebSockets',
      'hosting': 'Hosting / CDN',
      'schema-org': 'Schema.org JSON-LD',
      'open-graph': 'Open Graph Meta',
      'push-notifications': 'Push Notifications',
      'vapid': 'VAPID Security'
    };

    return {
      slug: id,
      name: names[id] || id,
      translations
    };
  } catch (error) {
    console.error(`Error reading technology data for ${id}:`, error);
    return null;
  }
}

export function getAllTechnologies(): string[] {
  try {
    if (!fs.existsSync(TECHNOLOGY_DIR)) return [];
    const files = fs.readdirSync(TECHNOLOGY_DIR);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error reading all technologies:', error);
    return [];
  }
}
