'use client';

import React, { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { X, Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  const { settings } = useSettings();
  const [dismissed, setDismissed] = useState(false);

  if (!settings.announcementEnabled || dismissed) return null;

  return (
    <div className="relative bg-[#0E0E0E] text-[#F5F0E8] border-b border-[#34312D] py-2 px-4 text-xs tracking-widestLuxury text-center z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <Sparkles className="w-3 h-3 text-[#C5A46D] hidden sm:inline-block animate-pulse" />
        <span className="font-medium uppercase text-[11px] sm:text-xs">
          {settings.announcementText}
        </span>
        <Sparkles className="w-3 h-3 text-[#C5A46D] hidden sm:inline-block animate-pulse" />
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29A] hover:text-[#C5A46D] transition-colors p-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

