import React from 'react';

interface ELMonogramProps {
  className?: string;
  color?: string;
  variant?: 'minimal' | 'framed' | 'crest';
}

export default function ELMonogram({
  className = 'w-8 h-8',
  color = 'currentColor',
  variant = 'minimal',
}: ELMonogramProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="EL Monogram — ELYON LECLAIR"
    >
      {variant === 'framed' && (
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.4"
          className="transition-all duration-500"
        />
      )}

      {variant === 'crest' && (
        <>
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke={color}
            strokeWidth="0.75"
            strokeOpacity="0.3"
            strokeDasharray="2 3"
          />
          <circle
            cx="50"
            cy="50"
            r="47"
            stroke={color}
            strokeWidth="0.5"
            strokeOpacity="0.5"
          />
        </>
      )}

      {/* Interlocking EL Calligraphic Geometry */}
      <g stroke={color} strokeLinecap="square" strokeLinejoin="miter">
        {/* Letter E Main Vertical Pillar */}
        <path
          d="M 32 26 L 32 74 M 27 26 L 37 26 M 27 74 L 37 74"
          strokeWidth="2.2"
        />
        {/* E Top Horizontal Arm with Serif */}
        <path
          d="M 32 26 L 62 26 M 62 26 L 62 33"
          strokeWidth="2"
        />
        {/* E Middle Arm with Diamond Finial */}
        <path
          d="M 32 49 L 53 49 M 53 47 L 55 49 L 53 51 Z"
          strokeWidth="1.8"
          fill={color}
        />
        {/* E Bottom Horizontal Arm */}
        <path
          d="M 32 74 L 64 74 M 64 74 L 64 67"
          strokeWidth="2"
        />

        {/* Letter L Overlapping Interlocked Stem */}
        <path
          d="M 49 20 L 49 74"
          strokeWidth="1.5"
          strokeDasharray="60"
          strokeOpacity="0.9"
        />
        {/* L Top Serif */}
        <path
          d="M 44 20 L 54 20"
          strokeWidth="1.75"
        />
        {/* L Extended Base Arm with Serifs */}
        <path
          d="M 49 74 L 78 74 M 78 74 L 78 64"
          strokeWidth="2.2"
        />
      </g>

      {/* Subtle Central Architectural Axis Point */}
      <circle cx="50" cy="50" r="1.2" fill={color} opacity="0.6" />
    </svg>
  );
}
