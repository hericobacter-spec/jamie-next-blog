import React from 'react'
import { getPublicPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

export async function generateMetadata({ params }:{params:{tag:string}}){
  return { title: `Tag: ${params.tag} - Jamie Next Blog`, description: `Posts tagged with ${params.tag}` }
}

export default function TagPage({ params }: { params: { tag: string } }){
  const all = getPublicPosts()
  const tag = params.tag
  const filtered = all.filter((p:any) => ((p.meta && p.meta.tags) || p.tags || []).includes(tag))
  return (
    <div style={{ maxWidth: 1200, margin: '80px auto 120px', padding: '0 24px' }}>
      <h1 style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.022em', color: 'var(--color-ink, #1d1d1f)', marginBottom: 8 }}>Tag: {tag}</h1>
      <p style={{ color: 'var(--muted, #707070)', marginBottom: 24, fontSize: 14 }}>{filtered.length} posts</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 1, background: 'var(--border)', borderRadius: 'var(--radius-card, 28px)', overflow: 'hidden' }}>
        {filtered.map(p=> <PostCard key={p.slug} post={p} />)}
      </div>
      <div style={{marginTop:20}}><Link href="/posts">Back to posts</Link></div>
    </div>
  )
}
