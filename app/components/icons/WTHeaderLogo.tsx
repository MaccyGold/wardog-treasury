import React from "react";

export default function WTHeaderLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Carbon Fiber Pattern */}
        <pattern id="carbon-wt" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#08080a" />
          <polygon points="0,0 3,0 0,3" fill="#14151a" />
          <polygon points="3,3 6,3 3,6" fill="#14151a" />
          <polygon points="3,0 6,0 6,3" fill="#1a1c23" />
          <polygon points="0,3 3,3 0,6" fill="#1a1c23" />
        </pattern>

        {/* Polished Gold Gradient */}
        <linearGradient id="gold-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="30%" stopColor="#c89b3c" />
          <stop offset="70%" stopColor="#855b14" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>

        <linearGradient id="gold-text" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="50%" stopColor="#c89b3c" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        {/* Glow Filter */}
        <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Shield Bevel (Gold) */}
      <path
        d="M50 5 L92 22 V55 C92 78 72 98 50 105 C28 98 8 78 8 55 V22 Z"
        fill="url(#gold-bevel)"
        filter="url(#gold-glow)"
      />

      {/* Inner Shield Body (Carbon Fiber) */}
      <path
        d="M50 10 L86 25 V53 C86 73 68 91 50 97 C32 91 14 73 14 53 V25 Z"
        fill="url(#carbon-wt)"
        stroke="#1a1c23"
        strokeWidth="2"
      />

      {/* Inner Gold Rim */}
      <path
        d="M50 14 L82 28 V52 C82 69 66 86 50 92 C34 86 18 69 18 52 V28 Z"
        fill="none"
        stroke="url(#gold-bevel)"
        strokeWidth="1.5"
        opacity="0.8"
      />

      {/* WT Monogram Text */}
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fill="url(#gold-text)"
        stroke="#060608"
        strokeWidth="2"
        fontSize="34"
        fontWeight="900"
        fontFamily="monospace"
        letterSpacing="-2"
      >
        WT
      </text>
    </svg>
  );
}