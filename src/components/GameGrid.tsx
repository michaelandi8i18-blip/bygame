'use client';

import { Game } from '@/types';
import GameCard from './GameCard';

interface GameGridProps {
  games: Game[];
  onTopUp: (game: Game) => void;
}

export default function GameGrid({ games, onTopUp }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-6xl mb-4 block">🎮</span>
        <h3 className="text-lg font-bold text-pink-400 mb-2">Game tidak ditemukan</h3>
        <p className="text-sm text-pink-300">Coba kata kunci lain atau pilih kategori berbeda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onTopUp={onTopUp} />
      ))}
    </div>
  );
}
