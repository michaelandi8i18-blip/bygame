'use client';

import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, MessageSquare, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface MessagePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const typeConfig = {
  info: { icon: <Info className="w-5 h-5" />, color: 'bg-blue-50 border-blue-200 text-blue-600' },
  success: { icon: <CheckCircle className="w-5 h-5" />, color: 'bg-green-50 border-green-200 text-green-600' },
  warning: { icon: <AlertTriangle className="w-5 h-5" />, color: 'bg-amber-50 border-amber-200 text-amber-600' },
  error: { icon: <AlertCircle className="w-5 h-5" />, color: 'bg-red-50 border-red-200 text-red-600' },
};

export default function MessagePanel({ isOpen, onClose }: MessagePanelProps) {
  const { user, getUserMessages, markMessageRead, getUnreadCount } = useStore();
  const messages = getUserMessages();
  const unreadCount = getUnreadCount();

  if (!isOpen || !user) return null;

  const handleMarkAllRead = () => {
    messages.forEach((msg) => {
      if (!msg.isRead) markMessageRead(msg.id);
    });
  };

  return (
    <div className="fixed inset-0 z-[70] bg-white animate-[fadeIn_0.2s_ease-out] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-pink-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-pink-50 transition-colors text-pink-600">
            <X className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-black text-pink-800 text-lg">Pesan</h1>
            <p className="text-xs text-pink-400">
              {unreadCount > 0 ? `${unreadCount} pesan belum dibaca` : 'Semua pesan sudah dibaca'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 text-xs font-bold text-pink-600 bg-pink-50 rounded-full hover:bg-pink-100 transition-colors"
          >
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="max-w-3xl mx-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">💬</span>
            <h3 className="text-lg font-bold text-pink-400 mb-2">Belum ada pesan</h3>
            <p className="text-sm text-pink-300">Pesan dari admin akan muncul di sini</p>
          </div>
        ) : (
          messages.map((msg) => {
            const config = typeConfig[msg.type];
            const date = new Date(msg.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={msg.id}
                onClick={() => !msg.isRead && markMessageRead(msg.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                  msg.isRead ? 'bg-white border-pink-100' : `border ${config.color}`
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.from === 'admin' ? 'bg-gradient-to-br from-purple-100 to-pink-100' : 'bg-gradient-to-br from-pink-100 to-rose-100'
                  }`}>
                    <MessageSquare className={`w-5 h-5 ${msg.from === 'admin' ? 'text-purple-500' : 'text-pink-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-pink-800 text-sm">{msg.title}</span>
                      {!msg.isRead && (
                        <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-pink-600 leading-relaxed">{msg.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-pink-300">{date}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        msg.from === 'admin' ? 'bg-purple-50 text-purple-500' : 'bg-pink-50 text-pink-400'
                      }`}>
                        {msg.from === 'admin' ? '👑 Admin' : '🤖 Sistem'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
