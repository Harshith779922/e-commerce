import React from 'react';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/shop/ProductCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Product } from '@/lib/types';
import { Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function CollectionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const collection = await prisma.collection.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        where: { isActive: true },
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
          variants: true,
          category: true,
        },
      },
    },
  });

  if (!collection) {
    notFound();
  }

  return (
    <div className="bg-[#0B0B0B] text-[#F5F0E8] min-h-screen">
      {/* Editorial Collection Hero */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center justify-center text-center bg-[#070707] border-b border-[#2B2B2B]">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-70 scale-105"
          style={{
            backgroundImage: `url(${collection.image || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000'})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-black/60 to-black/30" />

        <div className="relative z-10 max-w-3xl px-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A46D]/15 border border-[#C5A46D]/40 text-[#C5A46D] text-[10px] tracking-megaLuxury uppercase font-mono">
            <Sparkles className="w-3 h-3" />
            Curated Atelier Collection
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#F5F0E8] uppercase tracking-wide font-light">
            {collection.name}
          </h1>
          {collection.subtitle && (
            <p className="text-sm font-serif italic text-[#C5A46D]">
              {collection.subtitle}
            </p>
          )}
          <p className="text-xs sm:text-sm text-[#A8A29A] font-light max-w-xl mx-auto leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Breadcrumbs & Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-[#222] flex items-center justify-between text-xs text-[#A8A29A]">
        <div className="flex items-center gap-2 uppercase tracking-widest text-[10px]">
          <Link href="/" className="hover:text-[#C5A46D]">Atelier</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#C5A46D]">Collections</Link>
          <span>/</span>
          <span className="text-[#C5A46D]">{collection.name}</span>
        </div>
        <span className="font-mono text-xs">{collection.products.length} Creations</span>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {collection.products.map((p) => (
            <ProductCard key={p.id} product={p as unknown as Product} />
          ))}
        </div>
      </div>
    </div>
  );
}

