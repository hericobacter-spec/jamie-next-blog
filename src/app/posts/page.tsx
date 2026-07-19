import React from 'react'
import styled from 'styled-components'
import type { Metadata } from 'next'
import { getPublicPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import CategoriesClient from '@/components/CategoriesClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: '모든 기록',
  description: 'Jamie가 직접 경험하고 확인한 AI 실험, 블로그 제작, 가족 여행, 맛집 기록을 카테고리별로 살펴보세요.',
  alternates: { canonical: '/posts' },
}

type Category = 'All' | 'Blog' | 'Foodie' | 'A.I' | 'Life'
type SearchParamsInput = { category?: string } | Promise<{ category?: string }> | undefined

const Shell = styled.main`
  width: min(100% - 40px, 1280px);
  margin: 0 auto;
  padding: clamp(64px, 9vw, 116px) 0 80px;

  @media (max-width: 640px) {
    width: min(100% - 28px, 1280px);
  }
`

const Intro = styled.header`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.55fr);
  gap: 52px;
  align-items: end;
  margin-bottom: 42px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 18px;
  }
`

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-serif), serif;
  font-size: clamp(3rem, 7vw, 6rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.07em;
`

const Description = styled.p`
  margin: 0 0 8px;
  color: var(--muted);
  font-size: 16px;
  line-height: 1.8;
`

const Count = styled.p`
  margin: 28px 0 20px;
  color: var(--muted);
  font-size: 13px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 920px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

function normalizeCategory(input?: string): Category {
  const value = (input ?? '').trim().toLowerCase()
  if (value === 'blog') return 'Blog'
  if (value === 'foodie') return 'Foodie'
  if (value === 'life') return 'Life'
  if (['a.i', 'ai', 'a.i.', 'a i'].includes(value)) return 'A.I'
  return 'All'
}

export default async function PostsPage({ searchParams }: { searchParams?: SearchParamsInput }) {
  const resolved = await Promise.resolve(searchParams)
  const currentCategory = normalizeCategory(resolved?.category)
  const allPosts = getPublicPosts()
  const posts = currentCategory === 'All'
    ? allPosts
    : allPosts.filter((post) => normalizeCategory(post.category) === currentCategory)

  return (
    <Shell>
      <Intro>
        <Title>모든 기록</Title>
        <Description>직접 써본 도구, 가족과 지나온 장소, 다시 찾고 싶은 맛을 오래 읽을 수 있는 글로 남깁니다.</Description>
      </Intro>
      <React.Suspense fallback={null}>
        <CategoriesClient />
      </React.Suspense>
      <Count>{posts.length}개의 기록</Count>
      <Grid>
        {posts.map((post, index) => <PostCard key={post.slug} post={post} priority={index < 3} />)}
      </Grid>
    </Shell>
  )
}
