'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '../shop/ProductCard';
import { ArrowRight } from 'lucide-react';

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  // Take exactly 5 products for wide screens as required
  const displayProducts = products.slice(0, 5);

  return (
    <section className="py-20 sm:py-24 bg-[#141414] border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#262626] pb-6">
          <div>
            <span className="text-[11px] font-mono tracking-megaLuxury uppercase text-[#B89A6A] block mb-2">
              Autumn / Winter Atelier
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F5F2EC] font-light uppercase tracking-wide">
              New Arrivals
            </h2>
            <p className="text-xs text-[#85817A] mt-2 font-light max-w-md">
              Discover the latest additions to our collection.
            </p>
          </div>

          <Link
            href="/shop?newArrival=true"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widestLuxury text-[#B89A6A] hover:text-[#CDB388] transition-colors font-medium"
          >
            View Complete Collection <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 5-Column Responsive Product Showcase */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
