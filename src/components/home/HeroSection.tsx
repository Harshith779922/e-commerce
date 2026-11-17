'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface Slide {
  id: number;
  campaignHeading: string;
  mainTitle: string;
  subtitle: string;
  image: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    campaignHeading: 'THE ART OF MODERN LUXURY',
    mainTitle: 'DRESS BEYOND EXPECTATIONS.',
    subtitle: 'Contemporary silhouettes. Exceptional craftsmanship. Timeless expression.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop',
    ctaPrimaryText: 'EXPLORE MEN',
    ctaPrimaryLink: '/men',
    ctaSecondaryText: 'EXPLORE WOMEN',
    ctaSecondaryLink: '/women',
  },
  {
    id: 2,
    campaignHeading: 'HAUTE COUTURE 2026',
    mainTitle: 'SCULPTED IN SILK & CASHMERE.',
    subtitle: 'Architectural column gowns and hand-loomed Biella tailoring engineered for the modern icon.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop',
    ctaPrimaryText: 'EXPLORE WOMEN',
    ctaPrimaryLink: '/women',
    ctaSecondaryText: 'DISCOVER CAMPAIGN',
    ctaSecondaryLink: '/collections/the-signature-collection',
  },
  {
    id: 3,
    campaignHeading: 'THE SIGNATURE ATELIER',
    mainTitle: 'AN EXPRESSION OF INTENTION.',
    subtitle: 'Full-floating canvas, Florentine calfskin and gold filigree accessories in limited editions.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000&auto=format&fit=crop',
    ctaPrimaryText: 'EXPLORE MEN',
    ctaPrimaryLink: '/men',
    ctaSecondaryText: 'VIEW ACCESSORIES',
    ctaSecondaryLink: '/accessories',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Auto advance slides every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Touch Swipe Handlers for smooth mobile gestures
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const active = slides[currentSlide];

  return (
    <section
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative w-full h-[84vh] min-h-[520px] max-h-[920px] overflow-hidden bg-[#111111] select-none"
    >
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background image positioned on the right for desktop, centered for mobile */}
          <div
            className={`w-full h-full bg-cover bg-right md:bg-[center_right] transition-transform duration-10000 ease-out ${
              index === currentSlide ? 'scale-105' : 'scale-100'
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />

          {/* Dark atmospheric overlay ensuring text readability on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/95 via-[#111111]/65 to-transparent w-full md:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/40" />
        </div>
      ))}

      {/* Hero Content aligned to the left */}
      <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl text-left space-y-6">
          {/* Campaign Small Heading */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#B89A6A]"></span>
            <span className="text-[11px] sm:text-xs tracking-megaLuxury uppercase text-[#B89A6A] font-mono font-medium">
              {active.campaignHeading}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[#F5F2EC] tracking-wide leading-[1.15] sm:leading-[1.12] uppercase">
            {active.mainTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#A8A29A] font-light max-w-lg leading-relaxed line-clamp-3 sm:line-clamp-none">
            {active.subtitle}
          </p>

          {/* Buttons: EXPLORE MEN & EXPLORE WOMEN */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href={active.ctaPrimaryLink}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#947A4F] via-[#B89A6A] to-[#CDB388] text-black font-sans text-xs tracking-widestLuxury uppercase font-semibold hover:brightness-110 transition-all shadow-luxury flex items-center justify-center gap-2 group"
            >
              {active.ctaPrimaryText}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href={active.ctaSecondaryLink}
              className="w-full sm:w-auto px-8 py-3.5 border border-[#34312D] hover:border-[#B89A6A] text-[#F5F2EC] hover:text-[#B89A6A] font-sans text-xs tracking-widestLuxury uppercase transition-all backdrop-blur-sm bg-black/40 font-medium text-center"
            >
              {active.ctaSecondaryText}
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute z-20 bottom-8 left-6 sm:left-12 flex items-center gap-6">
        {/* Pagination Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                currentSlide === idx ? 'w-8 bg-[#B89A6A]' : 'w-2 bg-[#444] hover:bg-[#777]'
              }`}
            />
          ))}
        </div>

        {/* Counter */}
        <span className="text-[11px] font-mono tracking-widest text-[#A8A29A]">
          0{currentSlide + 1} / 0{slides.length}
        </span>
      </div>

      {/* Arrows */}
      <div className="hidden sm:flex absolute z-20 bottom-8 right-12 items-center gap-3">
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="p-3 border border-[#34312D] text-[#A8A29A] hover:text-[#B89A6A] hover:border-[#B89A6A] bg-black/40 backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="p-3 border border-[#34312D] text-[#A8A29A] hover:text-[#B89A6A] hover:border-[#B89A6A] bg-black/40 backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
