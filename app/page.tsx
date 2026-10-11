"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { supabase } from "@/lib/supabaseClient";
import WTHeaderLogo from "./components/icons/WTHeaderLogo";
import GoldIcon from "./components/icons/GoldIcon";

interface GoldRatePoint {
  id: string;
  price_in_cash: number;
  ai_analysis: string;
  recorded_at: string;
  headline: string;
}

const RANGES = ["1W", "1M", "2M", "4M", "6M", "8M", "10M", "12M", "18M", "24M"];

export default function HomePage() {
  const [goldData, setGoldData] = useState<GoldRatePoint[]>([]);
  const [selectedRange, setSelectedRange] = useState("1M");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setFetchError(null);

      if (!supabase) {
        setFetchError("Supabase client is not initialized.");
        setLoading(false);
        return;
      }

      // Strictly querying gold_rates with exact locked schema columns
      const { data: gold, error } = await supabase
        .from("gold_rates")
        .select("id, price_in_cash, ai_analysis, recorded_at, headline")
        .order("recorded_at", { ascending: true });

      if (error) {
        console.error("Supabase gold_rates Fetch Error:", error);
        setFetchError(error.message);
      }

      if (gold && gold.length > 0) {
        const formattedGold = gold.map((item: any) => ({
          id: item.id || Math.random().toString(),
          price_in_cash: Number(item.price_in_cash || 0),
          ai_analysis: item.ai_analysis || "",
          recorded_at: item.recorded_at || new Date().toISOString(),
          headline: item.headline || "Telemetry Exchange Update",
        }));
        setGoldData(formattedGold);
      } else {
        setGoldData([]);
      }

      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  // Filter data based on selected range selector (1W to 24M)
  const getFilteredData = () => {
    if (goldData.length === 0) return [];
    const now = new Date().getTime();
    let daysToSubtract = 30; // default 1M

    switch (selectedRange) {
      case "1W": daysToSubtract = 7; break;
      case "1M": daysToSubtract = 30; break;
      case "2M": daysToSubtract = 60; break;
      case "4M": daysToSubtract = 120; break;
      case "6M": daysToSubtract = 180; break;
      case "8M": daysToSubtract = 240; break;
      case "10M": daysToSubtract = 300; break;
      case "12M": daysToSubtract = 365; break;
      case "18M": daysToSubtract = 548; break;
      case "24M": daysToSubtract = 730; break;
      default: daysToSubtract = 30;
    }

    const cutoff = now - daysToSubtract * 86400000;
    const filtered = goldData.filter((d) => new Date(d.recorded_at).getTime() >= cutoff);
    return filtered.length > 0 ? filtered : goldData;
  };

  const chartData = getFilteredData();
  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].price_in_cash : 0;
  const previousPrice = chartData.length > 1 ? chartData[chartData.length - 2].price_in_cash : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const isPositive = priceChange >= 0;

  // Maccy AI Summary from ai_analysis of the latest record
  const latestSummary = chartData.length > 0 && chartData[chartData.length - 1].ai_analysis 
    ? chartData[chartData.length - 1].ai_analysis 
    : "Awaiting live telemetry intelligence update...";

  // Dynamic Y-axis bounds
  const prices = chartData.map((d) => d.price_in_cash);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 100;
  const yDomain = [Math.floor(minPrice * 0.95), Math.ceil(maxPrice * 1.05)];

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-mono text-slate-100 pb-16">
      {/* HERO BANNER WITH WT HEADER LOGO */}
      <div className="bg-[#0d0d10] border-2 border-[#222327] p-8 relative shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-[#c89b3c]" />
        
        <div className="flex items-center gap-6">
          <WTHeaderLogo className="w-20 h-20 shrink-0 drop-shadow-[0_0_15px_rgba(200,155,60,0.3)]" />
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-[#c89b3c] tracking-widest uppercase">
              WARDOGS TREASURY
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
              Centralized intelligence command, gold rate telemetry, and combat archives.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 self-stretch md:self-auto justify-end">
          <div className="bg-[#060608] border border-[#222327] px-5 py-3 text-right shadow-inner">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">SYS STATUS</div>
            <div className="text-sm font-black text-emerald-400 mt-0.5">// ONLINE</div>
          </div>
        </div>
      </div>

      {/* DATABASE ERROR NOTIFICATION BANNER */}
      {fetchError && (
        <div className="bg-rose-950/40 border-2 border-rose-600 p-5 text-rose-200 text-sm flex items-center justify-between shadow-lg">
          <span><strong>SUPABASE SYNC WARNING:</strong> {fetchError}</span>
        </div>
      )}

      {/* MACCY AI GOLD SUMMARY BOX */}
      <div className="bg-[#0d0d10] border-2 border-[#222327] p-6 shadow-xl flex items-start gap-5">
        <div className="w-3.5 h-3.5 rounded-full bg-[#c89b3c] animate-pulse mt-1.5 shrink-0 shadow-[0_0_10px_#c89b3c]" />
        <div className="space-y-1.5">
          <div className="text-xs font-black text-[#c89b3c] uppercase tracking-widest">
            MACCY AI MARKET INTEL BRIEFING
          </div>
          <p className="text-sm md:text-base text-slate-200 leading-relaxed font-sans">
            {latestSummary}
          </p>
        </div>
      </div>

      {/* GOLD EXCHANGE TELEMETRY CHART */}
      <div className="bg-[#0d0d10] border-2 border-[#222327] p-8 space-y-6 relative shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1c1d22] pb-6">
          <div className="flex items-center gap-4">
            <GoldIcon className="w-10 h-10 shrink-0 drop-shadow-[0_0_10px_rgba(200,155,60,0.4)]" />
            <div>
              <h2 className="text-2xl font-black text-slate-100 uppercase tracking-wider">
                GOLD MARKET TELEMETRY
              </h2>
              <p className="text-sm text-slate-400">Daily exchange fluctuations and market trend analysis.</p>
            </div>
          </div>

          <div className="flex items-baseline gap-4 bg-[#060608] border border-[#222327] px-6 py-3.5 shadow-inner">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">CURRENT RATE:</span>
            <span className="text-2xl font-black text-[#c89b3c]">
              {currentPrice.toLocaleString()} <span className="text-xs text-slate-400">GOLD</span>
            </span>
            <span className={`text-sm font-black ${isPositive ? "text-emerald-400" : "text-rose-500"}`}>
              {isPositive ? `+${priceChange.toLocaleString()}` : priceChange.toLocaleString()}
            </span>
          </div>
        </div>

        {/* RANGE SELECTOR BAR (1W TO 24M) */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-3">TIMEFRAME:</span>
          {RANGES.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-4 py-2 text-xs font-black transition-all border ${
                selectedRange === range
                  ? "bg-[#c89b3c] text-black border-[#c89b3c] shadow-lg shadow-[#c89b3c]/25 scale-105"
                  : "bg-[#060608] text-slate-300 border-[#222327] hover:border-[#c89b3c] hover:text-[#c89b3c]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* RECHARTS AREA CHART WITH VISIBLE DOTS */}
        <div className="h-80 w-full pt-4">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center text-[#c89b3c] text-base font-bold animate-pulse">
              // LOADING_MARKET_TELEMETRY...
            </div>
          ) : chartData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-base font-bold">
              // NO_TELEMETRY_DATA_RECORDED
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c89b3c" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#c89b3c" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2026" vertical={false} />
                <XAxis
                  dataKey="recorded_at"
                  stroke="#94a3b8"
                  fontSize={13}
                  tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                />
                <YAxis stroke="#94a3b8" fontSize={13} domain={yDomain} />
                
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d0d10",
                    borderColor: "#c89b3c",
                    borderWidth: "2px",
                    borderRadius: "0px",
                    color: "#f8fafc",
                    fontFamily: "monospace",
                    fontSize: "14px",
                    boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.7)",
                  }}
                  labelStyle={{ color: "#c89b3c", fontWeight: "bold", marginBottom: "6px" }}
                  itemStyle={{ color: "#f8fafc", fontWeight: "bold" }}
                  labelFormatter={(label) => `DATE: ${new Date(label).toLocaleDateString()}`}
                  formatter={(val: any) => [`${Number(val || 0).toLocaleString()} GOLD`, "RATE"]}
                />

                <Area
                  type="monotone"
                  dataKey="price_in_cash"
                  stroke="#c89b3c"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#goldGradient)"
                  dot={{ stroke: "#c89b3c", strokeWidth: 2, fill: "#0d0d10", r: 5 }}
                  activeDot={{ r: 7, fill: "#c89b3c", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* HISTORICAL TELEMETRY EVENT LOG TABLE */}
      <div className="bg-[#0d0d10] border-2 border-[#222327] p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1c1d22] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-[#c89b3c] shadow-[0_0_8px_#c89b3c]" />
            <h2 className="text-xl font-black text-slate-100 uppercase tracking-wider">
              HISTORICAL TELEMETRY EVENT LOG
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">// ARCHIVE_FEED</span>
        </div>

        <div className="overflow-x-auto">
          {chartData.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm font-bold">
              // NO_ARCHIVED_EVENTS_RECORDED_IN_DATABASE
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#1c1d22] text-xs text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-bold">Timestamp</th>
                  <th className="py-3.5 px-4 font-bold">Headline</th>
                  <th className="py-3.5 px-4 font-bold">Gold Exchange Rate</th>
                  <th className="py-3.5 px-4 font-bold">AI Intelligence Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1d22]">
                {chartData.slice().reverse().map((row) => (
                  <tr key={row.id} className="hover:bg-[#16171d] transition-colors">
                    <td className="py-4 px-4 text-slate-300 whitespace-nowrap text-xs">
                      {new Date(row.recorded_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-slate-100 font-bold">
                      {row.headline}
                    </td>
                    <td className="py-4 px-4 text-[#c89b3c] font-black whitespace-nowrap">
                      {row.price_in_cash.toLocaleString()} GOLD
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-sans text-sm">
                      {row.ai_analysis || "No analysis recorded."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}