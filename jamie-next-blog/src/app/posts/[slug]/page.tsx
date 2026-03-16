import { getPostBySlug } from '@/lib/posts'
import { allPosts } from 'contentlayer/generated'
export default function PostPage({ params }: { params: { slug: string } }){
  const post = getPostBySlug(params.slug)
  if(!post) return <div>Not found</div>
  return (
    <div style={{maxWidth:800,margin:'0 auto',padding:24}}>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{__html: post.body.html || post.body }} />
    </div>
  )
}
