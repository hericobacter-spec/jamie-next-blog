import Link from 'next/link'
import styled from 'styled-components'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

const Hero = styled.section`
  background:linear-gradient(180deg,#ffffff, #f8fafc);padding:80px 0 40px;
`

export default function Home(){
  const posts = getAllPosts().slice(0,4)
  return (
    <div>
      <Hero>
        <div className="container" style={{paddingTop:8}}>
          <h1 style={{fontSize:48,margin:0}}>Jamie Next Blog</h1>
          <p style={{fontSize:18,color:'#374151',maxWidth:700}}>A refined starter blog inspired by yiyb-blog. Posts below are MDX-driven and styled with Styled-Components.</p>
        </div>
      </Hero>
      <section style={{padding:'40px 0'}}>
        <div className="container">
          <h2 style={{fontSize:28,marginBottom:16}}>Latest posts</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
            {posts.map((p:any)=> <PostCard key={p.slug} post={p} />)}
          </div>
        </div>
      </section>
    </div>
  )
}
