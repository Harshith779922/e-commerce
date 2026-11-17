'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface GalleryEnvironment {
  id: string;
  title: string;
  subtitle: string;
  editorial: string;
  image: string;
  href: string;
  tag: string;
}

const GALLERY_ENVIRONMENTS: GalleryEnvironment[] = [
  {
    id: 'men',
    title: "Men's Wardrobe",
    subtitle: 'SARTORIAL ARCHITECTURE',
    editorial: 'Double-breasted virgin wool tuxedos, structured shoulder contours, and Egyptian cotton dress shirts.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    href: '/men',
    tag: 'ROOM 01 · MEN',
  },
  {
    id: 'women',
    title: "Women's Haute Wardrobe",
    subtitle: 'SCULPTURAL FLUIDITY',
    editorial: 'Silk crepe column gowns, sculpted filigree hour-glass blazers, and draped eveningwear.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop',
    href: '/women',
    tag: 'ROOM 02 · WOMEN',
  },
  {
    id: 'signature',
    title: 'The Signature Collection',
    subtitle: 'MAISON CORE EDIT',
    editorial: 'The definitive foundation of ELYON LECLAIR. Obsidian velvet, Como silk twill, and bespoke tailoring.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    href: '/collections/the-signature-collection',
    tag: 'ROOM 03 · SIGNATURE',
  },
  {
    id: 'alta-notte',
    title: 'Alta Notte Gala Evening',
    subtitle: 'MIDNIGHT DRAMA',
    editorial: 'Baroque jacquards, 24k gold hand-carved button work, and dramatic peak lapels built for the gala.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    href: '/collections/the-dolce-collection',
    tag: 'ROOM 04 · GALA',
  },
];

export default function CollectionGallery() {
  const [activeId, setActiveId] = useState<string>('men');

  return (
    <section className="bg-[#101010] text-[#F2EEE5] py-24 sm:py-36 border-t border-[#241C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="w-8 h-[1px] bg-[#B69A63]" />
              <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-[#B69A63] font-medium">
                CHAPTER III · THE COLLECTION GALLERY
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#F2EEE5] font-light tracking-tight">
              Curated Environments
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#85817B] max-w-md font-sans font-light leading-relaxed">
            Step through our permanent digital salon. Explore each collection as an individual exhibition of silhouette and craftsmanship.
          </p>
        </div>

        {/* Gallery Exhibition Grid (4 Interactive Visual Rooms) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {GALLERY_ENVIRONMENTS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveId(item.id)}
                className={`group relative h-[480px] sm:h-[540px] overflow-hidden border border-[#2A2424] bg-[#161212] transition-all duration-700 flex flex-col justify-between p-6 ${
                  isActive ? 'border-[#B69A63]/70 shadow-goldGlow' : 'hover:border-[#4B171C]'
                }`}
              >
                {/* Background Campaign Visual */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 filter brightness-[0.78] group-hover:brightness-90"
                  />
                  {/* Subtle Light Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-75" />
                  <div className="absolute inset-0 bg-[#4B171C]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>

                {/* Top: Room Tag */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-[#B69A63] px-2 py-1 bg-[#101010]/80 border border-[#2A2424] backdrop-blur-sm">
                    {item.tag}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-[#B69A63]/40 flex items-center justify-center text-[#B69A63] group-hover:bg-[#B69A63] group-hover:text-black transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom: Title, Subtitle, Description & Link */}
                <div className="relative z-10 space-y-3 transform transition-transform duration-500">
                  <p className="text-[9px] font-sans tracking-[0.3em] uppercase text-[#B69A63] font-medium">
                    {item.subtitle}
                  </p>
                  <h3 className="font-serif text-2xl text-[#F2EEE5] font-light leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#85817B] font-sans leading-relaxed line-clamp-3 group-hover:text-[#F2EEE5]/90 transition-colors">
                    {item.editorial}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-2 text-xs font-sans tracking-[0.2em] uppercase text-[#F2EEE5] group-hover:text-[#B69A63] transition-colors border-b border-[#B69A63]/40 pb-0.5"
                    >
                      <span>DISCOVER COLLECTION</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote Link */}
        <div className="mt-12 text-center">
          <Link
            href="/collections"
            className="text-xs font-sans tracking-[0.25em] uppercase text-[#85817B] hover:text-[#B69A63] transition-colors inline-flex items-center gap-2"
          >
            <span>VIEW COMPLETE MAISON DIRECTORY</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
