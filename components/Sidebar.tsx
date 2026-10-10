'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { label: 'Gold Exchange', href: '/', icon: '📊', tooltip: 'Live market rates & AI economy trends' },
    { label: 'Videos', href: '/videos', icon: '📹', tooltip: 'Official dev vlogs & video feed' },
    { label: 'News', href: '/news', icon: '📰', tooltip: 'AI summaries & community updates' },
    { label: 'Loadout Builder', href: '/loadout-builder', icon: '🛠️', tooltip: 'Simulate kit cost, weight & movement speed' },
  ]

  return (
    <aside 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={"fixed top-0 left-0 h-screen bg-slate-950/90 backdrop-blur-md border-r border-slate-800/80 z-50 transition-all duration-300 flex flex-col justify-between " + (isOpen ? "w-64 shadow-2xl shadow-amber-500/5" : "w-20")}
    >
      <div className="p-3 flex flex-col gap-8">
        <Link href="/" className="flex items-center justify-center gap-3 overflow-hidden h-10 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 flex-shrink-0 text-base shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            W
          </div>
          {isOpen && (
            <span className="font-black text-amber-500 tracking-wider text-sm whitespace-nowrap flex-1 uppercase">
              WARDOG TREASURY
            </span>
          )}
        </Link>

        <nav className="flex flex-col gap-2.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.label} 
                href={item.href}
                title={!isOpen ? item.label + ': ' + item.tooltip : ''}
                className={"group flex items-center gap-4 p-3 rounded-xl transition-all relative justify-start " + (isActive ? "bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30 shadow-inner" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100 border border-transparent")}
              >
                <span className="text-xl flex-shrink-0 w-8 text-center">{item.icon}</span>
                {isOpen && (
                  <div className="flex flex-col overflow-hidden whitespace-nowrap">
                    <span className="text-sm font-semibold tracking-wide">{item.label}</span>
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
