'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { settings } = useSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await register(name, email, password, phone);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Registration failed');
    } else {
      router.push('/account');
    }
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
              Client Privilege Registry
            </span>
          </Link>
          <h2 className="font-serif text-lg text-[#F5F0E8] font-light pt-2">
            Create Your Bespoke Account
          </h2>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
              Full Legal Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#777] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lord / Lady / Devon Sterling"
                className="w-full bg-[#1A1A1A] border border-[#34312D] pl-10 pr-3 py-2.5 text-xs text-[#F5F0E8] focus:border-[#C5A46D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
              Email Address *
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
              Mobile Contact
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#777] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98112 34567"
                className="w-full bg-[#1A1A1A] border border-[#34312D] pl-10 pr-3 py-2.5 text-xs text-[#F5F0E8] focus:border-[#C5A46D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
              Passphrase *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#777] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-[#1A1A1A] border border-[#34312D] pl-10 pr-3 py-2.5 text-xs text-[#F5F0E8] focus:border-[#C5A46D]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#9A7B4F] via-[#C5A46D] to-[#E0C18A] text-black font-semibold text-xs tracking-widestLuxury uppercase hover:brightness-110 transition-all shadow-luxury flex items-center justify-center gap-2"
          >
            {loading ? 'Registering...' : 'Create Account & Join Salon'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#262626] text-xs text-[#A8A29A]">
          <p>
            Already an esteemed member?{' '}
            <Link href="/auth/login" className="text-[#C5A46D] hover:underline uppercase tracking-wider">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

