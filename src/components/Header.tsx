'use client';

import { useState } from 'react';
import { Search, X, Menu, ShoppingCart, Sparkles, User, LogOut, MessageSquare, Crown, History, Gift } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface HeaderProps {
  onSearchOpen: () => void;
  cartCount: number;
  onOpenHistory: () => void;
  onOpenMessages: () => void;
  onOpenLogin: () => void;
  onOpenAdmin: () => void;
  onOpenRedeem: () => void;
  onOpenHelp: () => void;
}

export default function Header({
  onSearchOpen,
  cartCount,
  onOpenHistory,
  onOpenMessages,
  onOpenLogin,
  onOpenAdmin,
  onOpenRedeem,
  onOpenHelp,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, logout, getUnreadCount } = useStore();
  const unreadCount = getUnreadCount();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-pink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => useStore.getState().setCurrentPage('home')} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              BYgame
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Home', action: () => useStore.getState().setCurrentPage('home'), icon: '🏠' },
              { label: 'Redeem', action: onOpenRedeem, icon: '🎁' },
              { label: 'Testimoni', action: () => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }), icon: '💬' },
              { label: 'Bantuan', action: onOpenHelp, icon: '🤝' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="px-4 py-2 rounded-full text-sm font-semibold text-pink-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onSearchOpen}
              className="p-2.5 rounded-full text-pink-600 hover:bg-pink-50 transition-all duration-200"
              aria-label="Cari"
            >
              <Search className="w-5 h-5" />
            </button>

            {isLoggedIn ? (
              <>
                {/* Messages */}
                <button
                  onClick={onOpenMessages}
                  className="relative p-2.5 rounded-full text-pink-600 hover:bg-pink-50 transition-all duration-200"
                  aria-label="Pesan"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-slow">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* History / Cart */}
                <button
                  onClick={onOpenHistory}
                  className="relative p-2.5 rounded-full text-pink-600 hover:bg-pink-50 transition-all duration-200"
                  aria-label="Riwayat"
                >
                  <History className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-slow">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Admin access */}
                {user?.role === 'admin' && (
                  <button
                    onClick={onOpenAdmin}
                    className="p-2.5 rounded-full text-amber-600 hover:bg-amber-50 transition-all duration-200"
                    aria-label="Admin"
                  >
                    <Crown className="w-5 h-5" />
                  </button>
                )}

                {/* User menu */}
                <div className="hidden sm:flex items-center gap-2 ml-1 pl-2 border-l border-pink-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center text-sm">
                    {user?.avatar}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold text-pink-800 leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-pink-400">Rp {user?.balance || 0}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-full text-pink-400 hover:bg-pink-50 hover:text-red-500 transition-all"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm rounded-full hover:from-pink-600 hover:to-rose-600 active:scale-95 transition-all shadow-md shadow-pink-300/30"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Masuk</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full text-pink-600 hover:bg-pink-50 transition-all duration-200"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-pink-100 animate-slide-up">
          <nav className="flex flex-col p-4 gap-1">
            {isLoggedIn ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-pink-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center text-lg">
                    {user?.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-pink-800 text-sm">{user?.name}</p>
                    <p className="text-xs text-pink-400">💰 Saldo: Rp {user?.balance || 0}</p>
                  </div>
                  <button onClick={logout} className="p-2 text-pink-400 hover:text-red-500">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                <MobileNavItem icon="🏠" label="Home" onClick={() => { useStore.getState().setCurrentPage('home'); setMobileMenuOpen(false); }} />
                <MobileNavItem icon="🎁" label="Redeem" onClick={() => { onOpenRedeem(); setMobileMenuOpen(false); }} />
                <MobileNavItem icon="📋" label="Riwayat Pembelian" onClick={() => { onOpenHistory(); setMobileMenuOpen(false); }} badge={cartCount > 0 ? String(cartCount) : undefined} />
                <MobileNavItem icon="💬" label="Pesan" onClick={() => { onOpenMessages(); setMobileMenuOpen(false); }} badge={unreadCount > 0 ? String(unreadCount) : undefined} />
                {user?.role === 'admin' && (
                  <MobileNavItem icon="👑" label="Admin Panel" onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }} />
                )}
              </>
            ) : (
              <>
                <MobileNavItem icon="🏠" label="Home" onClick={() => { useStore.getState().setCurrentPage('home'); setMobileMenuOpen(false); }} />
                <MobileNavItem icon="🎁" label="Redeem" onClick={() => { onOpenRedeem(); setMobileMenuOpen(false); }} />
                <MobileNavItem icon="🤝" label="Bantuan" onClick={() => { onOpenHelp(); setMobileMenuOpen(false); }} />
                <div className="mt-3 pt-3 border-t border-pink-100">
                  <button
                    onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl"
                  >
                    <User className="w-4 h-4" />
                    Masuk / Daftar
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function MobileNavItem({ icon, label, onClick, badge }: { icon: string; label: string; onClick: () => void; badge?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-pink-700 hover:bg-pink-50 font-semibold transition-all duration-200 relative"
    >
      <span>{icon}</span>
      <span>{label}</span>
      {badge && (
        <span className="ml-auto w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}
