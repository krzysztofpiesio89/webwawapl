"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

export interface CarProps {
  id: number | string;
  slug?: string;
  stock: string;
  year: number;
  make: string;
  model: string;
  damageType: string;
  mileage: number | null;
  engineStatus: string;
  buyNowPrice: number | null;
  bidPrice: number;
  imageUrl: string;
  detailUrl: string;
  fuelType?: string | null;
}

export function generateAuctionSlug(car: CarProps): string {
  if (car.slug) return car.slug;
  const parts: string[] = [];
  
  const auctionSource = car.detailUrl?.includes('iaai.com') ? 'iaai' :
    car.detailUrl?.includes('copart.com') ? 'copart' : 'auction';
  parts.push(auctionSource);

  if (car.make) {
    parts.push(car.make.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/mercedesbenz/g, 'mercedes-benz'));
  }
  
  if (car.model) {
    parts.push(car.model.toLowerCase().replace(/[^a-z0-9]/g, ''));
  }

  if (car.year) {
    parts.push(car.year.toString());
  }

  if (car.stock) {
    parts.push(car.stock.replace(/[^a-zA-Z0-9]/g, ''));
  }

  return parts.join('-').replace(/-+/g, '-');
}

export default function UCarsCarouselClient({ cars, dict }: { cars: CarProps[], dict: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let lastTimestamp = 0;
    let currentScroll = container.scrollLeft; // Trzymamy rzeczywistą pozycję zmiennoprzecinkową

    const scrollStep = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      
      if (deltaTime > 16) { // ~60fps
        if (container) {
          currentScroll += 0.5; // Bardzo powolne przesunięcie (0.5px na klatkę)
          container.scrollLeft = currentScroll;
          
          // Bezpieczny reset pętli (scrollWidth / 2 jest bezpieczny bo tablica jest zduplikowana 1:1)
          if (container.scrollLeft >= container.scrollWidth / 2) {
            currentScroll = 0;
            container.scrollLeft = 0;
          }
        }
        lastTimestamp = timestamp;
      }
      animationId = requestAnimationFrame(scrollStep);
    };

    // Rozpoczęcie animacji po krótkim opóźnieniu, by użytkownik zauważył
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(scrollStep);
    }, 1000);

    // Zatrzymanie po najechaniu myszką
    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      lastTimestamp = 0;
      currentScroll = container.scrollLeft; // Synchronizacja po manualnym przewinięciu
      animationId = requestAnimationFrame(scrollStep);
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleMouseEnter, { passive: true });
    container.addEventListener('touchend', handleMouseLeave);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleMouseEnter);
      container.removeEventListener('touchend', handleMouseLeave);
    };
  }, []);

  // Duplikujemy tablicę, żeby przy przewijaniu było więcej kafelków i pętla była mniej zauważalna
  const displayCars = [...cars, ...cars];

  return (
    <div 
      ref={scrollRef}
      className="flex overflow-x-auto gap-6 py-12 -my-12 px-8 -mx-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      style={{ scrollBehavior: 'auto' }} // auto by animacja działała płynnie
    >
      {displayCars.map((car, idx) => {
        const displayMileage = car.mileage ? `${car.mileage.toLocaleString()} mi` : dict.noData;
        const damagePL = car.damageType === 'None' || car.damageType === 'Brak' ? dict.noDamage : dict.normalWear;
        const priceVal = car.buyNowPrice || car.bidPrice;

        return (
          <a
            key={`${car.id}-${idx}`}
            href={`https://ucars.pl/auction/${generateAuctionSlug(car)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 w-[280px] sm:w-[320px] bg-slate-900/45 backdrop-blur-md border border-slate-800/85 rounded-3xl overflow-hidden hover:border-amber-400/80 hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)] transition-all duration-500 flex flex-col cursor-pointer"
          >
            {/* Image Section */}
            <div className="relative h-40 w-full overflow-hidden bg-slate-950">
              <Image
                src={car.imageUrl || 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=600'}
                alt={`${car.make} ${car.model}`}
                fill
                sizes="(max-w-768px) 100vw, 320px"
                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                unoptimized={car.imageUrl?.startsWith('http')}
              />
              {/* Floating badge */}
              <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-slate-950 font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse"></span>
                {car.engineStatus === 'Run & Drive' || car.engineStatus === 'Odpala i jeździ' ? dict.runAndDrive : car.engineStatus}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold mb-1.5">
                  <span>{car.year}</span>
                  <span className="bg-amber-400/10 px-1.5 py-0.5 rounded uppercase">{dict.importUSA}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-1">
                  {car.make} {car.model}
                </h3>

                {/* Stats List */}
                <div className="space-y-1.5 mb-4 text-xs text-slate-400">
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span>{dict.mileage}</span>
                    <strong className="text-slate-200">{displayMileage}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span>{dict.condition}</span>
                    <strong className="text-slate-200 line-clamp-1 text-right ml-2">{damagePL}</strong>
                  </div>
                </div>
              </div>

              {/* Price info & Action */}
              <div className="mt-auto pt-3 border-t border-slate-800/60">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{dict.buyNow}</span>
                  <strong className="text-xl font-black text-amber-400">
                    ${priceVal.toLocaleString()}
                  </strong>
                </div>
                <div className="w-full py-2 bg-slate-800/80 rounded-xl group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors duration-300 text-center font-bold text-xs flex items-center justify-center gap-2">
                  {dict.bidOn}
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
