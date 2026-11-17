'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';
import ELMonogram from '@/components/common/ELMonogram';
import { Instagram, Facebook, ShieldCheck, Check, ArrowRight } from 'lucide-react';

export default function Footer() {
  const { settings } = useSettings();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#101010] text-[#85817B] border-t border-[#241C1C] pt-20 pb-14 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Chapter 8 Headline / Sign-off */}
        <div className="text-center max-w-2xl mx-auto mb-16 pb-12 border-b border-[#241C1C]">
          <div className="flex justify-center mb-5">
            <ELMonogram className="w-12 h-12 text-[#B69A63]" variant="framed" />
          </div>

          <Link href="/" className="inline-block mb-2">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.35em] text-[#F2EEE5] uppercase font-light">
              ELYON LECLAIR
            </span>
          </Link>
          <p className="text-[10px] font-mono tracking-[0.4em] text-[#B69A63] uppercase">
            MAISON DE HAUTE COUTURE · CHAPTER VIII · THE SIGNATURE
          </p>

          <p className="text-xs text-[#85817B] leading-relaxed max-w-md mx-auto font-light mt-4">
            An architectural study in modern couture. Where silhouette commands presence and craftsmanship endures across generations.
          </p>
        </div>

        {/* Newsletter Privilege Section */}
        <div className="mb-16 p-8 bg-[#141010] border border-[#2A2424] max-w-3xl mx-auto text-center">
          <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#B69A63] font-medium mb-1">
            PRIVATE PRIVILEGE REGISTRY
          </p>
          <h3 className="font-serif text-xl sm:text-2xl text-[#F2EEE5] font-light mb-2">
            Receive Private Salon Invitations & Collection Previews
          </h3>
          <p className="text-xs text-[#85817B] mb-6 max-w-md mx-auto">
            Subscribers receive advance previews of seasonal releases and complimentary white-glove courier dispatch.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 p-3 bg-[#4B171C]/40 border border-[#B69A63]/50 text-[#F2EEE5] text-xs">
              <Check className="w-4 h-4 text-[#B69A63]" />
              <span>Welcome to the House of Elyon. Your invitation code has been dispatched.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your private email..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 bg-[#101010] border border-[#2A2424] px-4 py-2.5 text-xs text-[#F2EEE5] placeholder-[#666] focus:outline-none focus:border-[#B69A63]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#B69A63] text-black text-xs font-semibold tracking-widest uppercase hover:bg-[#CDB388] transition-colors flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? '...' : 'Register'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 text-xs">
          {/* Column 1: Collections */}
          <div>
            <h4 className="font-serif text-sm text-[#F2EEE5] tracking-widest uppercase mb-4 border-b border-[#241C1C] pb-1.5 inline-block">
              Atelier Collections
            </h4>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <Link href="/men" className="hover:text-[#B69A63] transition-colors">
                  Men's Wardrobe
                </Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-[#B69A63] transition-colors">
                  Women's Wardrobe
                </Link>
              </li>
              <li>
                <Link href="/collections/the-signature-collection" className="hover:text-[#B69A63] transition-colors">
                  The Signature Collection
                </Link>
              </li>
              <li>
                <Link href="/collections/the-dolce-collection" className="hover:text-[#B69A63] transition-colors">
                  Alta Notte Gala Evening
                </Link>
              </li>
              <li>
                <Link href="/accessories" className="hover:text-[#B69A63] transition-colors">
                  Tuscan Leather & Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: The Maison */}
          <div>
            <h4 className="font-serif text-sm text-[#F2EEE5] tracking-widest uppercase mb-4 border-b border-[#241C1C] pb-1.5 inline-block">
              The Maison
            </h4>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <Link href="/maison" className="hover:text-[#B69A63] transition-colors">
                  House of Elyon Story
                </Link>
              </li>
              <li>
                <Link href="/maison#craftsmanship" className="hover:text-[#B69A63] transition-colors">
                  The Art of Canvassing
                </Link>
              </li>
              <li>
                <Link href="/maison#textiles" className="hover:text-[#B69A63] transition-colors">
                  Lombard Silk Provenance
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#B69A63] transition-colors">
                  Private Salon Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Concierge */}
          <div>
            <h4 className="font-serif text-sm text-[#F2EEE5] tracking-widest uppercase mb-4 border-b border-[#241C1C] pb-1.5 inline-block">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-[11px]">
              <li>
                <Link href="/account" className="hover:text-[#B69A63] transition-colors">
                  Client Account & Orders
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#B69A63] transition-colors">
                  Concierge Support & Fitting
                </Link>
              </li>
              <li>
                <span className="text-[#85817B]">White-Glove Delivery (India & Worldwide)</span>
              </li>
              <li>
                <span className="text-[#85817B]">Complimentary Exchanges (14 Days)</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Salons */}
          <div>
            <h4 className="font-serif text-sm text-[#F2EEE5] tracking-widest uppercase mb-4 border-b border-[#241C1C] pb-1.5 inline-block">
              Private Salons
            </h4>
            <div className="space-y-3 text-[11px] text-[#85817B]">
              <p>
                <strong className="text-[#F2EEE5] block">Maison Atelier:</strong>
                Via Montenapoleone 18, Milano
              </p>
              <p>
                <strong className="text-[#F2EEE5] block">Client Salon:</strong>
                The Chanakya, Chanakyapuri, New Delhi
              </p>
              <p className="pt-2 text-xs text-[#B69A63]">
                concierge@elyonleclair.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Security */}
        <div className="pt-8 border-t border-[#1F1919] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} ELYON LECLAIR. All rights reserved. Maison de Haute Couture.</p>

          <div className="flex items-center gap-6 text-[#85817B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B69A63]" />
              256-Bit Encrypted Checkout
            </span>
            <span>•</span>
            <span className="font-mono text-[#B69A63]">INR (₹)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
