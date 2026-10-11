import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  // 1. Verify authorization header from Vercel Cron in production
  const authHeader = request.headers.get("authorization");
  if (
    process.env.NODE_ENV === "production" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validate Supabase client initialization
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase client is not initialized." },
      { status: 500 }
    );
  }

  // 3. Fetch candidate video records from Supabase
  const { data: videos, error } = await supabase
    .from("youtube_videos")
    .select("id, youtube_url, url, video_id, title, description, tags");

  if (error || !videos) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch videos from Supabase." },
      { status: 400 }
    );
  }

  const purgedIds: string[] = [];

  // 4. Evaluate each video entry
  for (const video of videos) {
    const rawUrl = video.youtube_url || video.url || video.video_id || "";
    const title = (video.title || "").toLowerCase();
    const desc = (video.description || "").toLowerCase();
    const tags = (video.tags || []).join(" ").toLowerCase();

    let videoId = rawUrl;

    // Extract exact 11-character YouTube video ID
    if (rawUrl.includes("v=")) {
      videoId = rawUrl.split("v=")[1]?.split("&")[0];
    } else if (rawUrl.includes("youtu.be/")) {
      videoId = rawUrl.split("youtu.be/")[1]?.split("?")[0];
    } else if (rawUrl.includes("/shorts/")) {
      videoId = rawUrl.split("/shorts/")[1]?.split("?")[0];
    }

    if (!videoId) continue;

    // Pattern pre-check: Immediate purge if URL/title/description contains explicit Shorts tags or keywords
    const isExplicitShort =
      rawUrl.toLowerCase().includes("shorts") ||
      title.includes("#short") ||
      title.includes("shorts") ||
      title.includes("pov:") ||
      desc.includes("#short") ||
      tags.includes("short");

    if (isExplicitShort) {
      await supabase.from("youtube_videos").delete().eq("id", video.id);
      purgedIds.push(video.id);
      continue;
    }

    // Live Server Check: Query YouTube's internal Shorts redirect endpoint
    try {
      const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
        method: "HEAD",
        redirect: "manual",
      });

      // Status HTTP 200 confirms YouTube actively routes and renders this video ID as a Short
      if (res.status === 200) {
        await supabase.from("youtube_videos").delete().eq("id", video.id);
        purgedIds.push(video.id);
      }
    } catch (e) {
      console.error(`[CRON_SHORTS_PURGE] Error checking video ID ${videoId}:`, e);
    }
  }

  return NextResponse.json({
    status: "success",
    message: "Shorts purge cycle complete.",
    scannedCount: videos.length,
    purgedCount: purgedIds.length,
    purgedIds,
  });
}