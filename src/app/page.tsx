'use client';

import { useState, useMemo, useRef } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import GameSearch from '@/components/GameSearch';
import CategoryTabs from '@/components/CategoryTabs';
import GameGrid from '@/components/GameGrid';
import FloatingRedeemBanner from '@/components/FloatingRedeemBanner';
import FeatureSection from '@/components/FeatureSection';
import TopupModal from '@/components/TopupModal';
import TestimonialSection from '@/components/TestimonialSection';
import RedeemSection from '@/components/RedeemSection';
import Footer from '@/components/Footer';
import FloatingDecorations from '@/components/FloatingDecorations';
import LoginModal from '@/components/LoginModal';
import HistoryPage from '@/components/HistoryPage';
import MessagePanel from '@/components/MessagePanel';
import AdminPanel from '@/components/AdminPanel';
import HelpPage from '@/components/HelpPage';
import { games } from '@/data/games';
import { Game, Category } from '@/types';

// We need to import the store types - but the actual store is from '@/store/useStore'
// The 'useStore' re-export from types is just for type compatibility
import { useStore as useZustandStore } from '@/store/useStore';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const redeemRef = useRef<HTMLDivElement>(null);

  const { isLoggedIn, purchases, user } = useZustandStore();

  // Filter games based on search and category
  const filteredGames = useMemo(() => {
    let result = games;
    if (activeCategory !== 'all') {
      result = result.filter((game) => game.category === activeCategory);
    }
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

  const userPurchaseCount = user ? purchases.filter((p) => p.userId === user.id).length : 0;

  const handleTopUp = (game: Game) => {
    setSelectedGame(game);
    setIsTopupOpen(true);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const scrollToRedeem = () => {
    redeemRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF1F5]">
      {/* Floating decorations */}
      <FloatingDecorations />

      {/* Floating Redeem Banner - appears on first visit */}
      <FloatingRedeemBanner />

      {/* Header */}
      <Header
        onSearchOpen={() => setIsSearchOpen(true)}
        cartCount={userPurchaseCount}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenMessages={() => setIsMessagesOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenRedeem={scrollToRedeem}
        onOpenHelp={() => setIsHelpOpen(true)}
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

        {/* Feature Section */}
        <FeatureSection />

        {/* Testimonials */}
        <div id="testimonials">
          <TestimonialSection />
        </div>

        {/* Redeem Section */}
        <div ref={redeemRef} id="redeem-section">
          <RedeemSection />
        </div>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-br from-pink-400 via-rose-400 to-purple-500 rounded-3xl p-8 sm:p-12 text-center text-white overflow-hidden">
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
                <p className="text-white/90 text-base sm:text-lg max-w-lg mx-auto mb-4 font-medium">
                  Bergabung dengan jutaan gamer Indonesia dan nikmati pengalaman top up tercepat dan termurah!
                </p>
                {!isLoggedIn && (
                  <p className="text-white/70 text-sm mb-6">
                    Login sekarang untuk menyimpan riwayat pembelian & dapatkan saldo bonus review!
                  </p>
                )}
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      setIsLoginOpen(true);
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-pink-600 font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 animate-bounce-slow"
                >
                  <span>{isLoggedIn ? 'Mulai Top Up' : 'Daftar & Mulai'}</span>
                  <span>🚀</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Pages */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <TopupModal
        game={selectedGame}
        isOpen={isTopupOpen}
        onClose={() => setIsTopupOpen(false)}
      />

      <HistoryPage isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <MessagePanel isOpen={isMessagesOpen} onClose={() => setIsMessagesOpen(false)} />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      <HelpPage isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
