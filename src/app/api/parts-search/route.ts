import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Memory cache for the database to avoid reading from disk on every search
let cachedParts: any[] | null = null;

async function getPartsData() {
  if (cachedParts) return cachedParts;

  try {
    const filePath = path.join(process.cwd(), 'data', 'csvjson.json');
    const content = await fs.readFile(filePath, 'utf-8');
    cachedParts = JSON.parse(content);
    return cachedParts || [];
  } catch (error) {
    console.error('Error reading parts database:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q')?.trim().toLowerCase() || '';

  if (!query) {
    return NextResponse.json({ success: true, results: [] });
  }

  const parts = await getPartsData();
  
  // Filter matching parts across any translated language or categories
  const filtered = parts.filter((item) => {
    const pl = (item.pl || item.main_pl || '').toLowerCase();
    const ru = (item.ru || item.main_ru || '').toLowerCase();
    const en = (item.en || '').toLowerCase();
    const de = (item.de || '').toLowerCase();
    const uk = (item.uk || '').toLowerCase();
    const zh = (item.zh || '').toLowerCase();
    const category = (item.category_allegro || '').toLowerCase();

    return (
      pl.includes(query) ||
      ru.includes(query) ||
      en.includes(query) ||
      de.includes(query) ||
      uk.includes(query) ||
      zh.includes(query) ||
      category.includes(query)
    );
  });

  // Limit search results to top 12 items for clean UI rendering and bandwidth saving
  const limitedResults = filtered.slice(0, 12);

  return NextResponse.json({
    success: true,
    results: limitedResults,
  });
}
