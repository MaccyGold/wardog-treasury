import React from "react";

export default function VideosIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="shield-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#c89b3c" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      {/* Outer Shield Ring */}
      <path d="M32 6 L56 16 V34 C56 48 44 58 32 62 C20 58 8 48 8 34 V16 Z" fill="#0d0d10" stroke="url(#shield-gold)" strokeWidth="3" />
      {/* Center Play Button */}
      <polygon points="26,20 46,32 26,44" fill="url(#shield-gold)" stroke="#060608" strokeWidth="2" />
    </svg>
  );
}