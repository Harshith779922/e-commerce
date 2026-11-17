'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    shipping,
    total,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const freeShippingThreshold = 4999;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput.trim());
    setIsApplying(false);
  };

  return (
    <div className="bg-[#0B0B0B] text-[#F5F0E8] min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-[10px] uppercase tracking-widestLuxury text-[#A8A29A] mb-4">
          <Link href="/" className="hover:text-[#C5A46D]">Boutique</Link>
          <span className="mx-2">/</span>
          <span className="text-[#C5A46D]">Shopping Bag</span>
        </nav>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#F5F0E8] uppercase tracking-wide font-light mb-2">
          Your Shopping Bag
        </h1>
        <p className="text-xs text-[#A8A29A] mb-8 font-light">
          {items.length} {items.length === 1 ? 'creation' : 'creations'} awaiting bespoke packaging.
        </p>

        {items.length === 0 ? (
          <div className="text-center py-24 border border-[#2B2B2B] bg-[#121212] p-8 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full border border-[#34312D] flex items-center justify-center mx-auto mb-4 text-[#C5A46D]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl text-[#F5F0E8] mb-2">Your Bag is Empty</h2>
            <p className="text-xs text-[#A8A29A] max-w-sm mx-auto mb-8 font-light">
              Explore our latest tailoring collections and timeless leather goods.
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#E0C18A] transition-colors"
            >
              Explore Boutique Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Items Table (7 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free shipping banner */}
              <div className="bg-[#141414] border border-[#2B2B2B] p-4 text-xs">
                {remainingForFreeShipping > 0 ? (
                  <p className="text-[#A8A29A]">
                    Add <span className="text-[#C5A46D] font-medium">{formatINR(remainingForFreeShipping)}</span> more to qualify for complimentary white-glove express delivery.
                  </p>
                ) : (
                  <p className="text-[#C5A46D] flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-4 h-4" /> Complimentary white-glove courier shipping unlocked!
                  </p>
                )}
                <div className="w-full bg-[#242424] h-1.5 mt-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#9A7B4F] to-[#E0C18A] h-full transition-all duration-500"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#242424] border-y border-[#242424]">
                {items.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                    <div className="flex gap-4">
                      <Link href={`/product/${item.slug}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-28 object-cover border border-[#2B2B2B] hover:opacity-90 transition-opacity"
                        />
                      </Link>
                      <div>
                        <Link href={`/product/${item.slug}`}>
                          <h3 className="font-serif text-base text-[#F5F0E8] hover:text-[#C5A46D] transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-[#A8A29A] mt-1">
                          Size: <span className="text-[#F5F0E8] font-mono">{item.size}</span> | Hue:{' '}
                          <span className="text-[#F5F0E8]">{item.color}</span>
                        </p>
                        <p className="text-xs text-[#C5A46D] font-sans font-medium mt-2">
                          {formatINR(item.price)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#34312D] bg-[#141414]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2.5 py-1 text-xs text-[#A8A29A] hover:text-[#F5F0E8]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="px-2.5 py-1 text-xs text-[#A8A29A] hover:text-[#F5F0E8] disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-sans text-sm font-semibold text-[#F5F0E8]">
                          {formatINR(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                          className="text-[#A8A29A] hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4">
                <Link
                  href="/shop"
                  className="text-xs uppercase tracking-widest text-[#A8A29A] hover:text-[#C5A46D] underline"
                >
                  ← Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs uppercase tracking-widest text-[#A8A29A] hover:text-red-400"
                >
                  Empty Bag
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary (4 Cols) */}
            <div className="lg:col-span-4 bg-[#121212] border border-[#2B2B2B] p-6 space-y-6">
              <h2 className="font-serif text-lg text-[#F5F0E8] tracking-widest uppercase pb-3 border-b border-[#262626]">
                Order Summary
              </h2>

              {/* Privilege Code */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between p-3 bg-[#C5A46D]/10 border border-[#C5A46D]/30 text-xs">
                    <div className="flex items-center gap-2 text-[#C5A46D]">
                      <Tag className="w-4 h-4" />
                      <div>
                        <p className="font-mono font-bold tracking-wider">{coupon.code}</p>
                        <p className="text-[10px] text-[#A8A29A]">{coupon.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[#A8A29A] hover:text-red-400 text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Privilege Code (MILANO10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs uppercase tracking-wider text-[#F5F0E8] placeholder-[#777] focus:outline-none focus:border-[#C5A46D]"
                      />
                      <button
                        type="submit"
                        disabled={isApplying || !couponInput.trim()}
                        className="px-4 py-2 bg-[#262626] border border-[#34312D] text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black text-xs uppercase tracking-widest font-semibold transition-all"
                      >
                        {isApplying ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
                  </form>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-3 text-xs text-[#A8A29A] border-t border-[#262626] pt-4">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-[#F5F0E8] font-mono">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#C5A46D]">
                    <span>Privilege Savings</span>
                    <span className="font-mono">- {formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Courier</span>
                  <span className="text-[#F5F0E8]">
                    {shipping === 0 ? <span className="text-[#C5A46D] font-medium">Complimentary</span> : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif text-[#F5F0E8] pt-3 border-t border-[#262626] font-medium">
                  <span>Grand Total</span>
                  <span className="text-[#C5A46D] font-sans font-bold text-lg">{formatINR(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-3 pt-2">
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#9A7B4F] via-[#C5A46D] to-[#E0C18A] text-black font-semibold text-xs tracking-widestLuxury uppercase hover:brightness-110 transition-all shadow-luxury"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[10px] text-[#777] pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>Razorpay Verified 256-Bit Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

