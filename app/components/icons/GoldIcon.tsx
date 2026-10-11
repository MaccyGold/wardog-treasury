import React from "react";

export default function GoldIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="gold-ingot" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#c89b3c" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      {/* Bottom Ingot */}
      <polygon points="8,44 24,36 56,36 40,44" fill="#582e07" />
      <polygon points="8,44 40,44 36,54 4,54" fill="url(#gold-ingot)" />
      <polygon points="40,44 56,36 52,46 36,54" fill="#a16207" />

      {/* Top Main Ingot */}
      <polygon points="16,28 32,20 60,20 44,28" fill="#fef08a" />
      <polygon points="16,28 44,28 40,40 12,40" fill="url(#gold-ingot)" />
      <polygon points="44,28 60,20 56,32 40,40" fill="#a16207" />

      {/* Gloss Lines */}
      <line x1="18" y1="30" x2="41" y2="30" stroke="#fffbeb" strokeWidth="1.5" opacity="0.8" />
    </svg>
  );
}