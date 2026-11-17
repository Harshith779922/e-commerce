'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'SUITS & BLAZERS',
    slug: 'suits-blazers',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
    subtitle: 'Canvassed Tailoring & Fine Lapels',
  },
  {
    name: 'DESIGNER SHIRTS',
    slug: 'designer-shirts',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
    subtitle: 'Egyptian Giza Cotton & Washed Silk',
  },
  {
    name: 'ACCESSORIES',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
    subtitle: 'Como Silk & Gold-Plated Details',
  },
  {
    name: 'BAGS & LIFESTYLE',
    slug: 'bags-travel',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
    subtitle: 'Full-Grain Tuscan Calfskin & Leather',
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-20 sm:py-24 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-[11px] font-mono tracking-megaLuxury uppercase text-[#B89A6A] mb-2">
            The Curated Wardrobe
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F2EC] font-light uppercase tracking-wide">
            Shop by Category
          </h2>
          <div className="w-12 h-[1px] bg-[#B89A6A] mx-auto mt-4" />
        </div>

        {/* 4 Large Editorial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/shop?category=${cat.slug}`}
              className="group relative h-[480px] sm:h-[520px] overflow-hidden border border-[#2B2B27] hover:border-[#B89A6A] transition-all duration-500 block"
            >
              {/* Background Image with Zoom */}
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
                style={{ backgroundImage: `url(${cat.image})` }}
              />

              {/* Dark Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

              {/* Editorial Category Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-left">
                <span className="text-[10px] font-mono tracking-widest text-[#B89A6A] uppercase mb-1">
                  Category 0{idx + 1}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#F5F2EC] uppercase tracking-wide mb-1 group-hover:text-[#B89A6A] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#85817A] font-light mb-4">
                  {cat.subtitle}
                </p>

                {/* SHOP NOW Button link */}
                <div className="inline-flex items-center gap-2 text-xs tracking-widestLuxury text-[#F5F2EC] group-hover:text-[#B89A6A] uppercase font-medium border-b border-transparent group-hover:border-[#B89A6A] pb-1 w-max transition-all">
                  Shop Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
