import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BULKHEAD_CHANNEL_ID = "UCPVan4eGsvtogvBO56LwSAw";

// Helper to convert ISO 8601 duration (e.g., "PT45S", "PT2M15S") to total seconds
function parseISO8601Duration(durationStr: string): number {
  const match = durationStr.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase env variables" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    let officialIngested = 0;
    let communityIngested = 0;

    if (YOUTUBE_API_KEY) {
      // 1. Fetch search results for Official Channel
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${BULKHEAD_CHANNEL_ID}&part=snippet,id&order=date&maxResults=20&type=video`
      );
      const searchData = await searchRes.json();

      if (searchData.items && searchData.items.length > 0) {
        // Collect video IDs to make a batch details request (to check duration)
        const videoIds = searchData.items.map((item: any) => item.id?.videoId).filter(Boolean).join(",");
        
        const detailsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,contentDetails`
        );
        const detailsData = await detailsRes.json();

        for (const vid of detailsData.items || []) {
          const videoId = vid.id;
          const duration = vid.contentDetails?.duration; // e.g., "PT45S"
          const durationSeconds = duration ? parseISO8601Duration(duration) : 999;
          
          // CRITICAL FILTER: Skip if duration is under 60 seconds (YouTube Short)
          if (durationSeconds > 0 && durationSeconds <= 60) {
            console.log(`Skipping Short (Duration: ${durationSeconds}s): ${vid.snippet.title}`);
            continue;
          }

          const { error } = await supabase.from("youtube_videos").upsert(
            {
              video_id: videoId,
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

      // 2. Fetch Community Clips with duration check
      const commSearchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=WARDOGS+gameplay&part=snippet,id&type=video&order=viewCount&maxResults=20`
      );
      const commSearchData = await commSearchRes.json();

      if (commSearchData.items && commSearchData.items.length > 0) {
        const commIds = commSearchData.items
          .filter((item: any) => item.snippet?.channelId !== BULKHEAD_CHANNEL_ID)
          .map((item: any) => item.id?.videoId)
          .filter(Boolean)
          .join(",");

        if (commIds) {
          const commDetailsRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${commIds}&part=snippet,contentDetails`
          );
          const commDetailsData = await commDetailsRes.json();

          for (const vid of commDetailsData.items || []) {
            const videoId = vid.id;
            const duration = vid.contentDetails?.duration;
            const durationSeconds = duration ? parseISO8601Duration(duration) : 999;

            // CRITICAL FILTER: Skip Shorts (< 60 seconds)
            if (durationSeconds > 0 && durationSeconds <= 60) {
              continue;
            }

            const { error } = await supabase.from("youtube_videos").upsert(
              {
                video_id: videoId,
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
    }

    return NextResponse.json({
      success: true,
      message: `Ingested ${officialIngested} official videos and ${communityIngested} community videos (Shorts filtered via duration check).`,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Error" }, { status: 500 });
  }
}