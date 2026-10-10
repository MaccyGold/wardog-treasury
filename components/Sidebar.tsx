'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { label: 'Gold Exchange', href: '/gold-exchange', icon: '📈', tooltip: 'Live market rate & AI economy trends' },
    { label: 'Video Feeds', href: '/#videos', icon: '📹', tooltip: 'Official dev updates & gameplay videos' },
    { label: 'News', href: '/#news', icon: '📰', tooltip: 'AI summaries & WARDOGS news feed' },
    { label: 'Loadout Builder', href: '/loadout-builder', icon: '🛠️', tooltip: 'Simulate gear cost, weight & movement speed' },
  ]

  return (
    <aside 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={"fixed top-0 left-0 h-screen bg-slate-900 border-r border-slate-800 z-50 transition-all duration-300 flex flex-col justify-between " + (isOpen ? "w-64 shadow-2xl" : "w-20")}
    >
      <div className="p-3 flex flex-col gap-8">
        <div className="flex items-center justify-center gap-3 overflow-hidden h-10">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950 flex-shrink-0 text-base shadow">
            W
          </div>
          {isOpen && (
            <span className="font-extrabold text-amber-500 tracking-wider text-sm whitespace-nowrap flex-1">
              WARDOG TREASURY
            </span>
          )}
        </div>

        <nav className="flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.href} 
                href={item.href}
                title={!isOpen ? item.label + ': ' + item.tooltip : ''}
                className={"group flex items-center gap-4 p-3 rounded-xl transition-all relative justify-start " + (isActive ? "bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100")}
              >
                <span className="text-xl flex-shrink-0 w-8 text-center">{item.icon}</span>
                {isOpen && (
                  <div className="flex flex-col overflow-hidden whitespace-nowrap">
                    <span className="text-sm">{item.label}</span>
                    <span className="text-[10px] text-slate-500 font-normal leading-tight">{item.tooltip}</span>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
