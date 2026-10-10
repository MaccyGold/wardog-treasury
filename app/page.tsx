import { connection } from 'next/server'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default async function Home() {
  await connection()

  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
  }

  const bulkheadVideos = [
    { id: 'ugkuP4a3xk4', title: 'WARDOGS | 10 Reasons NOT to Buy', url: 'http://www.youtube.com/watch?v=ugkuP4a3xk4' },
    { id: '8sgSjweihnw', title: 'WARDOGS | Addressing the "Announcement"', url: 'http://www.youtube.com/watch?v=8sgSjweihnw' },
    { id: 's1YpSHod0FA', title: 'WARDOGS | The #1 Rule of Anti-Cheat', url: 'http://www.youtube.com/watch?v=s1YpSHod0FA' },
    { id: 'jZFYCxfXJ3Y', title: 'New Studio Showcase! HUGE Year for WARDOGS incoming...', url: 'http://www.youtube.com/watch?v=jZFYCxfXJ3Y' }
  ]

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-amber-500">
            WARDOG TREASURY
          </h1>
          <p className="text-slate-400 mt-2">
            Zero-budget, AI-driven gaming news & intelligence hub.
          </p>
        </header>

        {/* YouTube Video Gallery */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-200">Bulkhead / WARDOGS Video Feed</h2>
            <a href="https://www.youtube.com/@BULKHEAD." target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline text-sm font-semibold">
              Visit YouTube Channel &rarr;
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {bulkheadVideos.map((video) => (
              <div key={video.id} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
                <div className="aspect-video w-full bg-slate-950">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-100">
                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                      {video.title}
                    </a>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* News Feed */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200">Latest Gaming News</h2>
          {articles && articles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`} className="block group">
                  <article className="bg-slate-900 border border-slate-800 rounded-lg p-6 group-hover:border-amber-500/50 transition-colors h-full flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 mb-3">
                        {article.source_name || article.category}
                      </span>
                      <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-amber-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                        {article.summary}
                      </p>
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(article.created_at).toLocaleDateString()}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No articles found in the database. Run the fetch API route to populate news.</p>
          )}
        </section>
      </div>
    </main>
  )
}
