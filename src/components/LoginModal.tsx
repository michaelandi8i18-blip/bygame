'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getSupabase } from '@/lib/supabaseClient';
import { supabase } from '@/lib/supabaseClient';

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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
      if (!name.trim()) {
        setError('Nama tidak boleh kosong.');
        setIsLoading(false);
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Masukkan email yang valid.');
        setIsLoading(false);
        return;
      }
      if (password.length < 3) {
        setError('Password minimal 3 karakter.');
        setIsLoading(false);
        return;
      }
      success = register(name.trim(), email.trim(), password);
      if (!success) setError('Email sudah terdaftar. Silakan masuk atau gunakan email lain.');
    } else {
      if (!email.trim() || !email.includes('@')) {
        setError('Masukkan email yang valid.');
        setIsLoading(false);
        return;
      }
      if (password.length < 3) {
        setError('Password minimal 3 karakter.');
        setIsLoading(false);
        return;
      }
      success = login(email.trim(), password);
      if (!success) setError('Email atau password salah. Pastikan sudah terdaftar.');
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

  const loginWithGoogle = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {

      const sb = getSupabase();
      if (!sb) {
        setError('Login Google belum tersedia. Hubungi admin.');
        setIsGoogleLoading(false);
        return;
      }
      const { data, error: oauthError } = await sb.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: typeof window !== 'undefined'
      ? window.location.origin + '/'
      : 'https://www.bygame.store/',
  },
});

      if (oauthError) {
        setError('Gagal login dengan Google. Coba lagi nanti.');
        console.error('Google OAuth error:', oauthError);
      }

      // If successful, Supabase will redirect the user automatically
      if (data?.url) {
        // User will be redirected, close the modal
        onClose();
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Terjadi kesalahan saat login dengan Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
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

          {isRegister && (
            <p className="text-xs text-pink-400 text-center">
              📝 Data akun akan tersimpan. Gunakan email & password yang sama saat login.
            </p>
          )}
          {!isRegister && (
            <p className="text-xs text-pink-400 text-center">
              💡 Belum punya akun? Daftar dulu di tab &ldquo;Daftar&rdquo;. Untuk akses admin, login dengan email yang mengandung &ldquo;admin&rdquo; dan password &ldquo;admin123&rdquo;.
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

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="flex-1 h-px bg-pink-200" />
            <span className="px-3 text-xs font-semibold text-pink-300 bg-white">atau</span>
            <div className="flex-1 h-px bg-pink-200" />
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={loginWithGoogle}
            disabled={isGoogleLoading}
            className="w-full py-3.5 bg-white border-2 border-pink-200 text-pink-700 font-bold rounded-xl shadow-sm hover:bg-pink-50 hover:border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group"
          >
            {isGoogleLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-pink-500 animate-spin" />
                <span className="text-pink-500">Menghubungkan ke Google...</span>
              </span>
            ) : (
              <>
                {/* Google "G" SVG */}
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Login dengan Google</span>
              </>
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