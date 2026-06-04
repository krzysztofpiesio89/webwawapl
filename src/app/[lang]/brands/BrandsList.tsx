'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Locale } from '@/app/[lang]/dictionaries';

interface BrandItem {
  id: number | string;
  name: string;
  logoUrl?: string | null;
  models: { id: number | string }[];
}

interface CityItem {
  id: number;
  name: string;
  slug: string;
}

export default function BrandsList({ brands, cities, dict, lang }: { brands: BrandItem[]; cities: CityItem[]; dict: any; lang: Locale }) {
  const [search, setSearch] = useState('');
  const [selectedCitySlug, setSelectedCitySlug] = useState('warszawa');

  const langPrefix = lang === 'pl' ? '' : `/${lang}`;

  // Filter brands based on search input
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  // Group brands alphabetically by their first letter
  const groupedBrands: Record<string, BrandItem[]> = {};
  filteredBrands.forEach(brand => {
    const firstLetter = brand.name.charAt(0).toUpperCase();
    if (!groupedBrands[firstLetter]) {
      groupedBrands[firstLetter] = [];
    }
    groupedBrands[firstLetter].push(brand);
  });

  // Get sorted list of letters
  const sortedLetters = Object.keys(groupedBrands).sort();

  return (
    <div className="space-y-12">
      {/* Search & City Selector Bar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row gap-6 items-stretch md:items-center justify-between">
        
        {/* Left - Search Input */}
        <div className="relative flex-1 max-w-xl">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder={dict.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-bold placeholder:text-slate-400 focus:ring-2 ring-amber-400 outline-none transition-all"
          />
        </div>

        {/* Right - City Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <label className="text-sm font-black text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-2">
            📍 {dict.yourCity}:
          </label>
          <select
            value={selectedCitySlug}
            onChange={(e) => setSelectedCitySlug(e.target.value)}
            className="p-4 pr-10 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-bold focus:ring-2 ring-amber-400 outline-none transition-all cursor-pointer appearance-none relative max-w-full truncate"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%230f172a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 16px center',
              backgroundSize: '16px'
            }}
          >
            {cities.map(city => (
              <option key={city.id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Quick Alphabetical Navigation */}
      {sortedLetters.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center py-4 bg-white/60 border border-slate-200/50 rounded-2xl p-4 shadow-sm">
          {sortedLetters.map(letter => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-slate-700 bg-white border border-slate-200 hover:bg-amber-400 hover:text-slate-900 hover:border-amber-400 transition-all text-sm"
            >
              {letter}
            </a>
          ))}
        </div>
      )}

      {/* Brands Alphabetical Grid */}
      {sortedLetters.length > 0 ? (
        <div className="space-y-12">
          {sortedLetters.map(letter => (
            <div key={letter} id={`letter-${letter}`} className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-black text-slate-900 bg-amber-400 w-12 h-12 rounded-2xl flex items-center justify-center shadow-md uppercase italic">
                  {letter}
                </h2>
                <div className="flex-1 h-0.5 bg-slate-200"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {groupedBrands[letter].map(brand => (
                  <Link
                    key={brand.id}
                    href={`${langPrefix}/${selectedCitySlug}/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="p-4 bg-white border border-slate-200/80 rounded-2xl text-center shadow-sm hover:border-amber-400 hover:shadow-lg transition-all duration-300 group flex flex-col items-center justify-between"
                  >
                    <div className="mb-3 w-14 h-14 flex items-center justify-center">
                      {brand.logoUrl ? (
                        <img 
                          src={brand.logoUrl} 
                          alt={brand.name} 
                          className="max-w-full max-h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-xl text-slate-300 font-black group-hover:bg-amber-300 group-hover:text-amber-800 transition-colors">
                          {brand.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="w-full">
                      <h3 className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors truncate">
                        {brand.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                        {brand.models.length} {brand.models.length === 1 ? dict.modelSingular : dict.modelPlural}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-2xl font-black text-slate-900 mb-2 uppercase italic">{dict.noResults}</p>
          <p className="text-slate-500">{dict.noResultsDesc.replace('{search}', search)}</p>
          <button
            onClick={() => setSearch('')}
            className="mt-6 btn-primary px-8 py-3 text-sm"
          >
            {dict.clearSearch}
          </button>
        </div>
      )}

      {/* CTA Bottom Banner */}
      <div className="bg-amber-400 rounded-3xl p-8 md:p-12 text-center shadow-xl space-y-6">
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tight">
          {dict.ctaTitle}
        </h3>
        <p className="text-slate-900 font-medium max-w-2xl mx-auto opacity-80 leading-relaxed">
          {dict.ctaDesc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={`${langPrefix}/#wycena`}
            className="bg-slate-900 text-white hover:bg-slate-800 font-black uppercase italic py-4 px-8 rounded-2xl transition-all shadow-md w-full sm:w-auto"
          >
            {dict.ctaFormBtn}
          </a>
          <a
            href="tel:+48664946209"
            className="bg-white text-slate-900 hover:bg-slate-50 font-black uppercase italic py-4 px-8 rounded-2xl transition-all border border-slate-200 shadow-md w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <span>📞</span> +48 664 946 209
          </a>
        </div>
      </div>
    </div>
  );
}
