import React from 'react';
import Link from 'next/link';
import ELMonogram from '@/components/common/ELMonogram';

export default function MaisonIdentity() {
  return (
    <section className="relative bg-[#101010] text-[#F2EEE5] py-24 sm:py-36 border-t border-[#241C1C] overflow-hidden">
      {/* Subtle Background Bordeaux Ambient Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#4B171C]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Striking Large Serif Typography & Manifesto */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#B69A63]" />
              <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-[#B69A63] font-medium">
                CHAPTER II · THE IDENTITY
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#F2EEE5] font-light leading-[1.15] tracking-tight">
              BEYOND FASHION. <br />
              <span className="italic font-normal text-[#F2EEE5]/90">A DISTINCTIVE EXPRESSION.</span>
            </h2>

            <div className="space-y-5 text-sm sm:text-base text-[#85817B] font-sans font-light leading-relaxed max-w-xl">
              <p>
                At ELYON LECLAIR, each garment is conceived not as transient apparel, but as an architectural study in silhouette, shadow, and tactile presence.
              </p>
              <p>
                Rooted in deep obsidian, black cherry, and antique gold subtleties, our maison crafts sartorial pieces for those who understand that true luxury never shouts. It enters a room with quiet, commanding authority.
              </p>
            </div>

            {/* Monogram Detail & Manifesto Link */}
            <div className="pt-4 flex items-center gap-6">
              <ELMonogram className="w-10 h-10 text-[#B69A63]" variant="minimal" />
              <div className="border-l border-[#241C1C] pl-6">
                <Link
                  href="/maison"
                  className="text-xs font-sans tracking-[0.25em] text-[#F2EEE5] uppercase hover:text-[#B69A63] transition-colors inline-flex items-center gap-2 group"
                >
                  <span>READ THE MAISON MANIFESTO</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Striking Campaign Portrait with Warm Ivory Accent */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] w-full overflow-hidden border border-[#2A2424] bg-[#161212] group">
              <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop"
                alt="ELYON LECLAIR Haute Tailoring Identity"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent opacity-60" />

              {/* Editorial Caption Tag */}
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#101010]/85 backdrop-blur-md border border-[#241C1C] flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-sans tracking-[0.25em] text-[#B69A63] uppercase">
                    ATELIER NO. 01
                  </p>
                  <p className="font-serif text-xs text-[#F2EEE5] mt-0.5">
                    Structure & Silhouette
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[#85817B]">2026/27</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
