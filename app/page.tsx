import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="border-b border-slate-800 pb-6 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-amber-500">
            WARDOG TREASURY
          </h1>
          <p className="text-slate-400 mt-2">
            Zero-budget, AI-driven gaming news & intelligence.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-200">Latest Articles</h2>

          {articles && articles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-amber-500/50 transition-colors"
                >
                  <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 mb-3">
                    {article.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-100 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                    {article.summary}
                  </p>
                  <div className="text-xs text-slate-500">
                    {new Date(article.created_at).toLocaleDateString()}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No articles found in the database.</p>
          )}
        </section>
      </div>
    </main>
  )
}
