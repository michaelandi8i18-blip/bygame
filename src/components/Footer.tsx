'use client';

import { Sparkles } from 'lucide-react';

const footerLinks = {
  games: [
    { label: 'Mobile Legends', href: '#' },
    { label: 'Free Fire', href: '#' },
    { label: 'PUBG Mobile', href: '#' },
    { label: 'Genshin Impact', href: '#' },
    { label: 'Valorant', href: '#' },
    { label: 'Roblox', href: '#' },
  ],
  payment: [
    { label: 'GoPay', href: '#' },
    { label: 'OVO', href: '#' },
    { label: 'Dana', href: '#' },
    { label: 'QRIS', href: '#' },
    { label: 'Transfer Bank', href: '#' },
    { label: 'Kartu Kredit', href: '#' },
  ],
  bantuan: [
    { label: 'FAQ', href: '#' },
    { label: 'Hubungi Kami', href: '#' },
    { label: 'Cara Top Up', href: '#' },
    { label: 'Kebijakan Privasi', href: '#' },
    { label: 'Syarat & Ketentuan', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-pink-600 via-rose-600 to-pink-700 text-white">
      {/* Wave decoration */}
      <div className="absolute -top-1 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0,20L60,24C120,28,240,36,360,38C480,40,600,36,720,30C840,24,960,16,1080,18C1200,20,1320,32,1380,38L1440,44L1440,0L0,0Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black">BYgame</span>
            </div>
            <p className="text-pink-100 text-sm leading-relaxed max-w-sm mb-4">
              Platform top up game terpercaya di Indonesia. Dengan harga termurah, proses instan, dan pelayanan 24/7, BYgame siap memenuhi kebutuhan gaming kamu!
            </p>
            {/* Social media */}
            <div className="flex gap-3">
              {['📘', '📸', '🐦', '💬'].map((icon, i) => (
                <button
                  key={i}
                  className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/25 hover:scale-110 transition-all duration-200"
                  aria-label="Social media"
                >
                  <span className="text-lg">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key}>
              <h3 className="font-bold text-lg mb-4 capitalize">{key === 'games' ? '🎮 Game Populer' : key === 'payment' ? '💳 Pembayaran' : '💬 Bantuan'}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-pink-100 hover:text-white text-sm font-medium transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-pink-500/30 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-pink-200 text-sm font-medium">
              &copy; 2026 BYgame. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-pink-200 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                System Online
              </span>
              <span>|</span>
              <span>v2.5.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
