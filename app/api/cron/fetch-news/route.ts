import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { supabase } from '../../../../lib/supabase'

const parser = new Parser({
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
})

const FEEDS = [
  { name: 'PC Gamer', url: 'https://www.pcgamer.com/rss/' },
  { name: 'IGN', url: 'http://feeds.feedburner.com/ign/news' }
]

export async function GET() {
  try {
    let addedCount = 0
    const logs: string[] = []

    for (const feed of FEEDS) {
      try {
        const feedData = await parser.parseURL(feed.url)
        for (const item of feedData.items.slice(0, 5)) {
          if (!item.title || !item.link) continue
          const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
          const rawSummary = item.contentSnippet || item.content || item.title
          const summary = rawSummary.replace(/<[^>]*>?/gm, '').slice(0, 250) + '...'

          const { error } = await supabase.from('articles').upsert({
            title: item.title,
            slug: slug,
            summary: summary,
            content: item.contentSnippet || item.content || item.title,
            source_url: item.link,
            source_name: feed.name,
            category: 'Gaming',
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
          }, { onConflict: 'slug' })

          if (!error) {
            addedCount++
          } else {
            logs.push(`Error inserting ${item.title}: ${error.message}`)
          }
        }
      } catch (feedErr: any) {
        logs.push(`Failed to fetch feed ${feed.name}: ${feedErr.message}`)
      }
    }
    return NextResponse.json({ success: true, added: addedCount, logs })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
