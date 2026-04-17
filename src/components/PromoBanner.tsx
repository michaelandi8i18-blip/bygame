'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { promos } from '@/data/games';

export default function PromoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % promos.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + promos.length) % promos.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-pink-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">🏷️</span>
          Promo Spesial
        </h2>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {promos.map((promo) => (
                <div
                  key={promo.id}
                  className={`w-full flex-shrink-0 bg-gradient-to-r ${promo.gradient} rounded-2xl p-6 sm:p-8 text-white min-h-[160px] sm:min-h-[180px] flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{promo.emoji}</span>
                      <h3 className="text-lg sm:text-xl font-extrabold">{promo.title}</h3>
                    </div>
                    <p className="text-white/90 text-sm sm:text-base font-medium mb-4">
                      {promo.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-bold text-lg">
                        {promo.discount}
                      </div>
                      <div className="px-4 py-2 bg-white rounded-full text-pink-600 font-bold text-sm hidden sm:block">
                        Kode: {promo.code}
                      </div>
                    </div>
                    <button className="px-5 py-2.5 bg-white text-pink-600 font-bold text-sm rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg">
                      Klaim
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-pink-500 hover:bg-white hover:scale-110 transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-pink-500 hover:bg-white hover:scale-110 transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {promos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-pink-500 w-8'
                    : 'bg-pink-200 hover:bg-pink-300'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
