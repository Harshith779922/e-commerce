'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedCollectionBanner() {
  return (
    <section className="relative w-full h-[580px] sm:h-[650px] overflow-hidden bg-[#0D0D0D] border-y border-[#262626]">
      {/* Background with distinctive editorial fashion photography */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-75 transition-transform duration-10000 hover:scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop')`,
        }}
      />

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

      {/* Content Frame */}
      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-xl text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B89A6A]/10 border border-[#B89A6A]/30 text-[#B89A6A] text-[10px] tracking-megaLuxury uppercase font-mono">
            <Sparkles className="w-3 h-3" />
            Limited Campaign Release
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#F5F2EC] uppercase tracking-wide leading-tight font-light">
            THE SIGNATURE <br />
            <span className="font-serif italic text-[#B89A6A]">COLLECTION</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#85817A] font-light leading-relaxed max-w-md">
            An expression of individuality, crafted with intention. Sculptural eveningwear, tactile virgin wools, and handcrafted accents built for discerning longevity.
          </p>

          <div className="pt-2">
            <Link
              href="/collections/the-signature-collection"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#947A4F] via-[#B89A6A] to-[#CDB388] text-black font-semibold text-xs tracking-widestLuxury uppercase hover:brightness-110 transition-all shadow-luxury group"
            >
              Discover the Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
