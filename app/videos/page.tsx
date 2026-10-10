'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Video {
  id: string
  title: string
  url: string
  thumbnail_url: string
  published_at: string
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const observerTarget = useRef(null)

  const PAGE_SIZE = 6

  const fetchVideos = async (pageNum: number) => {
    if (loading) return
    setLoading(true)
    const from = pageNum * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('published_at', { ascending: false })
      .range(from, to)

    if (data && data.length > 0) {
      setVideos(prev => {
        const existingIds = new Set(prev.map(v => v.id))
        const newVids = data.filter(v => !existingIds.has(v.id))
        return [...prev, ...newVids]
      })
      if (data.length < PAGE_SIZE) setHasMore(false)
    } else {
      setHasMore(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchVideos(0)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prevPage => {
            const nextPage = prevPage + 1
            fetchVideos(nextPage)
            return nextPage
          })
        }
      },
      { threshold: 0.5 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading])

  // Group videos dynamically by start of week
  const groupedVideos = videos.reduce((acc, video) => {
    const d = new Date(video.published_at || Date.now())
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Start of week (Monday)
    const startOfWeek = new Date(d.setDate(diff))
    const weekLabel = `Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

    if (!acc[weekLabel]) acc[weekLabel] = []
    acc[weekLabel].push(video)
    return acc
  }, {} as Record<string, Video[]>)

  return (
    <main className='p-8 max-w-6xl mx-auto space-y-10 bg-slate-950 text-slate-100 min-h-screen'>
      <header className='border-b border-slate-800 pb-6 flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight text-amber-500 uppercase'>
            Bulkhead / WARDOGS Video Feed
          </h1>
          <p className='text-slate-400 mt-1 text-sm'>
            Weekly dev logs, patch previews, and community archives.
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
        <h2 className='text-xl font-bold text-slate-200'>Weekly Video Archive</h2>
        <a href='https://www.youtube.com/@BULKHEAD.' target='_blank' rel='noopener noreferrer' className='text-amber-500 hover:underline text-sm font-semibold'>
          Visit YouTube Channel &rarr;
        </a>
      </div>

      {Object.keys(groupedVideos).length > 0 ? (
        <div className='space-y-10'>
          {Object.entries(groupedVideos).map(([week, weekVideos]) => (
            <section key={week} className='space-y-4'>
              <div className='flex items-center gap-3 border-b border-slate-800/80 pb-2'>
                <span className='w-2 h-2 rounded-full bg-amber-500'></span>
                <h3 className='text-lg font-black uppercase text-amber-400 tracking-wider'>{week}</h3>
                <span className='text-xs text-slate-500 font-medium'>({weekVideos.length} {weekVideos.length === 1 ? 'upload' : 'uploads'})</span>
              </div>
              <div className='grid gap-6 md:grid-cols-2'>
                {weekVideos.map((video) => (
                  <a key={video.id} href={video.url} target='_blank' rel='noopener noreferrer' className='group bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col hover:border-amber-500/50 transition-colors shadow-lg'>
                    <div className='aspect-video w-full bg-slate-950 relative overflow-hidden'>
                      <img src={video.thumbnail_url} alt={video.title} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' />
                      <div className='absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors'>
                        <div className='w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg group-hover:scale-110 transition-transform'>
                          &#9654;
                        </div>
                      </div>
                    </div>
                    <div className='p-4 flex flex-col justify-between flex-1 space-y-2'>
                      <h4 className='font-bold text-slate-100 group-hover:text-amber-400 transition-colors'>
                        {video.title}
                      </h4>
                      <p className='text-xs text-slate-500'>
                        Uploaded {new Date(video.published_at).toLocaleDateString()}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className='bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400'>
          Loading videos...
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      <div ref={observerTarget} className='py-6 text-center text-xs text-slate-500'>
        {loading && <p className='animate-pulse text-amber-500 font-medium'>Fetching more weekly video logs...</p>}
        {!hasMore && videos.length > 0 && <p>You have reached the end of the video archives.</p>}
      </div>
    </main>
  )
}
