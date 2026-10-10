import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default async function NewsPage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className='p-8 max-w-6xl mx-auto space-y-8 bg-slate-950 text-slate-100 min-h-screen'>
      <header className='border-b border-slate-800 pb-6 flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-amber-500 uppercase'>
            Latest Gaming News & AI Summaries
          </h1>
          <p className='text-slate-400 mt-1 text-sm'>
            Community updates, patch notes, and intelligence reports.
          </p>
        </div>
        <nav className='flex gap-6 text-sm font-semibold'>
          <Link href='/' className='text-slate-400 hover:text-amber-400 transition-colors'>Gold Exchange</Link>
          <Link href='/videos' className='text-slate-400 hover:text-amber-400 transition-colors'>Videos</Link>
          <Link href='/news' className='text-amber-500 border-b-2 border-amber-500 pb-1'>News</Link>
          <Link href='/loadout-builder' className='text-slate-400 hover:text-amber-400 transition-colors'>Loadout Builder</Link>
        </nav>
      </header>

      {articles && articles.length > 0 ? (
        <div className='grid gap-6 md:grid-cols-2'>
          {articles.map((article: any) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className='block group'>
              <article className='bg-slate-900 border border-slate-800 rounded-lg p-6 group-hover:border-amber-500/50 transition-colors h-full flex flex-col justify-between'>
                <div>
                  <span className='inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 mb-3'>
                    {article.source_name || article.category}
                  </span>
                  <h3 className='text-xl font-bold text-slate-100 mb-2 group-hover:text-amber-400 transition-colors'>
                    {article.title}
                  </h3>
                  <p className='text-slate-400 text-sm mb-4 line-clamp-3'>
                    {article.summary}
                  </p>
                </div>
                <div className='text-xs text-slate-500'>
                  {new Date(article.created_at).toLocaleDateString()}
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <p className='text-slate-400'>No articles found in the database.</p>
      )}
    </main>
  )
}
