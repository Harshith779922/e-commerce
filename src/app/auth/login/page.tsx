'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLoginAsAdmin, quickLoginAsCustomer, user } = useAuth();
  const { settings } = useSettings();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Invalid credentials');
    } else {
      router.push('/account');
    }
  };

  const handleAdminDemo = async () => {
    setLoading(true);
    await quickLoginAsAdmin();
    setLoading(false);
    router.push('/admin');
  };

  const handleCustomerDemo = async () => {
    setLoading(true);
    await quickLoginAsCustomer();
    setLoading(false);
    router.push('/account');
  };

  return (
    <div className="bg-[#0B0B0B] text-[#F5F0E8] min-h-screen flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md bg-[#121212] border border-[#2B2B2B] p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="font-serif text-2xl tracking-[0.25em] text-[#F5F0E8] uppercase">
              {settings.brandName}
            </span>
            <span className="block text-[9px] tracking-[0.4em] text-[#C5A46D] uppercase mt-0.5">
              Client Portal
            </span>
          </Link>
          <h2 className="font-serif text-lg text-[#F5F0E8] font-light pt-2">
            Welcome to the Private Salon
          </h2>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs text-center">
            {error}
          </div>
        )}

        {/* 1-Click Demo Accounts Section */}
        <div className="p-4 bg-[#171717] border border-[#34312D] space-y-3">
          <p className="text-[10px] font-mono tracking-widest uppercase text-[#C5A46D] text-center">
            Demo 1-Click Instant Sign-In
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCustomerDemo}
              disabled={loading}
              className="px-3 py-2 bg-[#222] hover:bg-[#C5A46D] hover:text-black border border-[#3A3A3A] text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" /> Patron Client
            </button>
            <button
              type="button"
              onClick={handleAdminDemo}
              disabled={loading}
              className="px-3 py-2 bg-[#222] hover:bg-[#C5A46D] hover:text-black border border-[#3A3A3A] text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 text-[#C5A46D]"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Atelier Admin
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[#262626]"></div>
          <span className="absolute bg-[#121212] px-3 text-[10px] uppercase tracking-widest text-[#777]">
            Or Sign In with Credentials
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#777] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@bespokemilano.com"
                className="w-full bg-[#1A1A1A] border border-[#34312D] pl-10 pr-3 py-2.5 text-xs text-[#F5F0E8] focus:border-[#C5A46D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
              Secret Passphrase
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#777] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1A1A1A] border border-[#34312D] pl-10 pr-3 py-2.5 text-xs text-[#F5F0E8] focus:border-[#C5A46D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#9A7B4F] via-[#C5A46D] to-[#E0C18A] text-black font-semibold text-xs tracking-widestLuxury uppercase hover:brightness-110 transition-all shadow-luxury flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Account'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#262626] text-xs text-[#A8A29A]">
          <p>
            Do not have a bespoke account?{' '}
            <Link href="/auth/register" className="text-[#C5A46D] hover:underline uppercase tracking-wider">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

