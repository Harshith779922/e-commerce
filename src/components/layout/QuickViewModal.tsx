'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatINR } from '@/lib/utils';
import { X, Heart, ShoppingBag, Check, ShieldCheck, Ruler } from 'lucide-react';
import SizeGuideModal from './SizeGuideModal';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Initialize selected variants on product load
  React.useEffect(() => {
    if (product && product.variants?.length) {
      setSelectedSize(product.variants[0].size);
      setSelectedColor(product.variants[0].colorName);
      setSelectedImageIdx(0);
      setQuantity(1);
      setAdded(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const currentVariant = product.variants?.find(
    (v) => v.size === selectedSize && v.colorName === selectedColor
  ) || product.variants?.[0];

  const maxStock = currentVariant ? currentVariant.stockQuantity : 10;
  const isOutOfStock = maxStock <= 0;
  const inWishlist = isInWishlist(product.id);

  // Unique sizes and colors
  const sizes = Array.from(new Set(product.variants?.map((v) => v.size) || []));
  const colors = Array.from(
    new Map(product.variants?.map((v) => [v.colorName, v.colorHex]) || []).entries()
  );

  const handleAddToCart = () => {
    if (!currentVariant || isOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: currentVariant.id,
      name: product.name,
      slug: product.slug,
      price: product.salePrice || product.price,
      image: product.images[0]?.url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600',
      size: selectedSize,
      color: selectedColor,
      quantity,
      maxStock,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
        <div className="relative bg-[#111111] border border-[#34312D] text-[#F5F0E8] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-10 p-2 text-[#A8A29A] hover:text-[#C5A46D] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Image Gallery */}
            <div className="p-6 bg-[#0E0E0E] flex flex-col justify-between">
              <div className="aspect-[3/4] overflow-hidden border border-[#262626] mb-4">
                <img
                  src={product.images[selectedImageIdx]?.url || product.images[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`w-14 h-16 border overflow-hidden transition-all ${
                        selectedImageIdx === idx ? 'border-[#C5A46D]' : 'border-[#333] opacity-60'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details & Purchase */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div>
                <p className="text-[10px] tracking-widestLuxury text-[#C5A46D] uppercase mb-1">
                  {product.gender} • {product.category?.name || 'Exclusive Atelier'}
                </p>
                <h2 className="font-serif text-2xl text-[#F5F0E8] leading-tight mb-2">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 mb-4">
                  <span className="font-sans text-xl text-[#C5A46D] font-medium">
                    {formatINR(product.salePrice || product.price)}
                  </span>
                  {product.salePrice && (
                    <span className="text-xs line-through text-[#A8A29A]">
                      {formatINR(product.price)}
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 border border-[#34312D] text-[#A8A29A] uppercase">
                    SKU: {product.sku}
                  </span>
                </div>

                <p className="text-xs text-[#A8A29A] leading-relaxed mb-6 font-light">
                  {product.shortDescription || product.description.slice(0, 180) + '...'}
                </p>

                {/* Color swatches */}
                {colors.length > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-[#A8A29A] uppercase tracking-wider text-[11px]">Colour</span>
                      <span className="text-[#F5F0E8] font-medium">{selectedColor}</span>
                    </div>
                    <div className="flex gap-2">
                      {colors.map(([name, hex]) => (
                        <button
                          key={name}
                          onClick={() => setSelectedColor(name)}
                          title={name}
                          className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                            selectedColor === name ? 'border-[#C5A46D] scale-110' : 'border-[#333]'
                          }`}
                        >
                          <span
                            className="block w-full h-full rounded-full"
                            style={{ backgroundColor: hex || '#000' }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {sizes.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-[#A8A29A] uppercase tracking-wider text-[11px]">Sartorial Size</span>
                      <button
                        onClick={() => setShowSizeGuide(true)}
                        className="text-[10px] text-[#C5A46D] hover:underline flex items-center gap-1 uppercase tracking-wider"
                      >
                        <Ruler className="w-3 h-3" /> Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3 py-1.5 text-xs font-mono border transition-all ${
                            selectedSize === s
                              ? 'border-[#C5A46D] bg-[#C5A46D] text-black font-semibold'
                              : 'border-[#34312D] text-[#F5F0E8] hover:border-[#C5A46D]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-[#262626]">
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || added}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all ${
                      added
                        ? 'bg-green-600 text-white'
                        : isOutOfStock
                        ? 'bg-[#222] text-[#666] cursor-not-allowed'
                        : 'bg-[#C5A46D] text-black hover:bg-[#E0C18A] shadow-luxury'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Bag
                      </>
                    ) : isOutOfStock ? (
                      'Out of Stock'
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`px-4 py-3.5 border transition-colors ${
                      inWishlist
                        ? 'border-[#C5A46D] text-[#C5A46D]'
                        : 'border-[#34312D] text-[#A8A29A] hover:text-[#F5F0E8] hover:border-[#C5A46D]'
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="block text-center text-xs uppercase tracking-widest text-[#A8A29A] hover:text-[#C5A46D] underline py-1 transition-colors"
                >
                  View Full Product Specification & Care Guide →
                </Link>

                <div className="flex items-center justify-center gap-2 text-[10px] text-[#7A756E] pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>Complimentary Shipping & 14-Day Milanese Return Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </>
  );
}

