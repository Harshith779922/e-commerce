'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '../shop/ProductCard';
import { ArrowRight, Star } from 'lucide-react';

interface BestSellersProps {
  products: Product[];
}

export default function BestSellers({ products }: BestSellersProps) {
  // Select top featured items
  const bestSellers = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section className="py-20 sm:py-24 bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#262626] pb-6">
          <div>
            <div className="flex items-center gap-1 text-[#C5A46D] mb-2">
              <Star className="w-3.5 h-3.5 fill-[#C5A46D]" />
              <span className="text-[11px] font-mono tracking-megaLuxury uppercase">
                Patron Favorites
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F0E8] font-light uppercase tracking-wide">
              Best Sellers
            </h2>
            <p className="text-xs text-[#A8A29A] mt-2 font-light">
              Enduring silhouettes favored by our international clientele.
            </p>
          </div>

          <Link
            href="/shop?sort=featured"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widestLuxury text-[#C5A46D] hover:text-[#E0C18A] transition-colors font-medium"
          >
            Explore All Best Sellers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Column Luxury Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

