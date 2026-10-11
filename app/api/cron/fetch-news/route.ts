import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { supabase } from '@/lib/supabaseClient'

const parser = new Parser({
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
})

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client unavailable' }, { status: 500 })
    }

    const feed = await parser.parseURL('https://store.steampowered.com/news/app/1234567/rss') // Replace with official WARDOGS feed URL if needed

    for (const item of feed.items) {
      const slug = item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `news-${Date.now()}`

      await supabase.from('news_bulletins').upsert(
        {
          title: item.title?.toUpperCase() || 'UNTITLED BULLETIN',
          content: item.contentSnippet || item.content || '',
          category: 'PATCH NOTES',
          source: 'STEAM',
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          slug,
        },
        { onConflict: 'slug' }
      )
    }

    return NextResponse.json({ success: true, count: feed.items.length })
  } catch (err: any) {
    console.error('Fetch News Error:', err)
    return NextResponse.json({ error: err.message || 'Failed to sync news' }, { status: 500 })
  }
}