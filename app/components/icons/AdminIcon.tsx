import React from "react";

export default function AdminIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Tactical Crest Shield */}
      <path 
        d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-5.45 8-12V5l-8-3z" 
        fill="#0d0d10" 
        stroke="#c89b3c" 
        strokeWidth="1.5" 
      />
      {/* Inner Metallic Border */}
      <path 
        d="M12 4L6 6.25v4.5c0 4.16 2.88 8.05 6 9 3.12-.95 6-4.84 6-9v-4.5L12 4z" 
        stroke="#c89b3c" 
        strokeWidth="1" 
        strokeOpacity="0.5" 
      />
      {/* Top Lock Shackle */}
      <path 
        d="M10 8V6.5a2 2 0 114 0V8" 
        stroke="#c89b3c" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      {/* Central "A" Crest Glyph */}
      <path 
        d="M12 9l-2.5 5h5L12 9zm-1.2 3.5h2.4" 
        stroke="#c89b3c" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}