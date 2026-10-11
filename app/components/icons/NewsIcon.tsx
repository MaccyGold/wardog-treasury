import React from "react";

export default function NewsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="scroll-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#c89b3c" />
          <stop offset="100%" stopColor="#855b14" />
        </linearGradient>
      </defs>
      {/* Scroll Body */}
      <rect x="14" y="12" width="36" height="40" rx="3" fill="#0d0d10" stroke="url(#scroll-gold)" strokeWidth="3" />
      {/* Rolled Ends */}
      <path d="M10 14 C10 8, 18 8, 18 14 V50 C18 56, 10 56, 10 50 Z" fill="url(#scroll-gold)" />
      <path d="M54 14 C54 8, 46 8, 46 14 V50 C46 56, 54 56, 54 50 Z" fill="url(#scroll-gold)" />
      {/* Monogram 'N' */}
      <text x="32" y="38" textAnchor="middle" fill="url(#scroll-gold)" fontSize="22" fontWeight="900" fontFamily="monospace">
        N
      </text>
    </svg>
  );
}