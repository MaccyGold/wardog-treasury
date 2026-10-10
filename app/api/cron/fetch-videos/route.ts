import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET() {
  try {
    const videosToSync = [
      { id: 'ugkuP4a3xk4', title: 'WARDOGS | 10 Reasons NOT to Buy', url: 'https://www.youtube.com/watch?v=ugkuP4a3xk4', thumbnail_url: 'https://img.youtube.com/vi/ugkuP4a3xk4/maxresdefault.jpg', published_at: new Date('2026-10-01').toISOString() },
      { id: '8sgSjweihnw', title: 'WARDOGS | Addressing the "Announcement"', url: 'https://www.youtube.com/watch?v=8sgSjweihnw', thumbnail_url: 'https://img.youtube.com/vi/8sgSjweihnw/maxresdefault.jpg', published_at: new Date('2026-09-24').toISOString() },
      { id: 's1YpSHod0FA', title: 'WARDOGS | The #1 Rule of Anti-Cheat', url: 'https://www.youtube.com/watch?v=s1YpSHod0FA', thumbnail_url: 'https://img.youtube.com/vi/s1YpSHod0FA/hqdefault.jpg', published_at: new Date('2026-09-15').toISOString() },
      { id: 'jZFYCxfXJ3Y', title: 'New Studio Showcase! HUGE Year for WARDOGS incoming...', url: 'https://www.youtube.com/watch?v=jZFYCxfXJ3Y', thumbnail_url: 'https://img.youtube.com/vi/jZFYCxfXJ3Y/hqdefault.jpg', published_at: new Date('2026-09-01').toISOString() }
    ]

    const { data, error } = await supabase
      .from('videos')
      .upsert(videosToSync, { onConflict: 'id' })

    if (error) throw error

    return NextResponse.json({ success: true, count: videosToSync.length })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
