"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setDebugLog("// INITIATING AUTH REQ...");

    try {
      if (!supabase) {
        throw new Error("Supabase client is not configured.");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        setErrorMsg(`[${error.status || "AUTH_ERR"}] ${error.message}`);
        setDebugLog(`// FAILED: ${error.message}`);
        setLoading(false);
        return;
      }

      if (data?.session) {
        setDebugLog("// SUCCESS: SESSION CREATED. REDIRECTING TO TERMINAL...");
        // Hard redirect allows cookies to be fully registered by the browser
        window.location.href = "/admin";
      } else {
        setErrorMsg("No session returned from Supabase.");
        setDebugLog("// ERROR: NO SESSION CREATED");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("[AUTH EXCEPTION]:", err);
      setErrorMsg(err.message || "An unexpected error occurred.");
      setDebugLog(`// EXCEPTION: ${err.message}`);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center font-mono text-slate-100 select-none p-4">
      <div className="w-full max-w-md bg-[#0d0d10] border-2 border-[#222327] p-8 space-y-6 relative shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-[#c89b3c]" />

        <div>
          <h1 className="text-[#c89b3c] font-black text-xl uppercase tracking-widest">
            // AUTHENTICATION_REQUIRED
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enter authorized security credentials to access administrative systems.
          </p>
        </div>

        {debugLog && (
          <div className="bg-[#060608] border border-[#222327] p-3 text-emerald-400 text-xs font-bold font-mono">
            {debugLog}
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-950/50 border border-red-500/50 p-3 text-red-400 text-xs font-bold">
            // ERROR: {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              COMMAND_EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@wardogs.hud"
              className="w-full bg-[#060608] border border-[#222327] p-3 text-sm text-slate-100 font-mono focus:border-[#c89b3c] outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              ACCESS_KEY / PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#060608] border border-[#222327] p-3 text-sm text-slate-100 font-mono focus:border-[#c89b3c] outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#c89b3c] text-[#060608] text-sm font-black uppercase tracking-widest hover:bg-[#f59e0b] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "INITIALIZE TERMINAL SESSION"}
          </button>
        </form>
      </div>
    </div>
  );
}