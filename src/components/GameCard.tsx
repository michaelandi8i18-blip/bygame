'use client';

import { Game } from '@/types';
import { Zap } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onTopUp: (game: Game) => void;
}

export default function GameCard({ game, onTopUp }: GameCardProps) {
  const minPrice = Math.min(...game.items.map((item) => item.price));

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-200/40 transition-all duration-300 cursor-pointer">
      {/* Popular badge */}
      {game.isPopular && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold shadow-md">
          <Zap className="w-3 h-3" />
          <span>Populer</span>
        </div>
      )}

      {/* Game image area */}
      <div className="relative h-36 sm:h-40 bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <span className="text-5xl sm:text-6xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          {game.image}
        </span>

        {/* Category tag */}
        <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm text-pink-600 text-xs font-semibold capitalize">
          {game.category}
        </span>
      </div>

      {/* Card content */}
      <div className="p-4">
        <h3 className="font-bold text-pink-900 text-sm sm:text-base leading-tight mb-1 line-clamp-1">
          {game.name}
        </h3>
        <p className="text-xs text-pink-400 mb-3 line-clamp-1">{game.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-pink-400 font-medium">Mulai dari</p>
            <p className="text-base sm:text-lg font-extrabold text-pink-600">
              {formatPrice(minPrice)}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTopUp(game);
            }}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all duration-200 shadow-md shadow-pink-300/30"
          >
            Top Up
          </button>
        </div>
      </div>
    </div>
  );
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
