import React from 'react'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

export default function TagPage({ params }: { params: { tag: string } }){
  const all = getAllPosts()
  const tag = params.tag
  const filtered = all.filter(p => (p.meta?.tags || []).includes(tag) || (p.tags || []).includes(tag))
  return (
    <div style={{maxWidth:960,margin:'0 auto',padding:24}}>
      <h1>Tag: {tag}</h1>
      <p>{filtered.length} posts</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
        {filtered.map(p=> <PostCard key={p.slug} post={p} />)}
      </div>
      <div style={{marginTop:20}}><Link href="/posts">Back to posts</Link></div>
    </div>
  )
}
