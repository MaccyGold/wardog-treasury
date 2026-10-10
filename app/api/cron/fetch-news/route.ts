import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { supabase } from '../../../../lib/supabase'

const parser = new Parser()

const FEEDS = [
  { name: 'PC Gamer', url: 'https://www.pcgamer.com/rss/' },
  { name: 'IGN', url: 'http://feeds.feedburner.com/ign/news' }
]

export async function GET() {
  try {
    let addedCount = 0
    for (const feed of FEEDS) {
      const feedData = await parser.parseURL(feed.url)
      for (const item of feedData.items.slice(0, 3)) {
        if (!item.title || !item.link) continue
        const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        const summary = item.contentSnippet ? item.contentSnippet.slice(0, 200) + '...' : item.title

        const { error } = await supabase.from('articles').upsert({
          title: item.title,
          slug: slug,
          summary: summary,
          content: item.contentSnippet || item.title,
          source_url: item.link,
          source_name: feed.name,
          category: 'Gaming',
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
        }, { onConflict: 'slug' })

        if (!error) addedCount++
      }
    }
    return NextResponse.json({ success: true, added: addedCount })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
