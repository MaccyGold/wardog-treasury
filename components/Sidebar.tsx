'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { label: '// Gold Exchange', href: '/', icon: '📊', tooltip: 'Live market rates & economy telemetry' },
    { label: '// Videos', href: '/videos', icon: '📹', tooltip: 'Official dev vlogs & video feed' },
    { label: '// Bulletin Board', href: '/news', icon: '📰', tooltip: 'Tactical dispatches & field reports' },
    { label: '// Loadout Builder', href: '/loadout-builder', icon: '🛠️', tooltip: 'Simulate kit cost, weight & movement speed' },
  ]

  return (
    <aside 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={"fixed top-0 left-0 h-screen bg-slate-950/95 backdrop-blur-md border-r border-slate-800/80 z-50 transition-all duration-300 flex flex-col justify-between " + (isOpen ? "w-64 shadow-2xl shadow-amber-500/5" : "w-20")}
    >
      <div className="p-3 flex flex-col gap-8">
        <Link href="/" className="flex items-center justify-center gap-3 overflow-hidden h-10 group">
          <div className="w-9 h-9 rounded-none bg-amber-500 flex items-center justify-center font-mono font-black text-slate-950 flex-shrink-0 text-base shadow-[0_0_12px_#f59e0b] group-hover:scale-105 transition-transform">
            W
          </div>
          {isOpen && (
            <span className="font-mono font-black text-amber-500 tracking-widest text-xs whitespace-nowrap flex-1 uppercase">
              // WARDOG_TREASURY
            </span>
          )}
        </Link>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.label} 
                href={item.href}
                title={!isOpen ? item.label + ': ' + item.tooltip : ''}
                className={"group flex items-center gap-4 p-3 rounded-none transition-all relative justify-start font-mono " + (isActive ? "bg-amber-500/10 text-amber-400 font-bold border-l-2 border-amber-500" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100 border-l-2 border-transparent")}
              >
                <span className="text-xl flex-shrink-0 w-8 text-center">{item.icon}</span>
                {isOpen && (
                  <div className="flex flex-col overflow-hidden whitespace-nowrap">
                    <span className="text-xs font-bold tracking-wider uppercase">{item.label}</span>
                    <span className="text-[10px] text-slate-500 font-normal leading-tight font-sans">{item.tooltip}</span>
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
