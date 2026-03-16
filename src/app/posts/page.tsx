import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

export default function Posts(){
  const posts = getAllPosts()
  return (
    <div style={{maxWidth:960,margin:'0 auto',padding:24}}>
      <h1 style={{fontSize:32,fontWeight:700,marginBottom:16}}>Posts</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
        {posts.map((p:any)=> <PostCard key={p.slug} post={p} />)}
      </div>
    </div>
  )
}
