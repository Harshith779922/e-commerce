'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';
import { Instagram, Facebook, ShieldCheck, Check } from 'lucide-react';

export default function Footer() {
  const { settings } = useSettings();
  const [currency, setCurrency] = useState('INR (₹)');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      setSubscribed(true);
      setNewsletterEmail('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <footer className="bg-[#0B0B0B] text-[#85817A] border-t border-[#262626] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding & Mission */}
        <div className="text-center max-w-2xl mx-auto mb-16 pb-12 border-b border-[#1E1E1E]">
          <Link href="/" className="inline-block mb-3">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] text-[#F5F2EC] uppercase font-light">
              {settings.brandName}
            </span>
          </Link>
          <p className="text-xs text-[#85817A] leading-relaxed max-w-lg mx-auto font-light mt-2">
            Contemporary silhouettes, exceptional craftsmanship, and timeless designer fashion crafted with intention.
          </p>
        </div>

        {/* 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-xs">
          {/* Column 1: Collections */}
          <div>
            <h4 className="font-serif text-sm text-[#F5F2EC] tracking-widest uppercase mb-4 border-b border-[#222] pb-1.5 inline-block">
              Boutique
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/men" className="hover:text-[#B89A6A] transition-colors">
                  Shop Men
                </Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-[#B89A6A] transition-colors">
                  Shop Women
                </Link>
              </li>
              <li>
                <Link href="/shop?newArrival=true" className="hover:text-[#B89A6A] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/accessories" className="hover:text-[#B89A6A] transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/collections/the-signature-collection" className="hover:text-[#B89A6A] transition-colors">
                  Signature Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Client Service */}
          <div>
            <h4 className="font-serif text-sm text-[#F5F2EC] tracking-widest uppercase mb-4 border-b border-[#222] pb-1.5 inline-block">
              Client Service
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/account" className="hover:text-[#B89A6A] transition-colors">
                  Track Consignment
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#B89A6A] transition-colors" onClick={() => alert('Complimentary white-glove shipping on orders above ₹4,999 with 2-4 day expedited transit.')}>
                  Shipping & Returns
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#B89A6A] transition-colors" onClick={() => alert('14-day hassle-free return and exchange policy with bespoke doorstep pickup.')}>
                  FAQs
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#B89A6A] transition-colors" onClick={() => alert('Concierge available 24/7 at concierge@example-ecom.com or WhatsApp.')}>
                  Contact Us
                </span>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#B89A6A] transition-colors">
                  Sizing Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About Us */}
          <div>
            <h4 className="font-serif text-sm text-[#F5F2EC] tracking-widest uppercase mb-4 border-b border-[#222] pb-1.5 inline-block">
              About Us
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="cursor-pointer hover:text-[#B89A6A] transition-colors" onClick={() => alert('EXAMPLE E-COM was founded with a singular vision: contemporary luxury combining timeless craftsmanship with modern usability.')}>
                  Our Story
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#B89A6A] transition-colors" onClick={() => alert('Full floating canvas, Giza cotton and hand-rolled Como silk define our textile standards.')}>
                  Craftsmanship & Heritage
                </span>
              </li>
              <li>
                <Link href="/#editorial" className="hover:text-[#B89A6A] transition-colors">
                  The Style Journal
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#B89A6A] transition-colors" onClick={() => alert('Terms & Conditions: Standard luxury e-commerce service terms apply.')}>
                  Terms & Conditions
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#B89A6A] transition-colors" onClick={() => alert('Privacy Policy: We treat client identity with uncompromising discretion and data encryption.')}>
                  Privacy Policy
                </span>
              </li>
              <li>
                <Link href="/admin" className="text-[#B89A6A] hover:underline flex items-center gap-1 font-medium pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Staff Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Club */}
          <div>
            <h4 className="font-serif text-sm text-[#F5F2EC] tracking-widest uppercase mb-4 border-b border-[#222] pb-1.5 inline-block">
              The Circle
            </h4>
            <p className="text-[11px] leading-relaxed mb-3 text-[#85817A]">
              Discover new collections, exclusive releases and private previews.
            </p>
            {subscribed ? (
              <p className="text-xs text-[#B89A6A] flex items-center gap-1 py-2">
                <Check className="w-4 h-4" /> You are enrolled in the circle.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2B2B2B] px-3 py-2 text-xs text-[#F5F2EC] placeholder-[#666] focus:outline-none focus:border-[#B89A6A]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#B89A6A] text-black text-[11px] uppercase tracking-widest font-semibold hover:bg-[#CDB388] transition-colors"
                >
                  Join the Circle
                </button>
              </form>
            )}

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-5 text-[#85817A]">
              <a
                href={settings.socialInstagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-[#B89A6A] transition-colors p-1"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.socialFacebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="hover:text-[#B89A6A] transition-colors p-1"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Country / Currency Selector, Payments, Legal */}
        <div className="pt-8 border-t border-[#1C1C1C] flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-[#7A756E]">
          {/* Currency / Region */}
          <div className="flex items-center gap-3">
            <span className="uppercase tracking-widest text-[#F5F2EC]">Region & Currency:</span>
            <div className="relative inline-block border border-[#2B2B2B] bg-[#141414] px-3 py-1">
              <span className="text-[#B89A6A] font-mono">India / {currency}</span>
            </div>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-3">
            <span className="tracking-widest uppercase text-[10px]">Payment Methods:</span>
            <div className="flex items-center gap-2 text-[#999]">
              <span className="px-2 py-0.5 border border-[#2E2E2E] text-[9px] bg-[#141414]">UPI</span>
              <span className="px-2 py-0.5 border border-[#2E2E2E] text-[9px] bg-[#141414]">RuPay</span>
              <span className="px-2 py-0.5 border border-[#2E2E2E] text-[9px] bg-[#141414]">VISA</span>
              <span className="px-2 py-0.5 border border-[#2E2E2E] text-[9px] bg-[#141414]">Mastercard</span>
              <span className="px-2 py-0.5 border border-[#2E2E2E] text-[9px] bg-[#141414] text-[#B89A6A]">Razorpay</span>
            </div>
          </div>

          {/* Copyright */}
          <div>
            <p>© {new Date().getFullYear()} {settings.brandName}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
