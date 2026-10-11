import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BULKHEAD_CHANNEL_ID = "UCPVan4eGsvtogvBO56LwSAw";

// Seed fallback data if API key is unconfigured or blocked
const SEED_VIDEOS = [
  {
    video_id: "J2VxjMnMDw4",
    title: "WARDOGS | Road to Season 02",
    thumbnail_url: "https://i.ytimg.com/vi/J2VxjMnMDw4/hqdefault.jpg",
    channel_title: "BULKHEAD",
    category: "INTEL_FEED",
    view_count: 175000,
    published_at: new Date().toISOString(),
  },
  {
    video_id: "CwBB7uJmAj4",
    title: "How to BUILD Bases That Actually WIN (WARDOGS)",
    thumbnail_url: "https://i.ytimg.com/vi/CwBB7uJmAj4/hqdefault.jpg",
    channel_title: "HitboTC",
    category: "COMMUNITY_TRANSMISSION",
    view_count: 23000,
    published_at: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    let officialIngested = 0;
    let communityIngested = 0;

    if (YOUTUBE_API_KEY) {
      // 1. Fetch Official Bulkhead Channel Videos
      const officialRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${BULKHEAD_CHANNEL_ID}&part=snippet,id&order=date&maxResults=10&type=video`
      );
      const officialData = await officialRes.json();

      if (officialData.items) {
        for (const vid of officialData.items) {
          if (!vid.id?.videoId) continue;
          const { error } = await supabase.from("youtube_videos").upsert(
            {
              video_id: vid.id.videoId,
              title: vid.snippet.title,
              thumbnail_url: vid.snippet.thumbnails?.high?.url || vid.snippet.thumbnails?.default?.url,
              channel_title: vid.snippet.channelTitle,
              category: "INTEL_FEED",
              view_count: 100000,
              published_at: vid.snippet.publishedAt,
            },
            { onConflict: "video_id" }
          );
          if (!error) officialIngested++;
        }
      }

      // 2. Fetch Community Clips
      const communityRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=WARDOGS+gameplay&part=snippet,id&type=video&order=viewCount&maxResults=10`
      );
      const communityData = await communityRes.json();

      if (communityData.items) {
        for (const vid of communityData.items) {
          if (!vid.id?.videoId || vid.snippet.channelId === BULKHEAD_CHANNEL_ID) continue;
          const { error } = await supabase.from("youtube_videos").upsert(
            {
              video_id: vid.id.videoId,
              title: vid.snippet.title,
              thumbnail_url: vid.snippet.thumbnails?.high?.url || vid.snippet.thumbnails?.default?.url,
              channel_title: vid.snippet.channelTitle,
              category: "COMMUNITY_TRANSMISSION",
              view_count: 50000,
              published_at: vid.snippet.publishedAt,
            },
            { onConflict: "video_id" }
          );
          if (!error) communityIngested++;
        }
      }
    }

    // Fallback seed insertion if 0 rows were ingested via API
    if (officialIngested === 0 && communityIngested === 0) {
      for (const item of SEED_VIDEOS) {
        await supabase.from("youtube_videos").upsert(item, { onConflict: "video_id" });
      }
      return NextResponse.json({
        success: true,
        message: "Seeded database with initial WARDOGS Intel & Community video feeds.",
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Ingested ${officialIngested} Intel videos and ${communityIngested} Community videos.`,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("YouTube Ingestion Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}