'use client';

import { Zap, Shield, Gift, Heart } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-7 h-7" />,
    emoji: '⚡',
    title: 'Proses Instan',
    description: 'Top up langsung masuk ke akun game kamu dalam hitungan detik, tanpa perlu menunggu lama. Sistem kami terhubung langsung ke server game.',
  },
  {
    icon: <Shield className="w-7 h-7" />,
    emoji: '🔒',
    title: 'Aman 100%',
    description: 'Transaksi dilindungi enkripsi SSL dan sistem keamanan berlapis. Data pribadi kamu tersimpan dengan aman dan tidak akan dibagikan.',
  },
  {
    icon: <Gift className="w-7 h-7" />,
    emoji: '💰',
    title: 'Harga Terbaik',
    description: 'Dapatkan harga termurah di pasaran! Kami menjamin harga kompetitif dengan bonus cashback dan promo menarik setiap hari.',
  },
  {
    icon: <Heart className="w-7 h-7" />,
    emoji: '🎁',
    title: 'Bonus Cashback',
    description: 'Nikmati cashback hingga 15% untuk setiap transaksi dan kumpulkan poin reward yang bisa ditukar dengan voucher game gratis.',
  },
];

export default function FeatureSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-3xl sm:text-4xl mb-3 block">🌟</span>
          <h2 className="text-2xl sm:text-3xl font-black text-pink-800 mb-3">
            Kenapa Pilih <span className="text-pink-500">BYgame</span>?
          </h2>
          <p className="text-pink-400 max-w-xl mx-auto font-medium">
            Platform top up game terpercaya dengan jutaan pengguna puas di seluruh Indonesia
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-gradient-to-br from-pink-50 to-white rounded-2xl p-6 border border-pink-100 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-200/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-pink-300/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="font-extrabold text-pink-800 text-lg mb-2">
                {feature.emoji} {feature.title}
              </h3>
              <p className="text-pink-400 text-sm leading-relaxed font-medium">
                {feature.description}
              </p>

              {/* Decorative corner */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-12 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500 rounded-2xl p-6 sm:p-8 flex flex-wrap justify-around items-center gap-6 text-white">
          {[
            { value: '10M+', label: 'Transaksi Berhasil' },
            { value: '500+', label: 'Game Tersedia' },
            { value: '4.9★', label: 'Rating Pengguna' },
            { value: '24/7', label: 'Customer Support' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-black">{stat.value}</p>
              <p className="text-white/80 text-sm font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
