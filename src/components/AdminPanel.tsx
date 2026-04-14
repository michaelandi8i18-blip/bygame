'use client';

import { useState } from 'react';
import { X, CheckCircle, XCircle, Crown, Users, Gift, MessageSquare, ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { formatPrice } from '@/components/GameCard';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { user, getRedeemRequests, adminApproveRedeem, getUserMessages } = useStore();
  const redeemRequests = getRedeemRequests();
  const pendingCount = redeemRequests.filter((r) => r.status === 'pending').length;

  if (!isOpen || !user || user.role !== 'admin') return null;

  return (
    <div className="fixed inset-0 z-[70] bg-[#FFF1F5] animate-[fadeIn_0.2s_ease-out] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-pink-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-pink-50 transition-colors text-pink-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-black text-pink-800 text-lg flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              Admin Panel
            </h1>
            <p className="text-xs text-pink-400">Kelola permintaan redeem</p>
          </div>
        </div>
        {pendingCount > 0 && (
          <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-600 text-xs font-bold animate-pulse">
            {pendingCount} menunggu
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto p-4">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard icon={<Users className="w-5 h-5" />} label="Total Request" value={redeemRequests.length} color="from-pink-400 to-rose-400" />
          <StatCard icon={<Gift className="w-5 h-5" />} label="Pending" value={pendingCount} color="from-amber-400 to-orange-400" />
          <StatCard icon={<MessageSquare className="w-5 h-5" />} label="Selesai" value={redeemRequests.length - pendingCount} color="from-green-400 to-emerald-400" />
        </div>

        {/* Request list */}
        <h2 className="font-bold text-pink-800 text-lg mb-4">📋 Permintaan Redeem</h2>
        {redeemRequests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-pink-100">
            <span className="text-5xl mb-3 block">📭</span>
            <h3 className="font-bold text-pink-400 mb-1">Belum ada permintaan</h3>
            <p className="text-sm text-pink-300">Permintaan redeem dari user akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-4">
            {redeemRequests.map((req) => (
              <RedeemRequestCard key={req.id} request={req} onApprove={adminApproveRedeem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm">
      <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-white mb-2`}>
        {icon}
      </div>
      <p className="text-xl font-black text-pink-800">{value}</p>
      <p className="text-xs text-pink-400 font-medium">{label}</p>
    </div>
  );
}

function RedeemRequestCard({
  request,
  onApprove,
}: {
  request: import('@/store/useStore').RedeemRequest;
  onApprove: (requestId: string, approved: boolean, note: string) => void;
}) {
  const [adminNote, setAdminNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [done, setDone] = useState(request.status !== 'pending');

  const statusConfig = {
    pending: { label: 'Menunggu', color: 'bg-amber-50 border-amber-200 text-amber-600' },
    approved: { label: 'Disetujui', color: 'bg-green-50 border-green-200 text-green-600' },
    rejected: { label: 'Ditolak', color: 'bg-red-50 border-red-200 text-red-600' },
  };
  const config = statusConfig[request.status];
  const date = new Date(request.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleAction = async (approved: boolean) => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 800));
    onApprove(request.id, approved, adminNote || (approved ? 'Permintaan disetujui' : 'Tidak memenuhi syarat'));
    setIsProcessing(false);
    setDone(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{request.gameImage}</span>
            <div>
              <p className="font-bold text-pink-800">{request.itemName}</p>
              <p className="text-xs text-pink-400">{request.gameName}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${config.color}`}>
            {config.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4 bg-pink-50 rounded-xl p-3">
          <div>
            <p className="text-xs text-pink-400">User</p>
            <p className="font-semibold text-pink-800">{request.userName}</p>
          </div>
          <div>
            <p className="text-xs text-pink-400">Email</p>
            <p className="font-semibold text-pink-800">{request.userEmail}</p>
          </div>
          <div>
            <p className="text-xs text-pink-400">ID Game</p>
            <p className="font-semibold text-pink-800">{request.userGameId}</p>
          </div>
          <div>
            <p className="text-xs text-pink-400">Harga Item</p>
            <p className="font-semibold text-pink-800">{formatPrice(request.itemPrice)}</p>
          </div>
        </div>

        <p className="text-xs text-pink-300 mb-3">{date}</p>

        {request.adminNote && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-600">
            <span className="font-bold">Catatan Admin: </span>{request.adminNote}
          </div>
        )}

        {request.status === 'pending' && !done && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-pink-700 mb-1">Catatan Admin (opsional)</label>
              <input
                type="text"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Tambahkan catatan..."
                className="w-full px-3 py-2 rounded-xl border-2 border-pink-200 text-sm text-pink-900 placeholder:text-pink-300 focus:border-pink-500 focus:outline-none transition-all font-medium"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(false)}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 border-2 border-red-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100 disabled:opacity-40 transition-all"
              >
                {isProcessing ? <span className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" /> : <XCircle className="w-4 h-4" />}
                Tolak
              </button>
              <button
                onClick={() => handleAction(true)}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 border-2 border-green-200 text-green-600 font-bold text-sm rounded-xl hover:bg-green-100 disabled:opacity-40 transition-all"
              >
                {isProcessing ? <span className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Setujui
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
