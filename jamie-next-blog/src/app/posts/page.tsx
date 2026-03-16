import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

export default function Posts(){
  const posts = getAllPosts()
  return (
    <div style={{maxWidth:800,margin:'0 auto',padding:24}}>
      <h1>Posts</h1>
      <div style={{display:'grid',gap:12}}>
        {posts.map(p=> <PostCard key={p.slug} post={p} />)}
      </div>
    </div>
  )
}
