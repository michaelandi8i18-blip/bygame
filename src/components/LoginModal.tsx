'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = useStore((s) => s.login);
  const register = useStore((s) => s.register);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    let success: boolean;
    if (isRegister) {
      success = register(name, email, password);
      if (!success) setError('Gagal mendaftar. Pastikan semua field terisi.');
    } else {
      success = login(email, password);
      if (!success) setError('Login gagal. Periksa email dan password.');
    }

    setIsLoading(false);

    if (success) {
      setName('');
      setEmail('');
      setPassword('');
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 to-rose-500 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black">{isRegister ? 'Daftar Akun Baru' : 'Masuk ke BYgame'}</h2>
          <p className="text-white/80 text-sm mt-1 font-medium">
            {isRegister ? 'Buat akun dan mulai top up!' : 'Masuk untuk melanjutkan'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-pink-700 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-300" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama kamu"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-pink-200 bg-white text-pink-900 placeholder:text-pink-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-pink-200 bg-white text-pink-900 placeholder:text-pink-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-300" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 3 karakter"
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-pink-200 bg-white text-pink-900 placeholder:text-pink-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all font-medium"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {!isRegister && (
            <p className="text-xs text-pink-400 text-center">
              💡 Masukkan email apapun & password min. 3 karakter untuk demo. Gunakan email yang mengandung &ldquo;admin&rdquo; untuk akses admin.
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-pink-300/30 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </span>
            ) : (
              isRegister ? 'Daftar Sekarang' : 'Masuk'
            )}
          </button>

          <p className="text-center text-sm text-pink-400">
            {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-pink-600 font-bold hover:underline"
            >
              {isRegister ? 'Masuk' : 'Daftar'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
