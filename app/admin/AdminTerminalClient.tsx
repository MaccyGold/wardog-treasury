"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import VideoGrid from "@/app/components/VideoGrid";

interface AdminTerminalClientProps {
  userEmail?: string;
}

export default function AdminTerminalClient({ userEmail }: AdminTerminalClientProps) {
  const [statusMessage, setStatusMessage] = useState<string>("// TERMINAL_READY");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // News Bulletin Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("PATCH NOTES");
  const [source, setSource] = useState("BULKHEAD");
  const [tagsInput, setTagsInput] = useState("");

  // Sign Out Handler
  async function handleSignOut() {
    setIsProcessing(true);
    setStatusMessage("// TERMINATING_SESSION...");

    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      window.location.href = "/login";
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`// ERROR: ${err.message || "FAILED_TO_LOGOUT"}`);
      setIsProcessing(false);
    }
  }

  // Manual Trigger for Gold Sync Cron
  async function handleTriggerGoldFetch() {
    setIsProcessing(true);
    setStatusMessage("// EXECUTING_GOLD_TELEMETRY_SYNC...");

    try {
      const res = await fetch("/api/cron/fetch-gold");
      if (res.ok) {
        setStatusMessage("// SUCCESS: GOLD TELEMETRY SYNCHRONIZED.");
      } else {
        setStatusMessage("// WARNING: GOLD CRON ENDPOINT RETURNED NON-200 STATUS.");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("// ERROR: FAILED TO REACH GOLD TELEMETRY ENDPOINT.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Manual Trigger for News Sync Cron
  async function handleTriggerNewsFetch() {
    setIsProcessing(true);
    setStatusMessage("// EXECUTING_NEWS_BULLETIN_SYNC...");

    try {
      const res = await fetch("/api/cron/fetch-news");
      if (res.ok) {
        setStatusMessage("// SUCCESS: NEWS BULLETINS SYNCHRONIZED.");
      } else {
        setStatusMessage("// WARNING: NEWS CRON ENDPOINT RETURNED NON-200 STATUS.");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("// ERROR: FAILED TO REACH NEWS SYNC ENDPOINT.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Manual Trigger for YouTube Sync Cron
  async function handleTriggerYouTubeFetch() {
    setIsProcessing(true);
    setStatusMessage("// EXECUTING_YOUTUBE_INTEL_SYNC...");

    try {
      const res = await fetch("/api/cron/fetch-videos");
      if (res.ok) {
        setStatusMessage("// SUCCESS: YOUTUBE INTEL & COMMUNITY FEEDS SYNCHRONIZED.");
      } else {
        setStatusMessage("// WARNING: YOUTUBE CRON ENDPOINT RETURNED NON-200 STATUS.");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("// ERROR: FAILED TO REACH YOUTUBE SYNC ENDPOINT.");
    } finally {
      setIsProcessing(false);
    }
  }

  // Submit News Bulletin to Supabase
  async function handleCreateNewsBulletin(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setStatusMessage("// ERROR: TITLE AND CONTENT ARE REQUIRED.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("// TRANSMITTING BULLETIN TO DATABASE...");

    try {
      if (!supabase) {
        setStatusMessage("// ERROR: SUPABASE CLIENT NOT CONFIGURED.");
        setIsProcessing(false);
        return;
      }

      const tagsArray = tagsInput
        ? tagsInput.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean)
        : [];

      const { error } = await supabase.from("news_bulletins").insert([
        {
          title: title.toUpperCase(),
          content,
          category: category.toUpperCase(),
          source: source.toUpperCase(),
          tags: tagsArray,
          published_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setStatusMessage("// SUCCESS: BULLETIN TRANSMITTED TO ARCHIVE.");
      setTitle("");
      setContent("");
      setTagsInput("");
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`// ERROR: ${err.message || "TRANSMISSION_FAILED"}`);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="w-full space-y-6 font-mono text-slate-100 select-none">
      {/* HUD HEADER */}
      <div className="bg-[#0d0d10] border-2 border-[#222327] p-6 relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-[#c89b3c]" />

        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-[#c89b3c] font-black tracking-widest text-xl md:text-2xl uppercase leading-none">
              // ADMIN CONTROL TERMINAL
            </h1>
            <span className="text-xs px-2.5 py-1 bg-[#29200a] text-[#c89b3c] border border-[#c89b3c] font-bold uppercase tracking-wider leading-none shrink-0">
              RESTRICTED_ACCESS
            </span>
          </div>

          <button
            onClick={handleSignOut}
            disabled={isProcessing}
            className="px-4 py-2 bg-red-950/40 text-red-400 border border-red-800 text-xs font-bold uppercase tracking-wider hover:bg-red-900/60 transition-all cursor-pointer disabled:opacity-50 shrink-0 leading-none"
          >
            // TERMINATE SESSION
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 font-medium mt-3">
          Operator: <span className="text-emerald-400 font-bold">{userEmail || "AUTHENTICATED"}</span>
        </p>
      </div>

      {/* CONSOLE STATUS */}
      <div className="bg-[#0d0d10] border-2 border-[#222327] p-6 space-y-4">
        <h2 className="text-base font-black text-[#c89b3c] uppercase tracking-widest border-b border-[#1c1d22] pb-3">
          // SYSTEM_STATUS_LOG
        </h2>
        <div className="bg-[#060608] border border-[#1c1d22] p-4 text-emerald-400 text-sm md:text-base font-bold">
          {statusMessage}
        </div>
      </div>

      {/* CONTROL GRID (3 TRIGGER BUTTONS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GOLD TELEMETRY */}
        <div className="bg-[#0d0d10] border-2 border-[#222327] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-black text-[#c89b3c] uppercase tracking-widest border-b border-[#1c1d22] pb-3">
              // GOLD TELEMETRY
            </h3>
            <p className="text-sm text-slate-300">
              Refresh extraction gold daily rate and trigger Gemini market analysis.
            </p>
          </div>
          <button
            onClick={handleTriggerGoldFetch}
            disabled={isProcessing}
            className="px-5 py-3 bg-[#c89b3c] text-[#060608] text-sm font-black uppercase tracking-wider hover:bg-[#f59e0b] transition-all cursor-pointer disabled:opacity-50 mt-4"
          >
            {isProcessing ? "PROCESSING..." : "TRIGGER GOLD SYNC"}
          </button>
        </div>

        {/* NEWS BULLETIN SYNC */}
        <div className="bg-[#0d0d10] border-2 border-[#222327] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-black text-[#c89b3c] uppercase tracking-widest border-b border-[#1c1d22] pb-3">
              // NEWS BULLETIN SYNC
            </h3>
            <p className="text-sm text-slate-300">
              Manually poll and synchronize the latest patch notes and bulletins.
            </p>
          </div>
          <button
            onClick={handleTriggerNewsFetch}
            disabled={isProcessing}
            className="px-5 py-3 bg-[#c89b3c] text-[#060608] text-sm font-black uppercase tracking-wider hover:bg-[#f59e0b] transition-all cursor-pointer disabled:opacity-50 mt-4"
          >
            {isProcessing ? "PROCESSING..." : "TRIGGER NEWS SYNC"}
          </button>
        </div>

        {/* YOUTUBE INTEL SYNC */}
        <div className="bg-[#0d0d10] border-2 border-[#222327] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-black text-[#c89b3c] uppercase tracking-widest border-b border-[#1c1d22] pb-3">
              // YOUTUBE INTEL SYNC
            </h3>
            <p className="text-sm text-slate-300">
              Ingest official Bulkhead intel feeds and community transmissions.
            </p>
          </div>
          <button
            onClick={handleTriggerYouTubeFetch}
            disabled={isProcessing}
            className="px-5 py-3 bg-[#c89b3c] text-[#060608] text-sm font-black uppercase tracking-wider hover:bg-[#f59e0b] transition-all cursor-pointer disabled:opacity-50 mt-4"
          >
            {isProcessing ? "PROCESSING..." : "TRIGGER YOUTUBE SYNC"}
          </button>
        </div>
      </div>

      {/* MANUAL NEWS BULLETIN FORM */}
      <div className="bg-[#0d0d10] border-2 border-[#222327] p-6 space-y-6">
        <h3 className="text-base font-black text-[#c89b3c] uppercase tracking-widest border-b border-[#1c1d22] pb-3">
          // MANUAL NEWS BULLETIN DISPATCH CREATOR
        </h3>

        <form onSubmit={handleCreateNewsBulletin} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                TITLE / HEADLINE
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. EXTRACTION ZONE UPDATE"
                className="w-full bg-[#060608] border border-[#222327] p-3 text-sm text-slate-100 font-mono focus:border-[#c89b3c] outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#060608] border border-[#222327] p-3 text-sm text-slate-100 font-mono focus:border-[#c89b3c] outline-none uppercase"
              >
                <option value="PATCH NOTES">PATCH NOTES</option>
                <option value="OPERATIONS">OPERATIONS</option>
                <option value="COMMUNITY">COMMUNITY</option>
                <option value="ECONOMY">ECONOMY</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                SOURCE
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-[#060608] border border-[#222327] p-3 text-sm text-slate-100 font-mono focus:border-[#c89b3c] outline-none uppercase"
              >
                <option value="BULKHEAD">BULKHEAD</option>
                <option value="STEAM">STEAM</option>
                <option value="REDDIT">REDDIT</option>
                <option value="MEDIA">MEDIA</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              TAGS (COMMA SEPARATED)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. WEAPONS, PATCH, HOTFIX"
              className="w-full bg-[#060608] border border-[#222327] p-3 text-sm text-slate-100 font-mono focus:border-[#c89b3c] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              CONTENT / DISPATCH BODY
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Type dispatch details..."
              className="w-full bg-[#060608] border border-[#222327] p-3 text-sm text-slate-100 font-mono focus:border-[#c89b3c] outline-none resize-y"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="px-6 py-3 bg-[#c89b3c] text-[#060608] text-sm font-black uppercase tracking-widest hover:bg-[#f59e0b] transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? "TRANSMITTING..." : "PUBLISH BULLETIN TO DATABASE"}
          </button>
        </form>
      </div>

      {/* LIVE VIDEO GRID */}
      <VideoGrid />
    </div>
  );
}