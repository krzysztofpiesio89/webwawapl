import React from 'react';
import Image from 'next/image';
import { fetchGoogleReviews, GoogleReview } from '@/lib/google-reviews';

export default async function Reviews({ dict }: { dict: any }) {
  const googleData = await fetchGoogleReviews();
  
  // Jeśli mamy dane z Google API i są one poprawne
  const hasRealReviews = googleData && googleData.reviews && googleData.reviews.length > 0;
  
  const fallbackReviews = dict.fallback || [];
  
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">{dict.title}</h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">{dict.subtitle}</p>
          
          {hasRealReviews && (
             <div className="flex items-center justify-center gap-3 mt-6 text-slate-800 bg-slate-50 py-3 px-6 rounded-full inline-flex mx-auto border border-slate-200">
               <span className="font-black text-2xl">{googleData.rating.toFixed(1)}</span>
               <div className="flex text-amber-400 text-xl">
                 {"★".repeat(Math.round(googleData.rating))}
               </div>
               <span className="text-sm font-medium">({googleData.user_ratings_total} {dict.ratingSuffix})</span>
             </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {hasRealReviews ? (
            googleData.reviews.slice(0, 3).map((review: GoogleReview, idx: number) => (
              <div key={idx} className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 relative bg-slate-200">
                    {review.profile_photo_url ? (
                      <Image src={review.profile_photo_url} alt={review.author_name} fill sizes="48px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-bold">{review.author_name.charAt(0)}</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{review.author_name}</h3>
                    <div className="flex text-amber-400 text-sm">
                      {"★".repeat(review.rating)}
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-slate-600 self-start text-right shrink-0">
                    {review.relative_time_description}
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed italic font-medium line-clamp-4 flex-grow">
                  &quot;{review.text}&quot;
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200/60 text-right">
                  <a href={review.author_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline font-medium">
                    {dict.viewOnGoogle}
                  </a>
                </div>
              </div>
            ))
          ) : (
            fallbackReviews.map((review: any, idx: number) => (
              <div key={idx} className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full ${review.color} text-white flex items-center justify-center font-bold text-lg shrink-0`}>
                    {review.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{review.name}</h3>
                    <div className="flex text-amber-400 text-sm">
                      {"★".repeat(review.rating)}
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-slate-600 self-start">
                    {review.date}
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed italic font-medium">
                  &quot;{review.text}&quot;
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <a 
            href="https://share.google/z1cf91AM5md8vvva2" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-amber-700 bg-slate-100 hover:bg-amber-500/10 py-2.5 px-6 rounded-full border border-slate-200 hover:border-amber-400/50 transition-all duration-300 group shadow-sm hover:shadow"
          >
            <span className="text-blue-500 text-lg group-hover:scale-110 transition-transform">G</span> 
            <span>{dict.googleNote}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
