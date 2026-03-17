import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

import React from 'react'
import CategoriesClient from '@/components/CategoriesClient'

export default async function Posts({ searchParams } : { searchParams: { category?: string } }){
  // Next may provide searchParams as a pending value in some runtimes — normalize by awaiting
  const params = await searchParams as { category?: string } | undefined
  const all = getAllPosts()
  const tags = Array.from(new Set(all.flatMap((p:any)=> p?.meta?.tags || [])))
  const category = params?.category
  const filtered = category && category !== 'All' ? all.filter((p:any)=> (p?.category === category) || (p?.meta && p.meta.category === category)) : all
  return (
    <div style={{maxWidth:960,margin:'0 auto',padding:24}}>
      <h1 style={{fontSize:32,fontWeight:700,marginBottom:16}}>Posts</h1>
      <React.Suspense fallback={<div /> }>
        <CategoriesClient />
      </React.Suspense>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
        {filtered.map((p:any)=> <PostCard key={p.slug} post={p} />)}
      </div>
    </div>
  )
}
