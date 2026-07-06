import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import CategoriesClient from '@/components/CategoriesClient'

const Hero = styled.section`
  padding: 80px 24px 60px;
  text-align: center;
`

const HeroEyebrow = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: var(--color-azure, #0071e3);
  letter-spacing: -0.01em;
  margin: 0 0 8px;
`

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.022em;
  margin: 0;
  color: var(--color-ink, #1d1d1f);
`

const HeroSubtitle = styled.p`
  font-size: 20px;
  font-weight: 300;
  line-height: 1.4;
  color: var(--color-graphite, #707070);
  max-width: 600px;
  margin: 16px auto 0;
  letter-spacing: -0.01em;
`

const CTAs = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 28px;
`

const PrimaryButton = styled(Link)`
  padding: 8px 20px;
  border-radius: var(--radius-button, 999px);
  font-size: 17px;
  font-weight: 400;
  background: var(--color-azure, #0071e3);
  color: #ffffff;
  text-decoration: none;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.88;
    color: #ffffff;
  }
`

const GhostButton = styled(Link)`
  padding: 8px 20px;
  font-size: 17px;
  font-weight: 400;
  color: var(--color-cobalt-link, #0066cc);
  text-decoration: none;

  &:hover {
    color: var(--color-azure, #0071e3);
  }
`

const Section = styled.section`
  padding: 0 24px 80px;
`

const SectionInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 28px;
`

const SectionTitle = styled.h2`
  font-size: 40px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0;
  color: var(--color-ink, #1d1d1f);
`

const PostCount = styled.span`
  color: var(--muted, #707070);
  font-size: 14px;
`

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 0;
  background: var(--border);
  gap: 1px;
  border-radius: var(--radius-card, 28px);
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const PostGridItem = styled.div`
  background: var(--card-bg);
`

const ContactSection = styled.section`
  padding: 0 24px 120px;
`

const ContactPanel = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 48px;
  background: var(--card-bg);
  border-radius: var(--radius-card, 28px);
  text-align: center;

  @media (max-width: 768px) {
    padding: 40px 28px;
  }
`

const ContactTitle = styled.h3`
  font-size: 40px;
  font-weight: 600;
  margin: 0 0 12px;
  letter-spacing: -0.01em;
  color: var(--color-ink, #1d1d1f);
`

const ContactText = styled.p`
  color: var(--muted, #707070);
  font-size: 20px;
  font-weight: 300;
  margin: 0;
`

const ContactLinks = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 28px;
`

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  border-radius: var(--radius-button, 999px);
  border: 1px solid var(--border-strong, #d2d2d7);
  color: var(--color-ink, #1d1d1f);
  text-decoration: none;
  font-size: 17px;
  font-weight: 400;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.65;
    color: var(--color-ink, #1d1d1f);
  }
`

export const metadata: Metadata = {
  title: 'Jamie Next Blog',
  description:
    'OpenClaw와 Next.js로 운영하는 개인 블로그. AI 실험, 맛집 후기, 여행 기록, 블로그 제작 과정을 담습니다.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Jamie Next Blog',
    description:
      'OpenClaw와 Next.js로 운영하는 개인 블로그. AI 실험, 맛집 후기, 여행 기록, 블로그 제작 과정을 담습니다.',
    url: 'https://jamie-next-blog.vercel.app',
    type: 'website',
  },
}

export default function Home() {
  const all = getAllPosts()
  const posts = all.filter((p: any) => p.category !== 'News').slice(0, 6)

  return (
    <div>
      <Hero>
        <HeroEyebrow>Personal Blog</HeroEyebrow>
        <HeroTitle>Jamie Next</HeroTitle>
        <HeroSubtitle>
          MDX-driven, fast, and minimal. AI experiments, food, travel, and engineering notes.
        </HeroSubtitle>
        <CTAs>
          <PrimaryButton href="/posts">Browse Posts</PrimaryButton>
          <GhostButton href="/about">Learn more ›</GhostButton>
        </CTAs>
      </Hero>

      <Section>
        <SectionInner>
          <SectionHeader>
            <SectionTitle>Recent Posts</SectionTitle>
            <PostCount>{all.length} total</PostCount>
          </SectionHeader>
          <PostGrid>
            {posts.map((p: any) => (
              <PostGridItem key={p.slug}>
                <PostCard post={p} />
              </PostGridItem>
            ))}
          </PostGrid>
        </SectionInner>
      </Section>

      <ContactSection>
        <ContactPanel>
          <ContactTitle>Connect</ContactTitle>
          <ContactText>Always happy to talk.</ContactText>
          <ContactLinks>
            <ContactButton href="https://github.com/hericobacter-spec" target="_blank" rel="noopener noreferrer">
              GitHub
            </ContactButton>
            <ContactButton href="mailto:hericobacter1@gmail.com">Email</ContactButton>
            <ContactButton href="https://www.instagram.com/jamiesuyong/" target="_blank" rel="noopener noreferrer">
              Instagram
            </ContactButton>
          </ContactLinks>
        </ContactPanel>
      </ContactSection>
    </div>
  )
}
