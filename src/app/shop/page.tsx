'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Product, Category, Collection } from '@/lib/types';
import ProductCard from '@/components/shop/ProductCard';
import { Filter, X, ChevronDown, SlidersHorizontal, ArrowUpDown, Sparkles, RefreshCw } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedGender, setSelectedGender] = useState<string>(searchParams.get('gender') || 'ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'ALL');
  const [selectedCollection, setSelectedCollection] = useState<string>(searchParams.get('collection') || 'ALL');
  const [priceBucket, setPriceBucket] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'featured');
  const [onlyNewArrivals, setOnlyNewArrivals] = useState<boolean>(searchParams.get('newArrival') === 'true');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Synchronize when URL parameters change
  useEffect(() => {
    if (searchParams.get('gender')) setSelectedGender(searchParams.get('gender')!);
    if (searchParams.get('category')) setSelectedCategory(searchParams.get('category')!);
    if (searchParams.get('collection')) setSelectedCollection(searchParams.get('collection')!);
    if (searchParams.get('newArrival')) setOnlyNewArrivals(searchParams.get('newArrival') === 'true');
  }, [searchParams]);

  // Fetch Categories & Collections
  useEffect(() => {
    async function loadMeta() {
      try {
        const [catsRes, colsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/collections'),
        ]);
        const catsData = await catsRes.json();
        const colsData = await colsRes.json();
        setCategories(catsData.categories || []);
        setCollections(colsData.collections || []);
      } catch (err) {
        console.error('Failed to load categories/collections', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch Products with filters
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedGender !== 'ALL') params.set('gender', selectedGender);
        if (selectedCategory !== 'ALL') params.set('category', selectedCategory);
        if (selectedCollection !== 'ALL') params.set('collection', selectedCollection);
        if (onlyNewArrivals) params.set('newArrival', 'true');
        params.set('sort', sortBy);

        if (priceBucket === 'UNDER_5K') {
          params.set('maxPrice', '5000');
        } else if (priceBucket === '5K_10K') {
          params.set('minPrice', '5000');
          params.set('maxPrice', '10000');
        } else if (priceBucket === '10K_20K') {
          params.set('minPrice', '10000');
          params.set('maxPrice', '20000');
        } else if (priceBucket === 'ABOVE_20K') {
          params.set('minPrice', '20000');
        }

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        let list: Product[] = data.products || [];

        if (onlyInStock) {
          list = list.filter((p) => p.variants?.some((v) => v.stockQuantity > 0));
        }

        setProducts(list);
      } catch (err) {
        console.error('Failed to fetch filtered products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedGender, selectedCategory, selectedCollection, priceBucket, sortBy, onlyNewArrivals, onlyInStock]);

  const clearAllFilters = () => {
    setSelectedGender('ALL');
    setSelectedCategory('ALL');
    setSelectedCollection('ALL');
    setPriceBucket('ALL');
    setOnlyNewArrivals(false);
    setOnlyInStock(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedGender !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedCollection !== 'ALL' ||
    priceBucket !== 'ALL' ||
    onlyNewArrivals ||
    onlyInStock;

  return (
    <div className="bg-[#0B0B0B] text-[#F5F0E8] min-h-screen pt-4 pb-24">
      {/* Category Banner */}
      <div className="relative py-16 px-4 sm:px-8 border-b border-[#262626] bg-[#0E0E0E] overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Breadcrumb Navigation */}
          <nav className="text-[10px] uppercase tracking-widestLuxury text-[#A8A29A] mb-3 flex items-center justify-center gap-2">
            <Link href="/" className="hover:text-[#C5A46D] transition-colors">Atelier</Link>
            <span>/</span>
            <span className="text-[#C5A46D]">
              {selectedCategory !== 'ALL'
                ? categories.find((c) => c.slug === selectedCategory)?.name
                : selectedGender !== 'ALL'
                ? `${selectedGender}’S COLLECTION`
                : 'COMPLETE BOUTIQUE'}
            </span>
          </nav>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#F5F0E8] uppercase tracking-wide font-light mb-3">
            {selectedCategory !== 'ALL'
              ? categories.find((c) => c.slug === selectedCategory)?.name
              : selectedGender !== 'ALL'
              ? `${selectedGender}’s Haute Couture`
              : 'The Master Collection'}
          </h1>

          <p className="text-xs sm:text-sm text-[#A8A29A] max-w-xl mx-auto font-light leading-relaxed">
            Handmade garments and leather creations reflecting centuries of Northern Italian sartorial excellence.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Control Bar: Total Count, Mobile Filter Trigger, Sort Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#262626]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#34312D] text-xs uppercase tracking-widest text-[#F5F0E8] hover:border-[#C5A46D]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A46D]" />
              Filter Boutique
            </button>

            <span className="text-xs text-[#A8A29A] font-mono tracking-wider">
              Showing <span className="text-[#F5F0E8] font-bold">{products.length}</span> Creations
            </span>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-[#C5A46D] hover:underline flex items-center gap-1 uppercase tracking-wider"
              >
                <X className="w-3 h-3" /> Clear All Filters
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#A8A29A] uppercase tracking-widest hidden sm:inline">Sort By:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#141414] border border-[#34312D] text-[#F5F0E8] text-xs uppercase tracking-wider px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-[#C5A46D] cursor-pointer"
              >
                <option value="featured">Featured Atelier</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#A8A29A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block space-y-8 pr-4">
            {/* Gender Filter */}
            <div>
              <h3 className="text-xs font-serif uppercase tracking-widestLuxury text-[#C5A46D] mb-3 pb-1 border-b border-[#262626]">
                Gender
              </h3>
              <div className="space-y-2 text-xs">
                {['ALL', 'MEN', 'WOMEN'].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      checked={selectedGender === g}
                      onChange={() => setSelectedGender(g)}
                      className="accent-[#C5A46D]"
                    />
                    <span className={selectedGender === g ? 'text-[#C5A46D] font-medium' : 'text-[#A8A29A] group-hover:text-[#F5F0E8]'}>
                      {g === 'ALL' ? 'All Collections' : g === 'MEN' ? 'Men’s Atelier' : 'Women’s Couture'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories Filter */}
            <div>
              <h3 className="text-xs font-serif uppercase tracking-widestLuxury text-[#C5A46D] mb-3 pb-1 border-b border-[#262626]">
                Product Category
              </h3>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'ALL'}
                    onChange={() => setSelectedCategory('ALL')}
                    className="accent-[#C5A46D]"
                  />
                  <span className={selectedCategory === 'ALL' ? 'text-[#C5A46D] font-medium' : 'text-[#A8A29A] group-hover:text-[#F5F0E8]'}>
                    All Categories
                  </span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.slug}
                      onChange={() => setSelectedCategory(cat.slug)}
                      className="accent-[#C5A46D]"
                    />
                    <span className={selectedCategory === cat.slug ? 'text-[#C5A46D] font-medium' : 'text-[#A8A29A] group-hover:text-[#F5F0E8]'}>
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Collection Filter */}
            <div>
              <h3 className="text-xs font-serif uppercase tracking-widestLuxury text-[#C5A46D] mb-3 pb-1 border-b border-[#262626]">
                Collection
              </h3>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="collection"
                    checked={selectedCollection === 'ALL'}
                    onChange={() => setSelectedCollection('ALL')}
                    className="accent-[#C5A46D]"
                  />
                  <span className={selectedCollection === 'ALL' ? 'text-[#C5A46D] font-medium' : 'text-[#A8A29A] group-hover:text-[#F5F0E8]'}>
                    All Releases
                  </span>
                </label>
                {collections.map((col) => (
                  <label key={col.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="collection"
                      checked={selectedCollection === col.slug}
                      onChange={() => setSelectedCollection(col.slug)}
                      className="accent-[#C5A46D]"
                    />
                    <span className={selectedCollection === col.slug ? 'text-[#C5A46D] font-medium' : 'text-[#A8A29A] group-hover:text-[#F5F0E8]'}>
                      {col.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="text-xs font-serif uppercase tracking-widestLuxury text-[#C5A46D] mb-3 pb-1 border-b border-[#262626]">
                Price Range
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { id: 'ALL', label: 'All Price Ranges' },
                  { id: 'UNDER_5K', label: 'Under ₹5,000' },
                  { id: '5K_10K', label: '₹5,000 - ₹10,000' },
                  { id: '10K_20K', label: '₹10,000 - ₹20,000' },
                  { id: 'ABOVE_20K', label: 'Above ₹20,000' },
                ].map((p) => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="price"
                      checked={priceBucket === p.id}
                      onChange={() => setPriceBucket(p.id)}
                      className="accent-[#C5A46D]"
                    />
                    <span className={priceBucket === p.id ? 'text-[#C5A46D] font-medium' : 'text-[#A8A29A] group-hover:text-[#F5F0E8]'}>
                      {p.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-xs font-serif uppercase tracking-widestLuxury text-[#C5A46D] mb-3 pb-1 border-b border-[#262626]">
                Availability & Status
              </h3>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyNewArrivals}
                    onChange={(e) => setOnlyNewArrivals(e.target.checked)}
                    className="accent-[#C5A46D]"
                  />
                  <span className="text-[#A8A29A]">New Arrivals Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="accent-[#C5A46D]"
                  />
                  <span className="text-[#A8A29A]">In Stock Immediately</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="py-24 text-center">
                <RefreshCw className="w-8 h-8 text-[#C5A46D] animate-spin mx-auto mb-3" />
                <p className="font-serif text-sm tracking-widest text-[#A8A29A] uppercase">
                  Curating Boutique Creations...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center border border-[#262626] bg-[#121212] p-8">
                <p className="font-serif text-xl text-[#F5F0E8] mb-2">No creations match the selected criteria</p>
                <p className="text-xs text-[#A8A29A] mb-6">
                  Try adjusting or clearing your filters to discover our current pieces.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#E0C18A] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-[#0E0E0E] border-l border-[#34312D] p-6 text-[#F5F0E8] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-[#262626] pb-4">
                <h3 className="font-serif text-lg tracking-widest uppercase">Filter Boutique</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-[#A8A29A] hover:text-[#C5A46D]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Gender */}
              <div>
                <h4 className="text-xs text-[#C5A46D] uppercase tracking-widest font-mono mb-2">Gender</h4>
                {['ALL', 'MEN', 'WOMEN'].map((g) => (
                  <button
                    key={g}
                    onClick={() => { setSelectedGender(g); setMobileFilterOpen(false); }}
                    className={`block w-full text-left py-1 text-xs ${selectedGender === g ? 'text-[#C5A46D] font-bold' : 'text-[#A8A29A]'}`}
                  >
                    {g === 'ALL' ? 'All' : g}
                  </button>
                ))}
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs text-[#C5A46D] uppercase tracking-widest font-mono mb-2">Categories</h4>
                <button
                  onClick={() => { setSelectedCategory('ALL'); setMobileFilterOpen(false); }}
                  className={`block w-full text-left py-1 text-xs ${selectedCategory === 'ALL' ? 'text-[#C5A46D] font-bold' : 'text-[#A8A29A]'}`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCategory(c.slug); setMobileFilterOpen(false); }}
                    className={`block w-full text-left py-1 text-xs ${selectedCategory === c.slug ? 'text-[#C5A46D] font-bold' : 'text-[#A8A29A]'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-[#262626] space-y-2">
                <button
                  onClick={() => { clearAllFilters(); setMobileFilterOpen(false); }}
                  className="w-full py-2.5 border border-[#34312D] text-xs uppercase tracking-widest text-[#A8A29A]"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-2.5 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold"
                >
                  Apply Filters ({products.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-[#C5A46D]">Loading Boutique...</div>}>
      <ShopContent />
    </Suspense>
  );
}

