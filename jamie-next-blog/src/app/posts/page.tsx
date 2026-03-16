import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

import React from 'react'
import CategoriesClient from '@/components/CategoriesClient'

export default function Posts(){
  const all = getAllPosts()
  const tags = Array.from(new Set(all.flatMap((p:any)=> p?.meta?.tags || [])))
  return (
    <div style={{maxWidth:960,margin:'0 auto',padding:24}}>
      <h1 style={{fontSize:32,fontWeight:700,marginBottom:16}}>Posts</h1>
      <React.Suspense fallback={<div /> }>
        <CategoriesClient tags={tags} />
      </React.Suspense>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
        {all.map((p:any)=> <PostCard key={p.slug} post={p} />)}
      </div>
    </div>
  )
}
