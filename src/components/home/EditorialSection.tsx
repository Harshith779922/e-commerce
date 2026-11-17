'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

const stories = [
  {
    tag: 'DESIGNER INSPIRATION',
    title: 'The Architecture of a Bespoke Suit: Canvas, Horsehair & Master Precision',
    description: 'Inside the tailoring atelier where forty hours of hand basting create a garment that molds uniquely to the wearer’s form.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop',
    readTime: '6 Min Read',
    link: '/collections/the-italian-collection',
  },
  {
    tag: 'STYLING GUIDE',
    title: 'Textile Chronicles: The Featherlight Touch of Pure Lake Como Silk',
    description: 'How centuries of heritage hand-rolling and screen printing define contemporary luxury neckwear and pocket squares.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
    readTime: '4 Min Read',
    link: '/accessories',
  },
  {
    tag: 'SEASONAL TRENDS',
    title: 'Gold & Obsidian: The Modern Evening Wardrobe Reimagined',
    description: 'Curating gala black tie with understated confidence, velvet textures and quiet architectural restraint.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    readTime: '5 Min Read',
    link: '/collections/alta-notte-evening',
  },
];

export default function EditorialSection() {
  return (
    <section id="editorial" className="py-20 sm:py-28 bg-[#141414] border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-[#B89A6A] mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono tracking-megaLuxury uppercase">
              Editorial Stories & Guides
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#F5F2EC] font-light uppercase tracking-wide">
            The Style Journal
          </h2>
          <p className="text-xs text-[#85817A] mt-3 font-light leading-relaxed">
            Essays on timeless silhouettes, rare natural textiles, and the philosophy of modern elegance.
          </p>
          <div className="w-16 h-[1px] bg-[#B89A6A] mx-auto mt-4" />
        </div>

        {/* Asymmetrical Magazine Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Hero Story (7 cols) */}
          <div className="lg:col-span-7 bg-[#191919] border border-[#2B2B27] hover:border-[#B89A6A]/60 transition-all group flex flex-col justify-between overflow-hidden">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={stories[0].image}
                alt={stories[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-[#34312D] text-[#B89A6A] text-[9px] uppercase tracking-widest px-3 py-1 font-mono">
                {stories[0].tag}
              </span>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
              <div>
                <span className="text-[10px] text-[#85817A] font-mono tracking-wider block mb-2">
                  {stories[0].readTime} • Atelier Feature Story
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F2EC] group-hover:text-[#B89A6A] transition-colors mb-3 leading-snug">
                  {stories[0].title}
                </h3>
                <p className="text-xs text-[#85817A] leading-relaxed font-light mb-6">
                  {stories[0].description}
                </p>
              </div>

              <Link
                href={stories[0].link}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widestLuxury text-[#B89A6A] hover:text-[#CDB388] font-medium pt-4 border-t border-[#262626]"
              >
                Read Feature Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Secondary Stacked Stories (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {stories.slice(1).map((story, idx) => (
              <div
                key={idx}
                className="bg-[#191919] border border-[#2B2B27] hover:border-[#B89A6A]/60 transition-all group flex-1 p-6 flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden border border-[#262626]">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] text-[#B89A6A] font-mono tracking-widest uppercase block mb-1">
                      {story.tag}
                    </span>
                    <h4 className="font-serif text-base text-[#F5F2EC] group-hover:text-[#B89A6A] transition-colors leading-snug mb-2 line-clamp-2">
                      {story.title}
                    </h4>
                    <p className="text-[11px] text-[#85817A] line-clamp-2 font-light">
                      {story.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#262626] mt-4 flex items-center justify-between">
                  <span className="text-[10px] text-[#777] font-mono">{story.readTime}</span>
                  <Link
                    href={story.link}
                    className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#B89A6A] hover:text-[#CDB388] font-medium"
                  >
                    Read Story <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
