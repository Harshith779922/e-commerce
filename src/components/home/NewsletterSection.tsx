'use client';

import React, { useState } from 'react';
import { Mail, Check, AlertCircle, Sparkles } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please provide a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Could not complete subscription.');
      } else {
        setStatus('success');
        setMessage(data.message || 'You have been enrolled in the circle of EXAMPLE E-COM.');
        setEmail('');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network connection interrupted. Please retry.');
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-[#0D0D0D] border-t border-[#262626] relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-[#B89A6A]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B89A6A]/10 border border-[#B89A6A]/30 text-[#B89A6A] text-[10px] tracking-megaLuxury uppercase font-mono mb-4">
          <Sparkles className="w-3 h-3" />
          The Private Gazette
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl text-[#F5F2EC] font-light uppercase tracking-wide mb-4">
          Be Part of Our World.
        </h2>

        <p className="text-xs sm:text-sm text-[#85817A] font-light max-w-xl mx-auto leading-relaxed mb-8">
          Discover new collections, exclusive releases and the latest from EXAMPLE E-COM.
        </p>

        {status === 'success' ? (
          <div className="max-w-md mx-auto p-4 bg-[#B89A6A]/10 border border-[#B89A6A]/40 text-[#F5F2EC] flex items-center justify-center gap-3">
            <Check className="w-5 h-5 text-[#B89A6A] flex-shrink-0" />
            <p className="text-xs text-left leading-relaxed">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  className="w-full bg-[#171717] border border-[#34312D] px-4 py-3.5 text-xs text-[#F5F2EC] placeholder-[#777] focus:outline-none focus:border-[#B89A6A] font-sans"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-3.5 bg-gradient-to-r from-[#947A4F] via-[#B89A6A] to-[#CDB388] text-black font-semibold text-xs tracking-widestLuxury uppercase hover:brightness-110 transition-all shadow-luxury disabled:opacity-50"
              >
                {status === 'loading' ? 'Joining...' : 'Subscribe'}
              </button>
            </div>

            {status === 'error' && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{message}</span>
              </div>
            )}
          </form>
        )}

        <p className="text-[10px] text-[#666] tracking-wider uppercase mt-6">
          Unsubscribe at any time. We honor client discretion and privacy.
        </p>
      </div>
    </section>
  );
}
