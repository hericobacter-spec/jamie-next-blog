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
  const all = getAllPosts()
  const posts = all.slice(0,8)
  const tags = Array.from(new Set(all.flatMap((p:any)=> p?.meta?.tags || [])))
  return (
    <div>
      <Hero>
        <HeroInner>
          <div>
            <h1 style={{fontSize:56,margin:0,lineHeight:1.02}}>Jamie Next Blog</h1>
            <p style={{fontSize:18,color:'#374151',maxWidth:640,marginTop:12}}>A refined starter blog — MDX-driven, fast, and minimal. I write about engineering, food, AI experiments, and daily life.</p>
            <CTAs>
              <CTAButtonLink href="/posts">Posts</CTAButtonLink>
              <CTAButtonLink href="/about" style={{background:'#4b5563'}}>About</CTAButtonLink>
            </CTAs>
          </div>
          <div style={{width:260,height:160,background:'#f8fafc',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',color:'#6b7280'}}>Hero image</div>
        </HeroInner>
      </Hero>

      <Section>
        <div className="container" style={{maxWidth:960,margin:'0 auto',padding:24}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h2 style={{fontSize:28,marginBottom:16}}>All posts</h2>
            <div style={{color:'#6b7280'}}>{all.length} posts</div>
          </div>
          <div style={{marginTop:8}}>
            <React.Suspense fallback={<div /> }>
              <CategoriesClient />
            </React.Suspense>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:24,marginTop:20,alignItems:'stretch'}}>
            {posts.map((p:any)=> <PostCard key={p.slug} post={p} />)}
          </div>
        </div>
      </Section>

      <Section style={{borderTop:'1px solid #eef2f7'}}>
        <div className="container" style={{maxWidth:960,margin:'0 auto',padding:24}}>
          <h3 style={{marginBottom:8}}>Contact</h3>
          <p style={{color:'#374151'}}>Connect with me:</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:12}}>
            <a href="#">GitHub</a>
            <a href="#">LinkedIn</a>
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
          </div>
        </div>
      </Section>
    </div>
  )
}
