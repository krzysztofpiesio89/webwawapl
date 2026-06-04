import fs from 'fs';
import path from 'path';
import Image from 'next/image';

export default function Gallery({ dict }: { dict: any }) {
  const galleryDir = path.join(process.cwd(), 'public', 'images', 'gallery');
  
  let images: string[] = [];
  try {
    if (fs.existsSync(galleryDir)) {
      const files = fs.readdirSync(galleryDir);
      images = files.filter(file => !file.startsWith('placeholder') && /\.(jpg|jpeg|png|webp)$/i.test(file));
    }
  } catch (error) {
    console.error('Error reading gallery directory:', error);
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section id="ostatniokupioneauta" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-700 text-sm font-bold mb-4 uppercase tracking-widest">
            {dict.badge}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">{dict.title}</h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            {dict.description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((filename, idx) => (
            <div key={idx} className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border-4 border-white group bg-slate-200">
              <Image 
                src={`/images/gallery/${filename}`} 
                alt={`Ostatnio zakupione auto ${idx + 1}`}
                fill
                sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-amber-400 text-slate-900 text-sm font-black px-3 py-1.5 rounded-lg inline-block uppercase">
                  {filename.includes('PHOTO-2026-05-21-18-22-27_2') ? dict.cashTag2 : dict.cashTag1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
