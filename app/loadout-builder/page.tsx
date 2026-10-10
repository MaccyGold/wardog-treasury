'use client'
import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Link from 'next/link'

const WEAPONS = [
  { name: 'M4 Assault Rifle', type: 'Primary', weight: 2.92, cost: 2800 },
  { name: 'FAL Heavy Rifle', type: 'Primary', weight: 4.25, cost: 6500 },
  { name: 'T-21 Economy Rifle', type: 'Primary', weight: 3.27, cost: 600 },
  { name: 'SVD Marksman', type: 'Primary', weight: 5.30, cost: 4800 },
  { name: 'PKM Heavy Machine Gun', type: 'Primary', weight: 7.50, cost: 4500 },
  { name: 'AMP-9 SMG', type: 'Primary', weight: 1.40, cost: 900 },
]

const ARMOR = [
  { name: 'None', weight: 0, cost: 0 },
  { name: 'Level 1 Armor (Low)', weight: 3.0, cost: 500 },
  { name: 'Level 2 Armor (Medium)', weight: 4.5, cost: 1200 },
  { name: 'Level 3 Armor (High)', weight: 10.5, cost: 3500 },
  { name: 'Level 4 Armor (Very High)', weight: 18.0, cost: 8000 },
]

const HELMETS = [
  { name: 'None', weight: 0, cost: 0 },
  { name: 'Level 1 Helmet', weight: 1.0, cost: 300 },
  { name: 'Level 2 Helmet', weight: 1.6, cost: 700 },
  { name: 'Level 3 Helmet', weight: 3.0, cost: 1800 },
  { name: 'Level 4 Helmet', weight: 4.5, cost: 4000 },
]

export default function LoadoutBuilder() {
  const [primary, setPrimary] = useState(WEAPONS[0])
  const [armor, setArmor] = useState(ARMOR[2])
  const [helmet, setHelmet] = useState(HELMETS[1])
  const [mags, setMags] = useState(3)

  const totalWeight = Number((primary.weight + armor.weight + helmet.weight + (mags * 0.4)).toFixed(2))
  const totalCost = primary.cost + armor.cost + helmet.cost + (mags * 150)

  let speedPct = 100
  let mobilityClass = 'Fast / Agile'
  let speedColor = 'text-green-400'

  if (totalWeight > 25) {
    speedPct = 65
    mobilityClass = 'Anchor / Heavy Movement'
    speedColor = 'text-red-500'
  } else if (totalWeight > 12) {
    speedPct = 85
    mobilityClass = 'Standard Infantry'
    speedColor = 'text-amber-400'
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 ml-20 p-8 max-w-5xl mx-auto space-y-8">
        <header className="border-b border-slate-800 pb-6 flex justify-between items-end">
          <h1 className="text-4xl font-extrabold text-amber-500 tracking-tight">WARDOGS Loadout Simulator</h1>
          <p className="text-slate-400 text-sm mt-1">Calculate loadout weight penalties, sprint performance, and total deploy costs.</p>
        <nav className="flex gap-6 text-sm font-semibold"><Link href="/" className="text-slate-400 hover:text-amber-400 transition-colors">Home & News</Link><Link href="/gold-exchange" className="text-slate-400 hover:text-amber-400 transition-colors">Gold Exchange</Link><Link href="/loadout-builder" className="text-amber-500 border-b-2 border-amber-500 pb-1">Loadout Builder</Link></nav></header>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Weapon</label>
              <select value={primary.name} onChange={(e) => setPrimary(WEAPONS.find(w => w.name === e.target.value)!)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 font-semibold focus:border-amber-500 outline-none">
                {WEAPONS.map(w => <option key={w.name} value={w.name}>{w.name} ({w.weight} kg) - ${w.cost.toLocaleString()}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Body Armor</label>
              <select value={armor.name} onChange={(e) => setArmor(ARMOR.find(a => a.name === e.target.value)!)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 font-semibold focus:border-amber-500 outline-none">
                {ARMOR.map(a => <option key={a.name} value={a.name}>{a.name} ({a.weight} kg) - ${a.cost.toLocaleString()}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Helmet Protection</label>
              <select value={helmet.name} onChange={(e) => setHelmet(HELMETS.find(h => h.name === e.target.value)!)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 font-semibold focus:border-amber-500 outline-none">
                {HELMETS.map(h => <option key={h.name} value={h.name}>{h.name} ({h.weight} kg) - ${h.cost.toLocaleString()}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Extra Spare Magazines: {mags}</label>
              <input type="range" min="1" max="8" value={mags} onChange={(e) => setMags(Number(e.target.value))} className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-xl space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-amber-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 block">Total Kit Weight</span>
                  <span className="text-2xl font-black text-slate-100">{totalWeight} <span className="text-sm font-normal text-slate-400">kg</span></span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Deploy Build Cost</span>
                  <span className="text-2xl font-black text-amber-400">${totalCost.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Sprint Speed Efficiency</span>
                  <span className={"text-2xl font-black " + speedColor}>{speedPct}%</span>
                  <span className="text-xs block text-slate-500 font-semibold mt-0.5">{mobilityClass}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 leading-relaxed">
              💡 <strong className="text-slate-200">Pro Tip:</strong> Carrying Level 4 Armor with an HMG limits mobility severely. Use vehicles or stay anchored near FOB objectives!
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
