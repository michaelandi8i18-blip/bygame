'use client';

import { useState } from 'react';
import { Search, X, Menu, ShoppingCart, Sparkles } from 'lucide-react';

interface HeaderProps {
  onSearchOpen: () => void;
  cartCount: number;
}

export default function Header({ onSearchOpen, cartCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-pink-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              BYgame
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Home', icon: '🏠' },
              { label: 'Games', icon: '🎮' },
              { label: 'Promo', icon: '🏷️' },
              { label: 'Bantuan', icon: '💬' },
            ].map((item) => (
              <button
                key={item.label}
                className="px-4 py-2 rounded-full text-sm font-semibold text-pink-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSearchOpen}
              className="p-2.5 rounded-full text-pink-600 hover:bg-pink-50 transition-all duration-200"
              aria-label="Cari"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              className="relative p-2.5 rounded-full text-pink-600 hover:bg-pink-50 transition-all duration-200"
              aria-label="Keranjang"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-slow">
                  {cartCount}
                </span>
              )}
            </button>

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
            {[
              { label: 'Home', icon: '🏠' },
              { label: 'Games', icon: '🎮' },
              { label: 'Promo', icon: '🏷️' },
              { label: 'Bantuan', icon: '💬' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-pink-700 hover:bg-pink-50 font-semibold transition-all duration-200"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
