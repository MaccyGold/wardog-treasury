"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WTHeaderLogo from "./icons/WTHeaderLogo";
import GoldIcon from "./icons/GoldIcon";
import AdminIcon from "./icons/AdminIcon";

// Rolled Tactical Scroll Icon ("N") for News Bulletin
function NewsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3H7A3 3 0 004 6v12a3 3 0 003 3h12a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="#c89b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 9l3 6V9l3 6" stroke="#c89b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Crest Shield + Play Dial Icon for Videos
function VideoIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-5.45 8-12V5l-8-3z" stroke="#c89b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polygon points="10,8 16,12 10,16" fill="#c89b3c" />
    </svg>
  );
}

export default function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { name: "Gold Exchange", href: "/", icon: GoldIcon },
    { name: "News Bulletin", href: "/news", icon: NewsIcon },
    { name: "Combat Video Feed", href: "/videos", icon: VideoIcon },
  ];

  return (
    <aside className="w-72 bg-[#0d0d10] border-r-2 border-[#222327] p-6 font-mono space-y-8 sticky top-0 h-screen overflow-y-auto shadow-2xl shrink-0">
      {/* Header Branding with WT Crest Logo */}
      <div className="space-y-4 border-b border-[#222327] pb-6">
        <div className="flex items-center gap-3">
          <WTHeaderLogo className="w-10 h-10 shrink-0 drop-shadow-[0_0_10px_rgba(200,155,60,0.4)]" />
          <div>
            <h2 className="text-sm font-black text-[#c89b3c] tracking-widest uppercase">
              WARDOGS TREASURY
            </h2>
            <p className="text-xs text-slate-400 font-medium">Tactical Command</p>
          </div>
        </div>
      </div>

      {/* Navigation Directory */}
      <div className="space-y-4">
        <div className="text-xs text-[#c89b3c] font-black uppercase tracking-widest">
          // COMMAND_NAV
        </div>
        <nav className="space-y-3 flex flex-col">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3.5 px-4 py-3.5 text-sm font-bold transition-all border ${
                  isActive
                    ? "bg-[#c89b3c]/15 text-[#c89b3c] border-[#c89b3c] shadow-md shadow-[#c89b3c]/15"
                    : "bg-[#060608] text-slate-200 border-[#222327] hover:border-[#c89b3c] hover:text-[#c89b3c]"
                }`}
              >
                <IconComponent className="w-6 h-6 shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Restricted Admin Access Section with Approved Crest Asset */}
      <div className="pt-6 border-t border-[#222327] space-y-3">
        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
          // RESTRICTED_ACCESS
        </div>
        <Link
          href="/admin"
          className="w-full flex items-center justify-center gap-3 bg-[#060608] hover:bg-[#c89b3c]/15 text-[#c89b3c] font-black px-4 py-3.5 text-xs uppercase tracking-wider transition-all shadow-lg border border-[#222327] hover:border-[#c89b3c]"
        >
          <AdminIcon className="w-6 h-6 shrink-0 drop-shadow-[0_0_6px_rgba(200,155,60,0.4)]" />
          <span>[ ADMIN PORTAL ]</span>
        </Link>
      </div>
    </aside>
  );
}