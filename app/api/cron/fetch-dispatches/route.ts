import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Vercel Cron handler
export async function GET(request: Request) {
  try {
    // 1. Verify Vercel Cron Authorization header (optional safety check)
    const authHeader = request.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }

    if (!supabase) {
      return NextResponse.json({ error: "Supabase not initialized" }, { status: 500 });
    }

    // 2. Define latest verified patch payloads (or fetch from an external RSS/API feed)
    const incomingDispatches = [
      {
        id: "BULK-PATCH-0.2",
        category: "PATCH NOTES",
        title: "WARDOGS SEASON 2 PREVIEW // NEW WEAPONS, VEHICLES & RAIN WEATHER",
        version: "v0.2.0",
        date: "2026-10-10",
        author: "BULKHEAD_DEV_TEAM",
        content: [
          "Season 2 officially launches October 15, introducing four new weapons (TCX-SPR Assault Rifle, M14 DMR, PP-19 Bizon SMG, and Evo-3 Ultra LMG).",
          "Added four new vehicles: Wolf-110, Wolf-110 Assault, T-72B3 Main Battle Tank, and Flakpanzer Gepard anti-air.",
          "Introduced the new dynamic rain weather preset affecting visibility, engagement ranges, and audio acoustics."
        ],
        badge_color: "border-[#c89b3c] text-[#c89b3c] bg-[#29200a]",
      },
    ];

    // 3. Upsert records into Supabase so duplicates are skipped and new notes are added
    const { error } = await supabase.from("dispatches").upsert(incomingDispatches);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${incomingDispatches.length} dispatches`,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}