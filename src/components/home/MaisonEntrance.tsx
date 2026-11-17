'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ELMonogram from '@/components/common/ELMonogram';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';

interface MaisonEntranceProps {
  onEnter?: () => void;
}

export default function MaisonEntrance({ onEnter }: MaisonEntranceProps) {
  // Phase: 0 = Dark line of light, 1 = Monogram reveal, 2 = Wordmark transition, 3 = Full cinematic reveal
  const [phase, setPhase] = useState<number>(0);
  const [hasVisited, setHasVisited] = useState<boolean>(true); // default true for SSR safety
  const [isIntroActive, setIsIntroActive] = useState<boolean>(true);

  useEffect(() => {
    // Check if user already saw the cinematic intro in this browser session
    const seen = sessionStorage.getItem('elyon_intro_viewed');
    if (seen === 'true') {
      setHasVisited(true);
      setIsIntroActive(false);
      setPhase(3);
      return;
    }

    setHasVisited(false);
    setIsIntroActive(true);

    // Sequence timing (total ~3.2 seconds):
    // 0ms: Thin beam of light
    // 700ms: EL Monogram glows
    const timer1 = setTimeout(() => setPhase(1), 700);
    // 1700ms: Transitions to ELYON LECLAIR wordmark
    const timer2 = setTimeout(() => setPhase(2), 1700);
    // 2700ms: Screen opens, background campaign image reveals
    const timer3 = setTimeout(() => {
      setPhase(3);
      setIsIntroActive(false);
      sessionStorage.setItem('elyon_intro_viewed', 'true');
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleSkip = () => {
    setPhase(3);
    setIsIntroActive(false);
    sessionStorage.setItem('elyon_intro_viewed', 'true');
  };

  const handleReplayIntro = () => {
    setIsIntroActive(true);
    setPhase(0);
    setTimeout(() => setPhase(1), 600);
    setTimeout(() => setPhase(2), 1600);
    setTimeout(() => {
      setPhase(3);
      setIsIntroActive(false);
    }, 2800);
  };

  return (
    <>
      {/* 3-Second Cinematic Curtain (Overlay) */}
      {isIntroActive && (
        <div className="fixed inset-0 z-50 bg-[#101010] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000">
          {/* Subtle Skip button in the top right */}
          <button
            onClick={handleSkip}
            className="absolute top-6 right-6 text-[11px] font-sans tracking-widestLuxury uppercase text-[#85817B] hover:text-[#F2EEE5] transition-colors py-1 px-3 border border-[#241C1C] hover:border-[#B69A63]/40"
          >
            Skip Reveal [Esc]
          </button>

          {/* Thin Horizontal Line of Light */}
          <div
            className={`h-[1px] bg-gradient-to-r from-transparent via-[#B69A63] to-transparent transition-all duration-700 ease-out ${
              phase >= 0 ? 'w-48 sm:w-80 opacity-100' : 'w-0 opacity-0'
            }`}
          />

          {/* Monogram Reveal */}
          <div
            className={`my-6 transform transition-all duration-700 ease-out flex flex-col items-center ${
              phase >= 1
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-2'
            }`}
          >
            <ELMonogram
              className="w-16 h-16 sm:w-20 sm:h-20 text-[#B69A63]"
              variant="framed"
            />
          </div>

          {/* Wordmark Transition */}
          <div
            className={`text-center space-y-1 transition-all duration-700 ${
              phase >= 2
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3'
            }`}
          >
            <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.35em] text-[#F2EEE5] uppercase font-light">
              ELYON LECLAIR
            </h1>
            <p className="text-[10px] sm:text-xs font-sans tracking-[0.5em] text-[#B69A63] uppercase">
              MAISON DE HAUTE COUTURE
            </p>
          </div>

          {/* Bottom Accent */}
          <div
            className={`mt-8 h-[1px] bg-gradient-to-r from-transparent via-[#4B171C] to-transparent transition-all duration-700 ${
              phase >= 2 ? 'w-32 opacity-100' : 'w-0 opacity-0'
            }`}
          />
        </div>
      )}

      {/* Chapter 1 — The Hero Stage (Revealed immediately or after curtain) */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-[#101010]">
        {/* Background Editorial Visual with Mask Reveal */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-[8000ms] ease-out scale-105 hover:scale-100"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop')",
            }}
          />
          {/* Deep Maison Dark Vignette Overlay: Obsidian & Bordeaux Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/70 to-[#101010]/50" />
          <div className="absolute inset-0 bg-radial-vignette opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101010]/80 via-transparent to-[#101010]/80" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 sm:pt-32 pb-16 flex flex-col items-center">
          {/* Small Monogram Seal */}
          <div className="mb-6 inline-flex items-center gap-3 px-4 py-1.5 border border-[#4B171C]/60 bg-[#101010]/80 backdrop-blur-md">
            <ELMonogram className="w-4 h-4 text-[#B69A63]" />
            <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.35em] text-[#F2EEE5] uppercase">
              THE HOUSE OF ELYON · AUTUMN / WINTER
            </span>
          </div>

          {/* Signature Headline */}
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F2EEE5] tracking-tight leading-[1.08] font-light max-w-4xl mx-auto">
            A WORLD BEYOND <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#F2EEE5]/90">THE ORDINARY.</span>
          </h2>

          <p className="mt-6 text-sm sm:text-base text-[#85817B] max-w-xl mx-auto font-sans font-light tracking-wide leading-relaxed">
            Architectural tailoring, floor-sweeping silk columns, and tactile virgin wools sculpted with uncompromising restraint.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-[#B69A63] text-[#101010] font-sans font-semibold text-xs tracking-[0.25em] uppercase hover:bg-[#CDB388] transition-all duration-300 shadow-goldGlow flex items-center justify-center gap-3"
            >
              <span>DISCOVER THE COLLECTION</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/maison"
              className="w-full sm:w-auto px-8 py-4 border border-[#2A2424] bg-[#101010]/60 backdrop-blur-md text-[#F2EEE5] font-sans font-medium text-xs tracking-[0.25em] uppercase hover:border-[#B69A63] hover:text-[#B69A63] transition-all duration-300 flex items-center justify-center"
            >
              ENTER THE MAISON
            </Link>
          </div>

          {/* Quick Replay Seal in Corner if visited */}
          {hasVisited && (
            <button
              onClick={handleReplayIntro}
              aria-label="Replay Maison intro"
              className="mt-12 text-[10px] font-sans tracking-widestLuxury uppercase text-[#85817B] hover:text-[#B69A63] flex items-center gap-1.5 transition-colors opacity-70 hover:opacity-100"
            >
              <Sparkles className="w-3 h-3 text-[#B69A63]" />
              <span>Replay Maison Reveal</span>
            </button>
          )}

          {/* Scroll Down Indicator */}
          <div className="mt-8 animate-bounce opacity-50">
            <ChevronDown className="w-4 h-4 text-[#85817B]" />
          </div>
        </div>
      </section>
    </>
  );
}
