"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface BulletinItem {
  id: string;
  category: "PATCH NOTES" | "BALANCE ADJUSTMENT" | "DEVELOPER BRIEFING";
  title: string;
  version: string;
  date: string;
  author: string;
  content: string[];
  badgeColor: string;
}

const CATEGORIES = [
  "ALL DISPATCHES",
  "PATCH NOTES",
  "BALANCE ADJUSTMENT",
  "DEVELOPER BRIEFING",
] as const;

export default function BulletinBoardPage() {
  const [dispatches, setDispatches] = useState<BulletinItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL DISPATCHES");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchDispatches() {
      if (!supabase) return;

      // 1. Fetch from capitalized "Dispatches" or lowercase "dispatches"
      let { data, error } = await supabase
        .from("Dispatches")
        .select("*")
        .order("date", { ascending: false });

      // Fallback check if capitalized query returns empty/error
      if ((!data || data.length === 0) && !error) {
        const fallback = await supabase
          .from("dispatches")
          .select("*")
          .order("date", { ascending: false });
        data = fallback.data;
        error = fallback.error;
      }

      // 2. Fallback to "Articles" table if Dispatches is completely empty
      if (!data || data.length === 0) {
        const articlesRes = await supabase
          .from("Articles")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (articlesRes.data && articlesRes.data.length > 0) {
          data = articlesRes.data.map((art: any) => ({
            id: art.id || `ART-${art.id}`,
            category: art.category || "DEVELOPER BRIEFING",
            title: art.title || "UNTITLED DISPATCH",
            version: art.version || "v2.5.0",
            date: art.date || art.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
            author: art.author || "BULKHEAD_TEAM",
            content: Array.isArray(art.content)
              ? art.content
              : typeof art.content === "string"
              ? art.content.split("\n")
              : [art.body || art.description || "No content summary provided."],
            badge_color: art.badge_color || "border-[#c89b3c] text-[#c89b3c] bg-[#29200a]",
          }));
        }
      }

      if (data && !error) {
        // Map and sanitize array formatting safely
        const formatted = data.map((item: any) => ({
          id: String(item.id),
          category: item.category || "PATCH NOTES",
          title: item.title || "UNTITLED DISPATCH",
          version: item.version || "v2.5.0",
          date: item.date || new Date().toISOString().split("T")[0],
          author: item.author || "BULKHEAD_DEV_TEAM",
          content: Array.isArray(item.content)
            ? item.content
            : typeof item.content === "string"
            ? item.content.split("\n")
            : ["No bullet details available."],
          badgeColor:
            item.badge_color ||
            item.badgeColor ||
            "border-[#c89b3c] text-[#c89b3c] bg-[#29200a]",
        }));
        setDispatches(formatted);
      }
      setLoading(false);
    }

    fetchDispatches();
  }, []);

  const filteredDispatches = useMemo(() => {
    if (selectedCategory === "ALL DISPATCHES") {
      return dispatches;
    }
    return dispatches.filter((item) => item.category === selectedCategory);
  }, [dispatches, selectedCategory]);

  return (
    <div className="w-full space-y-6 font-mono text-slate-100 select-none">
      {/* 1. HUD HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0d0d10] border-2 border-[#222327] p-6 relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-[#c89b3c]" />
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[#c89b3c] font-black tracking-widest text-2xl md:text-3xl uppercase">
              // OFFICIAL BULKHEAD DISPATCHES
            </h1>
            <span className="text-xs px-3 py-1 bg-[#29200a] text-[#c89b3c] border border-[#c89b3c] font-bold uppercase">
              {loading ? "SYNCING..." : "LIVE_DB_CONNECTED"}
            </span>
          </div>
          <p className="text-sm text-slate-300 font-medium mt-1">
            Official developer patch notes, game balance adjustments, and roadmap briefings.
          </p>
        </div>
      </div>

      {/* 2. CATEGORY FILTERS */}
      <div className="flex flex-wrap gap-3 bg-[#0d0d10] border-2 border-[#222327] p-4 items-center">
        <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-2">
          FILTER_CHANNEL:
        </span>
        {CATEGORIES.map((cat) => {
          const count =
            cat === "ALL DISPATCHES"
              ? dispatches.length
              : dispatches.filter((i) => i.category === cat).length;

          const isActive = selectedCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-[#c89b3c] text-[#060608] border border-[#c89b3c]"
                  : "bg-[#060608] text-slate-300 border border-[#1c1d22] hover:border-[#c89b3c]"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 font-black ${
                  isActive
                    ? "bg-[#060608] text-[#c89b3c]"
                    : "bg-[#16161a] text-slate-400"
                }`}
              >
                [{count}]
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. DISPATCHES FEED LIST */}
      <div className="space-y-6">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest">
            // ESTABLISHING SECURE DATABASE LINK...
          </div>
        ) : filteredDispatches.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest bg-[#0d0d10] border-2 border-[#222327]">
            // NO ACTIVE DISPATCHES FOUND IN REGISTRY
          </div>
        ) : (
          filteredDispatches.map((dispatch) => (
            <div
              key={dispatch.id}
              className="bg-[#0d0d10] border-2 border-[#222327] hover:border-[#c89b3c] transition-all p-6 space-y-4 shadow-xl relative group"
            >
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#1c1d22] pb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-xs border px-2.5 py-0.5 font-black uppercase ${dispatch.badgeColor}`}>
                    {dispatch.category}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">
                    [{dispatch.version}]
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
                  <span>AUTHOR: {dispatch.author}</span>
                  <span>UTC: {dispatch.date}</span>
                </div>
              </div>

              <h2 className="text-slate-100 font-black text-base md:text-lg uppercase tracking-wide group-hover:text-[#c89b3c] transition-all">
                {dispatch.title}
              </h2>

              <ul className="space-y-2 border-l-2 border-[#1c1d22] group-hover:border-[#c89b3c] pl-4 transition-all">
                {dispatch.content.map((point, index) => (
                  <li key={index} className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    <span className="text-[#c89b3c] mr-2 font-black">//</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}