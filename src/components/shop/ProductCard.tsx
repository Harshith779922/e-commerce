'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatINR } from '@/lib/utils';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import QuickViewModal from '../layout/QuickViewModal';

interface ProductCardProps {
  product: Product;
  theme?: 'dark' | 'light';
  showCategory?: boolean;
}

export default function ProductCard({
  product,
  theme = 'dark',
  showCategory = true,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600';
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  // Colors
  const colors = Array.from(
    new Map(product.variants?.map((v) => [v.colorName, v.colorHex]) || []).entries()
  );

  const defaultVariant = product.variants?.[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!defaultVariant) {
      setIsQuickViewOpen(true);
      return;
    }

    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      slug: product.slug,
      price: product.salePrice || product.price,
      image: primaryImage,
      size: defaultVariant.size,
      color: defaultVariant.colorName,
      quantity: 1,
      maxStock: defaultVariant.stockQuantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const isLight = theme === 'light';

  return (
    <>
      <div
        className={`group relative flex flex-col transition-all duration-500 ${
          isLight ? 'bg-[#F4F0E9] text-[#121212]' : 'bg-[#121212] text-[#F5F0E8]'
        } border ${isLight ? 'border-[#E2DDD5]' : 'border-[#262626]'} hover:border-[#C5A46D]/60`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges: NEW / LIMITED EDITION */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex flex-col gap-1">
          {product.isNewArrival && (
            <span className="bg-[#B89A6A] text-black text-[8px] sm:text-[9px] uppercase tracking-widest font-bold px-1.5 sm:px-2 py-0.5 shadow-sm">
              New Arrival
            </span>
          )}
          {product.salePrice && (
            <span className="bg-[#171717] text-[#B89A6A] border border-[#B89A6A]/50 text-[8px] sm:text-[9px] uppercase tracking-widest px-1.5 sm:px-2 py-0.5">
              Privilege Offer
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label="Wishlist toggle"
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm text-[#F5F0E8] hover:text-[#B89A6A] transition-colors"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              inWishlist ? 'text-[#B89A6A] fill-[#B89A6A]' : ''
            }`}
          />
        </button>

        {/* Product Image Frame */}
        <Link href={`/product/${product.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-[#0A0A0A]">
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Quick Actions Hover Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 sm:py-2 px-2 sm:px-3 bg-black/70 hover:bg-black text-[#F5F0E8] hover:text-[#B89A6A] text-[9px] sm:text-[10px] tracking-widest uppercase border border-[#444] transition-all backdrop-blur-sm font-medium"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </button>

            <button
              onClick={handleQuickAdd}
              aria-label="Quick Add"
              className={`p-1.5 sm:p-2 transition-all border ${
                added
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'bg-[#B89A6A] border-[#B89A6A] text-black hover:bg-[#E0C18A]'
              }`}
            >
              {added ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>
        </Link>

        {/* Product Details */}
        <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
          <div>
            {showCategory && product.category && (
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widestLuxury text-[#B89A6A] mb-1 font-mono">
                {product.category.name}
              </p>
            )}

            <Link href={`/product/${product.slug}`}>
              <h3
                className={`font-serif text-xs sm:text-sm tracking-wide line-clamp-1 mb-1.5 group-hover:text-[#B89A6A] transition-colors ${
                  isLight ? 'text-[#121212]' : 'text-[#F5F0E8]'
                }`}
              >
                {product.name}
              </h3>
            </Link>

            {/* Price */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="font-sans text-xs sm:text-sm font-medium text-[#B89A6A]">
                {formatINR(product.salePrice || product.price)}
              </span>
              {product.salePrice && (
                <span className="font-sans text-[10px] sm:text-xs line-through text-[#888]">
                  {formatINR(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Color Swatches */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-2 border-t border-[#222]/30">
              {colors.slice(0, 4).map(([name, hex], idx) => (
                <button
                  key={name}
                  onClick={() => setSelectedColorIdx(idx)}
                  title={name}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedColorIdx === idx ? 'ring-1 ring-[#C5A46D] scale-110' : 'border-[#444]'
                  }`}
                  style={{ backgroundColor: hex || '#111' }}
                />
              ))}
              {colors.length > 4 && (
                <span className="text-[9px] text-[#A8A29A] font-mono">+{colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}

