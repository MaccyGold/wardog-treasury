"use client";

import React, { useState } from "react";

export interface IntelFeed {
  id: string;
  youtubeId: string;
  title: string;
  date: string;
  duration: string;
  tag: string;
  badgeColor: string;
  description: string;
  freq: string;
  posterUrl: string;
}

export default function IntelModal({
  activeIntel,
  onClose,
}: {
  activeIntel: IntelFeed;
  onClose: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono text-slate-100 select-none">
      <div className="bg-[#0d0d10] border-2 border-[#c89b3c] w-full max-w-4xl p-6 space-y-4 shadow-2xl relative">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b-2 border-[#1c1d22] pb-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#c89b3c] animate-ping rounded-full" />
            <span className="text-base font-black text-[#c89b3c] uppercase tracking-widest">
              // ACTIVE_TRANSMISSION [{activeIntel.id}]
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[#c89b3c] font-black text-sm px-3 py-1 bg-[#16161a] border border-[#1c1d22] hover:border-[#c89b3c] transition-all cursor-pointer"
          >
            [CLOSE_FEED]
          </button>
        </div>

        {/* EMBEDDED VIDEO VIEWPORT */}
        <div className="relative w-full aspect-video bg-[#060608] border border-[#1c1d22] flex items-center justify-center overflow-hidden">
          {isPlaying ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeIntel.youtubeId}?autoplay=1&rel=0&enablejsapi=1`}
              title={activeIntel.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            /* CLICK-TO-PLAY TACTICAL COVER (BYPASSES AUTOPLAY BLOCKING) */
            <div
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer group"
            >
              <img
                src={activeIntel.posterUrl}
                alt={activeIntel.title}
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-all group-hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #c89b3c 1px, transparent 1px), linear-gradient(to bottom, #c89b3c 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* TACTICAL PLAY NODE */}
              <div className="w-16 h-16 rounded-full border-2 border-[#c89b3c] bg-[#060608]/90 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#c89b3c] group-hover:text-[#060608] transition-all z-10 text-[#c89b3c]">
                <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

              <div className="z-10 mt-4 px-4 py-1.5 bg-[#060608]/90 border border-[#c89b3c] text-[#c89b3c] font-black text-xs uppercase tracking-widest">
                // INITIALIZE_EMBEDDED_STREAM
              </div>
            </div>
          )}
        </div>

        {/* FOOTER CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-t border-[#1c1d22] pt-3">
          <div>
            <h4 className="text-slate-100 font-black text-sm uppercase">
              {activeIntel.title}
            </h4>
            <p className="text-xs text-[#8c909a]">
              FREQ: {activeIntel.freq} | DURATION: {activeIntel.duration} | RECORDED: {activeIntel.date}
            </p>
          </div>

          <a
            href={`https://www.youtube.com/watch?v=${activeIntel.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#8c909a] hover:text-[#c89b3c] transition-all font-bold uppercase"
          >
            [EXTERNAL_LINK_BACKUP ↗]
          </a>
        </div>
      </div>
    </div>
  );
}