import UCarsCarouselClient, { CarProps } from './UCarsCarouselClient';

async function getUCars(): Promise<CarProps[]> {
  try {
    // Fetch directly from the production API of uCars.pl
    // Filtering for "Odpala i jeździ" and other criteria per user request
    const res = await fetch(
      'https://ucars.pl/api/car?yearFrom=2015&priceFrom=4000&auctionStatus=upcoming&damageType=Normalne+Zu%C5%BCycie&engineStatus=Odpala+i+je%C5%BAdzi&page=1&limit=10',
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!res.ok) {
      throw new Error('API response not ok');
    }

    const data = await res.json();
    if (data && Array.isArray(data.cars) && data.cars.length > 0) {
      return data.cars;
    }
  } catch (error) {
    console.warn('Failed to fetch from uCars.pl API, using high-quality fallback cars:', error);
  }

  // Beautiful fallback cars if API is offline or slow
  return [
    {
      id: 'mock-1',
      slug: 'mock-ford-mustang-gt-2021',
      stock: 'MOCK-FORD-MUSTANG',
      year: 2021,
      make: 'Ford',
      model: 'Mustang GT',
      damageType: 'Normal Wear & Tear',
      mileage: 42000,
      engineStatus: 'Run & Drive',
      buyNowPrice: 18500,
      bidPrice: 12400,
      imageUrl: 'https://images.unsplash.com/photo-1612462274053-46c59b634863?auto=format&fit=crop&q=80&w=600',
      detailUrl: 'https://ucars.pl',
      fuelType: 'Gasoline',
    },
    {
      id: 'mock-2',
      slug: 'mock-tesla-model-3-2022',
      stock: 'MOCK-TESLA-3',
      year: 2022,
      make: 'Tesla',
      model: 'Model 3 Long Range',
      damageType: 'None',
      mileage: 18500,
      engineStatus: 'Run & Drive',
      buyNowPrice: 22000,
      bidPrice: 15100,
      imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
      detailUrl: 'https://ucars.pl',
      fuelType: 'Electric',
    },
    {
      id: 'mock-3',
      slug: 'mock-audi-q5-2020',
      stock: 'MOCK-AUDI-Q5',
      year: 2020,
      make: 'Audi',
      model: 'Q5 Premium Plus',
      damageType: 'Normal Wear & Tear',
      mileage: 58000,
      engineStatus: 'Run & Drive',
      buyNowPrice: 19800,
      bidPrice: 13500,
      imageUrl: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=600',
      detailUrl: 'https://ucars.pl',
      fuelType: 'Gasoline',
    },
    {
      id: 'mock-4',
      slug: 'mock-bmw-330i-2021',
      stock: 'MOCK-BMW-3',
      year: 2021,
      make: 'BMW',
      model: '330i xDrive',
      damageType: 'Normal Wear & Tear',
      mileage: 35000,
      engineStatus: 'Run & Drive',
      buyNowPrice: 16500,
      bidPrice: 11000,
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=600',
      detailUrl: 'https://ucars.pl',
      fuelType: 'Gasoline',
    },
  ];
}

export default async function UCarsPromo({ dict }: { dict: any }) {
  const cars = await getUCars();

  return (
    <section className="py-12 bg-slate-950 text-white relative border-t border-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-[10px] uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              {dict.badge}
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 uppercase italic">
              {dict.titlePrefix} <span className="text-amber-400">{dict.titleHighlight}</span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: dict.description }} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://ucars.pl"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-amber-500 text-slate-950 font-black uppercase italic tracking-wider transition-all duration-300 hover:bg-amber-400 rounded-xl text-sm text-center"
            >
              {dict.ctaPrimary}
            </a>
            <a
              href="https://ucars.pl/aukcje"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white font-bold text-center hover:bg-slate-700 transition-all duration-300 text-sm"
            >
              {dict.ctaSecondary}
            </a>
          </div>
        </div>

        {/* Animated Cars Carousel */}
        <UCarsCarouselClient cars={cars} dict={dict.carousel} />

        {/* Small Trust Badge */}
        <div className="mt-10 text-center text-[10px] text-slate-400 max-w-xl mx-auto leading-relaxed">
          {dict.trustText}
        </div>
      </div>
    </section>
  );
}
