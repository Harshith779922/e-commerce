'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#34312D] text-[#A8A29A] hover:text-[#C5A46D] hover:border-[#C5A46D] text-xs uppercase tracking-wider transition-colors"
    >
      <Printer className="w-3.5 h-3.5" />
      <span>Print Invoice</span>
    </button>
  );
}

