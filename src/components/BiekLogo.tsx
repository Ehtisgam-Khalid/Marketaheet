import React from 'react';

interface BiekLogoProps {
  className?: string;
  size?: number;
}

export const BiekLogo: React.FC<BiekLogoProps> = ({ className = '', size = 80 }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Outer decorative ring */}
        <circle cx="80" cy="74" r="68" stroke="#1b4332" strokeWidth="2.5" fill="#f8faf8" />
        <circle cx="80" cy="74" r="64" stroke="#081c15" strokeWidth="1.2" strokeDasharray="2 1.5" />
        <circle cx="80" cy="74" r="60" stroke="#1b4332" strokeWidth="1.5" />

        {/* Crescent and Star at Top */}
        <g transform="translate(80, 24)">
          {/* Crescent */}
          <path
            d="M -9 4 A 7 7 0 1 0 7 8 A 5.5 5.5 0 1 1 -9 4 Z"
            fill="#1b4332"
          />
          {/* 5-pointed star */}
          <polygon
            points="0,-4 1.5,-0.5 5,-0.5 2,1.8 3,5.2 0,3.2 -3,5.2 -2,1.8 -5,-0.5 -1.5,-0.5"
            fill="#1b4332"
          />
        </g>

        {/* Architectural Arch & Pillars */}
        <g stroke="#081c15" strokeWidth="1.6" fill="none">
          {/* Left Pillar */}
          <path d="M 44 94 L 44 48 L 48 48 L 48 94 Z" fill="#e9f5ed" />
          <path d="M 42 48 L 50 48 M 40 44 L 52 44" />
          <path d="M 46 44 L 46 36 L 44 34 L 48 34 Z" fill="#1b4332" />

          {/* Right Pillar */}
          <path d="M 112 94 L 112 48 L 116 48 L 116 94 Z" fill="#e9f5ed" />
          <path d="M 110 48 L 118 48 M 108 44 L 120 44" />
          <path d="M 114 44 L 114 36 L 112 34 L 116 34 Z" fill="#1b4332" />

          {/* Central Islamic Arch */}
          <path
            d="M 48 54 C 48 44, 66 36, 80 34 C 94 36, 112 44, 112 54"
            stroke="#1b4332"
            strokeWidth="2.2"
          />
          <path
            d="M 52 56 C 52 47, 68 40, 80 38 C 92 40, 108 47, 108 56"
            stroke="#1b4332"
            strokeWidth="1"
          />
        </g>

        {/* Rays of Knowledge */}
        <g stroke="#2d6a4f" strokeWidth="0.8" opacity="0.6">
          <line x1="80" y1="46" x2="80" y2="40" />
          <line x1="72" y1="48" x2="68" y2="43" />
          <line x1="88" y1="48" x2="92" y2="43" />
          <line x1="65" y1="52" x2="59" y2="49" />
          <line x1="95" y1="52" x2="101" y2="49" />
        </g>

        {/* Central Open Book (Quran / Rehal) */}
        <g transform="translate(80, 68)">
          {/* Stand / Rehal */}
          <path
            d="M -16 18 L 16 18 M -12 18 L 0 6 L 12 18 M 0 6 L 0 10"
            stroke="#081c15"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Open Book Pages */}
          <path
            d="M -18 3 C -10 -2, -2 4, 0 6 C 2 4, 10 -2, 18 3 L 18 12 C 10 7, 2 13, 0 15 C -2 13, -10 7, -18 12 Z"
            fill="#ffffff"
            stroke="#1b4332"
            strokeWidth="1.5"
          />
          {/* Book Spine Center */}
          <line x1="0" y1="6" x2="0" y2="15" stroke="#1b4332" strokeWidth="1.2" />
          {/* Lines representing script */}
          <line x1="-14" y1="4" x2="-4" y2="5" stroke="#1b4332" strokeWidth="0.8" />
          <line x1="-14" y1="7" x2="-4" y2="8" stroke="#1b4332" strokeWidth="0.8" />
          <line x1="-14" y1="10" x2="-4" y2="11" stroke="#1b4332" strokeWidth="0.8" />
          <line x1="4" y1="5" x2="14" y2="4" stroke="#1b4332" strokeWidth="0.8" />
          <line x1="4" y1="8" x2="14" y2="7" stroke="#1b4332" strokeWidth="0.8" />
          <line x1="4" y1="11" x2="14" y2="10" stroke="#1b4332" strokeWidth="0.8" />
        </g>

        {/* Base Platform */}
        <path d="M 38 94 L 122 94 L 118 99 L 42 99 Z" fill="#1b4332" />

        {/* Lower Banner Ribbon */}
        <g transform="translate(80, 122)">
          {/* Ribbon back folds */}
          <path d="M -68 -8 L -60 -16 L -52 -8 Z" fill="#081c15" />
          <path d="M 68 -8 L 60 -16 L 52 -8 Z" fill="#081c15" />

          {/* Main Ribbon Body */}
          <path
            d="M -64 -5 C -40 -12, 40 -12, 64 -5 L 56 12 C 36 6, -36 6, -56 12 Z"
            fill="#1b4332"
            stroke="#081c15"
            strokeWidth="1.2"
          />

          {/* Ribbon Ends */}
          <path d="M -64 -5 L -74 2 L -66 10 L -56 12 L -58 0 Z" fill="#2d6a4f" stroke="#081c15" strokeWidth="1" />
          <path d="M 64 -5 L 74 2 L 66 10 L 56 12 L 58 0 Z" fill="#2d6a4f" stroke="#081c15" strokeWidth="1" />

          {/* Text inside banner */}
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="5.2"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            letterSpacing="0.4"
          >
            BOARD OF INTERMEDIATE EDUCATION
          </text>
          <text
            x="0"
            y="10"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="5"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            letterSpacing="0.8"
          >
            KARACHI
          </text>
        </g>
      </svg>
    </div>
  );
};
