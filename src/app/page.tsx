'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import GameSearch from '@/components/GameSearch';
import CategoryTabs from '@/components/CategoryTabs';
import GameGrid from '@/components/GameGrid';
import PromoBanner from '@/components/PromoBanner';
import FeatureSection from '@/components/FeatureSection';
import TopupModal from '@/components/TopupModal';
import Footer from '@/components/Footer';
import FloatingDecorations from '@/components/FloatingDecorations';
import { games } from '@/data/games';
import { Game, Category } from '@/types';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [cartCount] = useState(0);

  // Filter games based on search and category
  const filteredGames = useMemo(() => {
    let result = games;

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter((game) => game.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (game) =>
          game.name.toLowerCase().includes(query) ||
          game.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          game.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchQuery, activeCategory]);

  const handleTopUp = (game: Game) => {
    setSelectedGame(game);
    setIsTopupOpen(true);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-[#FFF1F5]">
      {/* Floating decorations */}
      <FloatingDecorations />

      {/* Header */}
      <Header
        onSearchOpen={() => setIsSearchOpen(true)}
        cartCount={cartCount}
      />

      {/* Search overlay */}
      <GameSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Main content */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Game catalog section */}
        <section className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section title */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-pink-800 flex items-center gap-2">
                <span className="text-2xl">🎮</span>
                Daftar Game
              </h2>
              <span className="text-sm text-pink-400 font-semibold">
                {filteredGames.length} game ditemukan
              </span>
            </div>

            {/* Inline search bar */}
            <div className="mb-4 relative">
              <div className="flex items-center gap-3 bg-white rounded-2xl border-2 border-pink-200 px-4 py-3 shadow-sm focus-within:border-pink-400 focus-within:shadow-md focus-within:shadow-pink-200/30 transition-all duration-200">
                <span className="text-lg">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Cari game favorit kamu..."
                  className="flex-1 text-pink-900 placeholder:text-pink-300 outline-none bg-transparent font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-3 py-1 rounded-full bg-pink-100 text-pink-500 text-xs font-bold hover:bg-pink-200 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Category tabs */}
            <div className="mb-6">
              <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {/* Game grid */}
            <GameGrid games={filteredGames} onTopUp={handleTopUp} />
          </div>
        </section>

        {/* Promo Banner */}
        <PromoBanner />

        {/* Feature Section */}
        <FeatureSection />

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-br from-pink-400 via-rose-400 to-purple-500 rounded-3xl p-8 sm:p-12 text-center text-white overflow-hidden">
              {/* Decorative */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <span className="absolute top-4 left-[10%] text-2xl animate-float opacity-50">⭐</span>
                <span className="absolute top-8 right-[15%] text-xl animate-float [animation-delay:0.5s] opacity-40">💕</span>
                <span className="absolute bottom-8 left-[20%] text-xl animate-float [animation-delay:1s] opacity-40">🎮</span>
                <span className="absolute bottom-4 right-[30%] text-2xl animate-twinkle opacity-30">✨</span>
              </div>

              <div className="relative z-10">
                <span className="text-4xl sm:text-5xl mb-4 block">🎮</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4">
                  Siap Top Up?
                </h2>
                <p className="text-white/90 text-base sm:text-lg max-w-lg mx-auto mb-8 font-medium">
                  Bergabung dengan jutaan gamer Indonesia dan nikmati pengalaman top up tercepat dan termurah!
                </p>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-pink-600 font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 animate-bounce-slow"
                >
                  <span>Mulai Sekarang</span>
                  <span>🚀</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Topup Modal */}
      <TopupModal
        game={selectedGame}
        isOpen={isTopupOpen}
        onClose={() => setIsTopupOpen(false)}
      />
    </div>
  );
}
