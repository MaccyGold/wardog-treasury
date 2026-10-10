'use client'
import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface RateData {
  recorded_at: string
  price_in_cash: number
  ai_analysis: string
}

const TIME_RANGES = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '2M', days: 60 },
  { label: '4M', days: 120 },
  { label: '6M', days: 180 },
  { label: '8M', days: 240 },
  { label: '10M', days: 300 },
  { label: '12M', days: 365 },
  { label: '18M', days: 547 },
  { label: '24M', days: 730 },
  { label: 'ALL', days: 0 },
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: RateData = payload[0].payload
    return (
      <div className="bg-slate-900 border border-amber-500/40 p-4 rounded-xl shadow-2xl max-w-xs space-y-2 text-xs">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span className="text-slate-400 font-semibold">{new Date(data.recorded_at).toLocaleDateString()}</span>
          <span className="text-amber-400 font-bold text-sm">${data.price_in_cash.toLocaleString()}</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          {data.ai_analysis || 'Regular daily market snapshot recorded.'}
        </p>
      </div>
    )
  }
  return null
}

export default function GoldExchange() {
  const [rates, setRates] = useState<RateData[]>([])
  const [selectedRange, setSelectedRange] = useState(0) // 0 = ALL

  useEffect(() => {
    async function fetchRates() {
      const { data, error } = await supabase
        .from('gold_rates')
        .select('*')
        .order('recorded_at', { ascending: true })

      if (!error && data) {
        setRates(data)
      }
    }
    fetchRates()
  }, [])

  const filteredRates = rates.filter(rate => {
    if (selectedRange === 0) return true
    const rateDate = new Date(rate.recorded_at)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - selectedRange)
    return rateDate >= cutoffDate
  })

  const latestRate = rates.length > 0 ? rates[rates.length - 1].price_in_cash : 272761

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 ml-20 p-8 max-w-6xl mx-auto space-y-8">
        <header className="border-b border-slate-800 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-amber-500 tracking-tight">WARDOGS Gold Exchange</h1>
            <p className="text-slate-400 text-sm mt-1">Automated daily market rate tracking & AI economic analysis.</p>
          </div>
        <nav className="flex gap-6 text-sm font-semibold"><Link href="/" className="text-slate-400 hover:text-amber-400 transition-colors">Home & News</Link><Link href="/gold-exchange" className="text-amber-500 border-b-2 border-amber-500 pb-1">Gold Exchange</Link><Link href="/loadout-builder" className="text-slate-400 hover:text-amber-400 transition-colors">Loadout Builder</Link></nav></header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-center items-center shadow-xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">1 Gold Bar Cost Today</span>
            <span className="text-4xl font-black text-amber-500">${latestRate.toLocaleString()}</span>
            <span className="text-xs text-slate-500 mt-2 font-medium">Cash earned in-game</span>
          </div>

          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">Rate History</h3>
              <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {TIME_RANGES.map(range => (
                  <button
                    key={range.label}
                    onClick={() => setSelectedRange(range.days)}
                    className={"px-2.5 py-1 text-xs font-bold rounded-md transition-colors " + (selectedRange === range.days ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800")}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredRates}>
                  <XAxis dataKey="recorded_at" tickFormatter={str => new Date(str).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })} stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={val => `\$${val / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="price_in_cash" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 7, fill: '#fbbf24' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
