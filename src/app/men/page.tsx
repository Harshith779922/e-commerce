import React from 'react';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/shop/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';

export const revalidate = 0;

export default async function MenPage() {
  const products = (await prisma.product.findMany({
    where: {
      isActive: true,
      gender: { in: ['MEN', 'UNISEX'] },
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
      {/* Men's Editorial Hero */}
      <div className="relative h-[65vh] min-h-[480px] overflow-hidden flex items-center justify-center text-center bg-[#070707] border-b border-[#2B2B2B]">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-75 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-black/50 to-black/30" />

        <div className="relative z-10 max-w-3xl px-4 space-y-4">
          <span className="text-[11px] font-mono tracking-megaLuxury text-[#C5A46D] uppercase block">
            Milano Sartorial Atelier
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#F5F0E8] uppercase tracking-wide font-light">
            Men’s Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#A8A29A] font-light max-w-xl mx-auto leading-relaxed">
            Full-floating canvassed tailoring, pure Super 150s virgin wool, washed silk shirts and Tuscan leather.
          </p>
        </div>
      </div>

      {/* Subcategory Navigation Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-[#222]">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-widest">
          <Link
            href="/shop?gender=men"
            className="px-5 py-2 bg-[#C5A46D] text-black font-semibold shadow-sm"
          >
            All Men’s ({products.length})
          </Link>
          <Link
            href="/shop?category=suits-blazers&gender=men"
            className="px-5 py-2 border border-[#34312D] text-[#A8A29A] hover:text-[#F5F0E8] hover:border-[#C5A46D] transition-colors"
          >
            Suits & Blazers
          </Link>
          <Link
            href="/shop?category=designer-shirts&gender=men"
            className="px-5 py-2 border border-[#34312D] text-[#A8A29A] hover:text-[#F5F0E8] hover:border-[#C5A46D] transition-colors"
          >
            Designer Shirts
          </Link>
          <Link
            href="/shop?category=trousers-footwear&gender=men"
            className="px-5 py-2 border border-[#34312D] text-[#A8A29A] hover:text-[#F5F0E8] hover:border-[#C5A46D] transition-colors"
          >
            Trousers & Footwear
          </Link>
          <Link
            href="/shop?category=accessories&gender=men"
            className="px-5 py-2 border border-[#34312D] text-[#A8A29A] hover:text-[#F5F0E8] hover:border-[#C5A46D] transition-colors"
          >
            Accessories & Silk
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

