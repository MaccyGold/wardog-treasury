import Link from 'next/link'

export default function VideosPage() {
  const bulkheadVideos = [
    { id: 'ugkuP4a3xk4', title: 'WARDOGS | 10 Reasons NOT to Buy', url: 'https://www.youtube.com/watch?v=ugkuP4a3xk4', thumb: 'https://img.youtube.com/vi/ugkuP4a3xk4/maxresdefault.jpg' },
    { id: '8sgSjweihnw', title: 'WARDOGS | Addressing the "Announcement"', url: 'https://www.youtube.com/watch?v=8sgSjweihnw', thumb: 'https://img.youtube.com/vi/8sgSjweihnw/maxresdefault.jpg' },
    { id: 's1YpSHod0FA', title: 'WARDOGS | The #1 Rule of Anti-Cheat', url: 'https://www.youtube.com/watch?v=s1YpSHod0FA', thumb: 'https://img.youtube.com/vi/s1YpSHod0FA/hqdefault.jpg' },
    { id: 'jZFYCxfXJ3Y', title: 'New Studio Showcase! HUGE Year for WARDOGS incoming...', url: 'https://www.youtube.com/watch?v=jZFYCxfXJ3Y', thumb: 'https://img.youtube.com/vi/jZFYCxfXJ3Y/hqdefault.jpg' }
  ]

  return (
    <main className='p-8 max-w-6xl mx-auto space-y-8 bg-slate-950 text-slate-100 min-h-screen'>
      <header className='border-b border-slate-800 pb-6 flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-amber-500 uppercase'>
            Bulkhead / WARDOGS Video Feed
          </h1>
          <p className='text-slate-400 mt-1 text-sm'>
            Official dev vlogs, announcements, and gameplay analysis.
          </p>
        </div>
        <nav className='flex gap-6 text-sm font-semibold'>
          <Link href='/' className='text-slate-400 hover:text-amber-400 transition-colors'>Gold Exchange</Link>
          <Link href='/videos' className='text-amber-500 border-b-2 border-amber-500 pb-1'>Videos</Link>
          <Link href='/news' className='text-slate-400 hover:text-amber-400 transition-colors'>News</Link>
          <Link href='/loadout-builder' className='text-slate-400 hover:text-amber-400 transition-colors'>Loadout Builder</Link>
        </nav>
      </header>

      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-bold text-slate-200'>Latest Channel Uploads</h2>
        <a href='https://www.youtube.com/@BULKHEAD.' target='_blank' rel='noopener noreferrer' className='text-amber-500 hover:underline text-sm font-semibold'>
          Visit YouTube Channel &rarr;
        </a>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {bulkheadVideos.map((video) => (
          <a key={video.id} href={video.url} target='_blank' rel='noopener noreferrer' className='group bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col hover:border-amber-500/50 transition-colors'>
            <div className='aspect-video w-full bg-slate-950 relative overflow-hidden'>
              <img src={video.thumb} alt={video.title} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' />
              <div className='absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors'>
                <div className='w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg group-hover:scale-110 transition-transform'>
                  &#9654;
                </div>
              </div>
            </div>
            <div className='p-4'>
              <h3 className='font-bold text-slate-100 group-hover:text-amber-400 transition-colors'>
                {video.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
