'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatINR } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        setResults(data.products || []);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#121212] border border-[#34312D] w-full max-w-3xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          aria-label="Close search"
          className="absolute top-6 right-6 text-[#A8A29A] hover:text-[#C5A46D] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="border-b border-[#34312D] pb-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C5A46D]" />
          <input
            type="text"
            placeholder="Search blazers, silk shirts, leather bags, gowns..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-[#F5F0E8] placeholder-[#A8A29A] text-lg sm:text-xl font-serif focus:outline-none"
          />
          {loading && <Loader2 className="w-5 h-5 text-[#C5A46D] animate-spin" />}
        </div>

        {/* Quick Suggestions when empty */}
        {!query && (
          <div className="mt-8 space-y-4">
            <p className="text-[11px] uppercase tracking-widestLuxury text-[#C5A46D]">
              Trending Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {['Baroque Evening Blazer', 'Como Silk Pocket Square', 'Cashmere Overcoat', 'Liquid Gold Gown', 'Tuscan Duffle Bag'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3 py-1.5 bg-[#1C1C1C] border border-[#34312D] text-[#A8A29A] hover:border-[#C5A46D] hover:text-[#F5F0E8] transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-widestLuxury text-[#C5A46D] mb-4">
              Atelier Results ({results.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-2 bg-[#171717] hover:bg-[#202020] border border-[#2B2B2B] hover:border-[#C5A46D]/50 transition-all group"
                >
                  <img
                    src={product.images[0]?.url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=300'}
                    alt={product.name}
                    className="w-16 h-20 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#A8A29A] uppercase tracking-widest">
                      {product.gender} • {product.category?.name || 'Exclusive'}
                    </p>
                    <h4 className="text-xs font-serif text-[#F5F0E8] truncate group-hover:text-[#C5A46D] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs font-sans text-[#C5A46D] font-medium mt-1">
                      {formatINR(product.salePrice || product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#34312D] text-center">
              <Link
                href={`/shop?search=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A46D] hover:text-[#E0C18A]"
              >
                View all results in boutique <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {query && !loading && results.length === 0 && (
          <div className="py-12 text-center text-[#A8A29A]">
            <p className="font-serif text-lg text-[#F5F0E8] mb-2">No matching pieces discovered</p>
            <p className="text-xs">Try searching for cashmere, velvet, blazers or silk.</p>
          </div>
        )}
      </div>
    </div>
  );
}

