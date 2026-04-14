'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Star, Wallet } from 'lucide-react';

export default function FloatingRedeemBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show banner after 1.5s delay on first visit
    const dismissed = sessionStorage.getItem('redeem-banner-dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => setIsDismissed(true), 400);
    sessionStorage.setItem('redeem-banner-dismissed', 'true');
  };

  const handleScrollToRedeem = () => {
    const redeemSection = document.getElementById('redeem-section');
    if (redeemSection) {
      redeemSection.scrollIntoView({ behavior: 'smooth' });
    }
    handleDismiss();
  };

  if (isDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-400 ${
        isVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Banner Card */}
      <div
        className={`relative w-full max-w-md transform transition-all duration-500 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-75 translate-y-8'
        }`}
      >
        <div className="relative bg-white rounded-3xl shadow-2xl shadow-pink-300/30 overflow-hidden">
          {/* Top decoration wave */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-pink-50 text-pink-400 hover:bg-pink-100 hover:text-pink-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-8 text-center">
            {/* Gift icon with animation */}
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full animate-pulse" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-pink-400 via-rose-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
                <Gift className="w-8 h-8 text-white" />
              </div>
              {/* Sparkle decorations */}
              <span className="absolute -top-1 -right-1 text-lg animate-twinkle">✨</span>
              <span className="absolute -bottom-1 -left-1 text-sm animate-twinkle [animation-delay:0.5s]">⭐</span>
            </div>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 mb-2">
              Free Redeem!
            </h3>
            <p className="text-pink-300 text-xs font-bold uppercase tracking-wider mb-4">
              Bonus Spesial untuk Kamu
            </p>

            {/* Info cards */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-3.5 text-left border border-pink-100">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-300 to-amber-500 rounded-xl flex items-center justify-center shadow-sm">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-pink-800 text-sm font-bold">Review Setelah Pembelian</p>
                  <p className="text-pink-400 text-xs font-medium">Beri rating & catatan untuk setiap pembelian</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3.5 text-left border border-green-100">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-sm">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-pink-800 text-sm font-bold">
                    Bonus Saldo <span className="text-emerald-500">Rp 100</span> / Review
                  </p>
                  <p className="text-pink-400 text-xs font-medium">Akumulasi bonus untuk redeem item game gratis!</p>
                </div>
              </div>
            </div>

            {/* Steps mini */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 bg-pink-100 rounded-full text-xs font-black text-pink-500 flex items-center justify-center">1</span>
                <span className="text-xs font-semibold text-pink-400 hidden sm:inline">Top Up</span>
              </div>
              <div className="w-6 h-0.5 bg-pink-200" />
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 bg-pink-100 rounded-full text-xs font-black text-pink-500 flex items-center justify-center">2</span>
                <span className="text-xs font-semibold text-pink-400 hidden sm:inline">Review</span>
              </div>
              <div className="w-6 h-0.5 bg-pink-200" />
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 bg-pink-100 rounded-full text-xs font-black text-pink-500 flex items-center justify-center">3</span>
                <span className="text-xs font-semibold text-pink-400 hidden sm:inline">Redeem</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleScrollToRedeem}
              className="w-full py-3.5 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-pink-300/40 hover:shadow-xl hover:shadow-pink-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" />
              <span>Lihat Menu Redeem</span>
            </button>

            <p className="text-pink-300 text-[10px] font-medium mt-3">
              *Bonus berlaku untuk setiap review setelah pembelian berhasil
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
