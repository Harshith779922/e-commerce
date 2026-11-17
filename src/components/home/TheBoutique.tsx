'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '@/components/shop/ProductCard';
import { ArrowRight } from 'lucide-react';

interface TheBoutiqueProps {
  products: Product[];
}

export default function TheBoutique({ products }: TheBoutiqueProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'men' | 'women' | 'evening' | 'accessories'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'men') return p.gender === 'MEN' || p.gender === 'UNISEX';
    if (activeTab === 'women') return p.gender === 'WOMEN' || p.gender === 'UNISEX';
    if (activeTab === 'evening') return p.category?.slug === 'dresses-eveningwear' || p.category?.slug === 'suits-blazers';
    if (activeTab === 'accessories') return p.category?.slug === 'accessories' || p.category?.slug === 'bags-travel';
    return true;
  });

  const displayedProducts = filteredProducts.slice(0, 8);

  return (
    <section className="bg-[#101010] text-[#F2EEE5] py-24 sm:py-36 border-t border-[#241C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#B69A63]" />
            <span className="text-[11px] font-sans tracking-[0.3em] uppercase text-[#B69A63] font-medium">
              CHAPTER IV · THE BOUTIQUE
            </span>
            <span className="w-8 h-[1px] bg-[#B69A63]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-[#F2EEE5] font-light tracking-tight">
            The Atelier Selection
          </h2>

          <p className="text-xs sm:text-sm text-[#85817B] font-sans font-light leading-relaxed">
            Curated garments tailored in small editions. Explore virgin wools, Como silks, and Tuscan leathers crafted for effortless distinction.
          </p>

          {/* Filter Navigation Tabs */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-sans tracking-[0.2em] uppercase">
            {[
              { id: 'all', label: 'All Creations' },
              { id: 'men', label: 'Men' },
              { id: 'women', label: 'Women' },
              { id: 'evening', label: 'Eveningwear' },
              { id: 'accessories', label: 'Leather & Accessories' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-4 transition-all duration-300 text-[11px] ${
                  activeTab === tab.id
                    ? 'bg-[#B69A63] text-black font-semibold'
                    : 'text-[#85817B] hover:text-[#F2EEE5] border border-transparent hover:border-[#2A2424]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 products/row desktop, 3 tablet, 2 mobile */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-20 text-[#85817B] text-xs font-sans tracking-wider">
            No creations found in this selection.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                theme="dark"
                showCategory={true}
              />
            ))}
          </div>
        )}

        {/* Call to Action Button */}
        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-[#B69A63] text-[#F2EEE5] hover:bg-[#B69A63] hover:text-black transition-all duration-300 text-xs font-sans tracking-[0.25em] uppercase font-medium"
          >
            <span>ENTER THE FULL BOUTIQUE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
