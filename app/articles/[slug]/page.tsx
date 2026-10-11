import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic';
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!supabase) return notFound()

  const { data: article, error } = await supabase
    .from('news_bulletins')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !article) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 font-mono text-slate-100">
      <div className="bg-[#0d0d10] border-2 border-[#222327] p-8 relative shadow-2xl space-y-4">
        <div className="absolute top-0 left-0 w-full h-[4px] bg-[#c89b3c]" />

        <div className="flex items-center gap-3 text-xs font-semibold text-[#c89b3c]">
          <span>[{article.category || 'BULLETIN'}]</span>
          <span>•</span>
          <span>{new Date(article.published_at).toLocaleDateString()}</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-slate-100 uppercase leading-snug">
          {article.title}
        </h1>

        <div className="border-t border-[#1c1d22] pt-6 text-base text-slate-300 leading-relaxed space-y-4 whitespace-pre-wrap">
          {article.content}
        </div>
      </div>
    </div>
  )
}