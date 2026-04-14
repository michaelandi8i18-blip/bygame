'use client';

import { Sparkles, TrendingUp, Headphones, Shield } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-400 via-rose-400 to-purple-500 py-16 sm:py-24 lg:py-32">
      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-10 left-[10%] text-3xl sm:text-5xl animate-float opacity-70">⭐</span>
        <span className="absolute top-20 right-[15%] text-2xl sm:text-4xl animate-float [animation-delay:0.5s] opacity-60">💕</span>
        <span className="absolute bottom-20 left-[20%] text-2xl sm:text-3xl animate-float [animation-delay:1s] opacity-50">🎮</span>
        <span className="absolute top-32 left-[60%] text-2xl sm:text-4xl animate-float [animation-delay:1.5s] opacity-60">✨</span>
        <span className="absolute bottom-10 right-[25%] text-3xl sm:text-4xl animate-float [animation-delay:0.8s] opacity-50">🌟</span>
        <span className="absolute top-16 left-[40%] text-xl sm:text-3xl animate-twinkle opacity-40">💎</span>
        <span className="absolute bottom-32 right-[40%] text-2xl sm:text-3xl animate-twinkle [animation-delay:0.7s] opacity-40">🎯</span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-6 animate-slide-up">
          <Sparkles className="w-4 h-4" />
          <span>Platform Top Up Game #1 di Indonesia</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 animate-slide-up [animation-delay:0.1s]">
          Top Up Game
          <br />
          <span className="text-yellow-200">Favorit Kamu!</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-medium animate-slide-up [animation-delay:0.2s]">
          Harga termurah, proses instan, dan aman 100%
        </p>

        {/* CTA Button */}
        <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-pink-600 font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 animate-bounce-slow">
          <Sparkles className="w-5 h-5" />
          Mulai Top Up
        </button>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-10 animate-slide-up [animation-delay:0.3s]">
          <TrustBadge icon={<TrendingUp className="w-4 h-4" />} value="10M+" label="Transaksi" />
          <TrustBadge icon={<Sparkles className="w-4 h-4" />} value="500+" label="Game" />
          <TrustBadge icon={<Headphones className="w-4 h-4" />} value="24/7" label="Support" />
          <TrustBadge icon={<Shield className="w-4 h-4" />} value="100%" label="Aman" />
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="#FFF1F5"
          />
        </svg>
      </div>
    </section>
  );
}

function TrustBadge({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white">
      {icon}
      <span className="font-bold text-sm">{value}</span>
      <span className="text-white/80 text-sm">{label}</span>
    </div>
  );
}
