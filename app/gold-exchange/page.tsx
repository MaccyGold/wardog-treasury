'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '../../lib/supabase'

export default function GoldExchange() {
  const [rates, setRates] = useState<any[]>([])
  const [latestRate, setLatestRate] = useState<number>(272761)
  const [aiSummary, setAiSummary] = useState<string>('Loading market analysis...')

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('gold_rates').select('*').order('recorded_at', { ascending: true })
      if (data && data.length > 0) {
        const formatted = data.map(r => ({
          date: new Date(r.recorded_at).toLocaleDateString(),
          price: Number(r.price_in_cash)
        }))
        setRates(formatted)
        const last = data[data.length - 1]
        setLatestRate(Number(last.price_in_cash))
        if (last.ai_analysis) setAiSummary(last.ai_analysis)
      } else {
        // Fallback demo data
        setRates([
          { date: '10 Sep', price: 2798240 },
          { date: '20 Sep', price: 1627740 },
          { date: '29 Sep', price: 1418305 },
          { date: '02 Oct', price: 331582 },
          { date: '10 Oct', price: 272761 }
        ])
        setAiSummary('Gold prices dropped sharply from early access peak levels after Bulkhead issued exploit bans and cash resets. At $272,761 per bar, buying endgame cosmetics like the Black & Gold AK74 is significantly more affordable. Players holding cash ahead of season reset should consider converting before rates shift.')
      }
    }
    loadData()
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="border-b border-slate-800 pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-amber-500 tracking-tight">WARDOG TREASURY</h1>
            <p className="text-slate-400 text-sm mt-1">Gold Exchange Rate & Intelligence Center</p>
          </div>
          <nav className="flex gap-4 text-sm font-semibold">
            <Link href="/" className="text-slate-400 hover:text-amber-400">Home & News</Link>
            <Link href="/gold-exchange" className="text-amber-500 border-b-2 border-amber-500 pb-1">Gold Exchange</Link>
          </nav>
        </header>

        {/* AI Market Analysis Callout */}
        <section className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded">GEMINI AI ANALYSIS</span>
            <span className="text-slate-400 text-xs">Updated Daily @ 8:00 AM UTC</span>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed font-medium">{aiSummary}</p>
        </section>

        {/* Daily Rate Display & Chart */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-center text-center">
            <span className="text-slate-400 text-sm font-semibold mb-1">1 Gold Bar Cost Today</span>
            <span className="text-3xl font-black text-amber-400">${latestRate.toLocaleString()}</span>
            <span className="text-xs text-slate-500 mt-2">Cash earned in-game</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:col-span-2 h-64">
            <h3 className="text-sm font-bold text-slate-300 mb-4">Rate History (Cash per Bar)</h3>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={rates}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                <Line type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  )
}
