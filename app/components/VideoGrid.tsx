"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface VideoItem {
  id: string;
  video_id: string;
  title: string;
  thumbnail_url: string;
  channel_title: string;
  category: "INTEL_FEED" | "COMMUNITY_TRANSMISSION";
  view_count: number;
  published_at: string;
}

export default function VideoGrid() {
  const [activeTab, setActiveTab] = useState<"INTEL_FEED" | "COMMUNITY_TRANSMISSION">("INTEL_FEED");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      if (!supabase) return;

      const { data, error } = await supabase
        .from("youtube_videos")
        .select("*")
        .eq("category", activeTab)
        .order("view_count", { ascending: false })
        .limit(6);

      if (!error && data) {
        setVideos(data);
      }
      setLoading(false);
    }

    fetchVideos();
  }, [activeTab]);

  return (
    <div className="w-full space-y-6 font-mono text-slate-100">
      {/* SECTION HEADER & TABS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0d0d10] border-2 border-[#222327] p-6 relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-[#c89b3c]" />
        
        <div>
          <h2 className="text-[#c89b3c] font-black tracking-widest text-xl uppercase">
            // TACTICAL VISUAL ARCHIVES
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Official operational briefings and trending community combat logs.
          </p>
        </div>

        {/* TAB SELECTOR */}
        <div className="flex items-center gap-2 bg-[#060608] border border-[#222327] p-1">
          <button
            onClick={() => setActiveTab("INTEL_FEED")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "INTEL_FEED"
                ? "bg-[#c89b3c] text-[#060608]"
                : "text-slate-400 hover:text-slate-100"
            }`}
          >
            INTEL FEEDS
          </button>
          <button
            onClick={() => setActiveTab("COMMUNITY_TRANSMISSION")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "COMMUNITY_TRANSMISSION"
                ? "bg-[#c89b3c] text-[#060608]"
                : "text-slate-400 hover:text-slate-100"
            }`}
          >
            COMMUNITY TRANSMISSIONS
          </button>
        </div>
      </div>

      {/* VIDEO GRID DISPLAY */}
      {loading ? (
        <div className="w-full h-48 flex items-center justify-center bg-[#0d0d10] border border-[#222327] text-[#c89b3c] text-xs font-bold">
          // DECRYPTING_VIDEO_FEEDS...
        </div>
      ) : videos.length === 0 ? (
        <div className="w-full h-48 flex items-center justify-center bg-[#0d0d10] border border-[#222327] text-slate-400 text-xs font-bold">
          // NO_TRANSMISSIONS_FOUND_IN_SECTOR
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <a
              key={vid.id}
              href={`https://www.youtube.com/watch?v=${vid.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0d0d10] border-2 border-[#222327] hover:border-[#c89b3c] transition-all group flex flex-col overflow-hidden"
            >
              <div className="relative aspect-video bg-[#060608] overflow-hidden">
                {vid.thumbnail_url && (
                  <img
                    src={vid.thumbnail_url}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute bottom-2 right-2 bg-[#060608]/90 border border-[#222327] px-2 py-0.5 text-[10px] text-[#c89b3c] font-bold">
                  {Number(vid.view_count).toLocaleString()} VIEWS
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between flex-grow space-y-3">
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-[#c89b3c] transition-colors line-clamp-2">
                  {vid.title}
                </h3>
                <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-[#1c1d22] pt-3">
                  <span className="truncate uppercase font-bold text-emerald-400">
                    {vid.channel_title}
                  </span>
                  <span>{new Date(vid.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}