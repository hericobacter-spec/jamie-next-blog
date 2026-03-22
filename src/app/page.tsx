import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import CategoriesClient from '@/components/CategoriesClient'

const Hero = styled.section`
  background:linear-gradient(180deg,#ffffff, #f8fafc);padding:80px 0 40px;border-bottom:1px solid #eef2f7;
`
const HeroInner = styled.div`
  max-width:960px;margin:0 auto;padding:0 24px;display:flex;gap:24px;align-items:center;justify-content:space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
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

const ContactLinks = styled.div`
  display:flex;
  gap:12px;
  flex-wrap:wrap;
  margin-top:12px;
`

const ContactButton = styled.a`
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:10px 14px;
  border-radius:999px;
  background:#f3f4f6;
  border:1px solid #e5e7eb;
  color:#111827;
  text-decoration:none;
  font-weight:600;
  transition:all 0.18s ease;

  &:hover {
    background:#111827;
    border-color:#111827;
    color:#ffffff;
    transform:translateY(-1px);
  }
`

export const metadata: Metadata = {
  title: 'Jamie Next Blog',
  description: 'OpenClaw와 Next.js로 운영하는 개인 블로그. AI 실험, 맛집 후기, 여행 기록, 블로그 제작 과정을 담습니다.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Jamie Next Blog',
    description: 'OpenClaw와 Next.js로 운영하는 개인 블로그. AI 실험, 맛집 후기, 여행 기록, 블로그 제작 과정을 담습니다.',
    url: 'https://jamie-next-blog.vercel.app',
    type: 'website',
  },
}

export default function Home(){
  const all = getAllPosts()
  const posts = all.slice(0,8)
  const tags = Array.from(new Set(all.flatMap((p:any)=> p?.meta?.tags || [])))
  return (
    <div>
      <Hero>
        <HeroInner>
          <div>
            <h1 style={{fontSize:'clamp(2.25rem, 7vw, 3.5rem)',margin:0,lineHeight:1.02}}>Jamie Next Blog</h1>
            <p style={{fontSize:'clamp(1rem, 3.5vw, 1.125rem)',color:'#374151',maxWidth:640,marginTop:12}}>A refined starter blog — MDX-driven, fast, and minimal. I write about engineering, food, AI experiments, and daily life.</p>
            <CTAs>
              <CTAButtonLink href="/posts">Posts</CTAButtonLink>
              <CTAButtonLink href="/about" style={{background:'#4b5563'}}>About</CTAButtonLink>
            </CTAs>
          </div>
          <div style={{ width: 'min(560px, 100%)', aspectRatio: '7 / 4', borderRadius: 12, overflow: 'hidden', flexShrink: 0, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', alignSelf: 'stretch', maxWidth: 560 }}>
            <Image
              src="/images/hero-main.jpg"
              alt="Jamie Blog hero image"
              width={560}
              height={320}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              priority
            />
          </div>
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
          <ContactLinks>
            <ContactButton href="https://github.com/hericobacter-spec" target="_blank" rel="noopener noreferrer">GitHub</ContactButton>
            <ContactButton href="mailto:hericobacter1@gmail.com">E-mail</ContactButton>
            <ContactButton href="https://www.instagram.com/jamiesuyong/" target="_blank" rel="noopener noreferrer">Instagram</ContactButton>
          </ContactLinks>
        </div>
      </Section>
    </div>
  )
}
