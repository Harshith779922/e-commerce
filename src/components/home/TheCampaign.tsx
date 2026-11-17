import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ELMonogram from '@/components/common/ELMonogram';

export default function TheCampaign() {
  return (
    <section className="relative min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#101010] border-t border-[#241C1C]">
      {/* Dominant Full-width Campaign Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="ELYON LECLAIR Autumn Winter Campaign"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-105"
        />
        {/* Cinematic Dark Maison Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/50 to-[#101010]/80" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70" />
      </div>

      {/* Campaign Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-20 flex flex-col items-center">
        {/* Monogram Seal */}
        <div className="mb-6">
          <ELMonogram className="w-12 h-12 text-[#B69A63]" variant="framed" />
        </div>

        <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.4em] text-[#B69A63] uppercase font-medium">
          CHAPTER VI · THE AUTUMN CAMPAIGN
        </span>

        <h2 className="mt-4 font-serif text-4xl sm:text-6xl md:text-7xl text-[#F2EEE5] font-light tracking-tight leading-[1.08]">
          THE ART OF PRESENCE.
        </h2>

        <p className="mt-5 text-xs sm:text-sm text-[#F2EEE5]/80 max-w-lg font-sans font-light leading-relaxed">
          Photographed on location. A study in obsidian silhouettes, floor-skimming silk columns, and twilight stillness.
        </p>

        <div className="mt-10">
          <Link
            href="/collections/the-signature-collection"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#B69A63] text-black hover:bg-[#CDB388] transition-all duration-300 text-xs font-sans tracking-[0.25em] uppercase font-semibold shadow-goldGlow"
          >
            <span>EXPLORE THE CAMPAIGN</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
