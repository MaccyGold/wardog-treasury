import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default async function NewsPage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className='p-8 max-w-6xl mx-auto space-y-10 bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-amber-500 selection:text-slate-950'>
      {/* TACTICAL HUD HEADER */}
      <header className='border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative'>
        <div className='absolute -top-3 left-0 text-[10px] font-mono tracking-widest text-amber-500/60 uppercase'>
          // INTEL_FEED // DISPATCH_LEVEL: PUBLIC
        </div>
        <div>
          <h1 className='text-3xl font-black tracking-wider text-amber-500 uppercase flex items-center gap-2'>
            <span className='text-slate-600 font-mono'>//</span> BULLETIN BOARD & INTEL DISPATCHES
          </h1>
          <p className='text-slate-400 mt-1 text-sm font-mono'>
            [FIELD REPORTS] Community announcements, official patch updates, and field telemetry.
          </p>
        </div>
        <nav className='flex flex-wrap gap-4 text-xs font-mono uppercase tracking-wider bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-800'>
          <Link href='/' className='text-slate-400 hover:text-amber-400 transition-colors'>// Gold Exchange</Link>
          <Link href='/videos' className='text-slate-400 hover:text-amber-400 transition-colors'>// Videos</Link>
          <Link href='/news' className='text-amber-500 border-b border-amber-500 pb-0.5 font-bold'>// News</Link>
          <Link href='/loadout-builder' className='text-slate-400 hover:text-amber-400 transition-colors'>// Loadout</Link>
        </nav>
      </header>

      <div className='flex justify-between items-center bg-slate-900/40 p-4 rounded-xl border border-slate-800 font-mono'>
        <span className='text-xs text-amber-400 uppercase tracking-widest'>
          // ACTIVE DISPATCHES: {articles ? articles.length : 0} POSTED
        </span>
        <span className='text-xs text-slate-500 uppercase tracking-wider'>
          [VERIFIED_SOURCES_ONLY]
        </span>
      </div>

      {articles && articles.length > 0 ? (
        <div className='grid gap-6 md:grid-cols-2'>
          {articles.map((article: any) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className='block group'>
              <article className='bg-slate-900 border border-slate-800 rounded-none p-6 group-hover:border-amber-500/80 transition-all h-full flex flex-col justify-between relative'>
                <div className='absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500 opacity-0 group-hover:opacity-100 transition-opacity'></div>
                <div className='absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500 opacity-0 group-hover:opacity-100 transition-opacity'></div>

                <div>
                  <div className='flex justify-between items-center mb-3 font-mono text-[10px]'>
                    <span className='px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase tracking-wider'>
                      // {article.source_name || article.category || 'BULLETIN'}
                    </span>
                    <span className='text-slate-500'>
                      [ID: {article.slug.slice(0, 8)}]
                    </span>
                  </div>
                  <h3 className='text-lg font-bold text-slate-100 mb-2 group-hover:text-amber-400 transition-colors uppercase tracking-wide leading-snug'>
                    {article.title}
                  </h3>
                  <p className='text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3 font-sans'>
                    {article.summary}
                  </p>
                </div>
                <div className='flex justify-between items-center text-[10px] font-mono text-slate-500 pt-3 border-t border-slate-800/80'>
                  <span>// POSTED: {new Date(article.created_at).toLocaleDateString()}</span>
                  <span className='text-amber-500 group-hover:translate-x-1 transition-transform'>READ BULLETIN &rarr;</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className='bg-slate-900 border border-slate-800 p-8 text-center font-mono text-slate-400 text-sm'>
          // NO DISPATCHES FOUND ON BULLETIN BOARD
        </div>
      )}
    </main>
  )
}
