'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ELMonogram from '@/components/common/ELMonogram';
import { Mail, Phone, MapPin, Clock, Check, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Private Fitting Appointment',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="bg-[#101010] text-[#F2EEE5] min-h-screen pt-28 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="flex justify-center mb-3">
            <ELMonogram className="w-10 h-10 text-[#B69A63]" variant="minimal" />
          </div>
          <p className="text-[10px] font-sans tracking-[0.35em] text-[#B69A63] uppercase">
            CLIENT CONCIERGE & PRIVATE SALONS
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#F2EEE5] font-light tracking-tight">
            Contact the Maison
          </h1>
          <p className="text-xs sm:text-sm text-[#85817B] font-sans font-light leading-relaxed">
            Our private concierges are at your disposal for bespoke fitting appointments, order assistance, and worldwide white-glove dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Salon Addresses & Concierge Info */}
          <div className="lg:col-span-5 space-y-10">
            {/* Salon 1 */}
            <div className="p-6 bg-[#141010] border border-[#2A2424] space-y-3">
              <span className="text-[9px] font-mono tracking-widest text-[#B69A63] uppercase">
                ATELIER HEADQUARTERS
              </span>
              <h3 className="font-serif text-xl text-[#F2EEE5] font-light">
                Maison Elyon Leclair Milano
              </h3>
              <p className="text-xs text-[#85817B] leading-relaxed">
                Via Montenapoleone 18, 20121 Milano MI, Italy
              </p>
              <div className="pt-2 text-xs text-[#85817B] space-y-1">
                <p>Monday – Saturday: 10:00 – 19:30</p>
                <p>By private appointment only.</p>
              </div>
            </div>

            {/* Salon 2 */}
            <div className="p-6 bg-[#141010] border border-[#2A2424] space-y-3">
              <span className="text-[9px] font-mono tracking-widest text-[#B69A63] uppercase">
                SOUTH ASIA CLIENT SALON
              </span>
              <h3 className="font-serif text-xl text-[#F2EEE5] font-light">
                The Chanakya Private Suite
              </h3>
              <p className="text-xs text-[#85817B] leading-relaxed">
                Tikka Road, Chanakyapuri, New Delhi 110021, India
              </p>
              <div className="pt-2 text-xs text-[#85817B] space-y-1">
                <p>Tuesday – Sunday: 11:00 – 20:00</p>
                <p>Private fitting appointments accommodated upon request.</p>
              </div>
            </div>

            {/* Direct Contact Channels */}
            <div className="space-y-3 text-xs text-[#85817B] pt-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#B69A63]" />
                <span>concierge@elyonleclair.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#B69A63]" />
                <span>+91 98201 12345 / +39 02 8901 2345</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#B69A63]" />
                <span>24/7 Digital Concierge Support via VIP Portal</span>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-[#141010] border border-[#2A2424] p-8 sm:p-10">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-12 h-12 rounded-full border border-[#B69A63] flex items-center justify-center mx-auto text-[#B69A63]">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-[#F2EEE5] font-light">
                  Inquiry Dispatched
                </h3>
                <p className="text-xs text-[#85817B] max-w-sm mx-auto leading-relaxed">
                  Thank you for contacting the Maison. A senior client concierge will contact you within four business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 border border-[#B69A63] text-[#B69A63] text-xs uppercase tracking-widest hover:bg-[#B69A63] hover:text-black transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-serif text-2xl text-[#F2EEE5] font-light mb-6">
                  Transmit an Inquiry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-sans tracking-widest text-[#85817B] uppercase mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Lord / Lady / Devon Sterling"
                      className="w-full bg-[#101010] border border-[#2A2424] px-3.5 py-2.5 text-xs text-[#F2EEE5] placeholder-[#555] focus:outline-none focus:border-[#B69A63]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans tracking-widest text-[#85817B] uppercase mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="client@bespoke.com"
                      className="w-full bg-[#101010] border border-[#2A2424] px-3.5 py-2.5 text-xs text-[#F2EEE5] placeholder-[#555] focus:outline-none focus:border-[#B69A63]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-sans tracking-widest text-[#85817B] uppercase mb-1.5">
                      Contact Telephone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98000 00000"
                      className="w-full bg-[#101010] border border-[#2A2424] px-3.5 py-2.5 text-xs text-[#F2EEE5] placeholder-[#555] focus:outline-none focus:border-[#B69A63]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans tracking-widest text-[#85817B] uppercase mb-1.5">
                      Nature of Request
                    </label>
                    <select
                      value={form.inquiryType}
                      onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                      className="w-full bg-[#101010] border border-[#2A2424] px-3.5 py-2.5 text-xs text-[#F2EEE5] focus:outline-none focus:border-[#B69A63]"
                    >
                      <option value="Private Fitting Appointment">Private Fitting Appointment</option>
                      <option value="Bespoke Couture Commission">Bespoke Couture Commission</option>
                      <option value="Existing Order Inquiries">Existing Order Inquiries</option>
                      <option value="Gala & Black-Tie Sizing Advice">Gala & Black-Tie Sizing Advice</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-sans tracking-widest text-[#85817B] uppercase mb-1.5">
                    Your Message / Fitting Preferences
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Specify sizing, preferred salon location, or garment references..."
                    className="w-full bg-[#101010] border border-[#2A2424] p-3.5 text-xs text-[#F2EEE5] placeholder-[#555] focus:outline-none focus:border-[#B69A63]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#B69A63] text-black font-semibold text-xs tracking-[0.25em] uppercase hover:bg-[#CDB388] transition-colors flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Transmitting...' : 'Dispatch Inquiry to Concierge'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
