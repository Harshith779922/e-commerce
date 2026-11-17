'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { Coupon } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import {
  Tag,
  Plus,
  Trash2,
  Sparkles,
  Settings,
  Bell,
  Check,
  Percent,
} from 'lucide-react';

export default function AdminMarketingPage() {
  const { settings, updateSettings } = useSettings();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Form for new coupon
  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [newValue, setNewValue] = useState('');
  const [newMinOrder, setNewMinOrder] = useState('2000');
  const [newMaxDiscount, setNewMaxDiscount] = useState('');
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);

  // Settings form state
  const [brandingForm, setBrandingForm] = useState({
    brandName: settings.brandName,
    brandLocation: settings.brandLocation,
    announcementText: settings.announcementText,
    announcementEnabled: settings.announcementEnabled,
    freeShippingThreshold: settings.freeShippingThreshold,
  });

  const [savedSettings, setSavedSettings] = useState(false);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newValue) return;
    setIsCreatingCoupon(true);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCode,
          description: newDesc,
          discountType: newType,
          discountValue: parseFloat(newValue),
          minOrderValue: parseFloat(newMinOrder) || 0,
          maxDiscount: newMaxDiscount ? parseFloat(newMaxDiscount) : null,
        }),
      });

      if (res.ok) {
        setNewCode('');
        setNewDesc('');
        setNewValue('');
        loadCoupons();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreatingCoupon(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(brandingForm);
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  return (
    <div className="p-6 sm:p-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#242424] gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-megaLuxury uppercase text-[#C5A46D] block mb-1">
            Storefront Configurations
          </span>
          <h1 className="font-serif text-3xl text-[#F5F0E8] uppercase tracking-wide font-light">
            Marketing & Store Configuration
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Brand & Announcement Settings (6 Cols) */}
        <div className="lg:col-span-6 bg-[#121212] border border-[#2B2B2B] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 text-[#C5A46D] pb-3 border-b border-[#242424]">
            <Settings className="w-4 h-4" />
            <h2 className="font-serif text-base uppercase tracking-widest text-[#F5F0E8]">
              Branding & Salon Announcements
            </h2>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brandingForm.brandName}
                  onChange={(e) => setBrandingForm({ ...brandingForm, brandName: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                  Brand Subtitle / Origin
                </label>
                <input
                  type="text"
                  value={brandingForm.brandLocation}
                  onChange={(e) => setBrandingForm({ ...brandingForm, brandLocation: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                Announcement Bar Message
              </label>
              <input
                type="text"
                value={brandingForm.announcementText}
                onChange={(e) => setBrandingForm({ ...brandingForm, announcementText: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={brandingForm.announcementEnabled}
                  onChange={(e) => setBrandingForm({ ...brandingForm, announcementEnabled: e.target.checked })}
                  className="accent-[#C5A46D]"
                />
                <span className="text-[#A8A29A]">Enable Announcement Bar</span>
              </label>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                Free Shipping Threshold (INR)
              </label>
              <input
                type="number"
                value={brandingForm.freeShippingThreshold}
                onChange={(e) => setBrandingForm({ ...brandingForm, freeShippingThreshold: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#E0C18A] transition-colors flex items-center justify-center gap-2"
            >
              {savedSettings ? (
                <>
                  <Check className="w-4 h-4" /> Changes Applied Live!
                </>
              ) : (
                'Save Storefront Configuration'
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Privilege & Coupon Management (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Create Coupon Card */}
          <div className="bg-[#121212] border border-[#2B2B2B] p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#C5A46D] pb-3 border-b border-[#242424]">
              <Tag className="w-4 h-4" />
              <h2 className="font-serif text-base uppercase tracking-widest text-[#F5F0E8]">
                Create Privilege Promo Code
              </h2>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIP2026"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs font-mono uppercase text-[#F5F0E8] focus:border-[#C5A46D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    placeholder="10 or 2500"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={newMaxDiscount}
                    onChange={(e) => setNewMaxDiscount(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Exclusive 10% welcome privilege"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                />
              </div>

              <button
                type="submit"
                disabled={isCreatingCoupon}
                className="w-full py-2.5 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#E0C18A] transition-colors"
              >
                {isCreatingCoupon ? 'Creating...' : '+ Create Privilege Code'}
              </button>
            </form>
          </div>

          {/* Active Coupons List */}
          <div className="bg-[#121212] border border-[#2B2B2B] p-6 space-y-3">
            <h3 className="font-serif text-sm uppercase tracking-widest text-[#F5F0E8] border-b border-[#242424] pb-2">
              Active Privilege Codes ({coupons.length})
            </h3>
            <div className="space-y-2">
              {coupons.map((c) => (
                <div key={c.id} className="p-3 bg-[#171717] border border-[#242424] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#C5A46D] tracking-wider block">
                      {c.code}
                    </span>
                    <p className="text-[11px] text-[#A8A29A]">{c.description}</p>
                    <p className="text-[10px] text-[#777] font-mono mt-0.5">
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% off` : `₹${c.discountValue} off`} • Min Order: ₹{c.minOrderValue}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-green-950 text-green-300 font-mono text-[9px] uppercase border border-green-800">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

