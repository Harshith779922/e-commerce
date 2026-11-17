'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
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
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0E0E0E] border-l border-[#34312D] text-[#F5F0E8] flex flex-col shadow-2xl animate-slideLeft">
          {/* Header */}
          <div className="p-6 border-b border-[#34312D] flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg tracking-widest uppercase">Shopping Bag</h2>
              <p className="text-[11px] text-[#A8A29A] tracking-wider uppercase mt-0.5">
                {items.length} {items.length === 1 ? 'Creation' : 'Creations'} Selected
              </p>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close bag"
              className="text-[#A8A29A] hover:text-[#C5A46D] transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#171717] px-6 py-3 border-b border-[#34312D] text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-[11px] text-[#A8A29A]">
                Add <span className="text-[#C5A46D] font-medium">{formatINR(remainingForFreeShipping)}</span> more to qualify for complimentary white-glove delivery.
              </p>
            ) : (
              <p className="text-[11px] text-[#C5A46D] flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Complimentary white-glove delivery unlocked!
              </p>
            )}
            <div className="w-full bg-[#2A2A2A] h-1.5 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#9A7B4F] to-[#E0C18A] h-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full border border-[#34312D] flex items-center justify-center mb-4 text-[#A8A29A]">
                  <Sparkles className="w-6 h-6 text-[#C5A46D]" />
                </div>
                <h3 className="font-serif text-lg text-[#F5F0E8] mb-2">Your Bag is Empty</h3>
                <p className="text-xs text-[#A8A29A] max-w-xs mb-6">
                  Explore our timeless collections to discover handcrafted garments and leather creations.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-3 bg-[#C5A46D] text-black font-sans text-xs uppercase tracking-widest font-semibold hover:bg-[#E0C18A] transition-colors"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-[#141414] border border-[#2B2B2B] relative group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover border border-[#222]"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif text-xs text-[#F5F0E8] truncate font-medium">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                          className="text-[#A8A29A] hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#A8A29A] mt-1">
                        Size: <span className="text-[#F5F0E8] font-medium">{item.size}</span> | Color:{' '}
                        <span className="text-[#F5F0E8] font-medium">{item.color}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#262626]">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#34312D]">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-xs text-[#A8A29A] hover:text-[#F5F0E8] hover:bg-[#222]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="px-2 py-0.5 text-xs text-[#A8A29A] hover:text-[#F5F0E8] hover:bg-[#222] disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-sans font-medium text-[#C5A46D]">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-[#121212] border-t border-[#34312D] space-y-4">
              {/* Promo Code Form */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#C5A46D]/10 border border-[#C5A46D]/30 text-xs">
                    <div className="flex items-center gap-2 text-[#C5A46D]">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="font-mono font-bold tracking-wider">{coupon.code}</span>
                      <span className="text-[10px] text-[#A8A29A]">({coupon.description})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[#A8A29A] hover:text-red-400 text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Privilege Code (e.g. MILANO10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs uppercase tracking-wider text-[#F5F0E8] placeholder-[#777] focus:outline-none focus:border-[#C5A46D]"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput.trim()}
                      className="px-4 py-2 bg-[#2A2A2A] border border-[#34312D] text-[#C5A46D] hover:bg-[#C5A46D] hover:text-black text-xs uppercase tracking-widest font-semibold transition-all disabled:opacity-40"
                    >
                      {isApplying ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-400 mt-1">{couponError}</p>}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-[#A8A29A]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#F5F0E8]">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#C5A46D]">
                    <span>Privilege Savings</span>
                    <span>- {formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="text-[#F5F0E8]">
                    {shipping === 0 ? <span className="text-[#C5A46D] font-medium">Complimentary</span> : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-serif text-[#F5F0E8] pt-2 border-t border-[#262626] font-medium">
                  <span>Grand Total</span>
                  <span className="text-[#C5A46D] font-sans font-bold">{formatINR(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#9A7B4F] via-[#C5A46D] to-[#E0C18A] text-black font-semibold text-xs tracking-widest uppercase hover:brightness-110 transition-all shadow-luxury"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full block text-center py-2.5 border border-[#34312D] text-[#A8A29A] hover:text-[#F5F0E8] hover:border-[#C5A46D] text-xs tracking-widest uppercase transition-colors"
                >
                  View Full Bag Details
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#777] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span>256-Bit Encrypted Secure Checkout with Razorpay</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

