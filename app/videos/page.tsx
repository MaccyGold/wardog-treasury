import { supabase } from '../../lib/supabase'
import Link from 'next/link'

interface Video {
  id: string
  title: string
  url: string
  thumbnail_url: string
  published_at: string
}

export default async function VideosPage() {
  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('published_at', { ascending: false })

  // Group videos dynamically by start of week
  const groupedVideos = (videos || []).reduce((acc, video) => {
    const d = new Date(video.published_at || Date.now())
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const startOfWeek = new Date(d.setDate(diff))
    const weekLabel = `// WEEK OF ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}`

    if (!acc[weekLabel]) acc[weekLabel] = []
    acc[weekLabel].push(video)
    return acc
  }, {} as Record<string, Video[]>)

  return (
    <main className='p-8 max-w-6xl mx-auto space-y-10 bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-amber-500 selection:text-slate-950'>
      {/* TACTICAL HUD HEADER */}
      <header className='border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative'>
        <div className='absolute -top-3 left-0 text-[10px] font-mono tracking-widest text-amber-500/60 uppercase'>
          // SECURE_FEED // STREAM_ID: BULKHEAD_OFFICIAL
        </div>
        <div>
          <h1 className='text-3xl font-black tracking-wider text-amber-500 uppercase flex items-center gap-2'>
            <span className='text-slate-600 font-mono'>//</span> VIDEO ARCHIVE & INTEL
          </h1>
          <p className='text-slate-400 mt-1 text-sm font-mono'>
            [ACTIVE CHANNEL: @BULKHEAD] Official dev vlogs, patch previews, and tactical debriefs.
          </p>
        </div>
        <nav className='flex flex-wrap gap-4 text-xs font-mono uppercase tracking-wider bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-800'>
          <Link href='/' className='text-slate-400 hover:text-amber-400 transition-colors'>// Gold Exchange</Link>
          <Link href='/videos' className='text-amber-500 border-b border-amber-500 pb-0.5 font-bold'>// Videos</Link>
          <Link href='/news' className='text-slate-400 hover:text-amber-400 transition-colors'>// News</Link>
          <Link href='/loadout-builder' className='text-slate-400 hover:text-amber-400 transition-colors'>// Loadout</Link>
        </nav>
      </header>

      <div className='flex justify-between items-center bg-slate-900/40 p-4 rounded-xl border border-slate-800'>
        <span className='text-xs font-mono text-amber-400 uppercase tracking-widest'>
          // STATUS: REAL-TIME SYNC ACTIVE
        </span>
        <a href='https://www.youtube.com/@BULKHEAD.' target='_blank' rel='noopener noreferrer' className='text-xs font-mono text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-wider flex items-center gap-1.5'>
          <span>// OPEN YOUTUBE CHANNEL</span> &rarr;
        </a>
      </div>

      {videos && videos.length > 0 ? (
        <div className='space-y-12'>
          {Object.entries(groupedVideos).map(([week, weekVideos]) => (
            <section key={week} className='space-y-4'>
              <div className='flex items-center gap-3 border-b border-slate-800 pb-2 font-mono'>
                <span className='w-2 h-2 rounded-none bg-amber-500 shadow-[0_0_8px_#f59e0b]'></span>
                <h3 className='text-sm font-black uppercase text-amber-400 tracking-widest'>{week}</h3>
                <span className='text-[10px] text-slate-500'>[{weekVideos.length} {weekVideos.length === 1 ? 'RECORD' : 'RECORDS'}]</span>
              </div>
              <div className='grid gap-6 md:grid-cols-2'>
                {weekVideos.map((video) => (
                  <a key={video.id} href={video.url} target='_blank' rel='noopener noreferrer' className='group bg-slate-900 border border-slate-800 rounded-none overflow-hidden flex flex-col hover:border-amber-500/80 transition-all shadow-xl relative'>
                    {/* Tactical corner accent */}
                    <div className='absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500 opacity-0 group-hover:opacity-100 transition-opacity z-10'></div>
                    <div className='absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500 opacity-0 group-hover:opacity-100 transition-opacity z-10'></div>

                    <div className='aspect-video w-full bg-slate-950 relative overflow-hidden'>
                      <img src={video.thumbnail_url} alt={video.title} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100' />
                      <div className='absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/10 transition-colors'>
                        <div className='w-12 h-12 bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform'>
                          &#9654;
                        </div>
                      </div>
                      <div className='absolute top-2 left-2 bg-slate-950/80 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono text-amber-400 uppercase tracking-wider'>
                        // INTEL_LOG
                      </div>
                    </div>
                    <div className='p-5 flex flex-col justify-between flex-1 space-y-3 bg-gradient-to-b from-slate-900 to-slate-950'>
                      <h4 className='font-bold text-slate-100 group-hover:text-amber-400 transition-colors text-sm uppercase tracking-wide leading-snug'>
                        {video.title}
                      </h4>
                      <div className='flex justify-between items-center text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800/80'>
                        <span>// UPLOADED: {new Date(video.published_at).toLocaleDateString()}</span>
                        <span className='text-amber-500/80 group-hover:translate-x-1 transition-transform'>ACCESS &rarr;</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className='bg-slate-900 border border-slate-800 p-8 text-center font-mono text-slate-400 text-sm'>
          // ERROR: NO VIDEO RECORDS FOUND IN DATABASE
        </div>
      )}
    </main>
  )
}
