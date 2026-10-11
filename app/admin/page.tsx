"use client";

import React, { useState } from "react";
import Link from "next/link";
import WTHeaderLogo from "../components/icons/WTHeaderLogo";

export default function AdminLoginPage() {
  const [operatorId, setOperatorId] = useState("");
  const [securityPhrase, setSecurityPhrase] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);

    setTimeout(() => {
      if (operatorId === "admin" && securityPhrase === "wardogs") {
        window.location.href = "/admin/dashboard";
      } else {
        setAuthError("INVALID CREDENTIALS // ACCESS DENIED");
        setIsAuthenticating(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0d0d10] text-slate-100 font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#c89b3c]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#c89b3c]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full space-y-8 relative z-10">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b-2 border-[#222327] pb-6">
          <div className="flex items-center gap-4">
            <WTHeaderLogo className="w-12 h-12 shrink-0 drop-shadow-[0_0_12px_rgba(200,155,60,0.4)]" />
            <div>
              <h1 className="text-xl font-black text-[#c89b3c] tracking-widest uppercase">
                WARDOGS COMMAND
              </h1>
              <p className="text-xs text-slate-400 font-bold">// RESTRICTED_ADMIN_TERMINAL</p>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-[#c89b3c] font-bold transition-colors border border-[#222327] hover:border-[#c89b3c] px-3 py-2 bg-[#060608]"
          >
            &lt; RETURN TO HUD
          </Link>
        </div>

        {/* HERO BADGE CONTAINER */}
        <div className="bg-[#0d0d10] border-2 border-[#222327] p-4 relative shadow-2xl overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#c89b3c]" />
          <div className="relative aspect-video w-full rounded overflow-hidden border border-[#1f2026] bg-[#060608]">
            <img
              src="/admin-portal-badge.jpg"
              alt="Wardogs Admin Portal Security Badge"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* LOGIN FORM */}
        <div className="bg-[#0d0d10] border-2 border-[#222327] p-8 space-y-6 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-[#1c1d22] pb-4">
            <span className="text-xs text-[#c89b3c] font-black uppercase tracking-widest">
              // AUTHENTICATION_REQUIRED
            </span>
            <span className="text-xs text-rose-500 font-bold animate-pulse">
              LEVEL 5 SECURITY
            </span>
          </div>

          {authError && (
            <div className="bg-rose-950/50 border-2 border-rose-600 p-4 text-rose-300 text-xs font-bold tracking-wider">
              [!] {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                OPERATOR ID
              </label>
              <input
                type="text"
                required
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                placeholder="Enter clearance ID..."
                className="w-full bg-[#060608] border-2 border-[#222327] focus:border-[#c89b3c] text-slate-100 px-4 py-3 text-sm font-mono focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                SECURITY PHRASE
              </label>
              <input
                type="password"
                required
                value={securityPhrase}
                onChange={(e) => setSecurityPhrase(e.target.value)}
                placeholder="Enter security key..."
                className="w-full bg-[#060608] border-2 border-[#222327] focus:border-[#c89b3c] text-slate-100 px-4 py-3 text-sm font-mono focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-[#c89b3c] hover:bg-[#b08833] text-black font-black py-4 text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#c89b3c]/20 border border-[#c89b3c] mt-4 disabled:opacity-50 cursor-pointer"
            >
              {isAuthenticating ? "// VERIFYING_CLEARANCE..." : "[ AUTHORIZE ACCESS ]"}
            </button>
          </form>

          <div className="pt-4 border-t border-[#1c1d22] text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              UNAUTHORIZED ACCESS ATTEMPTS ARE LOGGED & MONITORED
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}