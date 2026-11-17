'use client';

import React from 'react';
import { Truck, Sparkles, ShieldCheck, RotateCcw } from 'lucide-react';

const benefits = [
  {
    icon: Truck,
    title: 'COMPLIMENTARY SHIPPING',
    description: 'On all orders above ₹4,999 across India.',
  },
  {
    icon: Sparkles,
    title: 'PREMIUM CRAFTSMANSHIP',
    description: 'Hand-tailored precision with exceptional natural textiles.',
  },
  {
    icon: ShieldCheck,
    title: 'SECURE PAYMENTS',
    description: '256-bit encrypted Razorpay gateway with UPI and cards.',
  },
  {
    icon: RotateCcw,
    title: 'EASY RETURNS',
    description: '14-day seamless concierge exchange and returns policy.',
  },
];

export default function BrandBenefits() {
  return (
    <section className="bg-[#141414] border-y border-[#262626] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#2B2B2B]">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 px-0 lg:px-6 justify-start lg:justify-center group"
              >
                <div className="p-3 border border-[#2E2E2E] group-hover:border-[#B89A6A] bg-[#191919] transition-colors rounded-none flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#B89A6A]" />
                </div>
                <div>
                  <h4 className="font-serif text-xs text-[#F5F2EC] tracking-widest uppercase mb-1 font-medium group-hover:text-[#B89A6A] transition-colors">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-[#85817A] leading-relaxed font-light">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
