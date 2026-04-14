'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { popularSearches } from '@/data/games';

interface GameSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function GameSearch({
  searchQuery,
  onSearchChange,
  isOpen,
  onClose,
}: GameSearchProps) {
  const [isFocused, setIsFocused] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-32 px-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Search input */}
        <div className="flex items-center gap-3 p-4 border-b border-pink-100">
          <Search
            className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
              isFocused ? 'text-pink-500 animate-pulse' : 'text-pink-300'
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Cari game favorit kamu..."
            className="flex-1 text-lg font-medium text-pink-900 placeholder:text-pink-300 outline-none bg-transparent"
            autoFocus
          />
          <button
            onClick={() => {
              onSearchChange('');
              onClose();
            }}
            className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-sm font-semibold hover:bg-pink-200 transition-colors"
          >
            Tutup
          </button>
        </div>

        {/* Popular searches */}
        {searchQuery === '' && (
          <div className="p-4">
            <p className="text-sm font-semibold text-pink-400 mb-3">🔍 Pencarian Populer</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => onSearchChange(term)}
                  className="px-4 py-2 rounded-full bg-pink-50 text-pink-600 text-sm font-medium hover:bg-pink-100 hover:scale-105 transition-all duration-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search results info */}
        {searchQuery !== '' && (
          <div className="p-4 text-center">
            <p className="text-sm text-pink-400">
              Menampilkan hasil untuk &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
