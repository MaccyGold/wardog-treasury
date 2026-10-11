"use client";

import React from "react";
import { DataPoint } from "../goldData";

export default function GoldChart({
  chartPoints,
  allDailyLog,
  selectedTimeframe,
  setSelectedTimeframe,
  hoveredPoint,
  setHoveredPoint,
}: {
  chartPoints: DataPoint[];
  allDailyLog: DataPoint[];
  selectedTimeframe: string;
  setSelectedTimeframe: (tf: string) => void;
  hoveredPoint: DataPoint | null;
  setHoveredPoint: (pt: DataPoint | null) => void;
}) {
  const minPrice = Math.min(...chartPoints.map((d) => d.price));
  const maxPrice = Math.max(...chartPoints.map((d) => d.price));

  const svgW = 1000;
  const svgH = 350;
  const pad = 40;

  const points = chartPoints.map((d, idx) => {
    const x = pad + (idx / (chartPoints.length - 1 || 1)) * (svgW - pad * 2);
    const y = svgH - pad - ((d.price - minPrice) / (maxPrice - minPrice || 1)) * (svgH - pad * 2);
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const labelInterval = Math.max(1, Math.floor(chartPoints.length / 8));
  const latestEntry = allDailyLog[allDailyLog.length - 1];

  return (
    <div className="bg-[#0d0d10] border-2 border-[#222327] p-6 space-y-4 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-[#1c1d22] pb-3 gap-4">
        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            {/* MATCHED SECTION HEADING SIZE */}
            <span className="text-lg md:text-xl font-black text-slate-100 tracking-widest uppercase">
              // TELEMETRY_VALUATION_GRAPH
            </span>
            <span className="text-base font-black text-[#c89b3c]">
              [{latestEntry.price.toLocaleString()} CR / GOLD BAR]
            </span>
          </div>
          <p className="text-xs text-[#8c909a] mt-1 font-medium">
            Displays exact in-game credit exchange rates per Gold Bar on each historical settlement date.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-emerald-400 font-bold bg-[#1b431e] px-3.5 py-1.5 border border-emerald-700">
            24H VOLUME: {latestEntry.volume}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[#8c909a] font-bold uppercase">RANGE:</span>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-[#16161a] border border-[#c89b3c] text-[#c89b3c] font-black text-sm px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="1W">1W (7 DAYS)</option>
              <option value="1M">1M (30 DAYS)</option>
              <option value="2M">2M (60 DAYS)</option>
              <option value="4M">4M (120 DAYS)</option>
              <option value="6M">6M (180 DAYS)</option>
              <option value="12M">12M (1 YEAR)</option>
              <option value="18M">18M (1.5 YEARS)</option>
              <option value="24M">24M (2 YEARS)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[380px] bg-[#060608] border border-[#1c1d22] p-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #c89b3c 1px, transparent 1px), linear-gradient(to bottom, #c89b3c 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <path
            d={pathD}
            fill="none"
            stroke="#c89b3c"
            strokeWidth="3.5"
            className="drop-shadow-[0_0_10px_rgba(200,155,60,0.4)]"
          />

          {points.map((pt, idx) => (
            <g
              key={idx}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredPoint(pt.data)}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={pt.data.isCustomEvent ? "7" : "5"}
                className={`fill-[#0d0d10] stroke-[#c89b3c] ${
                  pt.data.isCustomEvent ? "stroke-[3]" : "stroke-[2]"
                } group-hover:r-8 transition-all`}
              />
              <circle cx={pt.x} cy={pt.y} r="2" className="fill-[#c89b3c]" />

              {idx % labelInterval === 0 && (
                <text
                  x={pt.x}
                  y={svgH - 10}
                  textAnchor="middle"
                  fill="#8c909a"
                  fontSize="13"
                  fontWeight="bold"
                >
                  {pt.data.date}
                </text>
              )}
            </g>
          ))}
        </svg>

        {hoveredPoint && (
          <div className="absolute top-6 right-6 bg-[#16161a] border-2 border-[#c89b3c] p-4 shadow-2xl space-y-1 text-sm z-10 pointer-events-none">
            <div className="text-[#8c909a] font-bold">DATE: {hoveredPoint.date}</div>
            <div className="text-[#c89b3c] text-lg font-black">
              {hoveredPoint.price.toLocaleString()} CR / GOLD BAR
            </div>
            <div className="text-slate-300">TRADED VOLUME: {hoveredPoint.volume}</div>
            <div className="text-emerald-400 font-bold border-t border-[#222327] pt-1 mt-1">
              EVENT: {hoveredPoint.event}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}