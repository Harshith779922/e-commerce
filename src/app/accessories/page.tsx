import React from 'react';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/shop/ProductCard';
import Link from 'next/link';
import { Product } from '@/lib/types';

export const revalidate = 0;

export default async function AccessoriesPage() {
  const products = (await prisma.product.findMany({
    where: {
      isActive: true,
      category: {
        slug: { in: ['accessories', 'bags-travel'] },
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      images: { orderBy: { displayOrder: 'asc' } },
      variants: true,
      category: true,
      collection: true,
    },
  })) as unknown as Product[];

  return (
    <div className="bg-[#0B0B0B] text-[#F5F0E8] min-h-screen">
      {/* Editorial Hero */}
      <div className="relative h-[60vh] min-h-[440px] overflow-hidden flex items-center justify-center text-center bg-[#070707] border-b border-[#2B2B2B]">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-75 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2000&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-black/50 to-black/30" />

        <div className="relative z-10 max-w-3xl px-4 space-y-4">
          <span className="text-[11px] font-mono tracking-megaLuxury text-[#C5A46D] uppercase block">
            Pelletteria & Oreficeria
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#F5F0E8] uppercase tracking-wide font-light">
            Accessories & Leather
          </h1>
          <p className="text-xs sm:text-sm text-[#A8A29A] font-light max-w-xl mx-auto leading-relaxed">
            Hand-rolled Lake Como silk, Tuscan vegetable-tanned calfskin, 24k gold cufflinks and Cadore eyewear.
          </p>
        </div>
      </div>

      {/* Subcategory Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-[#222]">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-widest">
          <Link
            href="/accessories"
            className="px-5 py-2 bg-[#C5A46D] text-black font-semibold shadow-sm"
          >
            All Accessories ({products.length})
          </Link>
          <Link
            href="/shop?category=bags-travel"
            className="px-5 py-2 border border-[#34312D] text-[#A8A29A] hover:text-[#F5F0E8] hover:border-[#C5A46D] transition-colors"
          >
            Bags & Travel Duffels
          </Link>
          <Link
            href="/shop?category=accessories"
            className="px-5 py-2 border border-[#34312D] text-[#A8A29A] hover:text-[#F5F0E8] hover:border-[#C5A46D] transition-colors"
          >
            Silk Squares & Jewelry
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

