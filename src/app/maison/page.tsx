import React from 'react';
import Link from 'next/link';
import ELMonogram from '@/components/common/ELMonogram';
import { ArrowRight, Sparkles, Shield, Compass } from 'lucide-react';

export const metadata = {
  title: 'The Maison — ELYON LECLAIR',
  description: 'The philosophy, creative direction, and bespoke atelier standards of the House of Elyon.',
};

export default function MaisonPage() {
  return (
    <div className="bg-[#101010] text-[#F2EEE5] min-h-screen pt-28 pb-32">
      {/* Editorial Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="flex justify-center mb-4">
          <ELMonogram className="w-16 h-16 text-[#B69A63]" variant="framed" />
        </div>

        <p className="text-[11px] font-sans tracking-[0.4em] uppercase text-[#B69A63] font-medium">
          LA MAISON ELYON LECLAIR
        </p>

        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#F2EEE5] font-light tracking-tight leading-[1.1]">
          The Digital Luxury Maison
        </h1>

        <p className="text-sm sm:text-base text-[#85817B] max-w-2xl mx-auto font-sans font-light leading-relaxed">
          Founded on the conviction that garments should command presence through architectural restraint rather than fleeting noise.
        </p>
      </div>

      {/* Hero Visual */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-16 sm:my-24">
        <div className="relative aspect-[21/9] w-full overflow-hidden border border-[#2A2424]">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop"
            alt="Maison Elyon Leclair Atelier"
            className="w-full h-full object-cover filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-[#101010]/30" />
        </div>
      </div>

      {/* Narrative Section 1: The Creative Direction */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 sticky top-32">
            <span className="text-[10px] font-mono tracking-widest text-[#B69A63] block mb-2">01 / CONCEPT</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F2EEE5] font-light">
              The Dark Maison
            </h2>
          </div>
          <div className="md:col-span-8 space-y-5 text-sm sm:text-base text-[#85817B] font-sans font-light leading-relaxed">
            <p>
              Our aesthetic code is rooted in the interplay of light and shadow. Obsidian Black (#101010) forms the architectural envelope; Black Cherry (#241C1C) and Deep Bordeaux (#4B171C) provide rich, understated warmth; while Antique Gold (#B69A63) is reserved exclusively for handcrafted details.
            </p>
            <p>
              This is not ordinary ready-to-wear. It is couture designed for evening galas, high-profile engagements, and those moments where presence is felt the instant one crosses the threshold.
            </p>
          </div>
        </div>

        {/* Narrative Section 2: Architectural Canvassing */}
        <div id="craftsmanship" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-12 border-t border-[#241C1C]">
          <div className="md:col-span-4 sticky top-32">
            <span className="text-[10px] font-mono tracking-widest text-[#B69A63] block mb-2">02 / CRAFTSMANSHIP</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F2EEE5] font-light">
              The Art of the Canvas
            </h2>
          </div>
          <div className="md:col-span-8 space-y-5 text-sm sm:text-base text-[#85817B] font-sans font-light leading-relaxed">
            <p>
              True sartorial structure cannot be glued. Every ELYON LECLAIR jacket features a full floating horsehair chest canvas. This interior skeleton allows the fabric to breathe, drape with liquid elegance, and subtly shape itself to the contours of your shoulders with every wearing.
            </p>
            <p>
              Each lapel roll is individually shaped by hand with microscopic pick-stitching, ensuring a soft, rolled curve that never puckers.
            </p>
          </div>
        </div>

        {/* Narrative Section 3: Textile Provenance */}
        <div id="textiles" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-12 border-t border-[#241C1C]">
          <div className="md:col-span-4 sticky top-32">
            <span className="text-[10px] font-mono tracking-widest text-[#B69A63] block mb-2">03 / PROVENANCE</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F2EEE5] font-light">
              Noble Textiles
            </h2>
          </div>
          <div className="md:col-span-8 space-y-5 text-sm sm:text-base text-[#85817B] font-sans font-light leading-relaxed">
            <p>
              Our textiles are selected from historic heritage mills across Northern Italy. From silk crepe woven in the Como lake district to Tasmanian Super 150s virgin wool and Tuscan vegetable-tanned calfskin, every element is chosen for hand-feel, durability, and visual depth under evening lighting.
            </p>
          </div>
        </div>
      </div>

      {/* Private Salon Appointment Callout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 sm:mt-36">
        <div className="p-8 sm:p-14 bg-[#141010] border border-[#B69A63]/40 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4B171C]/20 rounded-full blur-3xl pointer-events-none" />

          <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#B69A63] font-medium">
            CLIENT CONCIERGE & PRIVATE FITTINGS
          </p>

          <h3 className="font-serif text-3xl sm:text-4xl text-[#F2EEE5] font-light">
            Reserve a Private Atelier Consultation
          </h3>

          <p className="text-xs sm:text-sm text-[#85817B] max-w-lg mx-auto leading-relaxed">
            Schedule a confidential appointment with our master tailoring concierges for bespoke sizing, custom textile selections, and private trunk previews.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-[#B69A63] text-black text-xs font-semibold tracking-widest uppercase hover:bg-[#CDB388] transition-colors"
            >
              Request Private Appointment
            </Link>
            <Link
              href="/shop"
              className="px-8 py-3.5 border border-[#2A2424] text-[#F2EEE5] hover:text-[#B69A63] hover:border-[#B69A63] text-xs tracking-widest uppercase transition-colors"
            >
              Explore Creations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
