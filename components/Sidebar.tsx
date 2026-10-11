"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "// GOLD EXCHANGE", href: "/" },
    { name: "// NEWS BULLETIN", href: "/bulletin" },
    { name: "// LOADOUT BUILDER", href: "/loadout-builder" },
    { name: "// VIDEO FEEDS", href: "/videos" },
    { name: "// ACCESS TERMINAL", href: "/admin/dashboard" },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#0d0d10] border-r-2 border-[#222327] p-6 flex flex-col justify-between shrink-0 font-mono select-none">
      <div className="space-y-6">
        {/* BRANDING HEADER */}
        <div>
          <div className="text-[#c89b3c] font-black tracking-widest text-lg uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-[#c89b3c] animate-pulse" />
            WARDOGS_HUD
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
            SEC_OPS // V2.5.4
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 text-xs font-black uppercase tracking-wider transition-all border ${
                  isActive
                    ? "bg-[#c89b3c] text-[#060608] border-[#c89b3c] shadow-lg"
                    : "bg-[#060608] text-slate-300 border-[#1c1d22] hover:border-[#c89b3c] hover:text-[#c89b3c]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* SYSTEM STATUS FOOTER */}
      <div className="pt-6 border-t border-[#1c1d22] space-y-2">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          TELEMETRY LINK
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          SUPABASE // ONLINE
        </div>
      </div>
    </aside>
  );
}