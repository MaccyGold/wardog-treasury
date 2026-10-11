"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import NewsIcon from "../components/icons/NewsIcon";

interface NewsBulletin {
  id: string;
  title: string;
  content: string;
  category: string;
  source: string;
  tags?: string[];
  published_at: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsBulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setFetchError(null);

      if (!supabase) {
        setFetchError("Supabase client is not initialized.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("news_bulletins")
        .select("id, title, content, category, source, tags, published_at")
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Supabase news fetch error:", error);
        setFetchError(error.message);
      } else if (data) {
        setNews(data);
      }

      setLoading(false);
    }

    fetchNews();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-mono text-slate-100 pb-16">
      {/* HEADER BANNER WITH CUSTOM ASSET LOGO */}
      <div className="bg-[#0d0d10] border-2 border-[#222327] p-8 relative shadow-2xl flex items-center justify-between gap-6">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-[#c89b3c]" />
        
        <div className="flex items-center gap-6">
          <NewsIcon className="w-16 h-16 shrink-0 drop-shadow-[0_0_15px_rgba(200,155,60,0.4)]" />
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-[#c89b3c] tracking-widest uppercase">
              NEWS BULLETIN
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
              Official Bulkhead updates, combat dispatches, and field intelligence.
            </p>
          </div>
        </div>

        <div className="hidden md:block bg-[#060608] border border-[#222327] px-5 py-3 text-right shadow-inner">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">FEED STATUS</div>
          <div className="text-sm font-black text-emerald-400 mt-0.5">// LIVE DISPATCH</div>
        </div>
      </div>

      {fetchError && (
        <div className="bg-rose-950/40 border-2 border-rose-600 p-5 text-rose-200 text-sm shadow-lg">
          <strong>SUPABASE SYNC WARNING:</strong> {fetchError}
        </div>
      )}

      {/* ARTICLES LIST (ONE PER LINE) */}
      {loading ? (
        <div className="bg-[#0d0d10] border-2 border-[#222327] p-16 text-center text-[#c89b3c] text-base font-bold animate-pulse">
          // FETCHING_INTELLIGENCE_DISPATCHES...
        </div>
      ) : news.length === 0 ? (
        <div className="bg-[#0d0d10] border-2 border-[#222327] p-16 text-center text-slate-400 text-sm font-bold">
          // NO_NEWS_DISPATCHES_FOUND_IN_DATABASE
        </div>
      ) : (
        <div className="space-y-6">
          {news.map((item) => (
            <article 
              key={item.id} 
              className="bg-[#0d0d10] border-2 border-[#222327] p-8 space-y-5 hover:border-[#c89b3c] transition-all shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-[3px] h-full bg-[#c89b3c]/40" />

              {/* Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1c1d22] pb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-[#c89b3c]/15 text-[#c89b3c] border border-[#c89b3c] px-3 py-1 text-xs font-black uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 border border-[#222327] px-3 py-1 bg-[#060608] uppercase font-bold">
                    SOURCE: {item.source}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-bold tracking-wider">
                  {new Date(item.published_at).toLocaleString()}
                </span>
              </div>

              {/* Title & Body */}
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-slate-100 uppercase tracking-wide">
                  {item.title}
                </h2>
                <p className="text-base text-slate-300 font-sans leading-relaxed">
                  {item.content}
                </p>
              </div>

              {/* Tags & Footer */}
              <div className="pt-4 border-t border-[#1c1d22] flex flex-wrap items-center justify-between gap-4">
                {item.tags && item.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-[#c89b3c] bg-[#060608] px-2.5 py-1 border border-[#222327]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : <div />}
                
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  AUTHENTICATED DISPATCH <span className="text-[#c89b3c] ml-2">// VERIFIED</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}