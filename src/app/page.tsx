import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import CategoriesClient from '@/components/CategoriesClient'

const Hero = styled.section`
  background:linear-gradient(180deg,#ffffff, #f8fafc);padding:80px 0 40px;border-bottom:1px solid #eef2f7;
`
const HeroInner = styled.div`
  max-width:960px;margin:0 auto;padding:0 24px;display:flex;gap:24px;align-items:center;justify-content:space-between;
`
const CTAs = styled.div`
  display:flex;gap:12px;margin-top:12px;
`
const CTAButtonLink = styled(Link)`
  padding:10px 14px;border-radius:8px;background:#111827;color:#fff;text-decoration:none;font-weight:600;
`
const Section = styled.section`
  padding:36px 0;
`
export default function Home(){
  // Stepwise restore: start with Hero
  const all = getAllPosts()
  // Next step: add Categories section
  const posts = all.slice(0,8)
  return (
    <div>
      <Hero>
        <HeroInner>
          <div>
            <h1 style={{fontSize:56,margin:0,lineHeight:1.02}}>Jamie Next Blog</h1>
          </div>
        </HeroInner>
      </Hero>
      <Section>
        <div className="container" style={{maxWidth:960,margin:'0 auto',padding:24}}>
          <div style={{marginTop:8}}>
            <React.Suspense fallback={<div /> }>
              <CategoriesClient />
            </React.Suspense>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container" style={{maxWidth:960,margin:'0 auto',padding:24}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:24,marginTop:20,alignItems:'stretch'}}>
            {posts.slice(0,1).map((p:any)=> <PostCard key={p.slug} post={p} />)}
          </div>
        </div>
      </Section>
    </div>
  )
}
