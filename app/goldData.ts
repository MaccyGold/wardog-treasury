export interface DataPoint {
  date: string;
  price: number; // In-Game Credits per 1 Gold Bar
  event?: string;
  volume: string; // In-game Gold Bars traded
  isCustomEvent?: boolean;
}

export interface TimeframeDataset {
  allDailyLog: DataPoint[];
  chartPoints: DataPoint[];
}

// Fixed baseline historical in-game rate milestones (Credits per 1 Gold Bar)
const IN_GAME_HISTORICAL_RATES: { date: string; price: number; event: string; volume: string; isCustom: boolean }[] = [
  { date: "SEP 12", price: 38500, event: "Pre-Season Exchange Calibration", volume: "1,200 Bars", isCustom: false },
  { date: "SEP 15", price: 41200, event: "Industrial District Sector Unlock", volume: "2,450 Bars", isCustom: true },
  { date: "SEP 18", price: 43000, event: "Daily Settlement Index", volume: "2,100 Bars", isCustom: false },
  { date: "SEP 21", price: 44800, event: "Update 0.1.2 Exploit Mitigations", volume: "3,100 Bars", isCustom: true },
  { date: "SEP 25", price: 46200, event: "Squad Wager League Kickoff", volume: "4,200 Bars", isCustom: true },
  { date: "SEP 28", price: 47500, event: "Daily Settlement Index", volume: "3,800 Bars", isCustom: false },
  { date: "OCT 01", price: 48900, event: "CIWS Engagement Balance Hotfix", volume: "4,500 Bars", isCustom: true },
  { date: "OCT 04", price: 49800, event: "FOB Supply Logistics Surge", volume: "4,100 Bars", isCustom: false },
  { date: "OCT 07", price: 51200, event: "Mid-Season Vault Reserve Rebalance", volume: "5,300 Bars", isCustom: true },
  { date: "OCT 09", price: 52000, event: "Heavy Vehicle Introduction Dispatch", volume: "5,900 Bars", isCustom: true },
  { date: "OCT 10", price: 52200, event: "Daily Settlement Index", volume: "5,700 Bars", isCustom: false },
  { date: "OCT 11", price: 52400, event: "Season 02 Preview & Roadmap Dispatch", volume: "6,250 Bars", isCustom: true },
];

function buildDataset(days: number): TimeframeDataset {
  // If requesting a short timeline, slice the exact historical days
  const sliced = IN_GAME_HISTORICAL_RATES.slice(-Math.min(days, IN_GAME_HISTORICAL_RATES.length));

  const allDailyLog: DataPoint[] = sliced.map((item) => ({
    date: item.date,
    price: item.price,
    event: item.event,
    volume: item.volume,
    isCustomEvent: item.isCustom,
  }));

  // Downsample to max 30 for the SVG curve while keeping exact points
  let chartPoints: DataPoint[] = [];
  if (allDailyLog.length <= 30) {
    chartPoints = [...allDailyLog];
  } else {
    const step = (allDailyLog.length - 1) / 29;
    const selected = new Set<number>();
    allDailyLog.forEach((pt, i) => {
      if (pt.isCustomEvent) selected.add(i);
    });
    for (let i = 0; i < 30; i++) {
      selected.add(Math.round(i * step));
    }
    const sorted = Array.from(selected).sort((a, b) => a - b);
    chartPoints = sorted.map((idx) => allDailyLog[idx]);
  }

  return { allDailyLog, chartPoints };
}

export const TIMEFRAME_DATA: Record<string, TimeframeDataset> = {
  "1W": buildDataset(7),
  "1M": buildDataset(30),
  "2M": buildDataset(60),
  "4M": buildDataset(120),
  "6M": buildDataset(180),
  "12M": buildDataset(365),
  "18M": buildDataset(540),
  "24M": buildDataset(730),
};