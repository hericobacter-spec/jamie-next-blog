import Link from 'next/link'
import styled from 'styled-components'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

const Hero = styled.section`
  background:linear-gradient(180deg,#ffffff, #f8fafc);padding:80px 0 40px;
`

export default function Home(){
  const all = getAllPosts()
  const posts = all.slice(0,8)
  const tags = Array.from(new Set(all.flatMap((p:any)=> p?.meta?.tags || [])))
  return (
    <div>
      <Hero>
        <div className="container" style={{paddingTop:8}}>
          <h1 style={{fontSize:48,margin:0}}>Jamie Next Blog</h1>
          <p style={{fontSize:18,color:'#374151',maxWidth:700}}>A refined starter blog inspired by yiyb-blog. Posts below are MDX-driven and styled with Styled-Components.</p>
        </div>
      </Hero>
      <section style={{padding:'24px 0'}}>
        <div className="container">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h2 style={{fontSize:28,marginBottom:16}}>All posts</h2>
            <div style={{color:'#6b7280'}}>{all.length} posts</div>
          </div>
          <div style={{marginTop:8}}>
            <React.Suspense fallback={<div /> }>
              <CategoriesClient tags={tags} />
            </React.Suspense>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20,marginTop:12}}>
            {posts.map((p:any)=> <PostCard key={p.slug} post={p} />)}
          </div>
        </div>
      </section>
      <section style={{padding:'24px 0',borderTop:'1px solid #eef2f7'}}>
        <div className="container">
          <h3>Contact</h3>
          <p>Find me on: <a href="#">GitHub</a> • <a href="#">LinkedIn</a> • <a href="#">Instagram</a></p>
        </div>
      </section>
    </div>
  )
}
