import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

import Categories from '@/components/Categories'
import { useSearchParams } from 'next/navigation'

export default function Posts(){
  const all = getAllPosts()
  const tags = Array.from(new Set(all.flatMap((p:any)=> p?.meta?.tags || [])))
  const params = useSearchParams()
  const active = params?.get('tag')
  const posts = active && active!=='All' ? all.filter((p:any)=> (p.meta?.tags||[]).includes(active)) : all
  return (
    <div style={{maxWidth:960,margin:'0 auto',padding:24}}>
      <h1 style={{fontSize:32,fontWeight:700,marginBottom:16}}>Posts</h1>
      <Categories tags={tags} />
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
        {posts.map((p:any)=> <PostCard key={p.slug} post={p} />)}
      </div>
    </div>
  )
}
