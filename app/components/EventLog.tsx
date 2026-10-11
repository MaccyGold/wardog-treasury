"use client";

import React from "react";
import { DataPoint } from "../goldData";

export default function EventLog({
  allDailyLog,
  selectedTimeframe,
}: {
  allDailyLog: DataPoint[];
  selectedTimeframe: string;
}) {
  return (
    <div className="bg-[#0d0d10] border-2 border-[#222327] p-6 space-y-4 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-[#1c1d22] pb-3 gap-2">
        {/* MATCHED SECTION HEADING SIZE */}
        <span className="text-lg md:text-xl font-black text-slate-100 tracking-widest uppercase">
          // CHRONOLOGICAL_EVENT_LOG
        </span>
        <span className="text-sm text-[#c89b3c] font-bold">
          RANGE: {selectedTimeframe} ({allDailyLog.length} DAILY ENTRIES)
        </span>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
        {allDailyLog
          .slice()
          .reverse()
          .map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-[#060608] border border-[#1c1d22] hover:border-[#c89b3c] transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-sm"
            >
              <div className="flex items-center gap-4">
                <span className="text-[#c89b3c] font-black w-24">{item.date}</span>
                <span className="text-slate-100 font-bold">
                  {item.price.toLocaleString()} CR / BAR
                </span>
                <span
                  className={`px-2.5 py-0.5 font-bold ${
                    item.isCustomEvent
                      ? "bg-[#29200a] text-[#c89b3c] border border-[#c89b3c]"
                      : "bg-[#101114] text-[#8c909a] border border-[#1a1b20]"
                  }`}
                >
                  {item.event}
                </span>
              </div>
              <div className="text-[#8c909a] font-medium">VOLUME: {item.volume}</div>
            </div>
          ))}
      </div>
    </div>
  );
}