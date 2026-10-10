import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !article) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <article className="max-w-3xl mx-auto space-y-6">
        <a href="/" className="text-amber-500 hover:underline text-sm font-semibold">&larr; Back to Home</a>
        <header className="border-b border-slate-800 pb-6 mt-4">
          <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 mb-3">
            {article.category}
          </span>
          <h1 className="text-4xl font-extrabold text-slate-100 mb-4">{article.title}</h1>
          <p className="text-slate-400 text-lg leading-relaxed">{article.summary}</p>
          <p className="text-xs text-slate-500 mt-4">{new Date(article.published_at || article.created_at).toLocaleDateString()}</p>
        </header>
        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4">
          {article.content || 'Full content preview coming soon...'}
        </div>
      </article>
    </main>
  )
}
