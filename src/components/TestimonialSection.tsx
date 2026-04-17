'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function TestimonialSection() {
  const reviews = useStore((s) => s.getPublicReviews());
  const [startIndex, setStartIndex] = useState(0);

  // Show 3 reviews at a time on desktop, 1 on mobile
  const itemsPerPage = typeof window !== 'undefined' && window.innerWidth >= 768 ? 3 : 1;
  const maxIndex = Math.max(0, reviews.length - itemsPerPage);
  const visibleReviews = reviews.slice(startIndex, startIndex + itemsPerPage);

  const next = () => setStartIndex((prev) => Math.min(prev + itemsPerPage, maxIndex));
  const prev = () => setStartIndex((prev) => Math.max(prev - itemsPerPage, 0));

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-4xl mb-3 block">💬</span>
          <h2 className="text-2xl sm:text-3xl font-black text-pink-800 mb-2">
            Apa Kata Mereka?
          </h2>
          <p className="text-pink-400 font-medium">
            Testimonial dari para gamer yang sudah top up di BYgame
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-pink-100">
            <span className="text-5xl mb-3 block">📝</span>
            <h3 className="font-bold text-pink-500 mb-1">Belum ada review</h3>
            <p className="text-sm text-pink-300">Jadilah yang pertama memberi review!</p>
          </div>
        ) : (
          <>
            {/* Reviews carousel */}
            <div className="relative">
              {/* Left arrow */}
              {startIndex > 0 && (
                <button
                  onClick={prev}
                  className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center text-pink-500 hover:bg-pink-50 hover:scale-110 transition-all z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Right arrow */}
              {startIndex < maxIndex && (
                <button
                  onClick={next}
                  className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center text-pink-500 hover:bg-pink-50 hover:scale-110 transition-all z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {visibleReviews.map((review, idx) => (
                  <ReviewCard key={review.id} review={review} delay={idx * 0.1} />
                ))}
              </div>
            </div>

            {/* Dots for mobile */}
            <div className="flex justify-center gap-2 mt-6 md:hidden">
              {Array.from({ length: reviews.length }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStartIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === startIndex ? 'bg-pink-500 w-6' : 'bg-pink-200'
                  }`}
                />
              ))}
            </div>

            {/* Dots for desktop */}
            <div className="hidden md:flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.ceil(reviews.length / 3) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStartIndex(i * 3)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i * 3 === startIndex ? 'bg-pink-500 w-6' : 'bg-pink-200'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review, delay }: { review: import('@/store/useStore').Review; delay: number }) {
  const date = new Date(review.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Quote icon */}
      <Quote className="absolute top-3 right-3 w-8 h-8 text-pink-100" />

      {/* User info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center text-lg">
          {review.userAvatar}
        </div>
        <div>
          <p className="font-bold text-pink-800 text-sm">{review.userName}</p>
          <p className="text-xs text-pink-400">{date}</p>
        </div>
      </div>

      {/* Game */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">{review.gameImage}</span>
        <span className="text-xs text-pink-400 font-medium">{review.gameName}</span>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-pink-200'}`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-sm text-pink-600 leading-relaxed font-medium">&ldquo;{review.comment}&rdquo;</p>
    </div>
  );
}
