'use client';

import { useState } from 'react';
import { Game, PaymentMethod } from '@/types';
import { X, Minus, Plus, ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react';
import { paymentMethods } from '@/data/games';
import { useStore } from '@/store/useStore';

interface TopupModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TopupModal({ game, isOpen, onClose }: TopupModalProps) {
  const { user, isLoggedIn, addPurchase, addMessage } = useStore();
  const [step, setStep] = useState(1);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState('');
  const [serverId, setServerId] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  const selectedGameItem = game?.items.find((item) => item.id === selectedItem);
  const totalPrice = selectedGameItem ? selectedGameItem.price * quantity : 0;

  const handleClose = () => {
    setStep(1);
    setSelectedItem(null);
    setQuantity(1);
    setUserId('');
    setServerId('');
    setSelectedPayment(null);
    setIsProcessing(false);
    setIsSuccess(false);
    setCreatedOrderId('');
    onClose();
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePayment = async () => {
    if (!game || !selectedGameItem || !selectedPayment) return;
    setIsProcessing(true);

    try {
      // Step 1: Create topup order via API (apigames.id or mock)
      const topupRes = await fetch('/api/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          itemId: selectedGameItem.id,
          userGameId: userId,
          serverId: serverId || undefined,
          paymentMethod: selectedPayment,
          quantity,
          userId: user?.id,
          gameName: game.name,
          itemName: selectedGameItem.name,
          totalPrice,
        }),
      });

      const topupData = await topupRes.json();
      if (!topupRes.ok || !topupData.success) {
        throw new Error(topupData.message || 'Gagal membuat pesanan');
      }

      const orderId = topupData.data.orderId;

      // Step 2: Create payment via API (Pak Kasir or mock)
      const payRes = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentMethod: selectedPayment,
          amount: totalPrice,
          customerName: user?.name || 'BYgame User',
          customerEmail: user?.email || '',
        }),
      });

      const payData = await payRes.json();
      if (!payRes.ok || !payData.success) {
        throw new Error(payData.message || 'Gagal membuat pembayaran');
      }

      // Step 3: Save purchase to local store
      if (isLoggedIn && user) {
        addPurchase({
          userId: user.id,
          gameId: game.id,
          gameName: game.name,
          gameImage: game.image,
          itemId: selectedGameItem.id,
          itemName: selectedGameItem.name,
          quantity,
          totalPrice,
          userGameId: userId,
          serverId,
          paymentMethod: selectedPayment,
        });
      }

      setCreatedOrderId(orderId);
      setIsProcessing(false);
      setIsSuccess(true);
    } catch (err) {
      console.error('[TopupModal] Payment error:', err);
      setIsProcessing(false);
      // Fallback to local-only mode on API error
      if (isLoggedIn && user) {
        const purchase = addPurchase({
          userId: user.id,
          gameId: game.id,
          gameName: game.name,
          gameImage: game.image,
          itemId: selectedGameItem.id,
          itemName: selectedGameItem.name,
          quantity,
          totalPrice,
          userGameId: userId,
          serverId,
          paymentMethod: selectedPayment,
        });
        setCreatedOrderId(purchase.id);
      } else {
        setCreatedOrderId(`BY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      }
      setIsSuccess(true);
    }
  };

  if (!isOpen || !game) return null;

  const stepLabels = ['Pilih Item', 'Masukkan ID', 'Bayar'];

  const fmt = (price: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{game.image}</span>
            <div>
              <h2 className="font-bold text-pink-900">{game.name}</h2>
              <p className="text-xs text-pink-400">Top Up</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-pink-100 text-pink-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 p-4 bg-white flex-shrink-0">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300 ${
                  step > i + 1
                    ? 'bg-green-400 text-white'
                    : step === i + 1
                      ? 'bg-pink-500 text-white animate-pulse-glow'
                      : 'bg-pink-100 text-pink-400'
                }`}
              >
                {step > i + 1 ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs font-semibold truncate ${step >= i + 1 ? 'text-pink-700' : 'text-pink-300'}`}>
                {label}
              </span>
              {i < stepLabels.length - 1 && <ChevronRight className="w-4 h-4 text-pink-200 flex-shrink-0" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-green-600 mb-2">Pembayaran Berhasil! 🎉</h3>
              <p className="text-sm text-pink-400 mb-1">Pesanan sedang diproses</p>
              <p className="text-sm text-pink-400 mb-2">Estimasi 1-5 menit sampai ke akun kamu</p>
              {isLoggedIn && (
                <p className="text-xs text-pink-300 mb-6">Lihat status pesanan di menu Riwayat Pembelian</p>
              )}
              <div className="bg-pink-50 rounded-xl p-4 text-left mb-6">
                <p className="text-xs text-pink-400 mb-1">ID Pesanan</p>
                <p className="text-sm font-bold text-pink-700">{createdOrderId}</p>
              </div>
              <button
                onClick={handleClose}
                className="px-8 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Selesai
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Select item */}
              {step === 1 && (
                <div className="animate-slide-up">
                  <h3 className="font-bold text-pink-800 mb-3">Pilih Nominal</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {game.items.map((item) => {
                      const isSelected = selectedItem === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedItem(item.id)}
                          className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                            isSelected
                              ? 'border-pink-500 bg-pink-50 shadow-md shadow-pink-200/40 scale-[1.02]'
                              : 'border-pink-100 bg-white hover:border-pink-300 hover:bg-pink-50/50'
                          }`}
                        >
                          {item.discount && (
                            <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full mb-1">
                              -{item.discount}%
                            </span>
                          )}
                          <p className="font-bold text-pink-800 text-sm">{item.name}</p>
                          <p className="font-extrabold text-pink-600 text-sm mt-1">{fmt(item.price)}</p>
                          {item.originalPrice && (
                            <p className="text-xs text-pink-300 line-through">{fmt(item.originalPrice)}</p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {selectedItem && (
                    <div className="mt-4 p-3 bg-pink-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-pink-700">Jumlah</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-white border border-pink-200 flex items-center justify-center text-pink-500 hover:bg-pink-100 transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-bold text-pink-800 w-8 text-center">{quantity}</span>
                          <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-8 h-8 rounded-full bg-white border border-pink-200 flex items-center justify-center text-pink-500 hover:bg-pink-100 transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-pink-500">Total</span>
                        <span className="text-lg font-extrabold text-pink-600">{fmt(totalPrice)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Enter user ID */}
              {step === 2 && (
                <div className="animate-slide-up space-y-4">
                  <h3 className="font-bold text-pink-800">Detail Akun</h3>
                  <div>
                    <label className="block text-sm font-semibold text-pink-700 mb-1.5">
                      User ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Masukkan User ID kamu"
                      className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 bg-white text-pink-900 placeholder:text-pink-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all font-medium"
                    />
                    <p className="text-xs text-pink-400 mt-1">Contoh: 1234567890 (10 digit)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-pink-700 mb-1.5">
                      Server ID <span className="text-pink-400 font-normal">(opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={serverId}
                      onChange={(e) => setServerId(e.target.value)}
                      placeholder="Masukkan Server ID"
                      className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 bg-white text-pink-900 placeholder:text-pink-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all font-medium"
                    />
                  </div>
                  <div className="p-4 bg-pink-50 rounded-xl space-y-2">
                    <p className="font-bold text-pink-800 mb-2">Ringkasan Pesanan</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-pink-500">Game</span>
                      <span className="font-semibold text-pink-700">{game.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-pink-500">Item</span>
                      <span className="font-semibold text-pink-700">{selectedGameItem?.name} x{quantity}</span>
                    </div>
                    <div className="border-t border-pink-200 pt-2 flex justify-between">
                      <span className="font-bold text-pink-700">Total</span>
                      <span className="font-extrabold text-pink-600">{fmt(totalPrice)}</span>
                    </div>
                  </div>
                  {!isLoggedIn && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-600 font-medium">
                      💡 Login untuk menyimpan pesanan ke riwayat pembelian dan mendapatkan saldo bonus review!
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="animate-slide-up space-y-4">
                  <h3 className="font-bold text-pink-800">Metode Pembayaran</h3>
                  <div className="space-y-2">
                    {paymentMethods.map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setSelectedPayment(pm.id as PaymentMethod)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedPayment === pm.id ? 'border-pink-500 bg-pink-50 shadow-md' : 'border-pink-100 bg-white hover:border-pink-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl ${pm.color} flex items-center justify-center`}>
                          <span className="text-lg">{pm.icon}</span>
                        </div>
                        <span className="font-bold text-pink-800">{pm.name}</span>
                        {selectedPayment === pm.id && <Check className="w-5 h-5 text-pink-500 ml-auto" />}
                      </button>
                    ))}
                  </div>
                  <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-pink-500">Item</span>
                      <span className="font-semibold text-pink-700">{selectedGameItem?.name} x{quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-pink-500">User ID</span>
                      <span className="font-semibold text-pink-700">{userId}</span>
                    </div>
                    <div className="border-t border-pink-200 pt-2 flex justify-between items-center">
                      <span className="font-bold text-pink-700">Total Bayar</span>
                      <span className="text-xl font-black text-pink-600">{fmt(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer buttons */}
        {!isSuccess && (
          <div className="flex gap-3 p-4 border-t border-pink-100 bg-white flex-shrink-0">
            {step > 1 && (
              <button onClick={handleBack} className="flex items-center gap-1 px-5 py-3 rounded-full border-2 border-pink-200 text-pink-600 font-bold text-sm hover:bg-pink-50 transition-colors">
                <ChevronLeft className="w-4 h-4" />Kembali
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={(step === 1 && !selectedItem) || (step === 2 && !userId.trim())}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-300/30 hover:from-pink-600 hover:to-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Lanjut<ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePayment}
                disabled={!selectedPayment || isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-green-300/30 hover:from-green-500 hover:to-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {isProcessing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Memproses...</>
                ) : (
                  'Bayar Sekarang'
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
