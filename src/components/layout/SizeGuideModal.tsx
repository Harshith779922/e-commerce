'use client';

import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'men' | 'women'>('men');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-[#111111] border border-[#34312D] text-[#F5F0E8] w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close size guide"
          className="absolute top-6 right-6 text-[#A8A29A] hover:text-[#C5A46D] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 text-[#C5A46D] mb-2">
          <Ruler className="w-4 h-4" />
          <span className="text-[11px] uppercase tracking-widest font-mono">Bespoke Fit Guide</span>
        </div>
        <h2 className="font-serif text-2xl text-[#F5F0E8] mb-4">Sartorial Size Conversion</h2>
        <p className="text-xs text-[#A8A29A] leading-relaxed mb-6 font-light">
          Our garments are hand-tailored according to classical Milanese proportions. When between sizes, we recommend selecting the larger size for tailored alteration.
        </p>

        {/* Tab buttons */}
        <div className="flex border-b border-[#34312D] mb-6">
          <button
            onClick={() => setActiveTab('men')}
            className={`pb-2 px-4 text-xs uppercase tracking-widest transition-colors font-medium border-b-2 ${
              activeTab === 'men'
                ? 'border-[#C5A46D] text-[#C5A46D]'
                : 'border-transparent text-[#A8A29A] hover:text-[#F5F0E8]'
            }`}
          >
            Men’s Tailoring & Shirts
          </button>
          <button
            onClick={() => setActiveTab('women')}
            className={`pb-2 px-4 text-xs uppercase tracking-widest transition-colors font-medium border-b-2 ${
              activeTab === 'women'
                ? 'border-[#C5A46D] text-[#C5A46D]'
                : 'border-transparent text-[#A8A29A] hover:text-[#F5F0E8]'
            }`}
          >
            Women’s Couture & Dresses
          </button>
        </div>

        {/* Tables */}
        {activeTab === 'men' ? (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#34312D] text-[#C5A46D] font-mono text-[11px] uppercase">
                  <th className="py-2.5 px-3">Italian (IT)</th>
                  <th className="py-2.5 px-3">UK / US</th>
                  <th className="py-2.5 px-3">Chest (cm)</th>
                  <th className="py-2.5 px-3">Waist (cm)</th>
                  <th className="py-2.5 px-3">General</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222] text-[#A8A29A] font-mono text-[11px]">
                <tr>
                  <td className="py-2.5 px-3 text-[#F5F0E8] font-bold">46</td>
                  <td className="py-2.5 px-3">36</td>
                  <td className="py-2.5 px-3">92 - 95</td>
                  <td className="py-2.5 px-3">78 - 81</td>
                  <td className="py-2.5 px-3">S</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#F5F0E8] font-bold">48</td>
                  <td className="py-2.5 px-3">38</td>
                  <td className="py-2.5 px-3">96 - 99</td>
                  <td className="py-2.5 px-3">82 - 85</td>
                  <td className="py-2.5 px-3">M</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#F5F0E8] font-bold">50</td>
                  <td className="py-2.5 px-3">40</td>
                  <td className="py-2.5 px-3">100 - 103</td>
                  <td className="py-2.5 px-3">86 - 89</td>
                  <td className="py-2.5 px-3">L</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#F5F0E8] font-bold">52</td>
                  <td className="py-2.5 px-3">42</td>
                  <td className="py-2.5 px-3">104 - 107</td>
                  <td className="py-2.5 px-3">90 - 93</td>
                  <td className="py-2.5 px-3">XL</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#F5F0E8] font-bold">54</td>
                  <td className="py-2.5 px-3">44</td>
                  <td className="py-2.5 px-3">108 - 111</td>
                  <td className="py-2.5 px-3">94 - 98</td>
                  <td className="py-2.5 px-3">XXL</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#34312D] text-[#C5A46D] font-mono text-[11px] uppercase">
                  <th className="py-2.5 px-3">Italian (IT)</th>
                  <th className="py-2.5 px-3">FR</th>
                  <th className="py-2.5 px-3">UK</th>
                  <th className="py-2.5 px-3">Bust (cm)</th>
                  <th className="py-2.5 px-3">Waist (cm)</th>
                  <th className="py-2.5 px-3">Hips (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222] text-[#A8A29A] font-mono text-[11px]">
                <tr>
                  <td className="py-2.5 px-3 text-[#F5F0E8] font-bold">38 (XS)</td>
                  <td className="py-2.5 px-3">34</td>
                  <td className="py-2.5 px-3">6</td>
                  <td className="py-2.5 px-3">80 - 83</td>
                  <td className="py-2.5 px-3">60 - 63</td>
                  <td className="py-2.5 px-3">86 - 89</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#F5F0E8] font-bold">40 (S)</td>
                  <td className="py-2.5 px-3">36</td>
                  <td className="py-2.5 px-3">8</td>
                  <td className="py-2.5 px-3">84 - 87</td>
                  <td className="py-2.5 px-3">64 - 67</td>
                  <td className="py-2.5 px-3">90 - 93</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#F5F0E8] font-bold">42 (M)</td>
                  <td className="py-2.5 px-3">38</td>
                  <td className="py-2.5 px-3">10</td>
                  <td className="py-2.5 px-3">88 - 91</td>
                  <td className="py-2.5 px-3">68 - 71</td>
                  <td className="py-2.5 px-3">94 - 97</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-[#F5F0E8] font-bold">44 (L)</td>
                  <td className="py-2.5 px-3">40</td>
                  <td className="py-2.5 px-3">12</td>
                  <td className="py-2.5 px-3">92 - 95</td>
                  <td className="py-2.5 px-3">72 - 76</td>
                  <td className="py-2.5 px-3">98 - 102</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#34312D] text-[11px] text-[#A8A29A]">
          <p>Need bespoke tailoring advice? Our master tailors are available for private consultations.</p>
        </div>
      </div>
    </div>
  );
}

