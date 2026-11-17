import React from 'react';
import ELMonogram from '@/components/common/ELMonogram';

interface DetailCard {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const DETAILS: DetailCard[] = [
  {
    number: '01',
    title: 'The Architectural Silhouette',
    subtitle: 'FLOATING CANVAS & NATURAL SHOULDERS',
    description:
      'Every jacket is built with a horsehair chest canvas that molds naturally to the wearer’s anatomy over time, achieving effortless structure without artificial stiffness.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=900&auto=format&fit=crop',
  },
  {
    number: '02',
    title: 'Tactile Textile Selection',
    subtitle: 'COMO SILK & S150s VIRGIN WOOL',
    description:
      'We source exclusively from historic Italian and Swiss mills. Mulberry silk twill woven in Como and Tasmanian extrafine wool woven with dense, fluid drape.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=900&auto=format&fit=crop',
  },
  {
    number: '03',
    title: 'Artisanal Finishing & Accents',
    subtitle: 'HORN BUTTONS & HAND-ROLLED EDGES',
    description:
      'Buttons carved from water buffalo horn, pick-stitched 2mm lapel borders, and pure cupro linings woven for whisper-quiet movement.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=900&auto=format&fit=crop',
  },
];

export default function ArtOfDetail() {
  return (
    <section className="bg-[#101010] text-[#F2EEE5] py-24 sm:py-36 border-t border-[#241C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#B69A63]" />
            <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-[#B69A63] font-medium">
              CHAPTER V · THE ART OF DETAIL
            </span>
            <span className="w-8 h-[1px] bg-[#B69A63]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-[#F2EEE5] font-light tracking-tight">
            The Mastery of Construction
          </h2>

          <p className="text-xs sm:text-sm text-[#85817B] font-sans font-light leading-relaxed">
            Excellence in haute luxury is not accidental. It resides in the millimeter precision of a lapel roll, the tactile density of pure wool, and the architectural balance of line.
          </p>
        </div>

        {/* 3 Detail Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {DETAILS.map((detail) => (
            <div
              key={detail.number}
              className="bg-[#141010] border border-[#2A2424] hover:border-[#B69A63]/50 transition-all duration-500 overflow-hidden group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1D1717]">
                <img
                  src={detail.image}
                  alt={detail.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141010] via-transparent to-transparent opacity-80" />
                <span className="absolute top-4 left-4 font-mono text-xs text-[#B69A63] px-2.5 py-1 bg-[#101010]/80 border border-[#2A2424] backdrop-blur-sm">
                  {detail.number}
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[9px] font-sans tracking-[0.25em] text-[#B69A63] uppercase font-medium">
                    {detail.subtitle}
                  </p>
                  <h3 className="font-serif text-xl text-[#F2EEE5] font-light mt-1">
                    {detail.title}
                  </h3>
                  <p className="mt-3 text-xs text-[#85817B] font-sans leading-relaxed">
                    {detail.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#241C1C] flex items-center justify-between text-[10px] text-[#85817B] font-mono">
                  <span>ATELIER ELYON</span>
                  <ELMonogram className="w-4 h-4 text-[#B69A63]/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
