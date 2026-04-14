'use client';

import { useState } from 'react';
import { Gift, Search, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { games } from '@/data/games';
import { formatPrice } from '@/components/GameCard';

export default function RedeemSection() {
  const { user, isLoggedIn, addRedeemRequest, balance } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameId, setSelectedGameId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [userGameId, setUserGameId] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredGames = games.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedGame = games.find((g) => g.id === selectedGameId);
  const selectedItem = selectedGame?.items.find((i) => i.id === selectedItemId);

  const handleSubmit = async () => {
    if (!selectedGame || !selectedItem || !userGameId.trim() || !email.trim()) return;
    if (!user) return;
    if (balance < selectedItem.price) {
      setErrorMsg('Saldo bonus tidak cukup!');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    await new Promise((r) => setTimeout(r, 1000));

    const success = addRedeemRequest({
      userId: user.id,
      userName: user.name,
      userEmail: email,
      gameId: selectedGame.id,
      gameName: selectedGame.name,
      gameImage: selectedGame.image,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      itemPrice: selectedItem.price,
      userGameId,
    });

    setIsSubmitting(false);

    if (success) {
      setSuccessMsg('Permintaan redeem berhasil dikirim! Tunggu konfirmasi admin di menu Pesan.');
      setSelectedGameId('');
      setSelectedItemId('');
      setUserGameId('');
      setEmail('');
      setShowForm(false);
      setTimeout(() => setSuccessMsg(''), 5000);
    } else {
      setErrorMsg('Gagal mengirim permintaan. Pastikan saldo mencukupi.');
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl mb-3 block">🎁</span>
          <h2 className="text-2xl sm:text-3xl font-black text-pink-800 mb-2">
            Redeem Item
          </h2>
          <p className="text-pink-400 font-medium">
            Tukarkan saldo bonus kamu dengan item game favorit!
          </p>
          {isLoggedIn && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-pink-50 to-rose-50 rounded-full border border-pink-200">
              <span>💰</span>
              <span className="font-bold text-pink-700">Saldo Bonus: Rp {user?.balance || 0}</span>
            </div>
          )}
        </div>

        {!isLoggedIn ? (
          <div className="text-center py-12 bg-pink-50 rounded-2xl border border-pink-100">
            <span className="text-4xl mb-3 block">🔐</span>
            <h3 className="font-bold text-pink-600 mb-2">Login untuk Redeem</h3>
            <p className="text-sm text-pink-400">Masuk ke akun kamu untuk menukar saldo bonus</p>
          </div>
        ) : (
          <>
            {/* Success/Error messages */}
            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 font-medium text-sm flex items-center gap-2">
                <span>✅</span> {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium text-sm flex items-center gap-2">
                <span>❌</span> {errorMsg}
              </div>
            )}

            {!showForm ? (
              <div>
                {/* Game selection grid */}
                <div className="mb-4 relative">
                  <div className="flex items-center gap-3 bg-white rounded-xl border-2 border-pink-200 px-4 py-3 focus-within:border-pink-400 transition-all">
                    <Search className="w-5 h-5 text-pink-300" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari game untuk redeem..."
                      className="flex-1 text-pink-900 placeholder:text-pink-300 outline-none bg-transparent font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {filteredGames.map((game) => {
                    const minPrice = Math.min(...game.items.map((i) => i.price));
                    return (
                      <button
                        key={game.id}
                        onClick={() => {
                          setSelectedGameId(game.id);
                          setShowForm(true);
                        }}
                        className="bg-gradient-to-br from-pink-50 to-white rounded-xl border border-pink-100 p-3 text-left hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-200/30 transition-all duration-200"
                      >
                        <span className="text-3xl block mb-1">{game.image}</span>
                        <p className="font-bold text-pink-900 text-xs leading-tight line-clamp-1">{game.name}</p>
                        <p className="text-[10px] text-pink-400 mt-0.5">Mulai {formatPrice(minPrice)}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Redeem form */
              <div className="max-w-lg mx-auto bg-white rounded-2xl border border-pink-100 p-6 shadow-lg animate-slide-up">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedGameId('');
                    setSelectedItemId('');
                  }}
                  className="text-sm text-pink-500 font-semibold mb-4 hover:text-pink-600"
                >
                  ← Kembali ke daftar game
                </button>

                {selectedGame && (
                  <div className="space-y-5">
                    {/* Selected game info */}
                    <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl">
                      <span className="text-3xl">{selectedGame.image}</span>
                      <div>
                        <p className="font-bold text-pink-800">{selectedGame.name}</p>
                        <p className="text-xs text-pink-400">Pilih item yang ingin di-redeem</p>
                      </div>
                    </div>

                    {/* Item selection */}
                    <div>
                      <label className="block text-sm font-semibold text-pink-700 mb-2">Pilih Item</label>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {selectedGame.items.map((item) => {
                          const isSelected = selectedItemId === item.id;
                          const canAfford = balance >= item.price;
                          return (
                            <button
                              key={item.id}
                              onClick={() => canAfford && setSelectedItemId(item.id)}
                              disabled={!canAfford}
                              className={`p-3 rounded-xl border-2 text-left transition-all text-xs ${
                                isSelected
                                  ? 'border-pink-500 bg-pink-50 shadow-md'
                                  : canAfford
                                    ? 'border-pink-100 bg-white hover:border-pink-300'
                                    : 'border-pink-100 bg-pink-50/50 opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <p className="font-bold text-pink-800">{item.name}</p>
                              <p className="font-extrabold text-pink-600 mt-1">{formatPrice(item.price)}</p>
                              {!canAfford && (
                                <p className="text-[10px] text-red-400 mt-0.5">Saldo kurang</p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* User Game ID */}
                    <div>
                      <label className="block text-sm font-semibold text-pink-700 mb-1.5">ID Game Kamu *</label>
                      <input
                        type="text"
                        value={userGameId}
                        onChange={(e) => setUserGameId(e.target.value)}
                        placeholder="Masukkan ID game kamu"
                        className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 bg-white text-pink-900 placeholder:text-pink-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all text-sm font-medium"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-pink-700 mb-1.5">Email untuk Hubungi Admin *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh@email.com"
                        className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 bg-white text-pink-900 placeholder:text-pink-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all text-sm font-medium"
                      />
                    </div>

                    {/* Summary */}
                    {selectedItem && (
                      <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-pink-500">Item</span>
                          <span className="font-semibold text-pink-700">{selectedItem.name}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-pink-500">Saldo kamu</span>
                          <span className="font-semibold text-pink-700">Rp {balance}</span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-pink-200 pt-2">
                          <span className="font-bold text-pink-700">Biaya redeem</span>
                          <span className="font-extrabold text-pink-600">{formatPrice(selectedItem.price)}</span>
                        </div>
                        <p className="text-xs text-pink-400 mt-2">* Permintaan akan ditinjau oleh admin</p>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedItem || !userGameId.trim() || !email.trim() || isSubmitting || (selectedItem ? balance < selectedItem.price : false)}
                      className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-300/30 hover:from-purple-600 hover:to-pink-600 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Gift className="w-5 h-5" />
                          Kirim Permintaan Redeem
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* User's redeem requests */}
            <div className="mt-8">
              <h3 className="font-bold text-pink-800 text-lg mb-4">📋 Riwayat Redeem</h3>
              <RedeemHistory />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function RedeemHistory() {
  const { getUserRedeemRequests } = useStore();
  const requests = getUserRedeemRequests();

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 bg-pink-50 rounded-xl">
        <p className="text-sm text-pink-400">Belum ada permintaan redeem</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => {
        const statusConfig = {
          pending: { label: 'Menunggu Review', color: 'bg-amber-50 border-amber-200 text-amber-600' },
          approved: { label: 'Disetujui', color: 'bg-green-50 border-green-200 text-green-600' },
          rejected: { label: 'Ditolak', color: 'bg-red-50 border-red-200 text-red-600' },
        };
        const config = statusConfig[req.status];
        const date = new Date(req.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

        return (
          <div key={req.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-pink-100">
            <span className="text-2xl">{req.gameImage}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-pink-800 text-sm truncate">{req.itemName}</p>
              <p className="text-xs text-pink-400">{req.gameName} - {date}</p>
              {req.adminNote && (
                <p className="text-xs text-pink-500 mt-0.5">Catatan: {req.adminNote}</p>
              )}
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${config.color}`}>
              {config.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
