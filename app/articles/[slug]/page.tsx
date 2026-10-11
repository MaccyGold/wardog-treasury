import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';

// Opt out of instant static shell prerendering for this route under Next.js 16 Cache Components
export const instant = false;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Suspense fallback={<div className="p-8 text-slate-400">// LOADING_ARTICLE_TELEMETRY...</div>}>
      <ArticleContent slug={slug} />
    </Suspense>
  );
}

async function ArticleContent({ slug }: { slug: string }) {
  // Your existing database fetch / page content logic goes here
  return (
    <div>
      {/* Render article details */}
    </div>
  );
}