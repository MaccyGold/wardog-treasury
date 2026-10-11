"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

function VideoIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-5.45 8-12V5l-8-3z" 
        stroke="#c89b3c" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <polygon points="10,8 16,12 10,16" fill="#c89b3c" />
    </svg>
  );
}

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  youtube_url?: string;
  url?: string;
  video_id?: string;
  category?: string;
  source?: string;
  tags?: string[];
  created_at?: string;
  published_at?: string;
}

function getYouTubeEmbedUrl(item: VideoItem): string | null {
  const rawUrl = item.youtube_url || item.url || item.video_id;
  if (!rawUrl) return null;

  const lowerUrl = rawUrl.toLowerCase();
  // Hard block any URL containing shorts
  if (lowerUrl.includes("shorts") || lowerUrl.includes("/shorts/")) {
    return null;
  }

  if (lowerUrl.includes("youtube.com/embed/")) {
    return rawUrl;
  }

  let videoId = rawUrl;
  if (rawUrl.includes("v=")) {
    videoId = rawUrl.split("v=")[1]?.split("&")[0] || rawUrl;
  } else if (rawUrl.includes("youtu.be/")) {
    videoId = rawUrl.split("youtu.be/")[1]?.split("?")[0] || rawUrl;
  }

  return `https://www.youtube.com/embed/${videoId}`;
}

type FilterCategory = "ALL" | "BULKHEAD" | "COMMUNITY";

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ALL");

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      setFetchError(null);

      if (!supabase) {
        setFetchError("Supabase client is not initialized.");
        setLoading(false);
        return;
      }

      let { data, error } = await supabase.from("youtube_videos").select("*");

      if (error || !data || data.length === 0) {
        const fallbackRes = await supabase.from("videos").select("*");
        if (!fallbackRes.error && fallbackRes.data && fallbackRes.data.length > 0) {
          data = fallbackRes.data;
          error = null;
        }
      }

      if (error) {
        console.error("Supabase video fetch error:", error);
        setFetchError(error.message);
      } else if (data) {
        // ULTIMATE SHORTS BLOCKER: Checks URL, title, tags, and description for 'shorts'
        const standardVideos = data.filter((item) => {
          const url = (item.youtube_url || item.url || item.video_id || "").toLowerCase();
          const title = (item.title || "").toLowerCase();
          const desc = (item.description || "").toLowerCase();
          const tags = (item.tags || []).join(" ").toLowerCase();

          const isShortUrl = url.includes("shorts");
          const isShortText = title.includes("short") || desc.includes("short") || tags.includes("short");

          return !isShortUrl && !isShortText;
        });

        setVideos(standardVideos);
      }

      setLoading(false);
    }

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) => {
    if (activeFilter === "ALL") return true;

    const sourceStr = (video.source || "").toUpperCase();
    const categoryStr = (video.category || "").toUpperCase();
    const titleStr = (video.title || "").toUpperCase();
    const tagsStr = (video.tags || []).join(" ").toUpperCase();

    const isBulkhead =
      sourceStr.includes("BULKHEAD") ||
      categoryStr.includes("DEV") ||
      categoryStr.includes("BULKHEAD") ||
      titleStr.includes("DEV") ||
      titleStr.includes("UPDATE") ||
      tagsStr.includes("DEV");

    if (activeFilter === "BULKHEAD") return isBulkhead;
    if (activeFilter === "COMMUNITY") return !isBulkhead;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-mono text-slate-100 pb-16">
      {/* HEADER BANNER */}
      <div className="bg-[#0d0d10] border-2 border-[#222327] p-8 relative shadow-2xl flex items-center justify-between gap-6">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-[#c89b3c]" />
        
        <div className="flex items-center gap-6">
          <VideoIcon className="w-16 h-16 shrink-0 drop-shadow-[0_0_15px_rgba(200,155,60,0.4)]" />
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-[#c89b3c] tracking-widest uppercase">
              COMBAT VIDEO FEED
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
              Archived tactical footage, developer streams, and operational recordings.
            </p>
          </div>
        </div>

        <div className="hidden md:block bg-[#060608] border border-[#222327] px-5 py-3 text-right shadow-inner">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">VIDEO ARCHIVE</div>
          <div className="text-sm font-black text-emerald-400 mt-0.5">// SIGNAL HIGH</div>
        </div>
      </div>

      {fetchError && (
        <div className="bg-rose-950/40 border-2 border-rose-600 p-5 text-rose-200 text-sm shadow-lg">
          <strong>SUPABASE SYNC WARNING:</strong> {fetchError}
        </div>
      )}

      {/* CATEGORY SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#222327] pb-4">
        <div className="flex items-center gap-2 bg-[#060608] border border-[#222327] p-1.5 shadow-inner">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-4 py-2 text-xs font-black uppercase transition-all ${
              activeFilter === "ALL"
                ? "bg-[#c89b3c] text-black shadow-md"
                : "text-slate-400 hover:text-[#c89b3c]"
            }`}
          >
            [ ALL FOOTAGE ]
          </button>
          <button
            onClick={() => setActiveFilter("BULKHEAD")}
            className={`px-4 py-2 text-xs font-black uppercase transition-all ${
              activeFilter === "BULKHEAD"
                ? "bg-[#c89b3c] text-black shadow-md"
                : "text-slate-400 hover:text-[#c89b3c]"
            }`}
          >
            // BULKHEAD DEVS
          </button>
          <button
            onClick={() => setActiveFilter("COMMUNITY")}
            className={`px-4 py-2 text-xs font-black uppercase transition-all ${
              activeFilter === "COMMUNITY"
                ? "bg-[#c89b3c] text-black shadow-md"
                : "text-slate-400 hover:text-[#c89b3c]"
            }`}
          >
            // COMMUNITY CONTENT
          </button>
        </div>

        <div className="text-xs text-slate-400 font-bold tracking-wider">
          SHOWING {filteredVideos.length} TRANSMISSIONS (SHORTS PURGED)
        </div>
      </div>

      {/* VIDEO GRID */}
      {loading ? (
        <div className="bg-[#0d0d10] border-2 border-[#222327] p-16 text-center text-[#c89b3c] text-base font-bold animate-pulse">
          // ACCESSING_TACTICAL_VIDEO_ARCHIVES...
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="bg-[#0d0d10] border-2 border-[#222327] p-16 text-center text-slate-400 text-sm font-bold">
          // NO_TRANSMISSIONS_MATCHING_FILTER
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredVideos.map((item) => {
            const embedUrl = getYouTubeEmbedUrl(item);

            return (
              <article 
                key={item.id} 
                className="bg-[#0d0d10] border-2 border-[#222327] p-6 space-y-4 hover:border-[#c89b3c] transition-all shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="relative aspect-video w-full bg-[#060608] border border-[#1f2026] overflow-hidden rounded">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={item.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-bold">
                        // VIDEO_STREAM_UNAVAILABLE
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-[#1c1d22] pb-2">
                      <span className="text-xs text-[#c89b3c] font-black uppercase tracking-wider">
                        {item.source ? `SOURCE: ${item.source}` : "// INTEL_TRANSMISSION"}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        {item.published_at || item.created_at
                          ? new Date(item.published_at || item.created_at!).toLocaleDateString()
                          : "ARCHIVED"}
                      </span>
                    </div>

                    <h2 className="text-lg font-black text-slate-100 uppercase tracking-wide">
                      {item.title}
                    </h2>

                    {item.description && (
                      <p className="text-sm text-slate-300 font-sans leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1c1d22] text-xs text-slate-500 flex justify-between items-center font-bold">
                  <span>RECORDED TRANSMISSION</span>
                  <span className="text-[#c89b3c]">// 1080P HD</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}