'use client';

import { useState } from 'react';
import { X, Star, Clock, CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore, Purchase } from '@/store/useStore';
import { formatPrice } from '@/components/GameCard';

interface HistoryPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig: Record<Purchase['status'], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: <Clock className="w-4 h-4" /> },
  processing: { label: 'Diproses', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: <Loader2 className="w-4 h-4 animate-spin" /> },
  success: { label: 'Berhasil', color: 'text-green-600', bg: 'bg-green-50 border-green-200', icon: <CheckCircle className="w-4 h-4" /> },
  failed: { label: 'Gagal', color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: <XCircle className="w-4 h-4" /> },
};

export default function HistoryPage({ isOpen, onClose }: HistoryPageProps) {
  const { user, purchases, addReview, addMessage } = useStore();
  const userPurchases = purchases.filter((p) => p.userId === user?.id);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-white animate-[fadeIn_0.2s_ease-out] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-pink-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-pink-50 transition-colors text-pink-600">
            <X className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-black text-pink-800 text-lg">Riwayat Pembelian</h1>
            <p className="text-xs text-pink-400">{userPurchases.length} transaksi</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-50 to-rose-50 rounded-full border border-pink-200">
          <span className="text-sm">💰</span>
          <span className="text-sm font-bold text-pink-700">Rp {user.balance}</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 pb-8 space-y-4">
        {userPurchases.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">📦</span>
            <h3 className="text-lg font-bold text-pink-400 mb-2">Belum ada pembelian</h3>
            <p className="text-sm text-pink-300">Yuk mulai top up game favorit kamu!</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full text-sm hover:scale-105 transition-transform"
            >
              Mulai Top Up
            </button>
          </div>
        ) : (
          userPurchases.map((purchase) => (
            <PurchaseCard
              key={purchase.id}
              purchase={purchase}
              onReview={(rating, comment) => {
                addReview(purchase.id, rating, comment);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PurchaseCard({
  purchase,
  onReview,
}: {
  purchase: Purchase;
  onReview: (rating: number, comment: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const status = statusConfig[purchase.status];
  const date = new Date(purchase.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleReviewSubmit = () => {
    if (rating === 0 || !comment.trim()) return;
    onReview(rating, comment);
    setReviewSubmitted(true);
    setShowReviewForm(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Main row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-4 text-left"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          {purchase.gameImage}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-pink-900 text-sm truncate">{purchase.gameName}</p>
          <p className="text-xs text-pink-400">{purchase.itemName} x{purchase.quantity}</p>
          <p className="text-xs text-pink-300 mt-0.5">{date}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-extrabold text-pink-600 text-sm">{formatPrice(purchase.totalPrice)}</p>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border mt-1 ${status.bg} ${status.color}`}>
            {status.icon}
            {status.label}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-pink-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 animate-slide-up">
          <div className="border-t border-pink-100 pt-4">
            {/* Info table */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <InfoRow label="ID Pembelian" value={purchase.id} />
              <InfoRow label="ID Game" value={purchase.userGameId} />
              <InfoRow label="Server ID" value={purchase.serverId || '-'} />
              <InfoRow label="Pembayaran" value={purchase.paymentMethod.charAt(0).toUpperCase() + purchase.paymentMethod.slice(1)} />
            </div>

            {/* Review section */}
            {purchase.status === 'success' && !purchase.reviewed && !reviewSubmitted && (
              <div className="mt-4 p-4 bg-pink-50 rounded-xl">
                <p className="font-bold text-pink-800 text-sm mb-1">Beri Review & Dapat Bonus! 🎁</p>
                <p className="text-xs text-pink-400 mb-3">Review pembelian kamu dan dapatkan saldo bonus Rp 100</p>

                {!showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm rounded-full hover:scale-105 transition-transform"
                  >
                    Tulis Review
                  </button>
                ) : (
                  <div className="space-y-3">
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= (hoverRating || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-pink-200'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm font-semibold text-pink-600 ml-2">
                        {rating > 0 ? ['', 'Buruk', 'Kurang', 'Biasa', 'Bagus', 'Sempurna'][rating] : 'Pilih rating'}
                      </span>
                    </div>

                    {/* Comment */}
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tulis pengalaman kamu di sini..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 bg-white text-pink-900 placeholder:text-pink-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all text-sm resize-none font-medium"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 border-2 border-pink-200 text-pink-600 font-bold text-sm rounded-full hover:bg-pink-50 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleReviewSubmit}
                        disabled={rating === 0 || !comment.trim()}
                        className="flex-1 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm rounded-full disabled:opacity-40 transition-all"
                      >
                        Kirim Review (+Rp 100)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {reviewSubmitted && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-semibold text-green-600">Review terkirim! +Rp 100 saldo bonus</span>
              </div>
            )}

            {purchase.reviewed && (
              <div className="mt-4 p-3 bg-pink-50 rounded-xl flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm text-pink-600 font-medium">Kamu sudah memberi review untuk pembelian ini</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-pink-400 font-medium">{label}</p>
      <p className="text-sm text-pink-800 font-semibold">{value}</p>
    </div>
  );
}
